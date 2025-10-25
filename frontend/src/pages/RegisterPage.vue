<template>
    <h1>Registration</h1>
    <AuthForm mode="register" @submit="handleRegistration" />
</template>

<script setup lang="ts">
import AuthForm from 'components/AuthForm.vue';

interface RegisterFormData {
  email: string;
  name: string;
  surname: string;
  nickname: string;
  password: string;
  repeatPassword: string;
}

function handleRegistration(formData: RegisterFormData) {
  console.log('Register data:', formData); //here is a place to work with data and send them to backend
}
</script>
