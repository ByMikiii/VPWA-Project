<template>
  <transition name="fade">
  <section class="side" v-show="state.showChannels">
    <div class="side-header">
      <h5 class="">Channels</h5>
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
          <path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6" />
          <path d="M9 17v1a3 3 0 0 0 6 0v-1" />
        </svg>
      </button>
    </div>


    <div id="channels-list">
      <button v-for="channel in state.channels" :key="channel.id" @click="handleChannelChange(channel)" class="channel-button text-left" :class="{ 'bg-primary': state.currentChannel.id === channel.id }" type="button">
        {{ channel.name }}
      </button>
    </div>


    <q-btn
    color="primary"
    unelevated
    class="text-white q-pa-sm join-btn"
    no-wrap
    >
      <div class="row items-center justify-center no-wrap q-gutter-x-sm">
        <span>Join channel</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          style="flex-shrink: 0;"
        >
          <path d="M13 12v.01" />
          <path d="M3 21h18" />
          <path d="M5 21V5a2 2 0 0 1 2-2h6m4 10.5v7.5" />
          <path d="M21 7h-7m3-3-3 3 3 3" />
        </svg>
      </div>
    </q-btn>

    <q-btn
      color="primary"
      unelevated
      class="text-white q-pa-sm join-btn"
    >
      <div class="row items-center q-gutter-x-sm">
        <span>Create Channel</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M8 1v14" />
          <path d="M1 8h14" />
        </svg>
      </div>
    </q-btn>
    <ProfileTab/>
  </section>
  </transition>
</template>

<script setup lang="ts">
  import ProfileTab from './ProfileTab.vue';
  import { inject } from 'vue'
  import type { Channel, ChatState} from '../state/ChatState'

  const state = inject('ChatState') as typeof ChatState

  function handleChannelChange(channel: Channel) {
    state.currentChannel = channel
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
