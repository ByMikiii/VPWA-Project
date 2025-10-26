<template>
    <q-btn
      color="primary"
      unelevated
      class="text-white q-pa-sm join-btn"
      id="create-btn"
      @click="showDialog = true"
    >
      <div class="row items-center justify-center q-gutter-x-sm">
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

    <q-dialog v-model="showDialog" persistent>
      <q-card class="channel-dialog">
        <q-card-section>
          <div class="text-h6">Create Channel</div>
        </q-card-section>

        <q-card-section>
          <q-input
            filled
            v-model="channelName"
            label="Channel Name"
            placeholder="Enter channel name"
            maxlength="24"
          />
          <q-toggle
            v-model="isPrivate"
            label="Private: "
            left-label
            color="primary"
            class="q-mt-md"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="negative" @click="cancelCreation" />
          <q-btn label="Create" color="primary" @click="createChannelBox" />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script setup lang="ts">
  import type { Channel, ChatState } from 'src/state/ChatState'
  import { ref, inject } from 'vue'
  const state = inject('ChatState') as typeof ChatState
  const showDialog = ref(false)
  const channelName = ref('')
  const isPrivate = ref(false)

  const createChannelBox = () => {
    if (!channelName.value.trim()) {
      console.warn('Channel name is required')
      return
    }

    const newChannel: Channel= {
      id: '6',
      name: channelName.value.trim(),
      private: isPrivate.value,
      users: [{id: state.currentUser.id , role: 'Owner'}]
    }
    state.channels.push(newChannel);

    channelName.value = ''
    isPrivate.value = false
    showDialog.value = false
  }

  const cancelCreation = () => {
    channelName.value = ''
    isPrivate.value = false
    showDialog.value = false
  }
</script>
