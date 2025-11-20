<template>
    <AuthForm mode="register" heading="Registration" @submit="handleRegistration" />
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


  interface RegisterFormData {
    email: string;
    name: string;
    surname: string;
    nickname: string;
    password: string;
    repeatPassword: string;
  }

  const router = useRouter();

  async function handleRegistration(formData: RegisterFormData) {
    if (formData.password.length < 6){
        Notify.create("The password has to have more than 6 characters");
        return;
    }
    if (formData.password != formData.repeatPassword){
      Notify.create("Passwords have to be same");
      return;
    }
    if (!/^[A-Za-zÁ-Žá-ž\s'-]+$/.test(formData.name) || !/^[A-Za-zÁ-Žá-ž\s'-]+$/.test(formData.surname)) {
      Notify.create("Name and surname can only contain letters, spaces, apostrophes, and hyphens.");
      return
    }
    if(formData.nickname.length < 6){
      Notify.create("The nickname has to have more than 6 characters");
      return
    }

    const success = await api.post('/register', formData)
      .then(res =>  { 
        Notify.create(res.data.message);
        ChatState.currentUser.email = formData.email;
        ChatState.currentUser.id = res.data.user.id;
        ChatState.currentUser.name = formData.name;
        ChatState.currentUser.surname = formData.surname;
        ChatState.currentUser.nickname = formData.nickname;
        ChatState.currentUser.status = 'Online';
        return true;
       }) 
      .catch(err => {
        if (err.response.status === 422) {
          Notify.create(err.response.data.errors);
        }
        else if (err.response.status === 409) {
          Notify.create(err.response.data.message);
        }
        return false;
      })

      if (success){
        await router.push('/');
      }
  }
</script>
