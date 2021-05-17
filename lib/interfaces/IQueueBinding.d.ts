import { IMessage } from "./IMessage";
export declare type IExchangeType = 'direct' | 'topic' | 'fanout';
export interface IQueueBinding {
    [key: string]: any;
}
export interface IQueueInternal extends IQueueBinding {
    exchange: string;
    exchangeType: string;
    bindRoute: string;
    queue: string;
    callback: (msg: IMessage) => Promise<void>;
}
//# sourceMappingURL=IQueueBinding.d.ts.map