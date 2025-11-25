<template>
  <div class="q-pa-md flex flex-center">
    <q-card class="q-pa-lg bg-dark text-accent" style="max-width: 500px; width: 100%;">
      <div class="row items-center justify-between">
        <q-card-section  class="text-right" dark>
          <q-btn
          rounded outlined
          color="accent"
          text-color="primary"
          class="q-px-lg"
          @click=back>
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
            <path d="M9 14l-4 -4l4 -4" />
            <path d="M5 10h11a4 4 0 1 1 0 8h-1" />
          </svg>
          </q-btn>
        </q-card-section>


        <q-card-section  class="text-right" dark>
          <q-btn
          rounded outlined
          color="accent"
          text-color="primary"
          class="q-px-lg"
          @click=logout>
          Log out
          </q-btn>
        </q-card-section>
      </div>

      <div class="flex justify-center q-mb-md">
        <ProfilePicture
          :status="user.status"
          style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover;"
        />
      </div>

      <div class="flex justify-center"><StatusDropdown></StatusDropdown></div>



      <q-card-section>
        <q-list padding class="text-center">
          <q-item>
            <q-item-section class="text-h5"><strong>Name:</strong> {{ user.name }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section class="text-h5"><strong>Surname:</strong> {{ user.surname }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section class="text-h5"><strong>Nickname:</strong> {{ user.nickname }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section class="text-h5"><strong>Email:</strong> {{ user.email }}</q-item-section>
          </q-item>
        </q-list>
      </q-card-section>




      <q-card-section class="row justify-between">
        <q-btn
          rounded
          outlined
          color="accent"
          text-color="primary"
          label="Edit profile"
          @click="$router.push('/editProfile')"
        />
        <q-btn
          rounded
          outlined
          color="accent"
          text-color="primary"
          label="Change password"
          @click="$router.push('/changePassword')"
        />
      </q-card-section>
    </q-card>
  </div>
</template>



<script setup lang="ts">
    import { ChatState } from '../state/ChatState';
    import { useRouter } from 'vue-router';
    import { Notify } from 'quasar';

    import ProfilePicture from '../components/ProfilePicture.vue';
    import StatusDropdown from '../components/StatusDropdown.vue';

    import { api } from 'boot/axios';
    import { disconnectWebSocket } from '../state/ChatState';

    const user = ChatState.currentUser;

    const router = useRouter();


    interface LogoutResponse {
      message: string;
    }
    const logout = async () => {
      await api.post<LogoutResponse>('/logout')
        .then(res =>  {
          Notify.create(res.data.message);
          const user = ChatState.currentChannel.users.find(user => user.id == Number(ChatState.currentUser.id));
          if(user){
            user.status = 'Offline';
          }
          ChatState.currentUser = {
            id: '',
            nickname: '',
            email: '',
            name: '',
            surname: '',
            status: 'Offline',
            only_mentions: false
          };
          localStorage.removeItem('currentUser');
          localStorage.removeItem('token');
          disconnectWebSocket();
        })

      await router.push('/login');
    }

    const back = async () => {
      await router.push('/');
    }

</script>



<style scoped>

</style>
