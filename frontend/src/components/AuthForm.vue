<template>
  <q-form @submit.prevent="onSubmit">
    <q-input
      class="accent-input"
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
    <q-input
      v-model="password"
      label="Password"
      type="password"
      color="accent"
      label-color="accent"  
      text-color="accent"
      outlined
      required
    />
    <q-btn type="submit" label="Login" />
  </q-form>
</template>

<script setup lang="ts">
    import { ref } from 'vue';

    const email = ref('');
    const password = ref('');

    const emit = defineEmits(['submit']);

    function onSubmit() {
        emit('submit', { email: email.value, password: password.value });
    }
</script>

<style lang="scss">
       
</style>
