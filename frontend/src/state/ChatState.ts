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
  only_mentions: boolean
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
  description: string | null
  isPrivate: boolean
  isDeleted: boolean
  ownerId: number
  latestActivity: string
  createdAt: string
  updatedAt: string
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
  invited_by: string
  channel_id: string
}

export interface MessageData {
  channel_id: string
  sender_name: string
  sender_id: string
  receiver_id: string | null
  content: string
  timestamp: string
}

export interface NotificationData {
  user_id: string
  sender_name: string
  channel_name: string
  content: string
  notification_id: string
}

export interface ChannelUsers {
  id: number
  username: string
  role: ChannelRole
  status: UserStatus
}

let socket: WebSocket | null = null;
/*
if (localStorage.getItem('token')){
  socket = new WebSocket(`ws://localhost:8082?token=${localStorage.getItem('token')}`);

  socket.onopen = () => {
    console.log("WS connected");
  };

  socket.onmessage = (event) => {
    console.log('Received:', event.data)
    const data = (event.data);
    handleMessage(data);
  };
}

if (!localStorage.getItem('token')) {
  if (socket){
    socket.close();
    socket = null;
    console.log("WS connection closed")
  }
}
*/

export function connectWebSocket() {
  if (socket) return; // neotváraj 2x

  const token = localStorage.getItem('token');
  if (!token) return;

  socket = new WebSocket(`ws://localhost:8082?token=${token}`);

  socket.onopen = () => console.log("WS connected");

  socket.onmessage = (event) => {
    const data = event.data;
    handleMessage(data);
  };

  socket.onclose = () => {
    console.log("WS closed");
    socket = null;
  };
}

export function disconnectWebSocket() {
  if (socket) {
    socket.close();
    socket = null;
  }
}

let currentUser: User = { id: '', nickname: '', email: '', name: '', surname: '', status: "Offline", only_mentions: false };
//let currentUser = users[0];

const savedUser = localStorage.getItem('currentUser');
if (savedUser) {
  currentUser = JSON.parse(savedUser);
}

if (localStorage.getItem('token')){
  connectWebSocket();
}

function handleMessage(message: string) {
  const data = JSON.parse(message);
  console.log(data);

  switch (data.type) {
    case 'status_changed':{
      const user = ChatState.currentChannel.users.find(user => user.id == Number(data.user_id));
      console.log(user);
      if (user){
        user.status = data.activity_status;
      }
      console.log(user);
      break;
    }
    case 'invitation_created':{
      console.log(newInvitations);
      ChatState.newInvitations.push({id: data.id, string_code: data.string_code, valid_till: data.valid_till, invited_by_username: data.invited_by_username,
        channel_name: data.channel_name, invited_by: data.invited_by, channel_id: data.channel_id
      });
      console.log(newInvitations);
      break;
    }
    case 'message_sent':{
      console.log(newMessages.length);
      console.log(currentChannel.id);
      console.log(data.channel_id);
      if (data.channel_id == currentChannel.id){
        ChatState.messages.push({channel_id: data.channel_id,
          sender_name: data.sender_name,
          sender_id: data.sender_id,
          receiver_id: data.receiver_id,
          content: data.content,
          timestamp: data.timestamp})
      }
      console.log(newMessages.length);
      break;
    }
    case 'nickname_changed':{
      const user = ChatState.currentChannel.users.find(user => user.id == Number(data.user_id));
      console.log(user);
      if (user){
        user.username = data.nickname;
      }
      console.log(user);
      break;
    }
    case 'new_channel_user':{
      ChatState.currentChannel.users.push({id: data.user.id, username: data.user.nickname, 
        role: "Guest", status: data.user.activityStatus});
    }
  }
}

