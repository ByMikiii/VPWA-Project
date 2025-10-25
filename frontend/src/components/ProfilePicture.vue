<template>
    <img src="profile-picture.webp" alt="profile-picture" class="profile-picture" :class="status">
</template>

<script setup lang="ts">

  defineProps({
    status: {
      type: String,
      required: true
    }
  })
</script>

<style lang="scss">
  .online {
    border: 3px solid green;
  }
  .away {
    border: 3px solid orange;
  }
  .donotdisturb {
    border: 3px solid orange;
  }
  .offline {
    border: 3px solid gray;
  }

</style>
