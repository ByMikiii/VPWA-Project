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
  import type { ChatState, UserStatus } from '../state/ChatState'
  import { Notify } from 'quasar'
  import axios from 'axios';

  const api = axios.create({
    baseURL: 'http://localhost:3333'
  });
  const state = inject('ChatState') as typeof ChatState

  const handleStatusChange = async (status: UserStatus) => {
    await api.post<string>('/status', {
      user_id: state.currentUser.id,
      status: status
    })
      .then(res =>  {
        Notify.create(res.data);
      })
      .catch(err => {
        Notify.create(err)
      })
    state.currentUser.status = status;
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
