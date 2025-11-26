import { DateTime } from 'luxon'
import type { HttpContext } from '@adonisjs/core/http'
import Channel from '#models/channel'
import Member from '#models/member'
import User from '#models/user'
import Invitation from '#models/invitation'
import { connectedUsers } from '../../start/websocket.js'

export default class InvitationController {

  public async createInvitation({ request, response }: HttpContext) {
    const payload = request.body()
    console.log('create invitation: ', payload)
    const user = await User
      .query()
      .where('nickname', payload.username)
      .first()

    const channel = await Channel
      .query()
      .where('id', payload.channelId)
      .first()
    console.log('invited to: ', channel)

    if (!user || !channel) {
      return response.conflict('User or channel does not exist!')
    }

    if (channel.is_private === true && channel.owner_id != payload.invitedBy) {
      return response.unauthorized('You are not authorized to invite in this channel!')
    }

    const existingMember = await Member
      .query()
      .where('user_id', user.id)
      .andWhere('channel_id', payload.channelId)
      .first()

    if (existingMember) {
      if (existingMember?.is_kicked === true) {
        existingMember.is_kicked = false
        existingMember.kick_ids = '';
        existingMember.save()
        return response.ok({ message: 'User has been unbanned!' })
      }
      return response.conflict('Cannot invite this user')
    }

    const sender = await User
      .query()
      .where('id', payload.invitedBy)
      .first()

    if (!user) {
      return response.conflict({ message: 'User does not exist!' })
    }

    const invitation = new Invitation()
    invitation.accepted = false;
    invitation.invited_by = payload.invitedBy;
    invitation.receiver_id = user.id;
    invitation.channel_id = payload.channelId;
    invitation.string_code = [...Array(8)].map(() => (~~(Math.random() * 36)).toString(36)).join('').toUpperCase();
    invitation.valid_till = DateTime.now().plus({ days: 7 })
    await invitation.save()

    const client = connectedUsers.get(user.id)
    console.log(client)
    if (client && client.readyState && client.readyState === client.OPEN) {
      client.send(JSON.stringify({
        type: "invitation_created", id: invitation.id,
        string_code: invitation.string_code, valid_till: invitation.valid_till,
        invited_by_username: sender?.nickname, channel_name: channel?.name, invited_by: invitation.invited_by,
        channel_id: invitation.channel_id
      }))
    }


    return response.ok({ message: 'Invitation has beed sent!' })
  }


  public async acceptInvitation({ request, response }: HttpContext) {
    const payload = request.body()
    console.log(payload, "fdksfksdhjfkl jsdklhjf klsdhkl fsdkl")

    const existingMember = await Member
      .query()
      .where('user_id', payload.receiver_id)
      .andWhere('channel_id', payload.channel_id)
      .first()

    const existingInvitation = await Invitation
      .query()
      .where('receiver_id', payload.receiver_id)
      .andWhere('invited_by', payload.invited_by)
      .andWhere('channel_id', payload.channel_id)
      .first()

    if (!existingInvitation || existingMember) {
      return response.conflict({ message: 'Invitation does not exist or you already are in that channel!' })
    }

    if (payload.is_accepted === true) {
      existingInvitation.accepted = true;
      existingInvitation.save()
      const member = new Member()
      member.is_kicked = false;
      member.kick_ids = '';
      member.user_id = existingInvitation.receiver_id;
      member.channel_id = existingInvitation.channel_id;
      member.role = "Guest"
      await member.save()
      const channel = await Channel
        .query()
        .where('id', payload.channel_id)
        .first()

      const user = await User
        .query()
        .where('id', payload.receiver_id)
        .first()

      if (channel){
        connectedUsers.forEach((client) => {
        if (client.readyState === client.OPEN) {
          client.send(JSON.stringify({ type: "new_channel_user", channel_id: channel.id, user: user}))
        }
        })
      }
      return response.ok(channel)
    } else {
      existingInvitation.valid_till = DateTime.now();
      existingInvitation.save()
      console.log('invit declined')
      return response.ok(null)
    }
  }

  public async fetchInvitations({ request, response }: HttpContext) {
    const user_id = request.qs().user_id
    console.log(user_id)
    if (!user_id) {
      return response.badRequest({ error: 'user_id is required' })
    }

    const invitationsTemp = await Invitation
      .query()
      .where('receiver_id', user_id)
      .andWhere('valid_till', '>', DateTime.now().toJSDate())
      .andWhere('accepted', '!=', 1)
      .join('users', 'invitations.invited_by', 'users.id')
      .join('channels', 'invitations.channel_id', 'channels.id')
      .select(
        'invitations.id',
        'invitations.string_code',
        'invitations.valid_till',
        'users.nickname as invited_by_username',
        'channels.name as channel_name',
        'invitations.channel_id',
        'invitations.invited_by'
      )

    const invitations = invitationsTemp.map((inv) => ({
      id: inv.id,
      string_code: inv.string_code,
      valid_till: inv.valid_till?.toISO(),
      invited_by_username: inv.$extras.invited_by_username,
      channel_name: inv.$extras.channel_name,
      channel_id: inv.channel_id,
      invited_by: inv.invited_by
    }));
    return invitations;
  }
}
