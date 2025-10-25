<template>
  <q-btn-dropdown
          id="status-dropdown"
          flat
          dense
          no-caps
          color="grey-6"
          text-color="grey-6"
          :label="currentStatus"
          class="status-dropdown"
          no-ripple
        >
          <q-list class="compact-list">
            <q-item clickable v-close-popup @click="onItemClick('online')">
              <q-item-section>
                <q-item-label class="dropdown-item">Online</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="onItemClick('away')">
              <q-item-section>
                <q-item-label class="dropdown-item">Away</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="onItemClick('do-not-disturb')">
              <q-item-section>
                <q-item-label class="dropdown-item">Do Not Disturb</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="onItemClick('offline')">
              <q-item-section>
                <q-item-label class="dropdown-item">Offline</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
</template>

<script setup lang="ts">
  defineProps({
    currentStatus: {
      type: String,
      required: true
    }
  })

  function onItemClick (status: string) {
    console.log(status)
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
