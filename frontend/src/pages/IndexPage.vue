<template>
  <main class="q-ma-xl row">

    <ChannelList/>

    <ChatSection/>

    <UsersTab/>

  </main>
  <NotificationBox/>
</template>

<script setup lang="ts">
  import { inject } from 'vue';
  import ChannelList from 'components/ChannelList.vue';
  import ChatSection from 'components/ChatSection.vue';
  import UsersTab from 'components/UsersTab.vue';
  import NotificationBox from 'components/NotificationBox.vue';
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
