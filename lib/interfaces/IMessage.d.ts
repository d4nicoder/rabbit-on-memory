export interface IMessage<T> {
    exchange: string;
    routingKey: string;
    consumerTag: string;
    content: T;
    headers: {
        [key: string]: string;
    };
    correlationId: string;
    deliveryMode: 1 | 2;
    type: string;
    contentType: string;
    contentEncoding: string;
    messageId: string;
    replyTo: string;
    expiration: string;
    timestamp: number;
    userId: string;
    appId: string;
}
//# sourceMappingURL=IMessage.d.ts.map