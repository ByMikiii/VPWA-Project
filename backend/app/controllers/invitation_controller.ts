import { DateTime } from 'luxon'
import type { HttpContext } from '@adonisjs/core/http'
import Channel from '#models/channel'
import Member from '#models/member'
import User from '#models/user'
import Invitation from '#models/invitation'


export default class InvitationController {

  public async createInvitation({ request, response }: HttpContext) {
    const payload = request.body()
    console.log(payload.name)

    const user = await User
      .query()
      .where('username', payload.username)
      .first()

    if (!user) {
      return response.conflict({ message: 'User does not exist!' })
    }

    const existingMember = await Member
      .query()
      .where('user_id', user.id)
      .andWhere('channel_id', payload.channel_id)
      .first()

    if (existingMember) {
      return response.conflict({ message: 'Cannot invite this user' })
    }

    const invitation = new Invitation()
    invitation.accepted = false;
    invitation.invited_by = payload.invitedBy;
    invitation.receiver_id = user.id;
    invitation.channel_id = payload.channelId;
    invitation.string_code = [...Array(8)].map(() => (~~(Math.random() * 36)).toString(36)).join('');
    await invitation.save()

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
      const member = new Member()
      member.is_kicked = false;
      member.kick_count = 0;
      member.user_id = existingInvitation.receiver_id;
      member.channel_id = existingInvitation.channel_id;
      member.role = "Guest"
      await member.save()
      const channel = await Channel
        .query()
        .where('id', payload.channel_id)
        .first()
      return response.ok(channel)
    } else {
      existingInvitation.valid_till = DateTime.now();
      existingInvitation.save()
      return response.ok(null)
    }
  }

  public async fetchInvitations({ request, response }: HttpContext) {
    const user_id = request.qs().user_id
    console.log(user_id)
    if (!user_id) {
      return response.badRequest({ error: 'user_id is required' })
    }

    const invitations = await Invitation
      .query()
      .where('receiver_id', user_id)
      .andWhere('valid_till', '>', DateTime.now().toJSDate())

    return invitations;
  }
}
