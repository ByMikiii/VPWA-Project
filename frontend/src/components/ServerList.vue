<template>
  <div id="channels-list">
    <button v-for="channel in state.channels" :key="channel.id" @click="state.currentChannelId = channel.id" class="channel-button text-left">
      {{ channel.name }}
    </button>
  </div>
</template>

<script setup lang="ts">
  import { inject } from 'vue'
  import type { ChatState} from '../state/ChatState'

  const state = inject('ChatState') as typeof ChatState
</script>

<style lang="scss">

</style>
