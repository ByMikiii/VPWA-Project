<template>
    <AuthForm mode="editProfile" heading="Edit profile" @submit="handleEditProfile" />
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

  interface EditProfileFormData {
    email: string;
    name: string;
    surname: string;
    nickname: string;
    id: string;
    only_mentions: boolean;
  }

  const router = useRouter();

  async function handleEditProfile(formData: EditProfileFormData) {
    console.log(formData)
    console.log('Edit profile form data:', formData);
      if (!/^[A-Za-zÁ-Žá-ž\s'-]+$/.test(formData.name) || !/^[A-Za-zÁ-Žá-ž\s'-]+$/.test(formData.surname)) {
        Notify.create("Name and surname can only contain letters, spaces, apostrophes, and hyphens.");
      }
      else{
        if(formData.nickname.length < 6){
          Notify.create("The nickname has to have more than 6 characters");
        }
        else{
          formData.id = ChatState.currentUser.id;
          interface EditProfileResponse {
            message: string;
          }
          const success = await api.post<EditProfileResponse>('/edit_profile', formData)
            .then(res =>  {
              Notify.create(res.data.message);
              ChatState.currentUser.email = formData.email;
              ChatState.currentUser.name = formData.name;
              ChatState.currentUser.surname = formData.surname;
              ChatState.currentUser.nickname = formData.nickname;
              ChatState.currentUser.only_mentions = formData.only_mentions;
              return true;
            })
            .catch(err => {
              if (err.response.status === 422) {
                Notify.create(err.response.data.errors);
              }
              else if (err.response.status === 409) {
                Notify.create(err.response.data.message);
              }
              else if (err.response.status === 404) {
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
</script>
