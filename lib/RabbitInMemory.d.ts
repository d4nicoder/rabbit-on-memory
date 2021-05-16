import { IQueueBinding } from "./interfaces/IQueueBinding";
import { IPublishOptions } from "./interfaces/IPublishOptions";
export default class RabbitOnMemory {
    static instance: RabbitOnMemory;
    private readonly exchanges;
    private readonly routes;
    private consumerTag;
    private constructor();
    private setExchange;
    private runQueues;
    private processQueuesFanout;
    private processQueuesDirect;
    private processQueuesTopic;
    static getInstance(): RabbitOnMemory;
    bindQueue(options: IQueueBinding): void;
    publishRoute(options: IPublishOptions): Promise<void>;
}
//# sourceMappingURL=RabbitInMemory.d.ts.map