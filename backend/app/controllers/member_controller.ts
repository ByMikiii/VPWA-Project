import { DateTime } from 'luxon'
import type { HttpContext } from '@adonisjs/core/http'
import Channel from '#models/channel'
import Member from '#models/member'

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
}
