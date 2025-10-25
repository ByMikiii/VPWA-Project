<template>
  <main class="q-ma-xl row">

    <section class="side relative-position">


      <div class="side-header">
        <h5 class="">Channels</h5>
        <button class="end-btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6" />
            <path d="M9 17v1a3 3 0 0 0 6 0v-1" />
          </svg>
        </button>
      </div>


      <ServerList/>

      <q-btn
      color="primary"
      unelevated
      class="text-white q-pa-sm join-btn"
      no-wrap
    >
      <div class="row items-center justify-center no-wrap q-gutter-x-sm">
        <span>Join channel</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          style="flex-shrink: 0;"
        >
          <path d="M13 12v.01" />
          <path d="M3 21h18" />
          <path d="M5 21V5a2 2 0 0 1 2-2h6m4 10.5v7.5" />
          <path d="M21 7h-7m3-3-3 3 3 3" />
        </svg>
      </div>
    </q-btn>

      <q-btn
        color="primary"
        unelevated
        class="text-white q-pa-sm join-btn"
      >
        <div class="row items-center q-gutter-x-sm">
          <span>Create Channel</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M8 1v14" />
            <path d="M1 8h14" />
          </svg>
        </div>
      </q-btn>
      <ProfileTab/>
    </section>

    <ChatSection/>

    <section class="side">
      <div class="side-header">
        <button id="" class="start-btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M20 12l-10 0" />
            <path d="M20 12l-4 4" />
            <path d="M20 12l-4 -4" />
            <path d="M4 4l0 16" />
          </svg>
        </button>
        <h5 class="">Users</h5>
      </div>

      <UsersTab/>

    </section>


  </main>
</template>

<script setup lang="ts">
  import ProfileTab from 'components/ProfileTab.vue';
  import ServerList from 'components/ServerList.vue';
  import ChatSection from 'components/ChatSection.vue';
  import UsersTab from 'components/UsersTab.vue';

</script>

<style lang="sass">

</style>
