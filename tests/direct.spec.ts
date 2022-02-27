import RabbitOnMemory from '../src/index'

describe('RabbitOnMemory direct mode', () => {
  it('should delivery a message to matched route and his queue', async () => {
    const mockFn = jest.fn<any, any>(() => {})
    const exchange = 'direct'

    RabbitOnMemory.subscribe(exchange, 'direct', 'queue1', 'first.queue', mockFn)
    RabbitOnMemory.subscribe(exchange, 'direct', 'queue2', 'second.queue', mockFn)

    const route = 'first.queue'
    const content = 'Sample message'

    await RabbitOnMemory.publish(exchange, route, content)

    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('should delivery each message to his exchange', async () => {
    const mockFn1 = jest.fn<any, any>(() => {})
    const mockFn2 = jest.fn<any, any>(() => {})
    const route = 'same.route.all'
    const exchange = 'sample1'

    RabbitOnMemory.subscribe(exchange, 'direct', 'queue1', route, mockFn1)
    RabbitOnMemory.subscribe('random', 'direct', 'queue2', route, mockFn2)

    const content = 'Sample message'

    await RabbitOnMemory.publish(exchange, route, content)

    expect(mockFn1).toHaveBeenCalledTimes(1)
    expect(mockFn2).toHaveBeenCalledTimes(0)
  })
})
