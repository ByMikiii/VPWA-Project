import { reactive } from 'vue'

export type UserStatus = 'Online' | 'Offline' | 'Away' | 'Do Not Disturb'

export interface User {
  id: string
  nickname: string
  email: string
  status: UserStatus
}

export interface Message {
  id: string
  senderId: string
  content: string
  timestamp: string
}

export interface Channel {
  id: string
  name: string
  users: string[]
}

// iba v 1.faze
const currentUser: User = {
  id: '1',
  nickname: 'Username1',
  email: 'user@user.com',
  status: 'Away'
}

export const ChatState = reactive({
  currentUser: currentUser,
  channels: [
    { id: '1', name: 'General', users: ['1'] },
    { id: '2', name: 'Random', users: ['1'] }
  ] as Channel[],
  currentChannelId: '1' as string | null,
})
