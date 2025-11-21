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
import Channel from '#models/channel'
import AuthController from '#controllers/auth_controller'
import ChannelController from '#controllers/channel_controller'
import Member from '#models/member'


router.get('/', async () => {
  const users = await User.all()
  return users
})

router.get('/channels', async () => {
  const channels = await Channel.all()
  return channels
})

router.get('/members', async () => {
  const members = await Member.all()
  return members
})

router.post('/register', [AuthController, 'register'])

router.post('/login', [AuthController, 'login'])

router.post('/logout', [AuthController, 'logout'])

router.post('/channels', [ChannelController, 'createChannel'])

router.post('/getchannels', [ChannelController, 'fetchChannels'])

// router.delete('/channels', [ChannelController, 'deleteChannel'])
