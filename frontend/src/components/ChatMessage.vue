<template>
    <q-chat-message
      :sent="sent"
      text-color="white"
      :bg-color="sent ? 'green-6' : 'primary'"
    >
      <template v-slot:name>{{ name }}</template>
      <template v-slot:stamp>{{timestamp}}</template>
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
      <span v-else>{{ message }}</span>

    </q-chat-message>
</template>

<script setup lang="ts">

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
    }
  })
</script>

<style>

</style>
