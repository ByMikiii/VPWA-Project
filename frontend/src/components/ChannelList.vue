<template>
  <transition name="fade">
  <section
    class="side"
    :class="{ 'full-width': !state.showUsers && !state.showChat }"
    v-show="state.showChannels"
  >
    <div class="side-header">
      <h5 class="">Channels</h5>
        <button class="end-btn" @click="toggleChannels">
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
          <path d="M4 12l10 0" />
          <path d="M4 12l4 4" />
          <path d="M4 12l4 -4" />
          <path d="M20 4l0 16" />
        </svg>
      </button>

    </div>


    <div id="channels-list">
      <ul class="channel-invitations">
        <li v-for="(inv, index) in state.newInvitations"
        :key="index"
        class="notification-item relative-position">
          <div class="notif-info">

            <div class="notif-header">
              <span class="notif-user">{{ inv.invited_by_username }}</span>
              <span> invited you to join channel </span>
              <span class="notif-user">#{{ inv.channel_name }}</span>
            </div>
            <div class="inv-actions">
              <button class="notif-accept" @click="acceptInvitation(true, inv.invited_by, inv.channel_id)">
                Accept
              </button>

              <button class="notif-decline" @click="acceptInvitation(false, inv.invited_by, inv.channel_id)">
                Decline
              </button>
            </div>
          </div>
        </li>
      </ul>
      <div v-for="channel in state.channels" :key="channel.id" class="channel-button text-left row items-center justify-between" :class="{ 'bg-primary': state.currentChannel.id === channel.id }" type="button">
        <button class="channel-but row items-center" @click="handleChannelChange(channel)">
          <svg
            v-if="!channel.isPrivate"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="private-icon"
          >
            <path d="M10 13a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
            <path d="M8 21v-1a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v1" />
            <path d="M15 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
            <path d="M17 10h2a2 2 0 0 1 2 2v1" />
            <path d="M5 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
            <path d="M3 13v-1a2 2 0 0 1 2 -2h2" />
          </svg>

          <svg
            v-if="channel.isPrivate"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="private-icon"
          >
            <path d="M5 11m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />
            <path d="M12 16m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
            <path d="M8 11v-5a4 4 0 0 1 8 0" />
          </svg>
          <span>{{ channel.name }}</span>
        </button>
        <button @click="leaveChannel(channel.id)" class="row items-center">
          <svg
            v-if="channel.ownerId === Number(state.currentUser.id)"
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M4 7l16 0" />
            <path d="M10 11l0 6" />
            <path d="M14 11l0 6" />
            <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
            <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M13 12v.01" />
            <path d="M3 21h18" />
            <path d="M5 21v-16a2 2 0 0 1 2 -2h7.5m2.5 10.5v7.5" />
            <path d="M14 7h7m-3 -3l3 3l-3 3" />
          </svg>
        </button>
      </div>
    </div>

    <Channel-buttons/>

    <ProfileTab/>
  </section>
  </transition>
</template>

<script setup lang="ts">
  import ProfileTab from './ProfileTab.vue';
  import ChannelButtons from './ChannelButtons.vue';
  import { inject } from 'vue'
  import type { Channel, ChatState} from '../state/ChatState';
  import type { ChannelUsers, MessageData } from '../state/ChatState';
  import { Notify } from 'quasar';
  import { api } from 'boot/axios';
  import { getChannelData } from '../state/ChatState';
  import { invalid_token } from '../state/ChatState';
  import { useRouter } from 'vue-router';

  const router = useRouter();

  const state = inject('ChatState') as typeof ChatState

  const handleChannelChange = async (channel: Channel) => {
    state.currentChannel = {
      ...channel,
      users: []
    }
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

const toggleChannels = () => {
    console.log(window.innerWidth)
    state.showChannels = !state.showChannels
    if(state.showChannels === true){
      if(window.innerWidth <= 1024 && window.innerWidth > 768){
        state.showUsers = false;
      }else if(window.innerWidth <= 768){
        state.showUsers = false;
        state.showChat = false;
      }
    }else{
      state.showChat = true;
    }
  }

  const acceptInvitation = async (isAccepted: boolean, invitedBy: string, channelId: string) => {
    let success = true;
    await api.post<Channel>('/accept', {
      receiver_id: state.currentUser.id,
      invited_by: invitedBy,
      channel_id: channelId,
      is_accepted: isAccepted
    })
        .then(res =>  {
          Notify.create("accepted");
          console.log(res)
          // state.channels.push(res.data)
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
  }

  const leaveChannel = async (channel_id: string) => {
    console.log("leaving...")

    const success = await api.post<string>('/members', {
        user_id: state.currentUser.id,
        channel_id: channel_id,
      })
          .then(res =>  {
            Notify.create(res.data);
            state.channels = state.channels.filter(ch => ch.id !== channel_id);
            if (state.channels[0] && channel_id == state.currentChannel.id){
              state.currentChannel = state.channels[0];
            }
            console.log(res.data)
            return true;
          })
          .catch(err => {
            Notify.create(err.response.data.message);
            return false;
          })
    if (success && state.channels[0] && channel_id == state.currentChannel.id){
      await getChannelData();
    }
    if (!success){
      invalid_token();
      await router.push('/login');
    }
  }
</script>

<style scoped>
  .channel-but {
    width: 84%;
    padding: 0.5rem 0;
    padding-left: 1rem;
  }
  .channel-but span{
    max-width: 82%;
    overflow: hidden;
  }
  button svg {
    opacity: 50%;
  }
  button svg:hover {
    opacity: 70%;
  }
  .channel-invitations{
    max-height: 218px;
    overflow-y: auto;
  }
  /* .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  } */
</style>
