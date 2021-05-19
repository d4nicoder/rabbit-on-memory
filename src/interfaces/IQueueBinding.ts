import { IMessage } from "./IMessage";

export type IExchangeType = 'direct' | 'topic' | 'fanout'

export interface IQueueBinding {
  [key: string]: any
}

export interface IQueueInternal extends IQueueBinding{
  exchange: string
  exchangeType: string
  bindRoute: string
  queue: string
  callback: (msg: IMessage) => Promise<void>
}