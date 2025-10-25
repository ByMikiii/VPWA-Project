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
      <div id="profile-tag">
        <img src="profile-picture.webp" alt="profile-picture" id="profile-picture">
        <div class="">
          <div class="">
            <p id="username">Username</p>
            <p id="status">Online</p>
          </div>
          <!-- <img src="" alt="Image settings icon" id="settings-icon"> -->
        </div>
      </div>
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
        <img src="" alt="">
      </div>
    </section>

    <section class="side">
      <h5 class="text-center side-header">Users</h5>
      <h6 class="role">Owner</h6>

      <div id="user-tag">
        <img src="profile-picture.webp" alt="profile-picture" id="profile-picture">
            <p id="username">Username</p>
      </div>
      <h6 class="role">Admin</h6>
      <div id="user-tag">
        <img src="profile-picture.webp" alt="profile-picture" id="profile-picture">
            <p id="username">Username</p>
      </div>
      <div id="user-tag">
        <img src="profile-picture.webp" alt="profile-picture" id="profile-picture">
            <p id="username">Username</p>
      </div>


    </section>


  </main>
</template>

<script setup lang="ts">
  import ChatMessage from 'components/ChatMessage.vue'
</script>

<style lang="sass">

</style>
