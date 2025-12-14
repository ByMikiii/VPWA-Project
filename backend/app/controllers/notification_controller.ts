import { DateTime } from 'luxon'
import type { HttpContext } from '@adonisjs/core/http'
import Channel from '#models/channel'
import Member from '#models/member'
import Message from '#models/message'
import User from '#models/user'
import Notification from '#models/notification'
import Jwt from 'jsonwebtoken'

export default class NotificationController {
  public async createNotification({ request, response }: HttpContext) {
    const header_token = request.header('authorization')
      if (!header_token) {
        return response.unauthorized({ message: "Invalid token" })
      }
  
      const token = header_token.replace('Bearer ', '')
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
        
    const payload = request.body()

    const receiver = await Member
      .query()
      .where('user_id', payload.user_id)
      .first()

    const message = await Message
      .query()
      .where('id', payload.message_id)
      .first()

    if (!message) {
      return response.notFound({ message: "Message not found" })
    }

    const channel = await Channel
      .query()
      .where('id', message.channel_id!)
      .first()

    if (!channel || !receiver) {
      return response.notFound({ message: 'User or channel does not exist!' })
    }

    const user = await User.query()
      .where('id', message.sender_id)
      .first()

    const newNotification = new Notification()
    newNotification.is_read = false;
    newNotification.user_id = receiver.user_id;
    newNotification.message_id = message.id;
    await newNotification.save()

    

    return response.ok({message: "Notification created!", notification_id: newNotification.id, content: message.message,
      user_id: message.sender_id, sender_name: user?.nickname, channel_name: channel.name
    });
  }

  public async fetchNotifications({ request, response }: HttpContext) {
    const user_id = request.qs().user_id
    if (!user_id) {
      return response.badRequest('user_id is required')
    }
    const notificationTemp = await Notification
      .query()
      .where('user_id', user_id)
      .andWhere('is_read', false)
      .join('messages', 'messages.id', 'notifications.message_id')
      .join('users', 'messages.sender_id', 'users.id')
      .join('channels', 'messages.channel_id', 'channels.id')
      .select(
        'users.nickname as username',
        'channels.name as channel_name',
        'notifications.user_id',
        'notifications.id',
        'messages.message as content'
      )

    const notifications = notificationTemp.map(r => ({
      sender_name: r.$extras.username,
      channel_name: r.$extras.channel_name,
      user_id: r.user_id,
      notification_id: r.id,
      content: r.$extras.content
    }))
    return notifications
  }

  public async readNotification({ request, response }: HttpContext) {
    const header_token = request.header('authorization')
    if (!header_token) {
      return response.unauthorized({ message: "Invalid token" })
    }

    const token = header_token.replace('Bearer ', '')
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
        
    const payload = request.body()
    console.log(payload)
    if (!payload.notification_id) {
      return response.badRequest('notification_id is required')
    }
    const notificationTemp = await Notification
      .query()
      .where('id', payload.notification_id)
      .first()

    if (!notificationTemp) {
      return response.badRequest('Notification does not exist!')
    }

    notificationTemp.is_read = true;
    notificationTemp.save()
    return response.ok({ message: "Notification read!" })
  }
}
