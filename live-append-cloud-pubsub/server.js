const path = require('path')
const { createServer } = require('http')
const express = require('express')
const WebSocket = require('ws')
const { PubSub } = require('@google-cloud/pubsub')

const pubSubClient = new PubSub()

const topicName = 'my-topic'
const subscriptionName = 'my-sub'

const app = express()

app.get('/', (req, res) => res.sendFile(path.resolve(__dirname, 'front.html')))

const port = process.env.PORT || 8080
const server = createServer(app)
server.listen(port, () => console.log(`Listening on http://localhost:${port}`))

const wss = new WebSocket.Server({ server })

const wsBroadcast = msg => wss.clients.forEach(x => x.readyState === WebSocket.OPEN && x.send(msg))

wss.on('connection', ws => {
  ws.send('hi')

  ws.on('message', async message => {
    console.log('[WS] Received: %s', message)
    const [command, value] = message.split(';')
    if (command === 'APPEND') {
      // Received command, publish to redis
      const message = value
      await pubSubClient.topic(topicName).publish(Buffer.from(message))
      console.log('[PubSub] Published %s to %s', message, topicName)
    }
  })
})

const subscription = pubSubClient.subscription(subscriptionName, { ackDeadline: 10 })

subscription.on('message', (/** @type {import('@google-cloud/pubsub').Message} */ message) => {
  const content = message.data.toString()
  console.log(`[PubSub] Received "${content}" from ${subscriptionName}`)
  wsBroadcast(`VALUE;${content}`)
  message.ack()
})
