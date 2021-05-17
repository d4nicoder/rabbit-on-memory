import { IQueueBinding } from "./interfaces/IQueueBinding";
import { IConfigOptions } from "./interfaces/IConfigOptions";
import { IPublishOptions } from "./interfaces/IPublishOptions";
export default class RabbitOnMemory {
    static instance: RabbitOnMemory;
    private readonly exchanges;
    private readonly routes;
    private consumerTag;
    private configuration;
    private constructor();
    private setExchange;
    private runQueuesAsync;
    private runQueuesSync;
    private runQueues;
    private processQueuesFanout;
    private processQueuesDirect;
    private processQueuesTopic;
    /**
     * Delete expired queues
     */
    private deleteExpired;
    static getInstance(): RabbitOnMemory;
    bindQueue(options: IQueueBinding): void;
    publishRoute(options: IPublishOptions): Promise<void>;
    setConfig(options: IConfigOptions): void;
}
//# sourceMappingURL=RabbitInMemory.d.ts.map