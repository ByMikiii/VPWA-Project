import { reactive } from 'vue'
import { Notify } from 'quasar';
import axios from 'axios';
import { AppVisibility } from 'quasar'

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

export interface ChatTypingUser {
  channel_id: string
  user_id: string
  username: string
  message: string
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

  socket.onmessage = async (event) => {
    const data = event.data;
    await handleMessage(data);
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

export function sendWebSocketMessage(type: string, data: object) {
  if (socket) {
    socket.send(JSON.stringify({ type, data }));
  }
}

if (localStorage.getItem('token')) {
  connectWebSocket();
}
let currentUser: User = { id: '', nickname: '', email: '', name: '', surname: '', status: "Offline", only_mentions: false };
//let currentUser = users[0];

export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    console.warn("error accessing system notif");
    return;
  }

  console.log("notifications request sent")
  if (Notification.permission === "default") {
    await Notification.requestPermission();
  }
}

export function sendSystemNotification(title: string, body: string) {
  if (Notification.permission !== "granted") return;

  new Notification(title, {
    body,
    icon: "/icons/favicon-32x32.png",
    silent: false,
  });
}

const savedUser = localStorage.getItem('currentUser');
if (savedUser) {
  currentUser = JSON.parse(savedUser);
  await requestNotificationPermission();
}

if (localStorage.getItem('token')) {
  connectWebSocket();
}

const typingTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

async function handleMessage(message: string) {
  const data = JSON.parse(message);
  console.log(data);

  switch (data.type) {
    case 'status_changed': {
      const user = ChatState.currentChannel.users.find(user => user.id == Number(data.user_id));
      console.log(user);
      if (user) {
        user.status = data.activity_status;
      }
      console.log(user);
      break;
    }
    case 'invitation_created': {
      console.log(newInvitations);
      ChatState.newInvitations.push({
        id: data.id, string_code: data.string_code, valid_till: data.valid_till, invited_by_username: data.invited_by_username,
        channel_name: data.channel_name, invited_by: data.invited_by, channel_id: data.channel_id
      });
      console.log(newInvitations);
      break;
    }
    case 'user_typing': {
      const newTypingUser: ChatTypingUser = data.message.data;
      console.log(data)
      console.log(`${ChatState.currentChannel.id} ${data.message.data.channel_id} ${newTypingUser.user_id} ${ChatState.currentUser.id}`)
      if (ChatState.currentChannel.id == data.message.data.channel_id && newTypingUser && newTypingUser.user_id != ChatState.currentUser.id) {
        const index = ChatState.typingUsers.findIndex(
          user => user.user_id === newTypingUser.user_id
        );
        // replace ak uz existuje
        if (newTypingUser.message === "") {
          if (index !== -1) {
            ChatState.typingUsers.splice(index, 1);
          }
          const existingTimeout = typingTimeouts.get(newTypingUser.user_id);
          if (existingTimeout) {
            clearTimeout(existingTimeout);
            typingTimeouts.delete(newTypingUser.user_id);
          }

          return;
        }
        else if (index !== -1) {
          // ChatState.typingUsers[index] = newTypingUser;
          ChatState.typingUsers.push(newTypingUser);
          ChatState.typingUsers.splice(index, 1);
        } else {
          ChatState.typingUsers.push(newTypingUser);
        }

        console.log("Typing users:", ChatState.typingUsers);

        const existingTimeout = typingTimeouts.get(newTypingUser.user_id);
        if (existingTimeout) {
          clearTimeout(existingTimeout);
        }

        const timeout = setTimeout(() => {
          const index = ChatState.typingUsers.findIndex(
            user => user.user_id === newTypingUser.user_id
          );

          if (index !== -1) {
            ChatState.typingUsers.splice(index, 1);
            console.log("Removed typing user:", newTypingUser.user_id);
          }

          typingTimeouts.delete(newTypingUser.user_id);
        }, 5000);

        typingTimeouts.set(newTypingUser.user_id, timeout);
      }
      break;
    }
    case 'message_sent': {
      console.log(ChatState.currentChannel.id);
      console.log(data.channel_id);
      if (data.channel_id == ChatState.currentChannel.id) {
        ChatState.messages.push({
          channel_id: data.channel_id,
          sender_name: data.sender_name,
          sender_id: data.sender_id,
          receiver_id: data.receiver_id,
          content: data.content,
          timestamp: data.timestamp
        })
      }
      console.log(ChatState.currentUser);

      if (data.sender_id == ChatState.currentUser.id) {
        break;
      }

      if (ChatState.currentUser.status == "Do Not Disturb" || ChatState.currentUser.status == "Offline") {
        break;
      }

      if (ChatState.currentUser.only_mentions && data.receiver_id != ChatState.currentUser.id) {
        break;
      }

      await handleNewNotification(data.message_id);

      break;
    }
    case 'nickname_changed': {
      const user = ChatState.currentChannel.users.find(user => user.id == Number(data.user_id));
      console.log(user);
      if (user) {
        user.username = data.nickname;
      }
      console.log(user);
      break;
    }
    case 'new_channel_user': {
      ChatState.currentChannel.users.push({
        id: data.user.id, username: data.user.nickname,
        role: "Guest", status: data.user.activityStatus
      });
    }
  }
}

async function handleNewNotification(message_id: number) {
  if (AppVisibility.appVisible) {
    return
  }
  await api.post<NotificationData>('/notifications', {
    user_id: currentUser.id, message_id: message_id,
  })
    .then(res => {
      console.log(ChatState.notifications);
      ChatState.notifications.push({
        user_id: res.data.user_id, sender_name: res.data.sender_name,
        channel_name: res.data.channel_name, content: res.data.content, notification_id: res.data.notification_id
      });
      sendSystemNotification("New message", res.data.content);
      console.log(ChatState.notifications);
    })
    .catch(err => {
      Notify.create(err.response.data.message);
    })
}

const commands: Command[] = [
  { name: 'invite', desc: 'invites certain user' },
  { name: 'join', desc: 'joins or creates channel (/join name [private])' },
  { name: 'revoke', desc: 'owner kicks selected user' },
  { name: 'kick', desc: 'vote to kick' },
  { name: 'quit', desc: 'deletes channel' },
  { name: 'cancel', desc: 'leave or if owner delete channel' },
  { name: 'list', desc: 'list all users of current channel' },
]

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
const typingUsers: ChatTypingUser[] = [];

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
    params: {
      channel_id: currentChannel.id,
      limit: 20,
      offset: 0
    }
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
  newInvitations: newInvitations,
  typingUsers: typingUsers
})
