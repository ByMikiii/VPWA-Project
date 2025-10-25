<template>
    <h1>Edit profile</h1>
    <AuthForm mode="editProfile" @submit="handleEditProfile" />
</template>

<script setup lang="ts">
import AuthForm from 'components/AuthForm.vue';

interface EditProfileFormData {
  email: string;
  name: string;
  surname: string;
  nickname: string;
}

function handleEditProfile(formData: EditProfileFormData) {
  console.log('Edit profile form data:', formData); //here is a place to work with data and send them to backend
}
</script>
