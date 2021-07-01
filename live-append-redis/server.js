const path = require('path')
const { createServer } = require('http')
const express = require('express')
const Redis = require('ioredis')

const app = express()

const WebSocket = require('ws')

const redisPub = new Redis({
  host: process.env.REDIS_HOST ? process.env.REDIS_HOST : undefined
})
const redisSub = new Redis({
  host: process.env.REDIS_HOST ? process.env.REDIS_HOST : undefined
})

const pubSubChannel = 'my-channel'
const nodeId = Math.floor(Math.random() * 1000000)

app.get('/', (req, res) => res.sendFile(path.resolve(__dirname, 'front.html')))

const port = process.env.PORT || 8080
const server = createServer(app)
server.listen(port, () => console.log(`Listening on http://localhost:${port} - Node id = ${nodeId}`))

const wss = new WebSocket.Server({ server })

const broadcast = msg => wss.clients.forEach(x => x.readyState === WebSocket.OPEN && x.send(msg))

wss.on('connection', ws => {
  ws.send('hi')

  ws.on('message', message => {
    console.log('[WS] Received: %s', message)
    const [command, value] = message.split(';')
    if (command === 'APPEND') {
      // Received command, publish to redis
      const message = JSON.stringify({ nodeId, content: value })
      redisPub.publish(pubSubChannel, message)
      console.log('[PubSub] Published %s to %s', message, pubSubChannel)
    }
  })
})

redisSub.subscribe(pubSubChannel, (err, count) => {
  if (err) return console.error('Failed to subscribe: %s', err.message)
  console.log(`[PubSub] Subscribed successfully! This client is currently subscribed to ${count} channels.`)
})

redisSub.on('message', (channel, _message) => {
  const message = JSON.parse(_message)
  const { content } = message
  console.log(`[PubSub] Received ${content} from ${channel}`)
  broadcast(`VALUE;${content}`)
})
