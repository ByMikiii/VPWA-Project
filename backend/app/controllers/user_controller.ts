import type { HttpContext } from '@adonisjs/core/http'
// import Channel from '#models/channel'
// import Member from '#models/member'
import User from '#models/user'
import Member from '#models/member'
import { connectedUsers } from '../../start/websocket.js'


export default class UserController {
  public async setStatus({ request, response }: HttpContext) {
    const payload = request.body()

    const user = await User.find(payload.user_id)
    if (!payload.status || !payload.user_id || !user) {
      return response.badRequest({ message: 'All fields are required' })
    }

    user.activity_status = payload.status
    await user.save()

    connectedUsers.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify({ type: "status_changed", user_id: user.id, activity_status: user.activity_status }))
      }
    })
    return response.ok(`Status has been set to ${user.activity_status}!`)
  }

  public async fetchUsers({ request, response }: HttpContext) {
    const channel_id = request.qs().channel_id
    if (!channel_id) {
      return response.badRequest('channel_id is required')
    }
    const usersTemp = await Member
      .query()
      .where('channel_id', channel_id)
      .andWhere('members.is_kicked', false)
      .join('users', 'members.user_id', 'users.id')
      .select(
        'users.id as id',
        'users.nickname as username',
        'members.role',
        'users.activity_status as status'
      )

    const users = usersTemp.map(u => ({
      id: u.id,
      username: u.$extras.username,
      role: u.role,
      status: u.$extras.status
    }))
    return users
  }

}
