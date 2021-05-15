import { IExchangeType, IQueueBinding } from "./interfaces/IQueueBinding"

import { IMessage } from './interfaces/IMessage'
import { IPublishOptions } from "./interfaces/IPublishOptions"
import { v4 } from 'uuid'

export default class RabbitOnMemory {
  public static instance: RabbitOnMemory

  private readonly exchanges: Map<string, IExchangeType> = new Map()
  private readonly routes: Map<string, IQueueBinding<any>[]> = new Map()
  private consumerTag: number = 1

  private constructor () { }

  private setExchange (name: string, type: IExchangeType) {
    if (this.exchanges.has(name)) {
      return
    }
    this.exchanges.set(name, type)
  }

  private async runQueues (list: IQueueBinding<any>[], message: IMessage<any>): Promise<void> {
    for (let i = 0; i < list.length; i++) {
      try {
        await list[i].callback(message)
      } catch (e) {
        console.error(e)
        console.error(`Error executing the queue ${list[i].queue}`)
        console.error(message)
      }
    }
  }

  private async processQueuesFanout (message: IMessage<any>): Promise<void> {
    const queues = Array.from(this.routes.values()).reduce((accum: IQueueBinding<any>[], queues: IQueueBinding<any>[]) => {
      return accum.concat(queues.filter((queue) => queue.exchange === message.exchange))
    }, [])
    return this.runQueues(queues, message)
  }

  private async processQueuesDirect (route: string, message: IMessage<any>): Promise<void> {
    const queues = Array.from(this.routes.entries()).reduce((accum: IQueueBinding<any>[], queues: [string, IQueueBinding<any>[]]) => {
      if (queues[0] === route) {
        accum = accum.concat(queues[1].filter((queue) => queue.exchange === message.exchange))
      }
      return accum
    }, [])
    return this.runQueues(queues, message)
  }

  private async processQueuesTopic (route: string, message: IMessage<any>): Promise<void> {
    const messageSplitedRoute: string[] = route.split('.')
    const queues = Array.from(this.routes.entries()).reduce((accum: IQueueBinding<any>[], queues: [string, IQueueBinding<any>[]]) => {
      const queuesSplitedRoute: string[] = queues[0].split('.')
      for (let i = 0; i < messageSplitedRoute.length; i++) {
        if (messageSplitedRoute[i] === queuesSplitedRoute[i]) {
          // Match
          continue
        } else if (queuesSplitedRoute[i] === '#') {
          // Match from here to end
          return accum.concat(queues[1].filter((queue) => queue.exchange === message.exchange))
        } else if (queuesSplitedRoute[i] === '*') {
          // Match this segment
          continue
        }
        // No match
        return accum
      }
      return accum.concat(queues[1].filter((queue) => queue.exchange === message.exchange))
    }, [])
    return this.runQueues(queues, message)
  }

  public static getInstance (): RabbitOnMemory {
    if (!RabbitOnMemory.instance) {
      RabbitOnMemory.instance = new RabbitOnMemory()
    }
    return RabbitOnMemory.instance
  }

  public bindQueue<T> (options: IQueueBinding<T>) {
    // Deine exchange
    options.exchange = options.exchange || 'default'
    options.exchangeType = options.exchangeType || 'direct'
    this.setExchange(options.exchange, options.exchangeType)
    
    let queues: IQueueBinding<T>[] = this.routes.get(options.bindRoute) || []
    queues.push(options)
    this.routes.set(options.bindRoute, queues)
  }

  public async publishRoute (options: IPublishOptions) {
    options.exchange = options.exchange || 'default'

    options.appId = options.appId || 'default'
    options.contentEncoding = options.contentEncoding || 'none'
    options.contentType = options.contentType || 'application/json'
    options.deliveryMode = options.deliveryMode === 1 || options.deliveryMode === 2 ? options.deliveryMode : 1
    options.expiration = options.expiration || new Date().toISOString()
    options.headers = options.headers || {}
    options.messageId = options.messageId || v4()
    options.replyTo = options.replyTo || ''
    options.timestamp = Math.floor(Date.now() / 1000)
    options.type = options.type || ''
    options.userId = options.userId || ''
    options.correlationId = options.correlationId || v4()

    const message: IMessage<unknown> = {
      appId: options.appId,
      consumerTag: String(this.consumerTag++),
      content: options.content,
      contentEncoding: options.contentEncoding,
      contentType: options.contentType,
      correlationId: options.correlationId,
      deliveryMode: options.deliveryMode,
      exchange: options.exchange,
      expiration: options.expiration,
      headers: options.headers,
      messageId: options.messageId,
      replyTo: options.replyTo,
      routingKey: options.route,
      timestamp: options.timestamp,
      type: options.type,
      userId: options.type
    }

    const exchangeType: IExchangeType | undefined = this.exchanges.get(options.exchange)

    if (!exchangeType) {
      const error = new Error()
      error.message = `Exchange ${options.exchange} not exists`
      error.name = 'ExchangeNotExists'
      throw error
    }
    
    if (exchangeType === 'fanout') {
      return this.processQueuesFanout(message)
    } else if (exchangeType === 'direct') {
      return this.processQueuesDirect(options.route, message)
    } else if (exchangeType === 'topic') {
      return this.processQueuesTopic(options.route, message)
    } else {
      const error = new Error()
      error.message = `Exchange type ${exchangeType} not supported`
      error.name = 'ExchangeNotSupported'
      throw error
    }
  }
}