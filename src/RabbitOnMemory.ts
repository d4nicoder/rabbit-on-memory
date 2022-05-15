import { IExchangeType, IQueueBinding, IQueueInternal } from "./interfaces/IQueueBinding"

import { IConfigOptions } from "./interfaces/IConfigOptions"
import { IMessage } from './interfaces/IMessage'
import { IPublishOptions } from "./interfaces/IPublishOptions"
import os from 'os'

export default class RabbitOnMemory {
  public static instance: RabbitOnMemory

  private readonly exchanges: Map<string, IExchangeType> = new Map()
  private readonly routes: Map<string, IQueueInternal[]> = new Map()
  private consumerTag: number = 1
  private configuration =  {
    syncMode: true,
    propagateExceptionsOnSyncMode: false,
    debug: false
  }

  public constructor () {
    // Set default exchange
    this.exchanges.set('default', 'direct')
  }

  private setExchange (name: string, type: IExchangeType) {
    if (this.exchanges.has(name)) {
      return
    }
    this.exchanges.set(name, type)
  }

  private async runQueuesAsync (list: IQueueInternal[],  message: IMessage): Promise<void> {
    for (let i = 0; i < list.length; i++) {
      list[i].callback(message)
        .then(() => {
          if (this.configuration.debug) {
            console.log(`Successful executed event on queue ${list[i].queue}, route ${list[i].bindRoute}`)
          }
        })
        .catch((e) => {
          console.error(e)
          console.error(`Error executing the queue ${list[i].queue}`)
          console.error(message)
        })
    }
  }

  private async runQueuesSync (list: IQueueInternal[], message: IMessage): Promise<void> {
    for (let i = 0; i < list.length; i++) {
      try {
        await list[i].callback(message)
        if (this.configuration.debug) {
          console.log(`Successful executed event on queue ${list[i].queue}, route ${list[i].bindRoute}`)
        }
      } catch (e) {
        if (this.configuration.propagateExceptionsOnSyncMode) {
          throw e
        } else if (this.configuration.debug) {
          console.error(`Error executing the queue ${list[i].queue}`)
          console.error(e)
        }
      }
    }
  }

  private async runQueues (list: IQueueInternal[], message: IMessage): Promise<void> {
    if (this.configuration.syncMode) {
      return this.runQueuesSync(list, message)
    } else {
      return this.runQueuesAsync(list, message)
    }
  }

  private async processQueuesFanout (message: IMessage): Promise<void> {
    const queues = Array.from(this.routes.values()).reduce((accum: IQueueInternal[], queues: IQueueInternal[]) => {
      return accum.concat(queues.filter((queue) => queue.exchange === message.fields.exchange))
    }, [])
    return this.runQueues(queues, message)
  }

  private async processQueuesDirect (route: string, message: IMessage): Promise<void> {
    const queues = Array.from(this.routes.entries()).reduce((accum: IQueueInternal[], queues: [string, IQueueInternal[]]) => {
      if (queues[0] === route) {
        accum = accum.concat(queues[1].filter((queue) => queue.exchange === message.fields.exchange))
      }
      return accum
    }, [])
    return this.runQueues(queues, message)
  }

  private async processQueuesTopic (route: string, message: IMessage): Promise<void> {
    const messageSplitedRoute: string[] = route.split('.')
    const queues = Array.from(this.routes.entries()).reduce((accum: IQueueInternal[], queues: [string, IQueueInternal[]]) => {
      const queuesSplitedRoute: string[] = queues[0].split('.')
      for (let i = 0; i < messageSplitedRoute.length; i++) {
        if (messageSplitedRoute[i] === queuesSplitedRoute[i]) {
          // Match
          continue
        } else if (queuesSplitedRoute[i] === '#') {
          // Match from here to end
          return accum.concat(queues[1].filter((queue) => queue.exchange === message.fields.exchange))
        } else if (queuesSplitedRoute[i] === '*') {
          // Match this segment
          continue
        }
        // No match
        return accum
      }
      return accum.concat(queues[1].filter((queue) => queue.exchange === message.fields.exchange))
    }, [])
    return this.runQueues(queues, message)
  }

  /**
   * Delete expired queues
   */
  private deleteExpired (): void {
    this.routes.forEach((queues, route) => {
      const filtered = queues.filter((queue) => {
        if (!queue.options || !queue.options.expires || !queue.options.expireTime) {
          return true
        }
        return (Date.now() <= queue.options.expireTime)
      })
      if (filtered.length === 0) {
        this.routes.delete(route)
      } else {
        this.routes.set(route, filtered)
      }
    })
  }

