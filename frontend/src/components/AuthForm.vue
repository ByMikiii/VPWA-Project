<template>
  <q-form @submit.prevent="onSubmit">
    <q-input v-if="['register', 'login'].includes(mode)"
      v-model="email"
      label="Email"
      type="email"
      color="accent"
      label-color="accent"  
      text-color="accent"
      outlined
      field-border-color="accent"
      required
    />

    <q-input v-if = 'mode === "register"'
      v-model="name"
      label="Name"
      type="text"
      color="accent"
      label-color="accent"  
      text-color="accent"
      outlined
      field-border-color="accent"
      required
    />

    <q-input v-if = 'mode === "register"' 
      v-model="surname"
      label="Surname"
      type="text"
      color="accent"
      label-color="accent"  
      text-color="accent"
      outlined
      field-border-color="accent"
      required
    />

    <q-input v-if = 'mode === "register"' 
      v-model="nickname"
      label="Nickame"
      type="text"
      color="accent"
      label-color="accent"  
      text-color="accent"
      outlined
      field-border-color="accent"
      required
    />

    <q-input v-if="['register', 'login'].includes(mode)"
      v-model="password"
      label="Password"
      type="password"
      color="accent"
      label-color="accent"  
      text-color="accent"
      outlined
      required
    />

    <q-input v-if = 'mode === "register"' 
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
    </p> 
    <p v-else-if = 'mode === "register"'>
        Already have an account? 
        <router-link to="/login">Login here</router-link>
    </p>

  </q-form>
</template>

<script setup lang="ts">
    import { ref } from 'vue';

    const {mode} = defineProps<{ mode: 'login' | 'register' }>();

    const email = ref('');
    const password = ref('');

    const name = ref('');
    const surname = ref('');
    const nickname = ref('');
    const repeatPassword = ref('');

    const emit = defineEmits(['submit']);

    function onSubmit() {
        emit('submit', {
            email: email.value,
            password: password.value,
            name: name.value,
            surname: surname.value,
            nickname: nickname.value,
            repeatPassword: repeatPassword.value
        });
    }

</script>

<style lang="scss">
       
</style>
