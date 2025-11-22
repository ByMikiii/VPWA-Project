import type { HttpContext } from '@adonisjs/core/http'
// import Channel from '#models/channel'
// import Member from '#models/member'
import User from '#models/user'


export default class UserController {
  public async setStatus({ request, response }: HttpContext) {
    const payload = request.body()

    const user = await User.find(payload.user_id)
    if (!payload.status || !payload.user_id || !user) {
      return response.badRequest({ message: 'All fields are required' })
    }

    user.activity_status = payload.status
    await user.save()
    return response.ok(`Status has been set to ${user.activity_status}!`)
  }

  public async fetchUsers({ request, response }: HttpContext) {
    const user_id = request.qs().user_id
    console.log(response)
    return user_id
  }

}
