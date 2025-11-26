import { WebSocketServer } from 'ws'
import Jwt from 'jsonwebtoken'

const wss = new WebSocketServer({ port: 8082 })

const connectedUsers = new Map()

wss.on('connection', (socket, req) => {
  console.log('WS client connected')
  let token

  if (req.url) {
    const params = new URLSearchParams(req.url.replace('/?', ''))
    token = params.get('token')
  }

  if (!token) {
    socket.close()
    return
  }

  interface JwtUserPayload {
    id: number
    iat?: number
    exp?: number
  }
  let decoded: JwtUserPayload
  try {
    decoded = Jwt.verify(token, process.env.JWT_SECRET!) as JwtUserPayload
  } catch (err) {
    console.log("Invalid token")
    socket.close()
    return
  }

  const userId = decoded.id

  connectedUsers.set(userId, socket)

  socket.on('close', () => {
    connectedUsers.delete(userId)
    console.log("User disconnected:", userId)
  })

  socket.on('message', (data) => {
    const text = data.toString();
    const message = JSON.parse(text);
    console.log(message)
    if (message.type === 'typing') {
      connectedUsers.forEach((client) => {
        if (client.readyState === client.OPEN) {
          client.send(JSON.stringify({
            type: "user_typing",
            message: message,
          }))
        }
      })
    }
  })

  socket.send(JSON.stringify('WS authenticated and connected!'))
})

export { connectedUsers }