  public static getInstance (): RabbitOnMemory {
    if (!RabbitOnMemory.instance) {
      RabbitOnMemory.instance = new RabbitOnMemory()
    }
    return RabbitOnMemory.instance
  }

  public static init (): RabbitOnMemory {
    return new RabbitOnMemory()
  }

  public bindQueue (exchange: string, exchangeType: IExchangeType, queue: string, bindRoute: string, callback: (msg: IMessage) => Promise<void>, options?: IQueueBinding) {
    // Define exchange
    if (options && options.expires) {
      options.expireTime = Date.now() + options.expires
    }
    this.setExchange(exchange, exchangeType)

    const internalQueue: IQueueInternal = {
      exchange,
      exchangeType,
      bindRoute,
      queue,
      callback,
      options
    }

    let queues: IQueueInternal[] = this.routes.get(bindRoute) || []
    queues.push(internalQueue)
    this.routes.set(bindRoute, queues)

    if (this.configuration.debug) {
      console.log(`New queue registered:`)
      console.log(`  - Exchange:     ${exchange}`)
      console.log(`  - ExchangeType: ${exchangeType}`)
      console.log(`  - Queue:        ${queue}`)
      console.log(`  - BindRoute:    ${bindRoute}`)
    }
  }

  public unbindQueue (exchange: string, queue: string): void {
    // Locate queue inside routes
    this.routes.forEach((queues, route) => {
      const filtered = queues.filter((q) => q.queue !== queue || q.exchange !== exchange)
      this.routes.set(route, filtered)
    })
  }

  public async publishRoute (exchange: string, routingKey: string, content: unknown, options?: IPublishOptions) {
    // Delete expired queues
    this.deleteExpired()

    exchange = exchange || 'default'
    options = options || {}

    const message: IMessage = {
      fields: {
        exchange: exchange,
        routingKey: routingKey,
        redelivered: false,
        consumerTag: String(this.consumerTag++),
        deliveryTag: 1
      },
      properties: {
        contentType: options.contentType,
        contentEncoding: options.contentEncoding,
        headers: options.headers || {},
        deliveryMode: options.deliveryMode,
        priority: 1,
        correlationId: options.correlationId,
        replyTo: options.replyTo,
        expiration: options.expiration,
        messageId: options.messageId,
        timestamp: options.timestamp,
        type: options.type,
        userId: options.type,
        appId: options.appId,
        clusterId: os.hostname()
      },
      content: content,
    }

    const exchangeType: IExchangeType | undefined = this.exchanges.get(exchange)

    if (!exchangeType) {
      if (this.configuration.debug) {
        console.error(`Exchange ${exchange} not exists, dropping message`)
      }
      return
    }

    if (this.configuration.debug) {
      console.log(`New event to send:`)
      console.log(JSON.stringify(message, null, '  '))
    }

    if (exchangeType === 'fanout') {
      if (this.configuration.debug) {
        console.log(`Publishing in fanout mode`)
      }
      await this.processQueuesFanout(message)
    } else if (exchangeType === 'direct') {
      if (this.configuration.debug) {
        console.log(`Publishing in direct mode`)
      }
      await this.processQueuesDirect(routingKey, message)
    } else if (exchangeType === 'topic') {
      if (this.configuration.debug) {
        console.log(`Publishing in topic mode`)
      }
      await this.processQueuesTopic(routingKey, message)
    } else {
      const error = new Error()
      error.message = `Exchange type ${exchangeType} for ${exchange} not supported`
      error.name = 'ExchangeNotSupported'
      throw error
    }
  }

  public setConfig (options: IConfigOptions) {
    if (typeof options.syncMode === 'boolean') {
      this.configuration.syncMode = options.syncMode
      if (this.configuration.debug) {
        console.log(`Events sync mode ${this.configuration.syncMode ? 'active' : 'disabled'}`)
      }
    }
    if (typeof options.debug === 'boolean') {
      this.configuration.debug = options.debug
    }
    if (typeof options.propagateExceptionsOnSyncMode === 'boolean') {
      this.configuration.propagateExceptionsOnSyncMode = options.propagateExceptionsOnSyncMode
    }
  }
}
