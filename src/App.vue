<script setup lang="ts">
import { ref, onMounted } from 'vue'
import liff from '@line/liff'
import DefaultLayout from './components/DefaultLayout.vue'

const name = ref('')

onMounted(async () => {
  if (liff.isLoggedIn()) {
    const profile = await liff.getProfile()
    name.value = profile.displayName
  } else {
    liff.login()
  }
})

const sendMessage = async () => {
  await liff.sendMessages([
    { type: 'text', text: 'Hello from Vue 3 LIFF!' }
  ])
  liff.closeWindow()
}
</script>

<template>
  <div>
    <DefaultLayout/>
    <button @click="sendMessage">Send Message</button>
    <div class="page-container">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.page-container {
  margin-top: 60px;
  padding: 0 16px;
  height: 100%;
  overflow-y: auto;
}

</style>
