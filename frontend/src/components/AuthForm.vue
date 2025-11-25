<template>
  <h1 class="text-center q-mt-lg q-mb-lg"
    :class="{
      'text-h4': $q.screen.width < $q.screen.sizes.sm,
      'text-h3': $q.screen.width >= $q.screen.sizes.sm && $q.screen.width < $q.screen.sizes.md,
      'text-h2': $q.screen.width >= $q.screen.sizes.md && $q.screen.width < $q.screen.sizes.lg,
      'text-h1': $q.screen.width >= $q.screen.sizes.lg
    }">
  {{ heading }}
</h1>

  <q-form @submit.prevent="onSubmit" class="q-mx-auto q-pa-md"
  style="max-width: 400px;">
    <q-input v-if="['register', 'login', 'forgottenPassword', 'editProfile'].includes(mode)"
      v-model="email"
      label="Email"
      type="email"
      color="accent"
      label-color="accent"
      text-color="accent"
      rounded outlined
      field-border-color="accent"
      dark
      class = "q-mt-md"
      required
    />

    <q-input v-if="['register', 'editProfile'].includes(mode)"
      v-model="name"
      label="Name"
      type="text"
      color="accent"
      label-color="accent"
      text-color="accent"
      rounded outlined
      field-border-color="accent"
      dark
      class = "q-mt-md"
      required
    />

    <q-input v-if="['register', 'editProfile'].includes(mode)"
      v-model="surname"
      label="Surname"
      type="text"
      color="accent"
      label-color="accent"
      text-color="accent"
      rounded outlined
      field-border-color="accent"
      dark
      class = "q-mt-md"
      required
    />

    <q-input v-if="['register', 'editProfile'].includes(mode)"
      v-model="nickname"
      label="Nickame"
      type="text"
      color="accent"
      label-color="accent"
      text-color="accent"
      rounded outlined
      field-border-color="accent"
      dark
      class = "q-mt-md"
      required
    />

    <q-input v-if="['register', 'login', 'changePassword'].includes(mode)"
      v-model="password"
      label="Password"
      type="password"
      color="accent"
      label-color="accent"
      text-color="accent"
      rounded outlined
      field-border-color="accent"
      dark
      class = "q-mt-md"
      required
    />

    <q-input v-if="['forgottenPassword', 'changePassword'].includes(mode)"
      v-model="newPassword"
      label="New Password"
      type="password"
      color="accent"
      label-color="accent"
      text-color="accent"
      rounded outlined
      field-border-color="accent"
      dark
      class = "q-mt-md"
      required
    />

    <q-input v-if="['register', 'forgottenPassword', 'changePassword'].includes(mode)"
      v-model="repeatPassword"
      label="Repeat password"
      type="password"
      color="accent"
      label-color="accent"
      text-color="accent"
      rounded outlined
      field-border-color="accent"
      dark
      class = "q-mt-md"
      required
    />

    <q-toggle v-if="['editProfile'].includes(mode)"
      v-model="only_mentions"
      label="Only Mentions Notifications"
      color="secondary"
      class="row full-width justify-center"
    />

    <q-card-section class="q-mt-lg flex justify-center">
      <q-btn
        type="submit"
        label="Submit"
        rounded
        outlined
        color="accent"
        text-color="primary"
        size="md"
        class="q-px-lg"
      />
    </q-card-section>


    <p v-if = 'mode === "login"' class = "q-mt-md full-width text-center">
        Don't have an account?
        <router-link to="/register" class="custom-link">Register here</router-link>
        <br>
        Forgotten password?
        <router-link to="/forgottenPassword" class="custom-link">Renew password here</router-link>
    </p>
    <p v-else-if = 'mode === "register"' class = "q-mt-md full-width text-center">
        Already have an account?
        <router-link to="/login" class="custom-link">Login here</router-link>
    </p>
  </q-form>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { ChatState } from '../state/ChatState';


    const { mode, heading } = defineProps<{
      mode: 'login' | 'register' | 'forgottenPassword' | 'changePassword' | 'editProfile',
      heading: string
    }>();

    const email = ref('');
    const password = ref('');

    const name = ref('');
    const surname = ref('');
    const nickname = ref('');
    const repeatPassword = ref('');
    const newPassword = ref('');
    const only_mentions = ref(false)

    if (mode === 'editProfile') {
      email.value = ChatState.currentUser.email;
      name.value = ChatState.currentUser.name;
      surname.value = ChatState.currentUser.surname;
      nickname.value = ChatState.currentUser.nickname;
      only_mentions.value = ChatState.currentUser.only_mentions;
      console.log(only_mentions.value)
      console.log(ChatState.currentUser.only_mentions)
    }

    const emit = defineEmits(['submit']);

    function onSubmit() {
        emit('submit', {
            email: email.value,
            password: password.value,
            name: name.value,
            surname: surname.value,
            nickname: nickname.value,
            newPassword: newPassword.value,
            repeatPassword: repeatPassword.value,
            only_mentions: only_mentions.value
        });
    }

</script>

<style scoped lang="scss">

  .custom-link {
    color: $positive;
  }
  .custom-link:visited{
    color:$secondary;
  }

  #auth-form{
    max-width: 400px;
  }

</style>
