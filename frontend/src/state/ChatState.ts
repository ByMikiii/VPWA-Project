import { reactive } from 'vue'

export type UserStatus = 'Online' | 'Offline' | 'Away' | 'Do Not Disturb'

export type ChannelRole = 'Owner' | 'Admin' | 'Moderator' | 'Guest'


export interface User {
  id: string
  nickname: string
  email: string
  name: string
  surname: string
  status: UserStatus
}

export interface Message {
  id: string
  senderId: string
  content: string
  timestamp: string
}

export interface UserChannel {
  id: string,
  role: ChannelRole
}

export interface Channel {
  id: string
  name: string
  users: UserChannel[]
}

const users: User[] = [
  { id: '1', nickname: 'Alice123', email: 'alice@example.com', name: 'Alice', surname: 'Smith', status: 'Online' },
  { id: '2', nickname: 'Bob456', email: 'bob@example.com', name: 'Bob', surname: 'Johnson', status: 'Away' },
  { id: '3', nickname: 'Charlie789', email: 'charlie@example.com', name: 'Charlie', surname: 'Brown', status: 'Offline' },
  { id: '4', nickname: 'Dave321', email: 'dave@example.com', name: 'Dave', surname: 'Davis', status: 'Online' },
  { id: '5', nickname: 'Eve654', email: 'eve@example.com', name: 'Eve', surname: 'Miller', status: 'Online' },
  { id: '6', nickname: 'Frank987', email: 'frank@example.com', name: 'Frank', surname: 'Wilson', status: 'Away' },
  { id: '7', nickname: 'Grace111', email: 'grace@example.com', name: 'Grace', surname: 'Moore', status: 'Offline' },
  { id: '8', nickname: 'Heidi222', email: 'heidi@example.com', name: 'Heidi', surname: 'Taylor', status: 'Online' },
  { id: '9', nickname: 'Ivan333', email: 'ivan@example.com', name: 'Ivan', surname: 'Anderson', status: 'Away' },
  { id: '10', nickname: 'Judy444', email: 'judy@example.com', name: 'Judy', surname: 'Thomas', status: 'Online' }]

export const channels: Channel[] = [
  {
    id: '1',
    name: 'General',
    users: [
      { id: '1', role: 'Owner' },
      { id: '2', role: 'Admin' },
      { id: '3', role: 'Moderator' },
      { id: '4', role: 'Guest' },
      { id: '5', role: 'Guest' }
    ]
  },
  {
    id: '2',
    name: 'Random',
    users: [
      { id: '6', role: 'Owner' },
      { id: '7', role: 'Admin' },
      { id: '8', role: 'Moderator' },
      { id: '9', role: 'Moderator' },
      { id: '10', role: 'Guest' }
    ]
  },
  {
    id: '3',
    name: 'Development',
    users: [
      { id: '1', role: 'Owner' },
      { id: '3', role: 'Admin' },
      { id: '5', role: 'Moderator' },
      { id: '7', role: 'Moderator' },
      { id: '9', role: 'Guest' }
    ]
  },
  {
    id: '4',
    name: 'Marketing',
    users: [
      { id: '2', role: 'Owner' },
      { id: '4', role: 'Admin' },
      { id: '6', role: 'Moderator' },
      { id: '8', role: 'Moderator' },
      { id: '10', role: 'Guest' }
    ]
  },
  {
    id: '5',
    name: 'Support',
    users: [
      { id: '1', role: 'Owner' },
      { id: '2', role: 'Admin' },
      { id: '3', role: 'Moderator' },
      { id: '4', role: 'Moderator' },
      { id: '5', role: 'Guest' }
    ]
  }
]



export const getUserById = (id: string): User | undefined => {
  return users.find(user => user.id === id)
}

if (!users[0] || !channels[0]) {
  throw new Error('cfkdsjf')
}
const currentUser: User = users[0];
const currentChannel: Channel = channels[0];


export const ChatState = reactive({
  currentUser: currentUser,
  channels: channels,
  currentChannel: currentChannel,
})
