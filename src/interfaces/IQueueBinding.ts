import { IMessage } from "./IMessage";

export type IExchangeType = 'direct' | 'topic' | 'headers' | 'fanout'

export interface IQueueBinding<T> {
  exchange?: string
  exchangeType?: IExchangeType
  queue: string
  bindRoute: string
  callback: (message: IMessage<T>) => Promise<void>
}