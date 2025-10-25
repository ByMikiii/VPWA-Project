<template>

  <div v-for="role in roles" :key="role">
    <h6 v-if="usersByRole(role).length > 0" class="role">{{ role }} ({{ usersByRole(role).length }})</h6>

    <div
      v-for="user in usersByRole(role)"
      :key="user.id"
      class="row items-center q-pa-sm q-gutter-x-sm"
    >
      <ProfilePicture :status="getUserById(user.id)!.status" />
      <p id="username">{{ getUserById(user.id)!.nickname }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import ProfilePicture from 'components/ProfilePicture.vue';
  import { inject } from 'vue'
  import type {ChannelRole, ChatState, UserChannel} from '../state/ChatState'
  import { getUserById } from '../state/ChatState'


  const state = inject('ChatState') as typeof ChatState
  const roles: ChannelRole[] = ['Owner', 'Admin', 'Moderator', 'Guest']
  const usersByRole = (role: UserChannel['role']) =>
    state.currentChannel.users.filter(user => user.role === role)
</script>

<style>

</style>
