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
  channelId: string
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

export interface Command {
  name: string
  desc: string
}

const users: User[] = [
  { id: '1', nickname: 'Alice123', email: 'alice@example.com', name: 'Alice', surname: 'Smith', status: 'Online' },
  { id: '2', nickname: 'Bob456fdsjfh jdshjkfh ds', email: 'bob@example.com', name: 'Bob', surname: 'Johnson', status: 'Away' },
  { id: '3', nickname: 'Charlie789', email: 'charlie@example.com', name: 'Charlie', surname: 'Brown', status: 'Offline' },
  { id: '4', nickname: 'Dave321', email: 'dave@example.com', name: 'Dave', surname: 'Davis', status: 'Online' },
  { id: '5', nickname: 'Eve654', email: 'eve@example.com', name: 'Eve', surname: 'Miller', status: 'Online' },
  { id: '6', nickname: 'Frank987', email: 'frank@example.com', name: 'Frank', surname: 'Wilson', status: 'Away' },
  { id: '7', nickname: 'Grace111', email: 'grace@example.com', name: 'Grace', surname: 'Moore', status: 'Offline' },
  { id: '8', nickname: 'Heidi222', email: 'heidi@example.com', name: 'Heidi', surname: 'Taylor', status: 'Online' },
  { id: '9', nickname: 'Ivan333', email: 'ivan@example.com', name: 'Ivan', surname: 'Anderson', status: 'Away' },
  { id: '10', nickname: 'Judy444', email: 'judy@example.com', name: 'Judy', surname: 'Thomas', status: 'Online' },
  { id: '11', nickname: 'Ivan336', email: 'ivan1@example.com', name: 'Ivan', surname: 'Anderson', status: 'Away' },
  { id: '12', nickname: 'Ivan334', email: 'ivan2@example.com', name: 'Ivan', surname: 'Anderson', status: 'Away' },
  { id: '13', nickname: 'Ivan335', email: 'ivan3@example.com', name: 'Ivan', surname: 'Anderson', status: 'Away' },
]

export const channels: Channel[] = [
  {
    id: '1',
    name: 'General',
    users: [
      { id: '1', role: 'Owner' },
      { id: '2', role: 'Admin' },
      { id: '3', role: 'Moderator' },
      { id: '4', role: 'Guest' },
      { id: '5', role: 'Guest' },
      { id: '6', role: 'Guest' },
      { id: '7', role: 'Guest' },
      { id: '8', role: 'Guest' },
      { id: '9', role: 'Guest' },
      { id: '10', role: 'Guest' },
      { id: '11', role: 'Guest' },
      { id: '12', role: 'Guest' },
      { id: '13', role: 'Guest' },
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

const messages: Message[] = [
  {
    channelId: '1',
    senderId: '1',
    content: 'ahoj',
    timestamp: '1767076500000'
  },
  {
    channelId: '1',
    senderId: '2',
    content: 'ako sa mas',
    timestamp: '1767076560000'
  },
  {
    channelId: '1',
    senderId: '1',
    content: 'dobrze',
    timestamp: '1767076620000'
  },
  {
    channelId: '1',
    senderId: '3',
    content: 'co robis',
    timestamp: '1767076680000'
  },
  {
    channelId: '2',
    senderId: '4',
    content: 'ahoj vsetci',
    timestamp: '1767076740000'
  },
  {
    channelId: '2',
    senderId: '5',
    content: 'ideme von',
    timestamp: '1767076800000'
  },
  {
    channelId: '3',
    senderId: '6',
    content: 'dnes pekne pocasie',
    timestamp: '1767076860000'
  },
  {
    channelId: '3',
    senderId: '7',
    content: 'mam hlad',
    timestamp: '1767076920000'
  },
  {
    channelId: '3',
    senderId: '6',
    content: 'pojdem jest',
    timestamp: '1767076980000'
  },
  {
    channelId: '1',
    senderId: '2',
    content: 'superg sdgdsjkjgskj fksdjh kfjsdh jkfsdjkfdj hsdkj hfkjsdh jkfhsdkj fhkjsdh fjksdh kjfhsdkj fhdskjh fkjsdh fkjsdh kjfhksjd hfkjsdh fkjshd kjfhdskj hfkjsd fhkjsdh fkjhsd kj',
    timestamp: '1767077040000'
  },
  {
    channelId: '1',
    senderId: '2',
    content: '.',
    timestamp: '1767077040000'
  }
]

const commands: Command[] = [
  { name: 'help', desc: 'shows help information' },
  { name: 'kick', desc: 'kicks selected user' },
  { name: 'invite', desc: 'creates invitation code' },
]
export function getMessagesByChannelId(channelId: string): Message[] {
  return ChatState.messages.filter(m => m.channelId === channelId)
}

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
  messages: messages,
  commands: commands,
  showUsers: true,
  showChannels: true,
  showChat: true
})
