<template>
  <button id="notification-btn" class="has-notification" @click="toggleList">
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

  <ul v-if="showList" class="notification-list">
    <li
      v-for="(notif, index) in state.notifications"
      :key="index"
      class="notification-item relative-position"
    >
      <div class="notif-info">
        <div class="notif-header">
          <span class="notif-user">{{ notif.sender_name }}</span>
          <span> in </span>
          <span class="notif-user">#{{ notif.channel_name }}</span>
        </div>
        <p class="notif-message">{{ notif.content }}</p>
      </div>
      <button class="notif-remove absolute" @click.stop="removeNotification(notif.notification_id)">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </li>

    <p v-if="state.notifications.length === 0" class="no-notif">No notifications</p>
  </ul>
</template>

<script setup lang="ts">
  import { inject, ref } from 'vue';
  import type { ChatState } from 'src/state/ChatState';
  import { Notify } from 'quasar';
  import axios from 'axios';

  const api = axios.create({
    baseURL: 'http://localhost:3333'
  });

  const state = inject('ChatState') as typeof ChatState

  const showList = ref(false)
  const toggleList = () => {
    showList.value = !showList.value
  }

  const removeNotification = async (index: string) => {
    await api.post<string>('/readNotification', {
      notification_id: index
    })
        .then(res =>  {
          // Notify.create(res.data);
          console.log(res.data)
          // state.channels.push(res.data)
        })
        .catch(err => {
          Notify.create(err.response.data.message);
        })
    // state.notifications.splice(index, 1)
  }
</script>
