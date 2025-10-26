<template>
    <AuthForm mode="register" heading="Registration" @submit="handleRegistration" />
</template>

<script setup lang="ts">
  import AuthForm from 'components/AuthForm.vue';
  import { useRouter } from 'vue-router';
  import { ChatState } from '../state/ChatState';
  import { Notify } from 'quasar';

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
    console.log('Register data:', formData); //here is a place to work with data and send them to backend
    if (formData.password.length < 6){
        Notify.create("The password has to have more than 6 characters");
    }
    else{
      if (formData.password != formData.repeatPassword){
        Notify.create("Passwords have to be same");
      }
      else{
        if (!/^[A-Za-zÁ-Žá-ž\s'-]+$/.test(formData.name) || !/^[A-Za-zÁ-Žá-ž\s'-]+$/.test(formData.surname)) {
          Notify.create("Name and surname can only contain letters, spaces, apostrophes, and hyphens.");
        }
        else{
          if(formData.nickname.length < 6){
            Notify.create("The nickname has to have more than 6 characters");
          }
          else{
            Notify.create("Registered successfuly");
            ChatState.currentUser.email=formData.email;
            ChatState.currentUser.name=formData.name;
            ChatState.currentUser.surname=formData.surname;
            ChatState.currentUser.nickname=formData.nickname;
            await router.push('/');
          }
        }
      }
    }
  }
</script>
