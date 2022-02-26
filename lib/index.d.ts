/// <reference types="node" />
import { IExchangeType, IQueueBinding } from "./interfaces/IQueueBinding";
import { IConfigOptions } from "./interfaces/IConfigOptions";
import { IMessage } from "./interfaces/IMessage";
import { IPublishOptions } from "./interfaces/IPublishOptions";
import { RabbitOnMemoryWrapper } from './RabbitOnMemoryWrapper';
declare const _default: {
    publish: (exchange: string, routingKey: string, content: Buffer, options?: IPublishOptions | undefined) => Promise<void>;
    subscribe: (exchange: string, exchangeType: IExchangeType, queue: string, bindRoute: string, callback: (msg: IMessage) => Promise<void>, options?: IQueueBinding | undefined) => void;
    setConfig: (options: IConfigOptions) => void;
    init: () => RabbitOnMemoryWrapper;
};
export default _default;
//# sourceMappingURL=index.d.ts.map