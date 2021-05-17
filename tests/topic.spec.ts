import RabbitOnMemory from '../src/index'

describe('RabbitOnMemory topic mode', () => {
  it('should delivery a message to matched route and his queue', async () => {
    const mockFn = jest.fn<any, any>(() => {})
    const mockFn2 = jest.fn<any, any>(() => {})
    const mockFn3 = jest.fn<any, any>(() => {})
    const mockFn4 = jest.fn<any, any>(() => {})
    const mockFn5 = jest.fn<any, any>(() => {})
    const mockFn6 = jest.fn<any, any>(() => {})

    const exchange1 = 'topic'
    const exchangeType1 = 'topic'
    const queue1 = 'queue1'
    const bindRoute1 = 'first.#'
    const callback1 = mockFn

    const exchange2 = 'topic'
    const exchangeType2 = 'topic'
    const queue2 = 'queue2'
    const bindRoute2 = '*.queue'
    const callback2 = mockFn2

    const exchange3 = 'topic'
    const exchangeType3 = 'topic'
    const queue3 = 'queue3'
    const bindRoute3 = '#'
    const callback3 = mockFn3

    const exchange4 = 'topic'
    const exchangeType4 = 'topic'
    const queue4 = 'queue4'
    const bindRoute4 = 'first.*'
    const callback4 = mockFn4

    const exchange5 = 'topic'
    const exchangeType5 = 'topic'
    const queue5 = 'queue5'
    const bindRoute5 = 'first.queue'
    const callback5 = mockFn5

    const exchange6 = 'topic'
    const exchangeType6 = 'topic'
    const queue6 = 'queue6'
    const bindRoute6 = 'first.queues'
    const callback6 = mockFn6

    RabbitOnMemory.subscribe(exchange1, exchangeType1, queue1, bindRoute1, callback1)
    RabbitOnMemory.subscribe(exchange2, exchangeType2, queue2, bindRoute2, callback2)
    RabbitOnMemory.subscribe(exchange3, exchangeType3, queue3, bindRoute3, callback3)
    RabbitOnMemory.subscribe(exchange4, exchangeType4, queue4, bindRoute4, callback4)
    RabbitOnMemory.subscribe(exchange5, exchangeType5, queue5, bindRoute5, callback5)
    RabbitOnMemory.subscribe(exchange6, exchangeType6, queue6, bindRoute6, callback6)

    await RabbitOnMemory.publish('topic', 'first.queue', Buffer.from('Sample message'))
    await RabbitOnMemory.publish('topic', 'second.queue', Buffer.from('Sample message'))
    await RabbitOnMemory.publish('topic', 'first.queue.message', Buffer.from('Sample message'))

    expect(mockFn).toHaveBeenCalledTimes(2)
    expect(mockFn2).toHaveBeenCalledTimes(2)
    expect(mockFn3).toHaveBeenCalledTimes(3)
    expect(mockFn4).toHaveBeenCalledTimes(1)
    expect(mockFn5).toHaveBeenCalledTimes(1)
    expect(mockFn6).toHaveBeenCalledTimes(0)
  })

  it('should delivery each message to his exchange', async () => {
    const mockFn1 = jest.fn<any, any>(() => {})
    const mockFn2 = jest.fn<any, any>(() => {})
    const route = 'same.route.all'

    const exchange1 = 'topic1'
    const exchangeType1 = 'topic'
    const queue1 = 'queue1'
    const bindRoute1 = route
    const callback1 = mockFn1

    const exchange2 = 'topic2'
    const exchangeType2 = 'topic'
    const queue2 = 'queue2'
    const bindRoute2 = route
    const callback2 = mockFn2


    RabbitOnMemory.subscribe(exchange1, exchangeType1, queue1, bindRoute1, callback1)
    RabbitOnMemory.subscribe(exchange2, exchangeType2, queue2, bindRoute2, callback2)

    await RabbitOnMemory.publish('topic1', route, Buffer.from('Sample message'))

    expect(mockFn1).toHaveBeenCalledTimes(1)
    expect(mockFn2).toHaveBeenCalledTimes(0)
  })
})