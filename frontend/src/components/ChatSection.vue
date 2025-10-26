<template>
  <section class="col-grow" id="chat">

    <div class="center-header">
      <button class="start-btn" @click="toggleChannels">
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
      <ChatMessage v-for="message in messages"
        :name="getUserById(message.senderId)!.nickname"
        :key="message.timestamp"
        :timestamp="message.timestamp"
        :message="message.content"
        :sent="message.senderId === state.currentUser.id"
      />

      <ChatMessage name="User" :sent="false" :typing="true"></ChatMessage>
    </div>


    <div id="chat-area">
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
  import type { ChatState, Message } from '../state/ChatState'
  import { getUserById, getMessagesByChannelId } from '../state/ChatState'

  const state = inject('ChatState') as typeof ChatState
  const messages = computed(() => getMessagesByChannelId(state.currentChannel.id))
  console.log(state.currentChannel.id)
  const messagesContainer = ref<HTMLDivElement | null>(null)

watch(
  () => messages.value.length,
  async () => {
    await nextTick()
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  },
  { deep: true }
)

  const chatText = ref('')

  const handleEnter = (event: KeyboardEvent) => {
    if (!event.shiftKey) {
      handleSend()
    }
  }

  const handleSend = () => {
    console.log("message sent")
    const newMessage: Message = {
      channelId: state.currentChannel.id,
      senderId: state.currentUser.id,
      content: chatText.value,
      timestamp: Date.now().toString()
    }
    state.messages.push(newMessage)
    chatText.value = '';
  }

  const toggleUsers = () => {
    state.showUsers = !state.showUsers
  }

  const toggleChannels = () => {
    state.showChannels = !state.showChannels
  }
</script>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
