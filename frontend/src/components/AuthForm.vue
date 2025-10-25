<template>
  <q-form @submit.prevent="onSubmit">
    <q-input v-if="['register', 'login', 'forgottenPassword', 'editProfile'].includes(mode)"
      v-model="email"
      label="Email"
      type="email"
      color="accent"
      label-color="accent"  
      text-color="accent"
      outlined
      field-border-color="accent"
      :placeholder="mode === 'editProfile' ? 'james.brown@gmail.com' : ''"
      required
    />

    <q-input v-if="['register', 'editProfile'].includes(mode)"
      v-model="name"
      label="Name"
      type="text"
      color="accent"
      label-color="accent"  
      text-color="accent"
      outlined
      field-border-color="accent"
      :placeholder="mode === 'editProfile' ? 'James' : ''"
      required
    />

    <q-input v-if="['register', 'editProfile'].includes(mode)"
      v-model="surname"
      label="Surname"
      type="text"
      color="accent"
      label-color="accent"  
      text-color="accent"
      outlined
      field-border-color="accent"
      :placeholder="mode === 'editProfile' ? 'Brown' : ''"
      required
    />

    <q-input v-if="['register', 'editProfile'].includes(mode)" 
      v-model="nickname"
      label="Nickame"
      type="text"
      color="accent"
      label-color="accent"  
      text-color="accent"
      outlined
      field-border-color="accent"
      :placeholder="mode === 'editProfile' ? 'JamesBrown2000' : ''"
      required
    />

    <q-input v-if="['register', 'login', 'changePassword'].includes(mode)"
      v-model="password"
      label="Password"
      type="password"
      color="accent"
      label-color="accent"  
      text-color="accent"
      outlined
      required
    />

    <q-input v-if="['forgottenPassword', 'changePassword'].includes(mode)" 
      v-model="newPassword"
      label="New Password"
      type="password"
      color="accent"
      label-color="accent"  
      text-color="accent"
      outlined
      field-border-color="accent"
      required
    />

    <q-input v-if="['register', 'forgottenPassword', 'changePassword'].includes(mode)" 
      v-model="repeatPassword"
      label="Repeat password"
      type="password"
      color="accent"
      label-color="accent"  
      text-color="accent"
      outlined
      field-border-color="accent"
      required
    />
    <q-btn type="submit" label="Submit" />

    <p v-if = 'mode === "login"'>
        Don't have an account? 
        <router-link to="/register">Register here</router-link>
        <br>
        Forgotten password?
        <router-link to="/forgottenPassword">Renew password here</router-link>
    </p> 
    <p v-else-if = 'mode === "register"'>
        Already have an account? 
        <router-link to="/login">Login here</router-link>
    </p>

  </q-form>
</template>

<script setup lang="ts">
    import { ref } from 'vue';

    const {mode} = defineProps<{ mode: 'login' | 'register' | 'forgottenPassword' | 'changePassword' | 'editProfile'}>();

    const email = ref('');
    const password = ref('');

    const name = ref('');
    const surname = ref('');
    const nickname = ref('');
    const repeatPassword = ref('');
    const newPassword = ref('');

    const emit = defineEmits(['submit']);

    function onSubmit() {
        emit('submit', {
            email: email.value,
            password: password.value,
            name: name.value,
            surname: surname.value,
            nickname: nickname.value,
            newPassword: newPassword.value,
            repeatPassword: repeatPassword.value
        });
    }

</script>

<style lang="scss">
       
</style>
