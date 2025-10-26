<template>
    <AuthForm mode="forgottenPassword" heading="Renew password" @submit="handleForgottenPassword" />
</template>

<script setup lang="ts">
  import AuthForm from 'components/AuthForm.vue';
  import { useRouter } from 'vue-router';

  interface forgottenPasswordFormData {
    email: string;
    newPassword: string;
    repeatPassword: string;
  }

  const router = useRouter();

  async function handleForgottenPassword(formData: forgottenPasswordFormData) {
    console.log('Forgotten password form data:', formData); //here is a place to work with data and send them to backend
    if (formData.newPassword.length < 6){
        alert("The password has to have more than 6 characters");
    }
    else{
      if (formData.newPassword != formData.repeatPassword){
        alert("Passwords have to be same");
      }
      else{
        alert("Password renewed successfuly");
        await router.push('/login');
      }    
    }
  }
</script>
