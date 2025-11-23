<template>
  <transition name="fade">
  <section
    class="side"
    :class="{ 'full-width': !state.showUsers && !state.showChat }"
    v-show="state.showChannels"
  >
    <div class="side-header">
      <h5 class="">Channels</h5>
        <button class="end-btn" @click="toggleChannels">
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
          <path d="M4 12l10 0" />
          <path d="M4 12l4 4" />
          <path d="M4 12l4 -4" />
          <path d="M20 4l0 16" />
        </svg>
      </button>

    </div>


    <div id="channels-list">
      <button v-for="channel in state.channels" :key="channel.id" @click="handleChannelChange(channel)" class="channel-button text-left row items-center" :class="{ 'bg-primary': state.currentChannel.id === channel.id }" type="button">
        <svg
          v-if="!channel.isPrivate"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="private-icon"
        >
          <path d="M5 11m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />
          <path d="M12 16m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
          <path d="M8 11v-5a4 4 0 0 1 8 0" />
        </svg>

        <svg
          v-if="channel.isPrivate"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="private-icon"
        >
          <path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6z" />
          <path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
          <path d="M8 11v-4a4 4 0 1 1 8 0v4" />
        </svg>
        <span>{{ channel.name }}</span>
      </button>
    </div>

    <Channel-buttons/>

    <ProfileTab/>
  </section>
  </transition>
</template>

<script setup lang="ts">
  import ProfileTab from './ProfileTab.vue';
  import ChannelButtons from './ChannelButtons.vue';
  import { inject } from 'vue'
  import type { Channel, ChatState} from '../state/ChatState'
  import type { ChannelUsers, MessageData } from '../state/ChatState';
  import { Notify } from 'quasar';
  import axios from 'axios';

  const state = inject('ChatState') as typeof ChatState
  const api = axios.create({
    baseURL: 'http://localhost:3333'
  });

  const handleChannelChange = async (channel: Channel) => {
    state.currentChannel = {
      ...channel,
      users: []
    }
    await api.get<ChannelUsers[]>('/users', {
    params: { channel_id: state.currentChannel.id }
  })
    .then(res => {
      console.log('users: ', res.data)
      state.currentChannel.users = res.data
    })
    .catch(err => {
      Notify.create(err.response.data.error);
    })

  await api.get<MessageData[]>('/messages', {
    params: { channel_id: state.currentChannel.id }
  })
    .then(res => {
      console.log("test: ", res.data)
      state.messages = res.data
    })
    .catch(err => {
      Notify.create(err.response.data.message);
    })
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
