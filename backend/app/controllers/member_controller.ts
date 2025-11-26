import { DateTime } from 'luxon'
import type { HttpContext } from '@adonisjs/core/http'
import Channel from '#models/channel'
import Member from '#models/member'
import User from '#models/user'

export default class MemberController {
  public async leaveChannel({ request, response }: HttpContext) {
    const payload = request.body()

    const existingMember = await Member
      .query()
      .where('user_id', payload.user_id)
      .andWhere('channel_id', payload.channel_id)
      .first()

    const channel = await Channel
      .query()
      .where('id', payload.channel_id)
      .first()

    if (!channel || !existingMember) {
      return response.conflict({ message: 'You are not member of this channel!' })
    }

    if (channel?.owner_id === existingMember.user_id) {
      channel.is_deleted = true
      channel.name = DateTime.now().toISO()
      channel.save()
      return response.ok("You successfully deleted the channel!")
    } else {
      existingMember.delete()
      return response.ok("You successfully left the channel!")
    }
  }

  public async kickFromChannel({ request, response }: HttpContext) {
    const payload = request.body()

    const user = await User
      .query()
      .where('nickname', payload.username)
      .first()

    if (!user) {
      return response.notFound({ message: 'User does not exist!' })
    }

    const existingMember = await Member
      .query()
      .where('user_id', user.id)
      .andWhere('channel_id', payload.channel_id)
      .first()

    const channel = await Channel
      .query()
      .where('id', payload.channel_id)
      .first()

    if (!channel || !existingMember) {
      return response.unauthorized({ message: 'You are not authorized to kick this user!' })
    }

    if (channel.owner_id === existingMember.id || channel.owner_id === user.id) {
      return response.conflict({ message: 'You cannot kick owner!' })
    }

    if (channel.owner_id === payload.current_id) {
      existingMember.is_kicked = true
      existingMember.save()
      channel.latest_activity = DateTime.now()
      channel.save()
      return response.ok("You successfully kicked user!")
    } else if (channel.is_private === false) {
      let kickedBy = existingMember.kick_ids ? existingMember.kick_ids.split(',').map(Number) : []

      if (!kickedBy.includes(payload.current_id)) {
        kickedBy.push(payload.current_id)

        if (kickedBy.length > 3) {
          kickedBy = kickedBy.slice(0, 3)
        }
        existingMember.kick_ids = kickedBy.join(',')
        await existingMember.save()
      } else {
        return response.conflict("You cannot vote multiple times!")
      }

      if (kickedBy.length >= 3) {
        existingMember.is_kicked = true;
        existingMember.save()
        return response.ok("You successfully voted out user!")
      }
      return response.ok(`You successfully voted for user kick! (${kickedBy.length}/3)`)
    }
    return response.unauthorized("You are not authorized to kick!")
  }
}
