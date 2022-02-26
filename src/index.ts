import { IExchangeType, IQueueBinding } from "./interfaces/IQueueBinding";

import { IConfigOptions } from "./interfaces/IConfigOptions";
import { IMessage } from "./interfaces/IMessage";
import { IPublishOptions } from "./interfaces/IPublishOptions";
import RabbitOnMemory from "./RabbitOnMemory";
import { RabbitOnMemoryWrapper } from './RabbitOnMemoryWrapper'

const init = () => {

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
const publish = async (exchange: string, routingKey: string, content: Buffer, options?: IPublishOptions): Promise<void> => {
  const rabbitInstance = RabbitOnMemory.getInstance()
  return rabbitInstance.publishRoute(exchange, routingKey, content, options)
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
const subscribe = (exchange: string, exchangeType: IExchangeType, queue: string, bindRoute: string, callback: (msg: IMessage) => Promise<void>, options?: IQueueBinding): void => {
  const rabbitInstance = RabbitOnMemory.getInstance()
  rabbitInstance.bindQueue(exchange, exchangeType, queue, bindRoute, callback, options)
}

/**
 * Configure behavior of the events
 * @param {IConfigOptions} options
 */
const setConfig = (options: IConfigOptions): void => {
  const rabbitInstance = RabbitOnMemory.getInstance()
  rabbitInstance.setConfig(options)
}

export default {
  publish,
  subscribe,
  setConfig,
  init: (): RabbitOnMemoryWrapper => {
    return new RabbitOnMemoryWrapper()
  }
}
