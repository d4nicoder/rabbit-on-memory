import { IMessage } from "../src/interfaces/IMessage"
import { IPublishOptions } from "../src/interfaces/IPublishOptions"
import { IQueueBinding } from "../src/interfaces/IQueueBinding"
import RabbitOnMemory from '../src/index'

describe('RabbitOnMemory Fanout mode', () => {
  it('should delivery a message to all created queues', async () => {
    const mockFn = jest.fn<any, any>((message: IMessage) => {
      // Do nothing
    })
    const subOptions: IQueueBinding = {
      exchange: 'fanout',
      exchangeType: 'fanout',
      queue: 'queue1',
      bindRoute: 'noMatter',
      callback: mockFn
    }
    const subOptions2: IQueueBinding = {
      exchange: 'fanout',
      exchangeType: 'fanout',
      queue: 'queue2',
      bindRoute: 'noMatter2',
      callback: mockFn
    }

    RabbitOnMemory.subscribe(subOptions)
    RabbitOnMemory.subscribe(subOptions2)

    const messageOptions: IPublishOptions = {
      exchange: 'fanout',
      content: 'Sample message',
      route: 'noMatter3'
    }

    await RabbitOnMemory.publish(messageOptions)

    expect(mockFn).toHaveBeenCalledTimes(2)
  })

  it('should delivery each message to his exchange', async () => {
    const mockFn = jest.fn<any, any>((message: IMessage) => {
      // Do nothing
    })
    const mockFn2 = jest.fn<any, any>((message: IMessage) => {
      // Do nothing
    })
    const subOptions: IQueueBinding = {
      exchange: 'fanout1',
      exchangeType: 'fanout',
      queue: 'queue1',
      bindRoute: 'noMatter',
      callback: mockFn
    }
    const subOptions2: IQueueBinding = {
      exchange: 'fanout2',
      exchangeType: 'fanout',
      queue: 'queue2',
      bindRoute: 'noMatter2',
      callback: mockFn2
    }

    RabbitOnMemory.subscribe(subOptions)
    RabbitOnMemory.subscribe(subOptions2)

    const messageOptions: IPublishOptions = {
      exchange: 'fanout1',
      content: 'Sample message',
      route: 'noMatter3'
    }

    await RabbitOnMemory.publish(messageOptions)

    const messageOptions2: IPublishOptions = {
      exchange: 'fanout2',
      content: 'Sample message',
      route: 'noMatter3'
    }

    await RabbitOnMemory.publish(messageOptions2)

    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockFn2).toHaveBeenCalledTimes(1)
  })
})