const users: User[] = [
  { id: '2', nickname: 'Alice123', email: 'alice@example.com', name: 'Alice', surname: 'Smith', status: 'Online', only_mentions: false },
  { id: '1', nickname: 'Bob456fdsjfh jdshjkfh ds', email: 'bob@example.com', name: 'Bob', surname: 'Johnson', status: 'Away', only_mentions: false },
  { id: '3', nickname: 'Charlie789', email: 'charlie@example.com', name: 'Charlie', surname: 'Brown', status: 'Offline', only_mentions: false },
  { id: '4', nickname: 'Dave321', email: 'dave@example.com', name: 'Dave', surname: 'Davis', status: 'Online', only_mentions: false },
  { id: '5', nickname: 'Eve654', email: 'eve@example.com', name: 'Eve', surname: 'Miller', status: 'Online', only_mentions: false },
  { id: '6', nickname: 'Frank987', email: 'frank@example.com', name: 'Frank', surname: 'Wilson', status: 'Away', only_mentions: false },
  { id: '7', nickname: 'Grace111', email: 'grace@example.com', name: 'Grace', surname: 'Moore', status: 'Offline', only_mentions: false },
  { id: '8', nickname: 'Heidi222', email: 'heidi@example.com', name: 'Heidi', surname: 'Taylor', status: 'Online', only_mentions: false },
  { id: '9', nickname: 'Ivan333', email: 'ivan@example.com', name: 'Ivan', surname: 'Anderson', status: 'Away', only_mentions: false },
  { id: '10', nickname: 'Judy444', email: 'judy@example.com', name: 'Judy', surname: 'Thomas', status: 'Online', only_mentions: false },
  { id: '11', nickname: 'Ivan336', email: 'ivan1@example.com', name: 'Ivan', surname: 'Anderson', status: 'Away', only_mentions: false },
  { id: '12', nickname: 'Ivan334', email: 'ivan2@example.com', name: 'Ivan', surname: 'Anderson', status: 'Away', only_mentions: false },
  { id: '13', nickname: 'Ivan335', email: 'ivan3@example.com', name: 'Ivan', surname: 'Anderson', status: 'Away', only_mentions: false },
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

// const notifications: Notification[] = [
//   { user: 'Miki', channel: 'general', message: 'cau ne' },
//   { user: 'Anna', channel: 'dev-chat', message: 'ahoj' },
//   { user: 'John', channel: 'random', message: 'ffdksjfkds kfdsj flksdj klfjsdkl fjsldkjf lksdj flksdjfsklj fkldsjl kfjdslk fjsdlkjf klsdjf lkdsjlkf jsdkl fjdsklj fkldsjklf jsdlkjf lksdj flk' },
// ]


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


let currentChannel: Channel = {
  id: "1",
  name: "General",
  description: "Default general chat channel",
  isPrivate: false,
  isDeleted: false,
  ownerId: 1,
  latestActivity: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  users: []
}
let newInvitations: InvitationData[] = [];
let newChannels: Channel[] = [];
let newMessages: MessageData[] = [];
let newNotifications: NotificationData[] = [];

export const fetchChannelData = async () => {
  await api.get<ChannelUsers[]>('/users', {
    params: { channel_id: currentChannel.id }
  })
    .then(res => {
      console.log('users: ', res.data)
      currentChannel.users = res.data
    })
    .catch(err => {
      Notify.create(err.response.data.error);
    })

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
if (currentUser.id !== '') {
  console.log("usr: ", currentUser.id)
  await api.get<Channel[]>('/channels', {
    params: { user_id: currentUser.id }
  })
    .then(res => {
      console.log('jsdfjk', res.data)
      newChannels = res.data
      console.log('new; ', newChannels)
      if (newChannels[0]) {
        currentChannel = newChannels[0]!
        currentChannel.users = []
      }
    })
    .catch(err => {
      Notify.create(err.response.data.message);
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

  await api.get<NotificationData[]>('/notifications', {
    params: { user_id: currentUser.id }
  })
    .then(res => {
      newNotifications = res.data
      console.log("new notif: ", res.data);
    })
    .catch(err => {
      Notify.create(err.response.data.message);
    })

  await fetchChannelData()

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
  notifications: newNotifications,
  showUsers: true,
  showChannels: true,
  showChat: true,
  newInvitations: newInvitations
})
