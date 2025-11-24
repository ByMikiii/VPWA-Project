import { DateTime } from 'luxon'
import type { HttpContext } from '@adonisjs/core/http'
import Channel from '#models/channel'
import Member from '#models/member'
import User from '#models/user'

const deleteInactive = async () => {
  const cutoffDate = DateTime.now().minus({ days: 30 }).toJSDate();
  await Channel
    .query()
    .where('latest_activity', '<', cutoffDate)
    .update({ is_deleted: true });
}


export default class ChannelController {
  public async createChannel({ request, response }: HttpContext) {
    await deleteInactive()
    const payload = request.body()
    console.log(payload.name)

    const user = await User.find(payload.user_id)
    if (!payload.name || payload.private === undefined || !payload.user_id || !user) {

      return response.badRequest({ message: 'All fields are required' })
    }

    const existingChannel = await Channel.findBy('name', payload.name)
    if (existingChannel) {
      return response.conflict({ message: 'Channel name already exists' })
    }

    const channel = new Channel()
    channel.name = payload.name;
    channel.is_private = payload.private;
    channel.owner_id = payload.user_id;
    channel.latest_activity = DateTime.now()
    await channel.save()

    const member = new Member()
    member.is_kicked = false;
    member.kick_count = 0;
    member.user_id = channel.owner_id;
    member.channel_id = channel.id;
    member.role = "Owner"
    await member.save()

    return response.ok(channel)
  }

  public async fetchChannels({ request, response }: HttpContext) {
    await deleteInactive()
    const user_id = request.qs().user_id
    console.log(user_id)
    if (!user_id) {
      return response.badRequest({ error: 'user_id is required' })
    }

    const memberships = await Member
      .query()
      .where('user_id', user_id)
      .select('channel_id')

    const channelIds = memberships.map((m) => m.channel_id)

    const channels = await Channel
      .query()
      .whereIn('id', channelIds)
      .andWhere('is_deleted', 0)
      .orderBy('latest_activity', "desc")

    return channels
  }

}
