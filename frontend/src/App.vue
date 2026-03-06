<script setup>
import { ref, onMounted } from 'vue'
const message = ref('loading...')
onMounted(async () => {
  const res = await fetch('http://localhost:3000/api/hello')
  const data = await res.json()
  message.value = data.message
})
</script>

<template>
  <main>
    <h1>Vue Frontend (Docker)</h1>
    <p>{{ message }}</p>
  </main>
</template>
