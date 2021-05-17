import { IPublishOptions } from "../src/interfaces/IPublishOptions"
import { IQueueBinding } from "../src/interfaces/IQueueBinding"
import RabbitOnMemory from '../src/index'

describe('RabbitOnMemory direct mode', () => {
  it('should set exchange to default value', async () => {
    const subOptions: IQueueBinding = {
      queue: 'queue1',
      bindRoute: 'noMatter',
      callback: async () => {}
    }

    RabbitOnMemory.subscribe(subOptions)

    const messageOptions: IPublishOptions = {
      content: 'Sample message',
      route: 'noMatter'
    }

    await expect(RabbitOnMemory.publish(messageOptions)).resolves.not.toThrow()
  })

  it('should throw when exchange not exists', async () => {
    const exchange = 'randomDirect'
    const messageOptions: IPublishOptions = {
      exchange,
      content: 'Sample message',
      route: 'noMatter'
    }

    return RabbitOnMemory.publish(messageOptions).catch(error => {
      expect(error.name).toBe('ExchangeNotExists')
    })
  })

  it('should throw when exchange is not supported', async () => {
    const subOptions: IQueueBinding = {
      exchange: 'headers',
      exchangeType: 'headers',
      queue: 'queue1',
      bindRoute: 'noMatter',
      callback: async () => {}
    }

    RabbitOnMemory.subscribe(subOptions)

    const exchange = 'headers'
    const messageOptions: IPublishOptions = {
      exchange,
      content: 'Sample message',
      route: 'noMatter'
    }

    return RabbitOnMemory.publish(messageOptions).catch(error => {
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
    const subOptions: IQueueBinding = {
      exchange: 'direct',
      exchangeType: 'direct',
      queue: 'queue1',
      bindRoute: 'route',
      options: {
        expires: 1
      },
      callback: mockFn
    }

    RabbitOnMemory.subscribe(subOptions)

    await delay()

    const messageOptions: IPublishOptions = {
      exchange: 'direct',
      content: 'Sample message',
      route: 'route',
      deliveryMode: 1
    }

    await RabbitOnMemory.publish(messageOptions)
    expect(mockFn).toHaveBeenCalledTimes(0)
  })

  it ('should set delivery mode to 1', async () => {
    const mockFn = jest.fn<any, any>(async (message: any) => {})
    const subOptions: IQueueBinding = {
      queue: 'queue1',
      bindRoute: 'noMatter',
      callback: mockFn
    }

    RabbitOnMemory.subscribe(subOptions)

    const messageOptions: IPublishOptions = {
      content: 'Sample message',
      route: 'noMatter',
      deliveryMode: 1
    }

    await RabbitOnMemory.publish(messageOptions)
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
    const subOptions: IQueueBinding = {
      queue: 'queue1',
      bindRoute: 'noMatter',
      callback: mockFn
    }

    RabbitOnMemory.subscribe(subOptions)

    const messageOptions: IPublishOptions = {
      content: 'Sample message',
      route: 'noMatter',
      deliveryMode: 2
    }

    await RabbitOnMemory.publish(messageOptions)
    expect(mockFn).toBeCalledWith(
      expect.objectContaining({
        properties: expect.objectContaining({
          deliveryMode: 2
        })
      })
    )
  })
})