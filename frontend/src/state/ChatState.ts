import { reactive } from 'vue'
import { Notify } from 'quasar';
import axios from 'axios';
const api = axios.create({
  baseURL: 'http://localhost:3333'
});


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

export interface Channel {
  id: string
  name: string
  private: boolean
  users: ChannelUsers[]
}

export interface Command {
  name: string
  desc: string
}

export interface Notification {
  user: string
  channel: string
  message: string
}

export interface Invitation {
  id: number
  accepted: boolean
  string_code: string | null
  channel_id: number
  invited_by: number
  receiver_id: number
  valid_till: Date | null
  createdAt: Date
  updatedAt: Date | null
}

export interface InvitationData {
  id: number
  string_code: string
  valid_till: Date
  invited_by_username: string
  channel_name: string
}

export interface MessageData {
  channel_id: string
  sender_name: string
  sender_id: string
  receiver_id: string | null
  content: string
  timestamp: string
}

export interface ChannelUsers {
  id: number
  username: string
  role: ChannelRole
  status: UserStatus
}

const users: User[] = [
  { id: '2', nickname: 'Alice123', email: 'alice@example.com', name: 'Alice', surname: 'Smith', status: 'Online' },
  { id: '1', nickname: 'Bob456fdsjfh jdshjkfh ds', email: 'bob@example.com', name: 'Bob', surname: 'Johnson', status: 'Away' },
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

// export const channels: Channel[] = [
// {
//   id: '1',
//   name: 'General',
//   private: false,
//   users: [
//     { id: '1', role: 'Owner' },
//     { id: '2', role: 'Admin' },
//     { id: '3', role: 'Moderator' },
//     { id: '4', role: 'Guest' },
//     { id: '5', role: 'Guest' },
//     { id: '6', role: 'Guest' },
//     { id: '7', role: 'Guest' },
//     { id: '8', role: 'Guest' },
//     { id: '9', role: 'Guest' },
//     { id: '10', role: 'Guest' },
//     { id: '11', role: 'Guest' },
//     { id: '12', role: 'Guest' },
//     { id: '13', role: 'Guest' },
//   ]
// },
//   {
//     id: '2',
//     name: 'Random',
//     private: true,
//     users: [
//       { id: '6', role: 'Owner' },
//       { id: '7', role: 'Admin' },
//       { id: '8', role: 'Moderator' },
//       { id: '9', role: 'Moderator' },
//       { id: '10', role: 'Guest' }
//     ]
//   },
//   {
//     id: '3',
//     name: 'Development',
//     private: true,
//     users: [
//       { id: '1', role: 'Owner' },
//       { id: '3', role: 'Admin' },
//       { id: '5', role: 'Moderator' },
//       { id: '7', role: 'Moderator' },
//       { id: '9', role: 'Guest' }
//     ]
//   },
//   {
//     id: '4',
//     name: 'Marketing',
//     private: true,
//     users: [
//       { id: '2', role: 'Owner' },
//       { id: '4', role: 'Admin' },
//       { id: '6', role: 'Moderator' },
//       { id: '8', role: 'Moderator' },
//       { id: '10', role: 'Guest' }
//     ]
//   },
//   {
//     id: '5',
//     name: 'Support',
//     private: true,
//     users: [
//       { id: '1', role: 'Owner' },
//       { id: '2', role: 'Admin' },
//       { id: '3', role: 'Moderator' },
//       { id: '4', role: 'Moderator' },
//       { id: '5', role: 'Guest' }
//     ]
//   },
//   {
//     id: '7',
//     name: 'General',
//     private: false,
//     users: [
//       { id: '1', role: 'Owner' },
//       { id: '2', role: 'Admin' },
//       { id: '3', role: 'Moderator' },
//       { id: '4', role: 'Guest' },
//       { id: '5', role: 'Guest' },
//       { id: '6', role: 'Guest' },
//       { id: '7', role: 'Guest' },
//       { id: '8', role: 'Guest' },
//       { id: '9', role: 'Guest' },
//       { id: '10', role: 'Guest' },
//       { id: '11', role: 'Guest' },
//       { id: '12', role: 'Guest' },
//       { id: '13', role: 'Guest' },
//     ]
//   },
//   {
//     id: '8',
//     name: 'Random',
//     private: true,
//     users: [
//       { id: '6', role: 'Owner' },
//       { id: '7', role: 'Admin' },
//       { id: '8', role: 'Moderator' },
//       { id: '9', role: 'Moderator' },
//       { id: '10', role: 'Guest' }
//     ]
//   },
//   {
//     id: '9',
//     name: 'Development',
//     private: true,
//     users: [
//       { id: '1', role: 'Owner' },
//       { id: '3', role: 'Admin' },
//       { id: '5', role: 'Moderator' },
//       { id: '7', role: 'Moderator' },
//       { id: '9', role: 'Guest' }
//     ]
//   },
//   {
//     id: '10',
//     name: 'Marketing',
//     private: true,
//     users: [
//       { id: '2', role: 'Owner' },
//       { id: '4', role: 'Admin' },
//       { id: '6', role: 'Moderator' },
//       { id: '8', role: 'Moderator' },
//       { id: '10', role: 'Guest' }
//     ]
//   },
//   {
//     id: '11',
//     name: 'Support',
//     private: true,
//     users: [
//       { id: '1', role: 'Owner' },
//       { id: '2', role: 'Admin' },
//       { id: '3', role: 'Moderator' },
//       { id: '4', role: 'Moderator' },
//       { id: '5', role: 'Guest' }
//     ]
//   },
//   {
//     id: '12',
//     name: 'General',
//     private: false,
//     users: [
//       { id: '1', role: 'Owner' },
//       { id: '2', role: 'Admin' },
//       { id: '3', role: 'Moderator' },
//       { id: '4', role: 'Guest' },
//       { id: '5', role: 'Guest' },
//       { id: '6', role: 'Guest' },
//       { id: '7', role: 'Guest' },
//       { id: '8', role: 'Guest' },
//       { id: '9', role: 'Guest' },
//       { id: '10', role: 'Guest' },
//       { id: '11', role: 'Guest' },
//       { id: '12', role: 'Guest' },
//       { id: '13', role: 'Guest' },
//     ]
//   },
//   {
//     id: '13',
//     name: 'Random',
//     private: true,
//     users: [
//       { id: '6', role: 'Owner' },
//       { id: '7', role: 'Admin' },
//       { id: '8', role: 'Moderator' },
//       { id: '9', role: 'Moderator' },
//       { id: '10', role: 'Guest' }
//     ]
//   },
//   {
//     id: '14',
//     name: 'Development',
//     private: true,
//     users: [
//       { id: '1', role: 'Owner' },
//       { id: '3', role: 'Admin' },
//       { id: '5', role: 'Moderator' },
//       { id: '7', role: 'Moderator' },
//       { id: '9', role: 'Guest' }
//     ]
//   },
//   {
//     id: '15',
//     name: 'Marketing',
//     private: true,
//     users: [
//       { id: '2', role: 'Owner' },
//       { id: '4', role: 'Admin' },
//       { id: '6', role: 'Moderator' },
//       { id: '8', role: 'Moderator' },
//       { id: '10', role: 'Guest' }
//     ]
//   },
//   {
//     id: '16',
//     name: 'Support',
//     private: true,
//     users: [
//       { id: '1', role: 'Owner' },
//       { id: '2', role: 'Admin' },
//       { id: '3', role: 'Moderator' },
//       { id: '4', role: 'Moderator' },
//       { id: '5', role: 'Guest' }
//     ]
//   },
//   {
//     id: '17',
//     name: 'General',
//     private: false,
//     users: [
//       { id: '1', role: 'Owner' },
//       { id: '2', role: 'Admin' },
//       { id: '3', role: 'Moderator' },
//       { id: '4', role: 'Guest' },
//       { id: '5', role: 'Guest' },
//       { id: '6', role: 'Guest' },
//       { id: '7', role: 'Guest' },
//       { id: '8', role: 'Guest' },
//       { id: '9', role: 'Guest' },
//       { id: '10', role: 'Guest' },
//       { id: '11', role: 'Guest' },
//       { id: '12', role: 'Guest' },
//       { id: '13', role: 'Guest' },
//     ]
//   },
//   {
//     id: '18',
//     name: 'Random',
//     private: true,
//     users: [
//       { id: '6', role: 'Owner' },
//       { id: '7', role: 'Admin' },
//       { id: '8', role: 'Moderator' },
//       { id: '9', role: 'Moderator' },
//       { id: '10', role: 'Guest' }
//     ]
//   }
// ]

// const messages: Message[] = [
//   {
//     channelId: '1',
//     senderId: '1',
//     content: 'ahoj',
//     timestamp: '1767076500000'
//   },
//   {
//     channelId: '1',
//     senderId: '2',
//     content: 'ako sa mas',
//     timestamp: '1767076560000'
//   },
//   {
//     channelId: '1',
//     senderId: '1',
//     content: 'dobrze',
//     timestamp: '1767076620000'
//   },
//   {
//     channelId: '1',
//     senderId: '3',
//     content: 'co robis',
//     timestamp: '1767076680000'
//   },
//   {
//     channelId: '2',
//     senderId: '4',
//     content: 'ahoj vsetci',
//     timestamp: '1767076740000'
//   },
//   {
//     channelId: '2',
//     senderId: '5',
//     content: 'ideme von',
//     timestamp: '1767076800000'
//   },
//   {
//     channelId: '3',
//     senderId: '6',
//     content: 'dnes pekne pocasie',
//     timestamp: '1767076860000'
//   },
//   {
//     channelId: '3',
//     senderId: '7',
//     content: 'mam hlad',
//     timestamp: '1767076920000'
//   },
//   {
//     channelId: '3',
//     senderId: '6',
//     content: 'pojdem jest',
//     timestamp: '1767076980000'
//   },
//   {
//     channelId: '1',
//     senderId: '2',
//     content: 'superg sdgdsjkjgskj fksdjh kfjsdh jkfsdjkfdj hsdkj hfkjsdh jkfhsdkj fhkjsdh fjksdh kjfhsdkj fhdskjh fkjsdh fkjsdh kjfhksjd hfkjsdh fkjshd kjfhdskj hfkjsd fhkjsdh fkjhsd kj',
//     timestamp: '1767077040000'
//   },
//   {
//     channelId: '1',
//     senderId: '2',
//     content: '.',
//     timestamp: '1767077040000'
//   }
// ]

const commands: Command[] = [
  { name: 'help', desc: 'shows help information' },
  { name: 'invite', desc: 'invites certain user' },
  { name: 'revoke', desc: 'kicks selected user' },
  { name: 'quit', desc: 'leave/delete channel' },
  { name: 'cancel', desc: 'deletes channel' },
  { name: 'list', desc: 'list all users of current channel' },
]

const notifications: Notification[] = [
  { user: 'Miki', channel: 'general', message: 'cau ne' },
  { user: 'Anna', channel: 'dev-chat', message: 'ahoj' },
  { user: 'John', channel: 'random', message: 'ffdksjfkds kfdsj flksdj klfjsdkl fjsldkjf lksdj flksdjfsklj fkldsjl kfjdslk fjsdlkjf klsdjf lkdsjlkf jsdkl fjdsklj fkldsjklf jsdlkjf lksdj flk' },
]


// export function getMessagesByChannelId(channelId: string): Message[] {
//   return ChatState.messages.filter(m => m.channelId === channelId)
// }

// export const getUserById = (id: string): User | undefined => {
//   return users.find(user => user.id === id)
// }

// export const getUsersFromCurrentChannel = (): string[] => {
//   return currentChannel.users.map(userChannel => {
//     const user = getUserById(userChannel.id)
//     return user!.nickname;
//   })
// }

if (!users[0]) {
  throw new Error('cfkdsjf')
}



// const currentUser: User = { id: '', nickname: '', email: '', name: '', surname: '', status: "Offline" };
const currentUser = users[0];
let currentChannel: Channel = {
  id: '1',
  name: 'General',
  private: false,
  users: [
  ]
};
let newInvitations: InvitationData[] = [];
let newChannels: Channel[] = [];
let newMessages: MessageData[] = [];
if (currentUser.id !== '') {
  console.log("usr: ", currentUser.id)
  await api.get<Channel[]>('/channels', {
    params: { user_id: currentUser.id }
  })
    .then(res => {
      newChannels = res.data
      if (newChannels[0]) {
        currentChannel = newChannels[0]!
        currentChannel.users = []
      }
    })
    .catch(err => {
      Notify.create(err.response.data.message);
    })

  await api.get<ChannelUsers[]>('/users', {
    params: { channel_id: 4 }
  })
    .then(res => {
      currentChannel.users = res.data
    })
    .catch(err => {
      Notify.create(err.response.data.error);
    })

  await api.get<InvitationData[]>('/invitations', {
    params: { user_id: currentUser.id }
  })
    .then(res => {
      newInvitations = res.data
    })
    .catch(err => {
      Notify.create(err.response.data.message);
    })

  if (currentChannel) {
    await api.get<MessageData[]>('/messages', {
      params: { channel_id: currentChannel.id }
    })
      .then(res => {
        console.log("test: ", res.data)
        newMessages = res.data
      })
      .catch(err => {
        Notify.create(err.response.data.message);
      })
  }

  console.log('channels: ', newChannels)
  console.log('invit: ', newInvitations)
  console.log('messages: ', newMessages)
  console.log('currentUsers: ', currentChannel.users)
}


export const ChatState = reactive({
  currentUser: currentUser,
  channels: newChannels,
  currentChannel: currentChannel,
  messages: newMessages,
  commands: commands,
  notifications: notifications,
  showUsers: true,
  showChannels: true,
  showChat: true,
  newInvitations: newInvitations
})
