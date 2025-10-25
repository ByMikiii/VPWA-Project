<template>
  <div id="profile-tab" class="row">
    <ProfilePicture status="online" id="owner-picture"/>
      <div class="tab-text">
        <p id="username">Username</p>
        <StatusDropdown current-status="Online"/>
      </div>

      <button class="settings-button" @click="handleSettings">
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
          <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
          <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
        </svg>
      </button>
  </div>
</template>

<script setup lang="ts">
  import ProfilePicture from './ProfilePicture.vue';
  import StatusDropdown from './StatusDropdown.vue';

  function handleSettings() {
    alert("settings clicked")
  }
</script>


<style lang="scss">
  #status-dropdown {
    align-self: flex-start;
    color: #BBBBBB;
    font-weight: 400;
    font-size: 12px;
    display: inline-block;
    max-width: 108px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: middle;
  }

  .status-dropdown {
    font-size: 12px;
    font-weight: 400;
    padding: 0;
    min-height: unset;
  }

  .compact-list .q-item {
    min-height: 28px !important;
    padding: 2px 8px !important;
    background-color: $secondary;
  }

  .dropdown-item {
    color: #111111;
  }
</style>
