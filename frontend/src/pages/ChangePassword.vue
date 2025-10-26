<template>
    <AuthForm mode="changePassword" heading="Change password" @submit="handleChangePassword" />
</template>

<script setup lang="ts">
  import AuthForm from 'components/AuthForm.vue';
  import { useRouter } from 'vue-router';

  interface changePasswordFormData {
    password: string;
    newPassword: string;
    repeatPassword: string;
  }

  const router = useRouter();

  async function handleChangePassword(formData: changePasswordFormData) {
    console.log('Change password form data:', formData); //here is a place to work with data and send them to backend
    if (formData.newPassword.length < 6){
        alert("The new password has to have more than 6 characters");
    }
    else{
      if (formData.newPassword != formData.repeatPassword){
        alert("Passwords have to be same");
      }
      else{
        if(formData.password == formData.newPassword){
          alert("New password and old password have to be different");
        }
        else{
          alert("Password changed successfuly");
          await router.push('/profile');
        }
      }    
    }
  }
</script>
