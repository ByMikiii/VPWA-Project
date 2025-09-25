<template>
  <q-page padding>
    <q-btn label="Backend Request" @click="fetchUsers" />
    <div v-if="users.length">
      <div v-for="user in users" :key="user.id">
        {{ user.name }} ({{ user.email }})
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface User {
  id: number
  name: string
  email: string
}

const users = ref<User[]>([])

async function fetchUsers() {
  try {
    const res = await fetch('http://localhost:3333/')
    users.value = await res.json()
    console.log(users.value)
  } catch (err) {
    console.error('Fetch error:', err)
  }
}
</script>
