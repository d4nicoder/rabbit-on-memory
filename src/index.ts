import { IConfigOptions } from "./interfaces/IConfigOptions";
import { IPublishOptions } from "./interfaces/IPublishOptions";
import { IQueueBinding } from "./interfaces/IQueueBinding";
import RabbitOnMemory from "./RabbitInMemory";

/**
 * Publish a message in an exchange route. All the subscriber with valid binding keys
 * will be called with the payload.
 * @param options Publish options
 * @returns A promise when all the subscriber have ended
 */
const publish = async (options: IPublishOptions): Promise<void> => {
  const rabbitInstance = RabbitOnMemory.getInstance()
  return rabbitInstance.publishRoute(options)
}

/**
 * Creates a queue binded to a route in one exchange. It is lazy created, so if
 * queue not exists, it will be created in this moment
 * @param options Subscribing options
 */
const subscribe = (options: IQueueBinding): void => {
  const rabbitInstance = RabbitOnMemory.getInstance()
  rabbitInstance.bindQueue(options)
}

/**
 * Configure behavior of the events
 * @param options Options to configure behavior
 */
const setConfig = (options: IConfigOptions): void => {
  const rabbitInstance = RabbitOnMemory.getInstance()
  rabbitInstance.setConfig(options)
}

export default {
  publish,
  subscribe,
  setConfig
}