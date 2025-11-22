<template>
    <AuthForm mode="changePassword" heading="Change password" @submit="handleChangePassword" />
</template>

<script setup lang="ts">
  import AuthForm from 'components/AuthForm.vue';
  import { useRouter } from 'vue-router';
  import { Notify } from 'quasar';
  import axios from 'axios';
  import { ChatState } from '../state/ChatState';

  const api = axios.create({
    baseURL: 'http://localhost:3333'
  });

  interface changePasswordFormData {
    password: string;
    newPassword: string;
    repeatPassword: string;
    id: string;
  }

  const router = useRouter();

  async function handleChangePassword(formData: changePasswordFormData) {
    console.log('Change password form data:', formData); //here is a place to work with data and send them to backend
    if (formData.newPassword.length < 6){
        Notify.create("The new password has to have more than 6 characters");
    }
    else{
      if (formData.newPassword != formData.repeatPassword){
        Notify.create("Passwords have to be same");
      }
      else{
        if(formData.password == formData.newPassword){
          Notify.create("New password and old password have to be different");
        }
        else{
          interface ChangePasswordResponse {
            message: string;
          }

          formData.id = ChatState.currentUser.id;
          const success = await api.post<ChangePasswordResponse>('/change_password', formData)
            .then(res =>  {
              Notify.create(res.data.message);
              return true;
            })
            .catch(err => {
              if (err.response.status === 422) {
                Notify.create(err.response.data.errors);
              }
              else if (err.response.status === 401) {
                Notify.create(err.response.data.message);
              }
              return false;
            })

            if (success){
              await router.push('/profile');
            }
        }
      }    
    }
  }
</script>
