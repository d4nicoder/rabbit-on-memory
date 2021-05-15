export interface IMessage {
  fields: {
    exchange: string
    routingKey: string
    redelivered: boolean
    consumerTag: string
    deliveryTag: number
  },
  properties: {
    contentType?: string
    contentEncoding?: string
    headers: {
      [key: string]: string
    }
    deliveryMode?: 1 | 2
    priority?: number
    correlationId?: string
    replyTo?: string
    expiration?: string
    messageId?: string
    timestamp?: number
    type?: string
    userId?: string
    appId?: string
    clusterId?: string
  }
  content: Buffer
}