import { IPublishOptions } from "./interfaces/IPublishOptions";
import { IQueueBinding } from "./interfaces/IQueueBinding";
import RabbitOnMemory from "./RabbitInMemory";

const publish = async (options: IPublishOptions): Promise<void> => {
  const rabbitInstance = RabbitOnMemory.getInstance()
  return rabbitInstance.publishRoute(options)
}

const subscribe = <T>(options: IQueueBinding): void => {
  const rabbitInstance = RabbitOnMemory.getInstance()
  rabbitInstance.bindQueue(options)
}

export default {
  publish,
  subscribe
}