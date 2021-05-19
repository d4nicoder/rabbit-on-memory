import { IPublishOptions } from "../src/interfaces/IPublishOptions"
import { IQueueBinding } from "../src/interfaces/IQueueBinding"
import RabbitOnMemory from '../src/index'

describe('RabbitOnMemory direct mode', () => {
  it('should throw when exchange not exists', async () => {
    const exchange = 'randomDirect'
    const content = Buffer.from('Sample message')

    return RabbitOnMemory.publish(exchange, 'noMatter', content).catch(error => {
      expect(error.name).toBe('ExchangeNotExists')
    })
  })

  it('should throw when exchange is not supported', async () => {
    const callback = async () => {}

    // @ts-ignore
    RabbitOnMemory.subscribe('headers', 'headers', 'queue1', 'noMatter', callback, {})

    const exchange = 'headers'
    const route = 'noMatter'
    const content = Buffer.from('Sample message')

    return RabbitOnMemory.publish(exchange, route, content).catch(error => {
      expect(error.name).toBe('ExchangeNotSupported')
    })
  })

  it('should remove expired queue', async () => {
    const delay= async (): Promise<void> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve()
        }, 10)
      })
    }
    const mockFn = jest.fn<any, any>(async (message: any) => {})
    const exchange = 'direct'
    const exchangeType = 'direct'
    const queue = 'queue1'
    const bindRoute = 'route'
    const subOptions: IQueueBinding = {
      expires: 1
    }

    RabbitOnMemory.subscribe(exchange, exchangeType, queue, bindRoute, mockFn, subOptions)

    await delay()

    const route = 'route'
    const content = Buffer.from('Sample message')

    await RabbitOnMemory.publish(exchange, route, content)
    expect(mockFn).toHaveBeenCalledTimes(0)
  })

  it ('should set delivery mode to 1', async () => {
    const mockFn = jest.fn<any, any>(async () => {})
    const exchange = 'sample'
    const exchangeType = 'direct'
    const queue = 'queue1'
    const bindRoute = 'noMatter'

    RabbitOnMemory.subscribe(exchange, exchangeType, queue, bindRoute, mockFn)

    const route = 'noMatter'
    const content = Buffer.from('Sample message')
    const options: IPublishOptions = {
      deliveryMode: 1
    }
    
    await RabbitOnMemory.publish(exchange, route, content, options)
    expect(mockFn).toBeCalledWith(
      expect.objectContaining({
        properties: expect.objectContaining({
          deliveryMode: 1
        })
      })
    )
  })

  it ('should set delivery mode to 2', async () => {
    const mockFn = jest.fn<any, any>(async (message: any) => {})
    const exchange = 'default'
    const exchangeType = 'direct'
    const queue = 'queue1'
    const bindRoute = 'noMatter'
    

    RabbitOnMemory.subscribe(exchange, exchangeType, queue, bindRoute, mockFn)

    const route = 'noMatter'
    const content = Buffer.from('Sample message')
    const options: IPublishOptions = {
      deliveryMode: 2
    }
    
    await RabbitOnMemory.publish(exchange, route, content, options)
    expect(mockFn).toBeCalledWith(
      expect.objectContaining({
        properties: expect.objectContaining({
          deliveryMode: 2
        })
      })
    )
  })
})