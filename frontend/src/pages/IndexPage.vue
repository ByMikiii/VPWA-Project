<template>
  <main class="q-ma-xl row">

    <ChannelList/>

    <ChatSection/>

    <UsersTab/>

  </main>

  <button id="notification-btn">
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
      <path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6" />
      <path d="M9 17v1a3 3 0 0 0 6 0v-1" />
    </svg>
  </button>
</template>

<script setup lang="ts">
  import { inject } from 'vue';
  import ChannelList from 'components/ChannelList.vue';
  import ChatSection from 'components/ChatSection.vue';
  import UsersTab from 'components/UsersTab.vue';
  import { onMounted, onUnmounted } from 'vue';
  import type { ChatState } from 'src/state/ChatState';
  const state = inject('ChatState') as typeof ChatState

  const SMALL_WIDTH = 768
  const MEDIUM_WIDTH = 1024
  const updateShowUsers = () => {
    if(state.showChat) {
      state.showUsers = window.innerWidth > MEDIUM_WIDTH;
    }
    if(window.innerWidth > SMALL_WIDTH){
      state.showChat = true;
    }
  }
  const updateShowChannels = () => {
    if(state.showChat) {
      state.showChannels = window.innerWidth > SMALL_WIDTH;
    }
    if(window.innerWidth > SMALL_WIDTH){
      state.showChat = true;
    }
  }
  updateShowUsers()
  updateShowChannels()

  onMounted(() => {
    window.addEventListener('resize', updateShowUsers)
    window.addEventListener('resize', updateShowChannels)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateShowUsers)
    window.addEventListener('resize', updateShowChannels)
  })

</script>

<style>
</style>
