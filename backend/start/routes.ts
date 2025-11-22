/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import User from '#models/user'
import AuthController from '#controllers/auth_controller'


router.get('/', async () => {
  const users = await User.all()
  return users
})

router.post('/register', [AuthController, 'register'])

router.post('/login', [AuthController, 'login'])

router.post('/logout', [AuthController, 'logout'])

router.post('/change_password', [AuthController, 'change_password'])

router.post('/forgotten_password', [AuthController, 'forgotten_password'])