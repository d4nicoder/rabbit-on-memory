import { IMessage } from "./IMessage";
export declare type IExchangeType = 'direct' | 'topic' | 'headers' | 'fanout';
export interface IQueueBinding {
    exchange?: string;
    exchangeType?: IExchangeType;
    queue: string;
    bindRoute: string;
    callback: (message: IMessage) => Promise<void>;
}
//# sourceMappingURL=IQueueBinding.d.ts.map