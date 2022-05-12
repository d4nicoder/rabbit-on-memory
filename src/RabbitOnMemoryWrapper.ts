import { IConfigOptions } from './interfaces/IConfigOptions'
import { IMessage } from './interfaces/IMessage'
import { IPublishOptions } from './interfaces/IPublishOptions'
import { IExchangeType, IQueueBinding } from './interfaces/IQueueBinding'
import RabbitOnMemory from './RabbitOnMemory'

export class RabbitOnMemoryWrapper {
    private instance: RabbitOnMemory

    constructor () {
        this.instance = new RabbitOnMemory()
    }

    /**
     *
     * Publish a message in an exchange route. All the subscriber with valid binding keys
     * will be called with the payload.
     * @param {string} exchange
     * @param {string} routingKey
     * @param {Buffer} content
     * @param {IPublishOptions} [options]
     * @return {Promise<void>}
     */
    public async publish (exchange: string, routingKey: string, content: unknown, options?: IPublishOptions): Promise<void> {
        return this.instance.publishRoute(exchange, routingKey, content, options)
    }

    /**
     *
     * Creates a queue binded to a route in one exchange. It is lazy created, so if
     * queue not exists, it will be created in this moment
     * @param {string} exchange
     * @param {IExchangeType} exchangeType
     * @param {string} queue
     * @param {string} bindRoute
     * @param {(msg: IMessage) => Promise<void>} callback
     * @param {IQueueBinding} [options]
     */
    public subscribe (exchange: string, exchangeType: IExchangeType, queue: string, bindRoute: string, callback: (msg: IMessage) => Promise<void>, options?: IQueueBinding): void {
        this.instance.bindQueue(exchange, exchangeType, queue, bindRoute, callback, options)
    }

    /**
     * Unsubscribe from a queue
     * @param {string} exchange
     * @param {string} queue
     */
    public unsubscribe (exchange: string, queue: string): void {
        this.instance.unbindQueue(exchange, queue)
    }

    /**
     * Configure behavior of the events
     * @param {IConfigOptions} options
     */
    public setConfig (options: IConfigOptions): void {
        this.instance.setConfig(options)
    }
}
