<template>
    <h1>Forgotten password</h1>
    <AuthForm mode="forgottenPassword" @submit="handleForgottenPassword" />
</template>

<script setup lang="ts">
import AuthForm from 'components/AuthForm.vue';

interface forgottenPasswordFormData {
  email: string;
  newPassword: string;
  repeatPassword: string;
}

function handleForgottenPassword(formData: forgottenPasswordFormData) {
  console.log('Forgotten password form data:', formData); //here is a place to work with data and send them to backend
}
</script>
