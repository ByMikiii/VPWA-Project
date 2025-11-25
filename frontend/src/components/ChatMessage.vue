<template>
    <q-chat-message
      :sent="sent"
      text-color="white"
      :bg-color="sent ? 'primary' : 'secondary'"
      :class="highlighted ? 'highlighted-message' : ''"
    >
      <template v-slot:name>
        <span class="message-name">{{ name }}</span>
      </template>
      <template v-slot:stamp v-if="timestamp">{{formatTimestamp(timestamp)}}</template>
      <template v-slot:avatar>
        <img
          :class="[
            'q-message-avatar',
            sent ? 'q-message-avatar--sent' : 'q-message-avatar--received'
          ]"
          src="profile-picture.webp"
        />
      </template>
      <q-spinner-dots v-if="typing" size="1.5rem" />
      <span v-else class="message-text">{{ message }}</span>

    </q-chat-message>
</template>

<script setup lang="ts">

  function formatTimestamp(timestamp: string): string {
    const date = new Date(typeof timestamp === 'string' ? parseInt(timestamp) : timestamp)
    const month = date.toLocaleString('en-US', { month: 'short' })
    const day = date.getDate()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}, ${day} ${month}`
  }
  defineProps({
    name: {
      type: String,
      required: true
    },
    timestamp: {
      type: String,
    },
    message: {
      type: String,
    },
    sent: {
      type: Boolean,
      required: true
    },
    typing: {
      type: Boolean,
      default: false
    },
    highlighted: {
      type: Boolean,
    }
  })

</script>

<style scoped>
  .highlighted-message {
    border: 2px solid yellow;
    background-color: rgba(255, 255, 0, 0.2);
    transition: background-color 0.3s, border 0.3s;
  }
</style>
