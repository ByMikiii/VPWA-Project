import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

export default class AuthController {
  public async register({ request, response }: HttpContext) {
    const payload = request.body() // alebo request.all()

    // Jednoduchá server-side validácia
    if (!payload.email || !payload.password || !payload.name || !payload.surname || !payload.nickname) {
      return response.badRequest({ message: 'All fields are required' })
    }

    if (payload.password.length < 6) {
      return response.badRequest({ message: 'Password must be at least 6 characters' })
    }

    if (payload.nickname.length < 6) {
      return response.badRequest({ message: 'Nickname must be at least 6 characters' })
    }

    // Overenie unikátnosti
    const existingEmail = await User.findBy('email', payload.email)
    if (existingEmail) {
      return response.badRequest({ message: 'Email already in use' })
    }

    const existingNick = await User.findBy('nickname', payload.nickname)
    if (existingNick) {
      return response.badRequest({ message: 'Nickname already in use' })
    }

    // Vytvorenie používateľa
    const user = new User()
    user.email = payload.email
    user.name = payload.name
    user.surname = payload.surname
    user.nickname = payload.nickname
    user.password = await hash.make(payload.password)
    user.activity_status = 'online'
    await user.save()

    return response.ok({ message: 'Registered successfully', user: user })
  }
}
