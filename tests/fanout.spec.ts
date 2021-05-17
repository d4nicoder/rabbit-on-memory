import RabbitOnMemory from '../src/index'

describe('RabbitOnMemory Fanout mode', () => {
  it('should delivery a message to all created queues', async () => {
    const mockFn = jest.fn<any, any>(() => {})
    const exchange1 = 'fanout'
    const exchangeType1 = 'fanout'
    const queue1 = 'queue1'
    const bindRoute1 = 'noMatter'

    const exchange2 = 'fanout'
    const exchangeType2 = 'fanout'
    const queue2 = 'queue2'
    const bindRoute2 = 'noMatter2'

    RabbitOnMemory.subscribe(exchange1, exchangeType1, queue1, bindRoute1, mockFn)
    RabbitOnMemory.subscribe(exchange2, exchangeType2, queue2, bindRoute2, mockFn)
    const content = Buffer.from('Sample message')
    const route = 'noMatter3'

    await RabbitOnMemory.publish(exchange1, route, content)

    expect(mockFn).toHaveBeenCalledTimes(2)
  })

  it('should delivery each message to his exchange', async () => {
    const mockFn = jest.fn<any, any>(() => {})
    const mockFn2 = jest.fn<any, any>(() => {})
    
    const exchange1 = 'fanout1'
    const exchangeType1 = 'fanout'
    const queue1 = 'queue1'
    const bindRoute1 = 'noMatter'
    const callback1 = mockFn
    
    const exchange2 = 'fanout2'
    const exchangeType2 = 'fanout'
    const queue2 = 'queue2'
    const bindRoute2 = 'noMatter2'
    const callback2 = mockFn2
    

    RabbitOnMemory.subscribe(exchange1, exchangeType1, queue1, bindRoute1, callback1)
    RabbitOnMemory.subscribe(exchange2, exchangeType2, queue2, bindRoute2, callback2)
    
    await RabbitOnMemory.publish('fanout1', 'noMatter3', Buffer.from('Sample message'))
    await RabbitOnMemory.publish('fanout2', 'noMatter3', Buffer.from('Sample message'))

    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockFn2).toHaveBeenCalledTimes(1)
  })
})