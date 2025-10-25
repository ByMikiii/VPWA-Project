<template>
  <main class="q-ma-xl row">

    <section class="side">
      <h5 class="text-center side-header">Channels</h5>
      <div id="channels-list">
        <button class="channel-button text-left">Room #1</button>
        <button class="channel-button text-left">Room #2</button>
        <button class="channel-button text-left">Room #3</button>
        <button class="channel-button text-left">Room #4</button>

      </div>
      <div>
        <button id="create-channel" class="q-btn q-btn-primary">Create Channel</button>
      </div>
      <div>
        <button id="join-channel" class="q-btn q-btn-primary">Join Channel</button>
      </div>

      <ProfileTab/>

    </section>

    <section class="col-grow" id="chat">
      <h4 class="text-center" id="chat-title">Welcome to Chatty!</h4>


      <div id="messages">

        <ChatMessage name="Me" timestamp="7 minute AGO" message="cau ne" :sent="true"></ChatMessage>

        <ChatMessage name="User" timestamp="2 minute AGO" message="povedz ty" :sent="false"></ChatMessage>

        <ChatMessage name="Me" :sent="true" :typing="true"></ChatMessage>

        <ChatMessage name="User" :sent="false" :typing="true"></ChatMessage>
      </div>


      <div id="chat-area">
        <textarea name="chat-text" id="chat-text"></textarea>
        <button class="send-button">
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
            <path d="M10 14l11 -11" />
            <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" />
          </svg>
        </button>
      </div>
    </section>

    <section class="side">
      <h5 class="text-center side-header">Users</h5>
      <h6 class="role">Owner</h6>

      <div id="user-tab">
        <ProfilePicture status="online"/>
        <p id="username">Username</p>
      </div>
      <h6 class="role">Admin</h6>
      <div id="user-tab">
        <ProfilePicture status="away"/>
        <p id="username">Username</p>
      </div>
      <div id="user-tab">
        <ProfilePicture status="offline"/>
        <p id="username">Username</p>
      </div>


    </section>


  </main>
</template>

<script setup lang="ts">
  import ChatMessage from 'components/ChatMessage.vue'
  import ProfilePicture from 'components/ProfilePicture.vue';
  import ProfileTab from 'components/ProfileTab.vue';

</script>

<style lang="sass">

</style>
