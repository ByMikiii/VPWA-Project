<template>
  <div id="channels-list">
    <button v-for="channel in state.channels" :key="channel.id" @click="handleChannelChange(channel)" class="channel-button text-left">
      {{ channel.name }}
    </button>
  </div>
</template>

<script setup lang="ts">
  import { inject } from 'vue'
  import type { Channel, ChatState} from '../state/ChatState'

  const state = inject('ChatState') as typeof ChatState

  function handleChannelChange(channel: Channel) {
    state.currentChannel = channel
  }
</script>

<style lang="scss">

</style>
