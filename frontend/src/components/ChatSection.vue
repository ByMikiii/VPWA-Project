<template>
  <section class="col-grow" id="chat">

    <div class="center-header">
      <button class="start-btn">
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

      <button class="end-btn">
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
    </div>


    <div id="messages">

      <ChatMessage name="Me" timestamp="7 minute AGO" message="cau ne" :sent="true"></ChatMessage>

      <ChatMessage name="User" timestamp="2 minute AGO" message="povedz ty" :sent="false"></ChatMessage>

      <ChatMessage name="Me" :sent="true" :typing="true"></ChatMessage>

      <ChatMessage name="User" :sent="false" :typing="true"></ChatMessage>
    </div>


    <div id="chat-area">
      <textarea name="chat-text" id="chat-text"></textarea>
      <button class="send-button">
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
  import { inject } from 'vue'
  import type { ChatState } from '../state/ChatState'

  const state = inject('ChatState') as typeof ChatState

</script>

<style>

</style>
