<template>
    <q-chat-message
      @click="typingActive = !typingActive"
      :sent="sent"
      text-color="white"
      :bg-color="sent ? 'primary' : 'secondary'"
      :class="{
        'highlighted-message': highlighted,
        'cursor-pointer': typing
      }"
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
      <q-spinner-dots v-if="typing && !typingActive" size="1.5rem" />
      <!-- <span v-if="typing && !typingActive">{{ props.message }}</span> -->
      <span v-else class="message-text">{{ message }}</span>

    </q-chat-message>
</template>

<script setup lang="ts">
  import { ChatState } from 'src/state/ChatState'
  import { ref } from 'vue';

  function formatTimestamp(timestamp: string): string {
    const date = new Date(typeof timestamp === 'string' ? parseInt(timestamp) : timestamp)
    const month = date.toLocaleString('en-US', { month: 'short' })
    const day = date.getDate()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}, ${day} ${month}`
  }

  const typingActive = ref<boolean>(false)

  const props = defineProps({
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

  if(props.typing) {
      console.log("typing message")
      setTimeout(() => {
        const index = ChatState.typingUsers.findIndex(
          user =>
            user.username === props.name &&
            user.channel_id === ChatState.currentChannel.id
        );

        if (index !== -1) {
          ChatState.typingUsers.splice(index, 1);
          console.log("Removed typing user:", props.name);
        }
    }, 5000);
  }

</script>

<style scoped>
  .highlighted-message {
    border: 2px solid yellow;
    background-color: rgba(255, 255, 0, 0.2);
    transition: background-color 0.3s, border 0.3s;
  }
</style>
