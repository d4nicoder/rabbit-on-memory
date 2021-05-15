import { IMessage } from "../src/interfaces/IMessage"
import { IPublishOptions } from "../src/interfaces/IPublishOptions"
import { IQueueBinding } from "../src/interfaces/IQueueBinding"
import RabbitOnMemory from '../src/index'

describe('RabbitOnMemory topic mode', () => {
  it('should delivery a message to matched route and his queue', async () => {
    const mockFn = jest.fn<any, any>((message: IMessage) => {})
    const mockFn2 = jest.fn<any, any>((message: IMessage) => {})
    const mockFn3 = jest.fn<any, any>((message: IMessage) => {})
    const mockFn4 = jest.fn<any, any>((message: IMessage) => {})
    const mockFn5 = jest.fn<any, any>((message: IMessage) => {})
    const mockFn6 = jest.fn<any, any>((message: IMessage) => {})

    const subOptions: IQueueBinding = {
      exchange: 'topic',
      exchangeType: 'topic',
      queue: 'queue1',
      bindRoute: 'first.#',
      callback: mockFn
    }
    const subOptions2: IQueueBinding = {
      exchange: 'topic',
      exchangeType: 'topic',
      queue: 'queue2',
      bindRoute: '*.queue',
      callback: mockFn2
    }

    const subOptions3: IQueueBinding = {
      exchange: 'topic',
      exchangeType: 'topic',
      queue: 'queue3',
      bindRoute: '#',
      callback: mockFn3
    }

    const subOptions4: IQueueBinding = {
      exchange: 'topic',
      exchangeType: 'topic',
      queue: 'queue4',
      bindRoute: 'first.*',
      callback: mockFn4
    }

    const subOptions5: IQueueBinding = {
      exchange: 'topic',
      exchangeType: 'topic',
      queue: 'queue5',
      bindRoute: 'first.queue',
      callback: mockFn5
    }

    const subOptions6: IQueueBinding = {
      exchange: 'topic',
      exchangeType: 'topic',
      queue: 'queue6',
      bindRoute: 'first.queues',
      callback: mockFn6
    }

    RabbitOnMemory.subscribe(subOptions)
    RabbitOnMemory.subscribe(subOptions2)
    RabbitOnMemory.subscribe(subOptions3)
    RabbitOnMemory.subscribe(subOptions4)
    RabbitOnMemory.subscribe(subOptions5)
    RabbitOnMemory.subscribe(subOptions6)

    const messageOptions: IPublishOptions = {
      exchange: 'topic',
      content: 'Sample message',
      route: 'first.queue'
    }

    const messageOptions2: IPublishOptions = {
      exchange: 'topic',
      content: 'Sample message',
      route: 'second.queue'
    }

    const messageOptions3: IPublishOptions = {
      exchange: 'topic',
      content: 'Sample message',
      route: 'first.queue.message'
    }

    await RabbitOnMemory.publish(messageOptions)
    await RabbitOnMemory.publish(messageOptions2)
    await RabbitOnMemory.publish(messageOptions3)

    expect(mockFn).toHaveBeenCalledTimes(2)
    expect(mockFn2).toHaveBeenCalledTimes(2)
    expect(mockFn3).toHaveBeenCalledTimes(3)
    expect(mockFn4).toHaveBeenCalledTimes(1)
    expect(mockFn5).toHaveBeenCalledTimes(1)
    expect(mockFn6).toHaveBeenCalledTimes(0)
  })

  it('should delivery each message to his exchange', async () => {
    const mockFn1 = jest.fn<any, any>((message: IMessage) => {
      // Do nothing
    })
    const mockFn2 = jest.fn<any, any>((message: IMessage) => {
      // Do nothing
    })
    const route = 'same.route.all'
    const subOptions: IQueueBinding = {
      exchange: 'topic1',
      exchangeType: 'topic',
      queue: 'queue1',
      bindRoute: route,
      callback: mockFn1
    }
    const subOptions2: IQueueBinding = {
      exchange: 'topic2',
      exchangeType: 'topic',
      queue: 'queue2',
      bindRoute: route,
      callback: mockFn2
    }

    RabbitOnMemory.subscribe(subOptions)
    RabbitOnMemory.subscribe(subOptions2)

    const messageOptions: IPublishOptions = {
      exchange: 'topic1',
      content: 'Sample message',
      route
    }

    await RabbitOnMemory.publish(messageOptions)

    expect(mockFn1).toHaveBeenCalledTimes(1)
    expect(mockFn2).toHaveBeenCalledTimes(0)
  })
})