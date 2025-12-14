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
  import { Notify } from 'quasar';
  import { api } from 'boot/axios';
  const state = inject('ChatState') as typeof ChatState
  const showDialog = ref(false)
  const channelName = ref('')
  const isPrivate = ref(false)
  import { invalid_token } from '../state/ChatState';
  import { useRouter } from 'vue-router';

  const router = useRouter();

  interface CreateChannelData {
    name: string;
    private: boolean;
    user_id: string;
  }

  const createChannelBox = async () => {
    if (!channelName.value.trim()) {
      Notify.create('Channel name is required')
      return
    }

    const newChannel: CreateChannelData= {
      name: channelName.value.trim(),
      private: isPrivate.value,
      user_id: state.currentUser.id
    }

    let success = true;

    await api.post<Channel>('/channels', newChannel)
      .then(res =>  {
        state.channels.push(res.data)
        Notify.create("Channel has been created!");
      })
      .catch(err => {
        Notify.create(err.response.data.message);
        if (err.response.status == 401){
          invalid_token();
          success = false;
        }
      })
    
    
    if (!success){
      invalid_token();
      await router.push('/login');
    }

    nullData();
  }

  const cancelCreation = () => {
    nullData();
  }

  const nullData = () => {
    channelName.value = ''
    isPrivate.value = false
    showDialog.value = false
  }
</script>
