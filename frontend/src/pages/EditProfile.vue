<template>
    <AuthForm mode="editProfile" heading="Edit profile" @submit="handleEditProfile" />
</template>

<script setup lang="ts">
import AuthForm from 'components/AuthForm.vue';
import { useRouter } from 'vue-router';

interface EditProfileFormData {
  email: string;
  name: string;
  surname: string;
  nickname: string;
}

const router = useRouter();

async function handleEditProfile(formData: EditProfileFormData) {
  console.log('Edit profile form data:', formData); //here is a place to work with data and send them to backend
    if (!/^[A-Za-zÁ-Žá-ž\s'-]+$/.test(formData.name) || !/^[A-Za-zÁ-Žá-ž\s'-]+$/.test(formData.surname)) {
      alert("Name and surname can only contain letters, spaces, apostrophes, and hyphens.");
    }
    else{
      if(formData.nickname.length < 6){
        alert("The nickname has to have more than 6 characters");
      }
      else{
        alert("Profile edited successfuly");
        await router.push('/profile');
      }
    }
}
</script>
