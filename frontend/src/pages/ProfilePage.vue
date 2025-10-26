<template>
  <div class="q-pa-md flex flex-center">
    <q-card class="q-pa-lg bg-dark text-accent" style="max-width: 500px; width: 100%;">
      
      <q-card-section  class="text-right" dark>
        <q-btn 
        rounded outlined
        color="accent"
        text-color="primary" 
        class="q-px-lg">Log out</q-btn>
      </q-card-section>

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
        />
        <q-btn 
          rounded 
          outlined 
          color="accent" 
          text-color="primary" 
          label="Change password" 
        />
      </q-card-section>
    </q-card>
  </div>
</template>



<script setup lang="ts">
    import { ChatState } from '../state/ChatState';
    import ProfilePicture from '../components/ProfilePicture.vue';
    import StatusDropdown from '../components/StatusDropdown.vue';


    const user = ChatState.currentUser;
</script>



<style scoped>

</style>
