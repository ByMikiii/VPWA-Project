// import { DateTime } from 'luxon'
import type { HttpContext } from '@adonisjs/core/http'
import Channel from '#models/channel'
import Member from '#models/member'
import User from '#models/user'
import Message from '#models/message'
import { DateTime } from 'luxon'


export default class MessageController {
  public async sendMessage({ request, response }: HttpContext) {
    const payload = request.body()

    const channel = await Channel.find(payload.channel_id)
    const sender = await User.find(payload.sender_id)
    const member = await Member
      .query()
      .where('channel_id', payload.channel_id)
      .andWhere('user_id', payload.sender_id)
      .first()
    if (!payload.message || !payload.sender_id || !sender || !channel || !member) {
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
    message.sender_id = payload.sender_id;
    message.channel_id = payload.channel_id
    await message.save()

    channel.latest_activity = DateTime.now()
    channel.save()

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

    const messages = messagesTemp.map(msg => ({
      channel_id: msg.channel_id,
      content: msg.message,
      sender_name: msg.$extras.sender_name,
      sender_id: msg.sender_id,
      receiver_id: msg.receiver_id,
      timestamp: msg.createdAt.toMillis().toString()
    }))
    return messages
  }

}
