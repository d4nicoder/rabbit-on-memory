# Rabbit on memory

[![Tests](https://github.com/d4nicoder/rabbit-on-memory/actions/workflows/node.js.yml/badge.svg)](https://github.com/d4nicoder/rabbit-on-memory/actions/workflows/node.js.yml)

This is a module to implement a basic RabbitMQ system on memory. It allows you to implement DDD in your NodeJS application without deploying extra infrastructure.

With this module you can create exchanges, queues, bind this queues to his exchanges, publish and consume messages, etc. The allowed exchange types are: direct, topic and fanout. 

All will be running in singleton mode, so you will not have to worrie about multiple instances of your message queues.

## Installation

```bash
# NPM
npm install --save rabbit-on-memory

# Yarn
yarn add rabbit-on-memory
```

## Examples

### Creating a queue and bind to a route on an exchange

```typescript
import RabbitOnMemory from 'rabbit-on-memory'

const exchange = 'exchange_name'
const exchangeType = 'direct'
const bindRoute = 'core.user.1.event.user.created'
const queue = 'send_email_on_created_user'
const callback = async (msg) => {}

RabbitOnMemory.subscribe(exchange, exchangeType, queue, bindRoute, callback})

/* This will create the exchange if not exists and will
 * create the queue binded to the exchange with the provided
 * bindRoute
*/
```

### Publish message to a route and exchange

```typescript
import RabbitOnMemory from 'rabbit-on-memory'

const exchange = 'exchange_name'
const route = 'core.user.1.event.user.created'
const msg = {
  content: Buffer.from(JSON.stringify(userData))
}

await RabbitOnMemory.publish(exchange, route, content)

/*
 * This will publish that content on the queue of that exchange
 * If this exchange not exists, it will throw an error
/*
```

## Disclaimer

View LICENSE file for the software contained in this image.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
