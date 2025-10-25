<template>
  <router-view />
</template>

<script setup lang="ts">
import { provide } from 'vue'
import { ChatState} from './state/ChatState'

provide('ChatState', ChatState)
</script>
