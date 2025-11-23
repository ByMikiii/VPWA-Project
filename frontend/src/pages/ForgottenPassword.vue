<template>
    <AuthForm mode="forgottenPassword" heading="Renew password" @submit="handleForgottenPassword" />
</template>

<script setup lang="ts">
  import AuthForm from 'components/AuthForm.vue';
  import { useRouter } from 'vue-router';
  import { Notify } from 'quasar';
  import axios from 'axios';

  const api = axios.create({
    baseURL: 'http://localhost:3333'
  });

  interface forgottenPasswordFormData {
    email: string;
    newPassword: string;
    repeatPassword: string;
  }

  const router = useRouter();

  async function handleForgottenPassword(formData: forgottenPasswordFormData) {
    console.log('Forgotten password form data:', formData); 
    if (formData.newPassword.length < 6){
        Notify.create("The password has to have more than 6 characters");
    }
    else{
      if (formData.newPassword != formData.repeatPassword){
        Notify.create("Passwords have to be same");
      }
      else{
        interface ChangePasswordResponse {
          message: string;
        }

        const success = await api.post<ChangePasswordResponse>('/forgotten_password', formData)
          .then(res =>  {
            Notify.create(res.data.message);
            return true;
          })
          .catch(err => {
            if (err.response.status === 422) {
              Notify.create(err.response.data.errors);
            }
            else if (err.response.status === 404) {
              Notify.create(err.response.data.message);
            }
            return false;
          })

          if (success){
            await router.push('/login');
          }
      }    
    }
  }
</script>
