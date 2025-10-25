<template>
    <h1>Change password</h1>
    <AuthForm mode="changePassword" @submit="handleChangePassword" />
</template>

<script setup lang="ts">
import AuthForm from 'components/AuthForm.vue';

interface changePasswordFormData {
  password: string;
  newPassword: string;
  repeatPassword: string;
}

function handleChangePassword(formData: changePasswordFormData) {
  console.log('Change password form data:', formData); //here is a place to work with data and send them to backend
}
</script>
