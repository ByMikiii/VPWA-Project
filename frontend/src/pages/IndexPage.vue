<template>
  <main class="q-ma-xl row">

    <ChannelList/>

    <ChatSection/>

    <UsersTab/>

  </main>
</template>

<script setup lang="ts">
  import ChannelList from 'components/ChannelList.vue';
  import ChatSection from 'components/ChatSection.vue';
  import UsersTab from 'components/UsersTab.vue';

</script>

<style>
</style>
