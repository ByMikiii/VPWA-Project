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
import Member from '#models/member'
import Invitation from '#models/invitation'
import AuthController from '#controllers/auth_controller'
import ChannelController from '#controllers/channel_controller'
import InvitationController from '#controllers/invitation_controller'
import UserController from '#controllers/user_controller'
import MessageController from '#controllers/message_controller'

router.get('/', async () => {
  const users = await User.all()
  return users
})

router.get('/channel', async () => {
  const channels = await Channel.all()
  return channels
})

router.get('/member', async () => {
  const members = await Member.all()
  return members
})

router.get('/invitation', async () => {
  const invitations = await Invitation.all()
  return invitations
})


router.post('/register', [AuthController, 'register'])

router.post('/login', [AuthController, 'login'])

router.post('/logout', [AuthController, 'logout'])

router.post('/channels', [ChannelController, 'createChannel'])
router.get('/channels', [ChannelController, 'fetchChannels'])

// router.delete('/channels', [ChannelController, 'deleteChannel'])

router.post('/invite', [InvitationController, 'createInvitation'])
router.post('/accept', [InvitationController, 'acceptInvitation'])
router.get('/invitations', [InvitationController, 'fetchInvitations'])

router.post('/status', [UserController, 'setStatus'])

router.post('/messages', [MessageController, 'sendMessage'])
router.get('/messages', [MessageController, 'fetchMessages'])

router.get('/users', [UserController, 'fetchUsers'])
