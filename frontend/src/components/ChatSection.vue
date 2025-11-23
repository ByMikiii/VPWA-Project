<template>
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


    <div id="messages" ref="messagesContainer">
      <ChatMessage
        v-for="message in state.messages"
        :name="message.sender_name || 'Unknown'"
        :key="message.timestamp"
        :timestamp="message.timestamp || ''"
        :message="message.content || ''"
        :sent="message.sender_id === state.currentUser.id"
      />

      <ChatMessage name="User" :sent="false" :typing="true"></ChatMessage>
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
            @{{ username }}
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
  import ChatMessage from 'components/ChatMessage.vue'
  import { computed, inject, ref, watch, nextTick  } from 'vue'
  import type { ChatState, MessageData } from '../state/ChatState'
  import { Notify } from 'quasar'
  import { api } from 'boot/axios';

  const state = inject('ChatState') as typeof ChatState
  console.log(state.currentChannel.id)
  const messagesContainer = ref<HTMLDivElement | null>(null)

  const showCommands = computed(() => chatText.value.startsWith('/'))
    const filteredCommands = computed(() => {
      const input = chatText.value.slice(1).toLowerCase()
      return state.commands.filter(c => c.name.startsWith(input))
  })
  const showUsers = computed(() => chatText.value.startsWith('@'))
    const filteredUsers = computed(() => {
      console.log()
      const input = chatText.value.slice(1).toLowerCase()
      return state.currentChannel.users.filter(u => u.username.toLowerCase().startsWith(input))
  })

watch(
  () => state.messages.values.length,
  async () => {
    await nextTick()
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  },
  { deep: true }
)

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
        const newMessage: MessageData = {
          channel_id: state.currentChannel.id,
          sender_id: res.data.sender_id,
          sender_name: res.data.sender_name,
          receiver_id: res.data.receiver_id,
          content: res.data.message,
          timestamp: res.data.timestamp
        }
        state.messages.push(newMessage)
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
    if(parts[0] == null || parts [1] == null){
      Notify.create("Missing argument or command!");
      return
    }
    const command = parts[0].toLowerCase()
    const arg = parts[1]

  switch (command) {
    case '/invite':
      handleInvite(arg).catch(console.error)
      break
    case '/kick':
      console.log('kick')
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
        Notify.create(err)
        console.error(err)
      })
  }
</script>

<style scoped>
  /* .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  } */
</style>
