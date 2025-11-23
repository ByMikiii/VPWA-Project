<template>
    <AuthForm mode="login" heading="Login" @submit="handleLogin" />
</template>

<script setup lang="ts">
  import AuthForm from 'components/AuthForm.vue';
  import { useRouter } from 'vue-router';
  import { ChatState } from '../state/ChatState';
  import { Notify } from 'quasar';

  import axios from 'axios';

  const api = axios.create({
    baseURL: 'http://localhost:3333'
  });

  interface LoginFormData {
    email: string;
    password: string;
  }

  const router = useRouter();

  interface LoginResponse {
    message: string;
    user: {
      id: string;
      name: string;
      surname: string;
      nickname: string;
    };
  }
  async function handleLogin(formData: LoginFormData) {
    if (formData.password.length < 6){
      Notify.create("The password has to have more than 6 characters");
    }
    else{
      const success = await api.post<LoginResponse>('/login', formData)
        .then(res =>  {
          Notify.create(res.data.message);
          ChatState.currentUser.email = formData.email;
          ChatState.currentUser.id = res.data.user.id;
          ChatState.currentUser.name = res.data.user.name;
          ChatState.currentUser.surname = res.data.user.surname;
          ChatState.currentUser.nickname = res.data.user.nickname;
          ChatState.currentUser.status = 'Online';
          localStorage.setItem('currentUser', JSON.stringify(ChatState.currentUser));
          return true;
        })
        .catch(err => {
          if (err.response.status === 422) {
            Notify.create(err.response.data.errors);
          }
          else if (err.response.status === 401) { //unathorized
            Notify.create(err.response.data.message);
          }
          return false;
        })

      if (success){
        await router.push('/');
      }
    }
  }
</script>
