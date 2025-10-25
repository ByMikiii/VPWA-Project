<template>
    <h1>Login</h1>
    <AuthForm mode="login" @submit="handleLogin" />
</template>

<script setup lang="ts">
import AuthForm from 'components/AuthForm.vue';

interface LoginFormData {
  email: string;
  password: string;
}

function handleLogin(formData: LoginFormData) {
  console.log('Login data:', formData); //here is a place to work with data and send them to backend
}
</script>
