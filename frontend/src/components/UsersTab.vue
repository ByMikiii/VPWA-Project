<template>
  <transition name="fade">
    <section
      class="side"
      :class="{ 'full-width': !state.showChannels && !state.showChat }"
      id="users-side"
      v-show="state.showUsers"
    >
      <div class="side-header">
        <button id="hide-users-btn" class="start-btn" @click="toggleUsers">
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
            <path d="M20 12l-10 0" />
            <path d="M20 12l-4 4" />
            <path d="M20 12l-4 -4" />
            <path d="M4 4l0 16" />
          </svg>
        </button>
        <h5 class="">Users</h5>
      </div>

      <div class="users-list">
        <div v-for="role in roles" :key="role">
          <h6 v-if="usersByRole(role).length > 0" class="role">{{ role }} ({{ usersByRole(role).length }})</h6>

          <div
            v-for="user in usersByRole(role)"
            :key="user.id"
            class="row items-center q-pa-sm q-gutter-x-sm user-tab"
            :class="{ 'justify-center': !state.showChannels && !state.showChat }"
          >
            <ProfilePicture :status="getUserById(user.id)!.status" />
            <p id="username">{{ getUserById(user.id)!.nickname }}</p>
          </div>
        </div>
      </div>

    </section>
  </transition>
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

  const toggleUsers = () => {
    console.log(window.innerWidth)
    state.showUsers = !state.showUsers
    if(state.showUsers === true){
      if(window.innerWidth <= 1024 && window.innerWidth > 768){
        state.showChannels = false;
      }else if(window.innerWidth <= 768){
        state.showChannels = false;
        state.showChat = false;
      }
    }else{
      state.showChat = true;
    }
  }
</script>

<style scoped>
  /* .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  } */
</style>
