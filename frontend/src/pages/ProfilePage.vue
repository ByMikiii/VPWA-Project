<template>
  <div class="q-pa-md flex flex-center">
    <q-card class="q-pa-lg bg-dark text-white" style="min-width: 400px;">
        <ProfilePicture :status="user.status"></ProfilePicture>
      <q-card-section>
        <div class="text-h6 text-accent">My Profile</div>
      </q-card-section>

      <q-card-section text-accent>
        <div><strong>Name:</strong> {{ user.name }}</div>
        <div><strong>Surname:</strong> {{ user.surname }}</div>
        <div><strong>Nickname:</strong> {{ user.nickname }}</div>
        <div><strong>Email:</strong> {{ user.email }}</div>
      </q-card-section>
      <q-btn>Edit profile</q-btn>
      <q-btn>Change password</q-btn>
      <q-btn>Log out</q-btn>
    </q-card>
  </div>
</template>



<script setup lang="ts">
    import { ChatState } from '../state/ChatState';
    import ProfilePicture from '../components/ProfilePicture.vue';

    const user = ChatState.currentUser;
</script>



<style scoped>
    /* .q-card {
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
} */

</style>
