<template>

    <div class="row justify-between items-center join-btn">
      <textarea
        name="channel-code"
        id="channel-code"
        placeholder="#CHANNEL_CODE"
        maxlength="12"
        ref="channelCodeRef"
      ></textarea>
      <q-btn
      color="primary"
      unelevated
      class="text-white q-pa-sm"
      no-wrap
      @click="joinChannel"
      >
        <div class="row items-center justify-center no-wrap q-gutter-x-sm">
          <span>Join</span>
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
    </div>

    <ChannelCreation/>
</template>

<script setup lang="ts">
  import ChannelCreation from './ChannelCreation.vue'
  import { ref } from 'vue'
  import { Notify } from 'quasar';

  const channelCodeRef = ref<HTMLTextAreaElement | null>(null)


  const joinChannel = () => {
    Notify.create({message: `Invite code "${channelCodeRef.value?.value}" does not exist`, color: 'negative'})
  }
</script>

<style>

</style>
