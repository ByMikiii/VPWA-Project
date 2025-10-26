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
      <button v-for="channel in state.channels" :key="channel.id" @click="handleChannelChange(channel)" class="channel-button text-left" :class="{ 'bg-primary': state.currentChannel.id === channel.id }" type="button">
        {{ channel.name }}
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

  const state = inject('ChatState') as typeof ChatState

  function handleChannelChange(channel: Channel) {
    state.currentChannel = channel
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
