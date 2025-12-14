<template>
  <q-btn-dropdown
          id="status-dropdown"
          flat
          dense
          no-caps
          color="grey-6"
          text-color="grey-6"
          :label="state.currentUser.status"
          class="status-dropdown"
          no-ripple
        >
          <q-list class="compact-list">
            <q-item clickable v-close-popup @click="handleStatusChange('Online')">
              <q-item-section>
                <q-item-label class="dropdown-item">Online</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="handleStatusChange('Away')">
              <q-item-section>
                <q-item-label class="dropdown-item">Away</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="handleStatusChange('Do Not Disturb')">
              <q-item-section>
                <q-item-label class="dropdown-item">Do Not Disturb</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="handleStatusChange('Offline')">
              <q-item-section>
                <q-item-label class="dropdown-item">Offline</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
</template>

<script setup lang="ts">
  import { inject } from 'vue'
  import { connectWebSocket, disconnectWebSocket, type ChatState, type UserStatus } from '../state/ChatState'
  import type { ChannelUsers, MessageData } from '../state/ChatState';
  import { Notify } from 'quasar'
  import { api } from 'boot/axios';
  import { invalid_token } from '../state/ChatState';
  import { useRouter } from 'vue-router';

  const router = useRouter();

  const state = inject('ChatState') as typeof ChatState

  const handleStatusChange = async (status: UserStatus) => {
    let success = true;
    await api.post<string>('/status', {
      user_id: state.currentUser.id,
      status: status
    })
      .then(res =>  {
        Notify.create(res.data);
      })
      .catch(err => {
        Notify.create(err)
        if (err.response.status == 401){
          invalid_token();
          success = false;
        }
      })
    
    if (!success){
      invalid_token();
      await router.push('/login');
    }

    if (status == "Offline"){
      disconnectWebSocket();
    }
    if (state.currentUser.status == "Offline" && status!="Offline"){
      connectWebSocket();
      await api.get<ChannelUsers[]>('/users', {
        params: { channel_id: state.currentChannel.id }
      })
        .then(res => {
          console.log('users: ', res.data)
          state.currentChannel.users = res.data
        })
        .catch(err => {
          Notify.create(err.response.data.error);
        })

      await api.get<MessageData[]>('/messages', {
        params: { channel_id: state.currentChannel.id }
      })
        .then(res => {
          console.log("test: ", res.data)
          state.messages = res.data

        })
        .catch(err => {
          Notify.create(err.response.data.message);
        })
    }
    state.currentUser.status = status;
    const user = state.currentChannel.users.find(user => user.id == Number(state.currentUser.id));
    if(user){
      user.status = status;
    }
    localStorage.setItem('currentUser', JSON.stringify(state.currentUser));

  }
</script>

<style lang="scss">
  #status-dropdown {
    align-self: flex-start;
    color: #BBBBBB;
    font-weight: 400;
    font-size: 12px;
    display: inline-block;
    max-width: 108px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: middle;
  }

  .status-dropdown {
    font-size: 12px;
    font-weight: 400;
    padding: 0;
    min-height: unset;
  }

  .compact-list .q-item {
    min-height: 28px !important;
    padding: 2px 8px !important;
    background-color: $secondary;
  }

  .dropdown-item {
    color: #111111;
  }
</style>
