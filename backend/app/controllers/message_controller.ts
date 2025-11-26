// import { DateTime } from 'luxon'
import type { HttpContext } from '@adonisjs/core/http'
import Channel from '#models/channel'
import Member from '#models/member'
import User from '#models/user'
import Message from '#models/message'
import { DateTime } from 'luxon'

import Jwt from 'jsonwebtoken'
import { connectedUsers } from '../../start/websocket.js'

export default class MessageController {
  public async sendMessage({ request, response }: HttpContext) {
    const payload = request.body()

    const header_token = request.header('authorization')
    console.log(header_token)
    if (!header_token) {
      return response.unauthorized({ message: "Invalid token" })
    }

    const token = header_token.replace('Bearer ', '')
    console.log(token)
    interface JwtUserPayload {
      id: number
      iat?: number
      exp?: number
    }

    let decoded: JwtUserPayload
    try {
      decoded = Jwt.verify(token, process.env.JWT_SECRET!) as JwtUserPayload
    } catch (err) {
      return response.unauthorized({ message: "Invalid token" })
    }
    console.log(decoded.id)
    const sender = await User.find(decoded.id)

    const channel = await Channel.find(payload.channel_id)
    const member = await Member
      .query()
      .where('channel_id', payload.channel_id)
      .andWhere('user_id', decoded.id)
      .andWhere('is_kicked', '!=', true)
      .first()
    if (!payload.message || !decoded.id || !sender || !channel || !member) {
      return response.badRequest({ message: 'Failed to send a message!' })
    }

    const foundUsername = /@(\w+)/
    const mentionUsername = payload.message.match(foundUsername)

    if (mentionUsername) {
      const username = mentionUsername[1]
      const user = await User.findBy('nickname', username)
      if (user) {
        payload.receiver_id = user?.id
      }
    }

    const message = new Message()
    message.message = payload.message;
    message.receiver_id = payload.receiver_id;
    message.sender_id = Number(decoded.id);
    message.channel_id = payload.channel_id
    await message.save()

    channel.latest_activity = DateTime.now()
    channel.save()
    connectedUsers.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify({
          type: "message_sent", content: message.message, sender_name: sender.nickname,
          channel_id: message.channel_id, sender_id: message.sender_id,
          receiver_id: message.receiver_id, timestamp: message.createdAt
        }))
      }
    })

    return response.ok({
      channel_id: message.channel_id,
      message: message.message,
      receiver_id: message.receiver_id,
      sender_id: message.sender_id,
      sender_name: sender.name,
      timestamp: message.createdAt
    })
  }

  public async fetchMessages({ request, response }: HttpContext) {
    const channel_id = request.qs().channel_id
    const limit = request.qs().limit
    const offset = request.qs().offset
    console.log(channel_id)
    if (!channel_id) {
      return response.badRequest({ error: 'channel_id is required' })
    }

    const messagesTemp = await Message
      .query()
      .where('messages.channel_id', channel_id)
      .andWhere('messages.is_deleted', false)
      .join('users', 'messages.sender_id', 'users.id')
      .select(
        'messages.channel_id',
        'messages.message',
        'users.name as sender_name',
        'messages.sender_id',
        'messages.receiver_id',
        'messages.created_at'
      )
      .limit(limit)
      .offset(offset)
      .orderBy('created_at', 'desc')

    const messages = messagesTemp.map(msg => ({
      channel_id: msg.channel_id,
      content: msg.message,
      sender_name: msg.$extras.sender_name,
      sender_id: msg.sender_id,
      receiver_id: msg.receiver_id,
      timestamp: msg.createdAt.toMillis().toString()
    }))
    return messages.reverse()
  }

}
