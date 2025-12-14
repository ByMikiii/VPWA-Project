<template>
<q-dialog v-model="showUsersWin" persistent>
  <q-card class="users-list-main q-pa-md bg-secondary relative-position">
    <q-btn
      flat
      round
      icon="close"
      size="xs"
      class="absolute-top-right"
      style="top: 8px; right: 8px;"
      @click="showUsersWin = false"
    />
    <div class="q-mt-sm">
      <div v-for="role in roles" :key="role">
        <h6 v-if="usersByRole(role).length > 0" class="role text-black">
          {{ role }} ({{ usersByRole(role).length }})
        </h6>

        <div
          v-for="user in usersByRole(role)"
          :key="user.id"
          class="row items-center q-pa-sm q-gutter-x-sm user-tab"
        >
          <ProfilePicture :status="user.status" />
          <p id="username">{{ user.username }}</p>
        </div>
      </div>
    </div>
  </q-card>
</q-dialog>

  <section class="col-grow" id="chat" v-show="state.showChat">
    <div class="center-header">
      <div class="end-btn">
        <transition name="fade">
          <button class="start-btn" @click="toggleChannels" v-show="!state.showChannels">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M4 6l16 0" />
              <path d="M4 12l16 0" />
              <path d="M4 18l16 0" />
            </svg>
          </button>
        </transition>
      </div>

      <h4 class="row items-center" id="chat-title">{{ state.currentChannel.name }}</h4>

      <div class="end-btn">
        <transition name="fade">
          <button class="end-btn" @click="toggleUsers" v-show="!state.showUsers">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
              <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              <path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
            </svg>
          </button>
        </transition>
      </div>
    </div>

    <div ref="messagesContainer" class="messages-cont" @scroll="onScroll">
      <div id="messages">
        <ChatMessage
          v-for="msg in ChatState.messages"
          :key="msg.timestamp"
          :name="msg.sender_name || 'Unknown'"
          :timestamp="msg.timestamp || ''"
          :message="msg.content || ''"
          :sent="msg.sender_id === state.currentUser.id"
          :highlighted="msg.receiver_id === state.currentUser.id"
        />

        <ChatMessage
          v-for="user in ChatState.typingUsers"
          :key="user.user_id"
          :name="user.username"
          :sent="false"
          :typing="true"
          :message="user.message">
        </ChatMessage>
      </div>
    </div>

    <div id="chat-area" class="rounded-borders relative">

      <div
        v-if="showCommands && filteredCommands.length > 0"
        class="command-popup absolute"
      >
        <ul>
          <li
            v-for="(cmd, index) in filteredCommands"
            :key="cmd.name"
            @click="applyCommand(cmd.name, '/')"
            class="cursor-pointer"
            :class="[
              index === selectedIndex ? 'bg-primary' : ''
            ]"
          >
            /{{ cmd.name }} — <span class="opacity-70">{{ cmd.desc }}</span>
          </li>
        </ul>
      </div>

      <div
        v-if="showUsers && filteredUsers.length > 0"
        class="command-popup absolute"
      >
        <ul>
          <li
            v-for="(username, index) in filteredUsers"
            :key="username.username"
            @click="applyCommand(username.username, '@')"
            class="cursor-pointer"
            :class="[
              index === selectedIndex ? 'bg-primary' : ''
            ]"
          >
            @{{ username.username }}
          </li>
        </ul>
      </div>


      <textarea
        type="text"
        name="chat-textfdsfds"
        v-model="chatText"
        id="chat-text"
        placeholder="Type a message..."
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
        maxlength="200"
        @keydown.enter.prevent="handleEnter($event)"
        @input="handleTyping"
        >
      </textarea>
      <button class="send-button" @click="handleSend">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M10 14l11 -11" />
          <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" />
        </svg>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
  import ProfilePicture from 'components/ProfilePicture.vue';
  import ChatMessage from 'components/ChatMessage.vue'
  import { computed, inject, ref, nextTick, watch, onMounted, onBeforeUnmount } from 'vue'
  import type { MessageData, ChannelRole, ChannelUsers, Channel, ChatTypingUser } from '../state/ChatState'
  import { Notify } from 'quasar'
  import { ChatState, getChannelData } from 'src/state/ChatState'
  const offset = ref(20)
  const loadingOlder = ref(false)
  const state = inject('ChatState') as typeof ChatState
  const roles: ChannelRole[] = ['Owner', 'Admin', 'Moderator', 'Guest']

  const usersByRole = (role: ChannelUsers['role']) =>
    state.currentChannel.users.filter(user => user.role === role)

  import { api } from 'boot/axios';

  console.log(state.currentChannel.id)
  const showUsersWin = ref(false)
  const messagesContainer = ref<HTMLDivElement | null>(null)
  const showCommands = computed(() => chatText.value.startsWith('/'))
    const filteredCommands = computed(() => {
      const input = chatText.value.slice(1).toLowerCase()
      return state.commands.filter(c => c.name.startsWith(input))
  })

  // // edge case
  // for (let index = 0; index < 30; index++) {
  //   const userCopy = {
  //     ...state.currentChannel.users[0],
  //     id: state.currentChannel.users.length + 1
  //   } as {
  //     id: number
  //     username: string
  //     role: ChannelRole
  //     status: UserStatus
  //   }
  //   state.currentChannel.users.push(userCopy)
  // }


  import { connectWebSocket, disconnectWebSocket, sendWebSocketMessage } from 'src/state/ChatState';

  onMounted(() => {
    connectWebSocket()
  })
  onBeforeUnmount(() => {
    disconnectWebSocket()
  })

  let lastTypingTime = 0;
  function handleTyping() {
    if (!chatText.value) {
      return
    }

    // 100 milisekundovy throttle
    const now = Date.now();
    if (now - lastTypingTime < 80) {
      return
    };
    lastTypingTime = now;

    console.log(chatText.value)
    const typingData: ChatTypingUser = {
      channel_id: state.currentChannel.id,
      user_id: ChatState.currentUser.id,
      username: ChatState.currentUser.nickname,
      message: chatText.value
    }
    console.log("jeetyping data: ", typingData)

    sendWebSocketMessage('typing', {
      channel_id: state.currentChannel.id,
      user_id: ChatState.currentUser.id,
      username: ChatState.currentUser.nickname,
      message: chatText.value
     })
  }

  watch(
  () => ChatState.typingUsers,
  (newVal) => {
    if (newVal.length > 0) {
      const last = newVal[newVal.length - 1]
      console.log("LATEST TYPING USER:", last?.message)
    }
  },
  { deep: true }
)

  const showUsers = computed(() => chatText.value.startsWith('@'))
    const filteredUsers = computed(() => {
      console.log()
      const input = chatText.value.slice(1).toLowerCase()
      return state.currentChannel.users.filter(u => u.username.toLowerCase().startsWith(input))
  })

  const scrollToBottom = ref(true)

  watch(
    () => state.messages.length,
    async () => {
      const lastMessage = state.messages.at(-1);

      if(lastMessage){
        ChatState.typingUsers = ChatState.typingUsers.filter(
          user =>
            !(user.channel_id === lastMessage.channel_id &&
              user.user_id === lastMessage.sender_id)
        );
        console.log("typing deleted")
      }
      console.log("new messages time to scroll")
      await nextTick()
      if (messagesContainer.value && scrollToBottom.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
    },
    { deep: true }
  )

    watch(
      () => state.typingUsers.length,
    async () => {

      console.log("new messages time to scroll")
      await nextTick()
      if (messagesContainer.value && scrollToBottom.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
    },
    { deep: true }
  )


  onMounted(() => {
  if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
  const chatText = ref('')
  const selectedIndex = ref(0)


  const handleEnter = (event: KeyboardEvent) => {
    if (!event.shiftKey) {
      handleSend().catch(console.error)
    }
  }

  const handleSend = async() => {
    const text = chatText.value.trim()

    if (!text) return
    console.log("message sent")
    if (text.startsWith('/')) {
      handleCommand(text)
      chatText.value = ''
      return
    }
    interface MessageResponse {
      message: string
      sender_id: string
      sender_name: string
      receiver_id: string | null
      timestamp: string
    }
    await api.post<MessageResponse>('/messages', {
      message: text,
      receiver_id: "",
      channel_id: state.currentChannel.id
    })
      .then(res =>  {
        Notify.create('Message has been sent!');
        /*
        const newMessage: MessageData = {
          channel_id: state.currentChannel.id,
          sender_id: res.data.sender_id,
          sender_name: res.data.sender_name,
          receiver_id: res.data.receiver_id,
          content: res.data.message,
          timestamp: res.data.timestamp
        }
        state.messages.push(newMessage)
        */
        chatText.value = '';
        console.log(res.data.message)
      })
      .catch(err => {
        Notify.create(err)
        console.error(err)
      })
  }

  const toggleUsers = () => {
    console.log(window.innerWidth)
    state.showUsers = !state.showUsers
    if(state.showUsers === true){
      if(window.innerWidth <= 1024 && window.innerWidth > 768){
        state.showChannels = false;
      }else if(window.innerWidth <= 768){
        state.showChannels = false;
        state.showChat = false;
      }
    }else{
      state.showChat = true;
    }
  }

  const toggleChannels = () => {
    console.log(window.innerWidth)
    state.showChannels = !state.showChannels
    if(state.showChannels === true){
      if(window.innerWidth <= 1024 && window.innerWidth > 768){
        state.showUsers = false;
      }else if(window.innerWidth <= 768){
        state.showUsers = false;
        state.showChat = false;
      }
    }else{
      state.showChat = true;
    }
  }

  function applyCommand(cmd: string, prefix: string) {
    chatText.value = `${prefix}${cmd} `
  }

  const handleCommand = (text: string) => {
    const parts = text.trim().split(' ')
    if(parts[0] == null){
        Notify.create("Missing  command!");
        return
    }
    if(parts[1] == null && parts[0] in ['/list', '/cancel', '/quit']){
      Notify.create("Missing argument");
      return
    }

    const command = parts[0].toLowerCase()
    const arg = parts[1]
    let arg2 = '';
    if(parts[2]){
      arg2 = parts[2]
    }

  switch (command) {
    case '/invite':
      handleInvite(arg!).catch(console.error)
      break
    case '/join':
      console.log('join')
      handleCreate(arg!, arg2).catch(console.error)
      break
    case '/revoke':
      console.log('revoke')
      handleRevoke(arg!).catch(console.error)
      break
    case '/kick':
      console.log('kick')
      handleRevoke(arg!).catch(console.error)
      break
    case '/list':
      console.log('list')
      showUsersWin.value = true
      break
    case '/quit':
      console.log('quit')
      handleQuit().catch(console.error)
      break
    case '/cancel':
      console.log('cancel')
      handleCancel().catch(console.error)
      break
    default:
      Notify.create(`Unknown command:, ${command}`)
  }
  }

  const handleInvite = async (username: string) => {
    console.log(state.currentUser.id, ' invited ', username, ' to ', state.currentChannel.id)
    await api.post<string>('/invite', {
      invitedBy: state.currentUser.id,
      username: username,
      channelId: state.currentChannel.id
    })
      .then(res =>  {
        Notify.create('Invitation has been sent!');
        console.log(res)
      })
      .catch(err => {
        Notify.create(err.response.data)
        console.error(err)
      })
  }

  const handleCreate = async (channelName: string, privateChannel: string) => {
    if (!channelName) {
      Notify.create('Channel name is required')
      return
    }else if (channelName.length > 16){
      Notify.create('Channel name is too long')
      return
    }
    let isPrivate = false
    if(privateChannel === 'private'){
      isPrivate = true
    }
    interface CreateChannelData {
    name: string;
    private: boolean;
    user_id: string;
    }

    const newChannel: CreateChannelData= {
      name: channelName,
      private: isPrivate,
      user_id: state.currentUser.id
    }

    await api.post<Channel>('/channels', newChannel)
      .then(res =>  {
        state.channels.push(res.data)
        console.log('isprivate: ', `${isPrivate}, ${privateChannel}`,);
        if(res.data.ownerId != Number(state.currentUser.id)){
          Notify.create("Successfully joined public channel!");
        }else{
          Notify.create("Channel has been created!");
        }
      })
      .catch(err => {
        Notify.create(err.response.data.message);
      })
  }

  const handleRevoke = async(username: string) => {
    console.log("revoking...", username)
    await api.post<string>('/revoke', {
      current_id: state.currentUser.id,
      username: username,
      channel_id: state.currentChannel.id,
    })
        .then(res =>  {
          Notify.create(res.data);
          console.log(res.data)
          // state.channels.push(res.data)
        })
        .catch(err => {
          Notify.create(err.response.data.message);
        })
  }

  const handleQuit = async () => {
    if(state.currentChannel.ownerId != Number(state.currentUser.id)){
      Notify.create("You are not owner of this channel!")
      return
    }
    await handleCancel().catch(console.error)
  }

  const handleCancel = async () => {
    const success = await api.post<string>('/members', {
        user_id: state.currentUser.id,
        channel_id: state.currentChannel.id,
      })
          .then(res =>  {
            Notify.create(res.data);
            ChatState.channels = ChatState.channels.filter(ch => ch.id !== ChatState.currentChannel.id);
            if (ChatState.channels[0]){
              ChatState.currentChannel = ChatState.channels[0];
            }
            console.log(res.data)
            console.log(ChatState.currentChannel);
            console.log(ChatState.channels);
            return true;
          })
          .catch(err => {
            Notify.create(err.response.data.message);
            return false;
          })
    if (success && ChatState.channels[0]){
      await getChannelData();
    }
  }

  const loadOlderMessages = async () => {
  if (loadingOlder.value){
    return
  }
  loadingOlder.value = true

  const container = messagesContainer.value
  const prevHeight = container?.scrollHeight || 0

  try {
    const res = await api.get<MessageData[]>('/messages', {
      params: {
        channel_id: state.currentChannel.id,
        limit: 2, offset:
        offset.value
      }
    })

    if (!res.data.length) {
      return
    }
    console.log("fteching 2 messages")
    ChatState.messages.unshift(...res.data)
    offset.value += res.data.length
    await nextTick()

    if (container) {
      const newHeight = container.scrollHeight
      container.scrollTop = newHeight - prevHeight
    }
  } finally {
    loadingOlder.value = false
  }
  // 2s delay aby sa scroll nebil s infinity scrollom
  new Promise(resolve => setTimeout(resolve, 1000)).then(() => {
  scrollToBottom.value = true
  }).catch(console.error);
}

const onScroll = () => {
  const container = messagesContainer.value
  if (!container || loadingOlder.value) {
    return
  }
  if (container.scrollTop <= 20) {
    scrollToBottom.value = false
    loadOlderMessages().catch(console.error)
  }
}

</script>

<style scoped>
  .users-list-main {
    width: 320px;
    height: 70%;
  }
  #chat-title{
    max-width: 330px;
    overflow: hidden;
  }
  /* .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  } */
</style>
