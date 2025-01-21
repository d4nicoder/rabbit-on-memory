import { IExchangeType, IQueueBinding } from "./interfaces/IQueueBinding.js";

import { IConfigOptions } from "./interfaces/IConfigOptions.js";
import { IMessage } from "./interfaces/IMessage.js";
import { IPublishOptions } from "./interfaces/IPublishOptions.js";
import RabbitOnMemory from "./RabbitOnMemory.js";
import { RabbitOnMemoryWrapper } from "./RabbitOnMemoryWrapper.js";

/**
 * Publish a message in an exchange route. All the subscriber with valid binding keys
 * will be called with the payload.
 * @param {string} exchange
 * @param {string} routingKey
 * @param {Buffer} content
 * @param {IPublishOptions} [options]
 * @return {Promise<void>}
 */
const publish = async (
  exchange: string,
  routingKey: string,
  content: unknown,
  options?: IPublishOptions,
): Promise<void> => {
  const rabbitInstance = RabbitOnMemory.getInstance();
  return rabbitInstance.publishRoute(exchange, routingKey, content, options);
};

/**
 * Creates a queue binded to a route in one exchange. It is lazy created, so if
 * queue not exists, it will be created in this moment
 * @param {string} exchange
 * @param {IExchangeType} exchangeType
 * @param {string} queue
 * @param {string} bindRoute
 * @param {(msg: IMessage) => Promise<void>} callback
 * @param {IQueueBinding} [options]
 */
const subscribe = (
  exchange: string,
  exchangeType: IExchangeType,
  queue: string,
  bindRoute: string,
  callback: (msg: IMessage) => Promise<void>,
  options?: IQueueBinding,
): void => {
  const rabbitInstance = RabbitOnMemory.getInstance();
  rabbitInstance.bindQueue(
    exchange,
    exchangeType,
    queue,
    bindRoute,
    callback,
    options,
  );
};

/**
 * Unsubscribe from a queue
 * @param {string} exchange
 * @param {string} queue
 */
const unsubscribe = (exchange: string, queue: string): void => {
  const rabbitInstance = RabbitOnMemory.getInstance();
  rabbitInstance.unbindQueue(exchange, queue);
};

/**
 * Configure behavior of the events
 * @param {IConfigOptions} options
 */
const setConfig = (options: IConfigOptions): void => {
  const rabbitInstance = RabbitOnMemory.getInstance();
  rabbitInstance.setConfig(options);
};

export default {
  publish,
  subscribe,
  unsubscribe,
  setConfig,
  init: (): RabbitOnMemoryWrapper => {
    return new RabbitOnMemoryWrapper();
  },
};
