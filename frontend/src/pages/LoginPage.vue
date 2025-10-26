<template>
    <AuthForm mode="login" heading="Login" @submit="handleLogin" />
</template>

<script setup lang="ts">
  import AuthForm from 'components/AuthForm.vue';
  import { useRouter } from 'vue-router';
  import { ChatState } from '../state/ChatState';
  import { Notify } from 'quasar';

  interface LoginFormData {
    email: string;
    password: string;
  }

  const router = useRouter();

  async function handleLogin(formData: LoginFormData) {
    console.log('Login data:', formData); //here is a place to work with data and send them to backend
    if (formData.password.length < 6){
      Notify.create("The password has to have more than 6 characters");
    }
    else{
      Notify.create("Logged in successfuly");
      ChatState.currentUser.email=formData.email;
      await router.push('/');
    }
  }
</script>
