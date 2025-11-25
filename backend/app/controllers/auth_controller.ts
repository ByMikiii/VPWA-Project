import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import Jwt from 'jsonwebtoken'
import { connectedUsers } from '../../start/websocket.js'

export default class AuthController {
  public async register({ request, response }: HttpContext) {
    const payload = request.body() // alebo request.all()

    // tato validacia by mala byt vsetka uz spravena na frontende
    if (!payload.email || !payload.password || !payload.name || !payload.surname || !payload.nickname) {
      return response.badRequest({ message: 'All fields are required' })
    }

    if (payload.password.length < 6) {
      return response.badRequest({ message: 'Password must be at least 6 characters' })
    }

    if (payload.nickname.length < 6) {
      return response.badRequest({ message: 'Nickname must be at least 6 characters' })
    }

    // overenie unikatnosti
    // .conflict vracia statuscode 409
    const existingEmail = await User.findBy('email', payload.email)
    if (existingEmail) {
      return response.conflict({ message: 'Email already in use' })
    }

    const existingNick = await User.findBy('nickname', payload.nickname)
    if (existingNick) {
      return response.conflict({ message: 'Nickname already in use' })
    }

    const user = new User()
    user.email = payload.email
    user.name = payload.name
    user.surname = payload.surname
    user.nickname = payload.nickname
    user.password = payload.password //heslo je hashovane uz na zaklade user.ts, cize nechceme hashovat zahashovane
    user.activity_status = 'Online'
    await user.save()

    const token = Jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    )

    connectedUsers.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify({ type: "status_changed", user_id: user.id, activity_status: user.activity_status }))
      }
    })

    return response.ok({ message: 'Registered successfully', user: user, token: token })
  }


  public async login({ request, response }: HttpContext) {
    const payload = request.body()

    const user = await User.findBy('email', payload.email)

    //unathorized vracia statuscode 401
    if (!user) {
      return response.unauthorized({ message: 'User with such e-mail does not exist' })
    }

    const isValid = await hash.verify(user.password, payload.password)

    if (!isValid) {
      return response.unauthorized({ message: 'The password is not correct' })
    }

    user.activity_status = 'Online'
    await user.save()

    const token = Jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    )

    connectedUsers.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify({ type: "status_changed", user_id: user.id, activity_status: user.activity_status }))
      }
    })

    return response.ok({ message: 'Logged in successfully', user: user, token: token })
  }


  public async logout({ request, response }: HttpContext) {
    const payload = request.header('authorization')

    if (!payload){
      return response.noContent()
    }

    const token = payload?.replace(/^Bearer\s+/, '')

    interface JwtUserPayload {
      id: number
      iat?: number
      exp?: number
    }

    let decoded: JwtUserPayload
    try {
      decoded = Jwt.verify(token, process.env.JWT_SECRET!) as JwtUserPayload
      console.log('Decoded token:', decoded)
    } catch (err) {
      console.error('JWT verify error:', err)
      return response.noContent()
    }

    const user = await User.find(decoded.id)

    if (user) {
      user.activity_status = 'Offline'
      await user.save()

      connectedUsers.forEach((client) => {
        if (client.readyState === client.OPEN) {
          client.send(JSON.stringify({ type: "status_changed", user_id: user.id, activity_status: user.activity_status }))
        }
      })
    }

    return response.ok({ message: 'Logged out successfully' })
  }



  public async change_password({ request, response }: HttpContext) {
    const payload = request.body()

    const user = await User.findBy('id', payload.id)

    if (!user) {
      return response.notFound({ message: 'Not found' })
    }

    if (payload.newPassword.length < 6) {
      return response.badRequest({ message: 'Password must be at least 6 characters' })
    }

    if (payload.newPassword != payload.repeatPassword) {
      return response.badRequest({ message: 'Passwords have to be same' })
    }

    if (payload.password == payload.newPassword) {
      return response.badRequest({ message: 'New password and old password have to be different' })
    }

    const isValid = await hash.verify(user.password, payload.password)

    if (!isValid) {
      return response.unauthorized({ message: 'The old password is not correct' }) //401
    }

    user.password = payload.newPassword
    await user.save()

    return response.ok({ message: 'Password changed successfully' })
  }


  public async forgotten_password({ request, response }: HttpContext) {
    const payload = request.body()

    const user = await User.findBy('email', payload.email)

    if (!user) {
      return response.notFound({ message: 'User with such e-mail does not exist' })
    }

    if (payload.newPassword.length < 6) {
      return response.badRequest({ message: 'Password must be at least 6 characters' })
    }

    if (payload.newPassword != payload.repeatPassword) {
      return response.badRequest({ message: 'Passwords have to be same' })
    }

    user.password = payload.newPassword
    await user.save()

    return response.ok({ message: 'Password renewed successfully' })
  }


  public async edit_profile({ request, response }: HttpContext) {
    const payload = request.body()

    const user = await User.findBy('id', payload.id)

    if (!user) {
      return response.notFound({ message: 'User with such e-mail does not exist' })
    }

    if (payload.nickname.length < 6) {
      return response.badRequest({ message: 'Nickname must be at least 6 characters' })
    }

    const existing_email = await User
      .query()
      .where('email', payload.email)
      .whereNot('id', payload.id)
      .first()

    if (existing_email) {
      return response.conflict({ message: 'Email already in use' })
    }

    const existing_nickname = await User
      .query()
      .where('nickname', payload.nickname)
      .whereNot('id', payload.id)
      .first()

    if (existing_nickname) {
      return response.conflict({ message: 'Nickname already in use' })
    }

    if (user.nickname != payload.nickname){ //changed username
      connectedUsers.forEach((client) => {
        if (client.readyState === client.OPEN) {
          client.send(JSON.stringify({ type: "nickname_changed", user_id: user.id, nickname: payload.nickname}))
        }
      })
    }

    user.email = payload.email
    user.name = payload.name
    user.surname = payload.surname
    user.nickname = payload.nickname
    user.only_mentions = payload.only_mentions
    await user.save()


    return response.ok({ message: 'Profile edited successfully' })
  }
}
