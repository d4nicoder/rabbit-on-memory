import RabbitOnMemory from '../src/index'

describe('RabbitOnMemory multiple instances', () => {
  it('should not deliver a message from other instance', async () => {
    const mockFn = jest.fn<any, any>(() => {})
    const exchange = 'direct'

    const instance1 = RabbitOnMemory.init()
    const instance2 = RabbitOnMemory.init()
    instance1.subscribe(exchange, 'direct', 'queue1', 'first.queue', mockFn)

    const route = 'first.queue'
    const content = Buffer.from('Sample message')

    await instance2.publish(exchange, route, content)
    await RabbitOnMemory.publish(exchange, route, content)

    expect(mockFn).toHaveBeenCalledTimes(0)
  })
})
