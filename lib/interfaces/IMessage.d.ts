export interface IMessage {
    fields: {
        exchange: string;
        routingKey: string;
        redelivered: boolean;
        consumerTag: string;
        deliveryTag: number;
    };
    properties: {
        contentType?: string;
        contentEncoding?: string;
        headers: {
            [key: string]: any;
        };
        deliveryMode?: 1 | 2;
        priority?: number;
        correlationId?: string;
        replyTo?: string;
        expiration?: string;
        messageId?: string;
        timestamp?: number;
        type?: string;
        userId?: string;
        appId?: string;
        clusterId?: string;
    };
    content: unknown;
}
//# sourceMappingURL=IMessage.d.ts.map