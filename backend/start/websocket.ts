import { WebSocketServer } from 'ws'

const wss = new WebSocketServer({ port: 8082 })

wss.on('connection', (socket) => {
  console.log('WS client connected')

  socket.on('message', (data: string) => {
    console.log('Message:', data.toString())
  })

  socket.send('Welcome to WS server!')
})

export default wss
