import { IMessage } from "../src/interfaces/IMessage"
import { IPublishOptions } from "../src/interfaces/IPublishOptions"
import { IQueueBinding } from "../src/interfaces/IQueueBinding"
import RabbitOnMemory from '../src/index'

describe('RabbitOnMemory direct mode', () => {
  it('should delivery a message to matched route and his queue', async () => {
    const mockFn = jest.fn<any, any>((message: IMessage<unknown>) => {
      // Do nothing
    })
    const subOptions: IQueueBinding<string> = {
      exchange: 'direct',
      exchangeType: 'direct',
      queue: 'queue1',
      bindRoute: 'first.queue',
      callback: mockFn
    }
    const subOptions2: IQueueBinding<string> = {
      exchange: 'direct',
      exchangeType: 'direct',
      queue: 'second.queue',
      bindRoute: 'noMatter2',
      callback: mockFn
    }

    RabbitOnMemory.subscribe(subOptions)
    RabbitOnMemory.subscribe(subOptions2)

    const messageOptions: IPublishOptions = {
      exchange: 'direct',
      content: 'Sample message',
      route: 'first.queue'
    }

    await RabbitOnMemory.publish(messageOptions)

    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('should delivery each message to his exchange', async () => {
    const mockFn1 = jest.fn<any, any>((message: IMessage<unknown>) => {
      // Do nothing
    })
    const mockFn2 = jest.fn<any, any>((message: IMessage<unknown>) => {
      // Do nothing
    })
    const route = 'same.route.all'
    const subOptions: IQueueBinding<string> = {
      exchange: 'direct1',
      exchangeType: 'direct',
      queue: 'queue1',
      bindRoute: route,
      callback: mockFn1
    }
    const subOptions2: IQueueBinding<string> = {
      exchange: 'direct2',
      exchangeType: 'direct',
      queue: 'queue2',
      bindRoute: route,
      callback: mockFn2
    }

    RabbitOnMemory.subscribe(subOptions)
    RabbitOnMemory.subscribe(subOptions2)

    const messageOptions: IPublishOptions = {
      exchange: 'direct1',
      content: 'Sample message',
      route
    }

    await RabbitOnMemory.publish(messageOptions)

    expect(mockFn1).toHaveBeenCalledTimes(1)
    expect(mockFn2).toHaveBeenCalledTimes(0)
  })
})