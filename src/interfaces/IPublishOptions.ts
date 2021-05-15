export interface IPublishOptions {
  exchange?: string
  route: string
  content: unknown
  deliveryMode?: 1 | 2
  headers?: {
    [key: string]: string
  }
  correlationId?: string
  type?: string
  contentType?: string
  contentEncoding?: string
  messageId?: string
  replyTo?: string
  expiration?: string
  timestamp?: number
  userId?: string
  appId?: string
}