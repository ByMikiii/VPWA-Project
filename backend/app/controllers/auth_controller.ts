import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

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

    return response.ok({ message: 'Registered successfully', user: user })
  }


  public async login({ request, response }: HttpContext){
    const payload = request.body()

    const user = await User.findBy('email', payload.email)

    //unathorized vracia statuscode 401
    if (!user){
      return response.unauthorized({ message: 'User with such e-mail does not exist' })
    }

    const isValid = await hash.verify(user.password, payload.password)

    if (!isValid){
      return response.unauthorized({ message: 'The password is not correct' })
    }

    user.activity_status = 'Online'
    await user.save()
    
    return response.ok({ message: 'Logged in successfully', user: user })
  }


  public async logout ({ request, response }: HttpContext){
    const payload = request.body()

    const user = await User.findBy('id', payload.id)

    if (user){
      user.activity_status = 'Offline'
      await user.save()
    }
    else{
      return response.noContent()
    }

    return response.ok({ message: 'Logged out successfully'})
  }
}
