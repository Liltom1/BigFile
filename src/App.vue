<template>
  <BigFileUpload :options="options"></BigFileUpload>
</template>

<script setup>
import BigFileUpload from './packages/BigFileUpload/index.vue'
import { ref, reactive } from 'vue'
const options = ref({
  checkFileUrl: 'http://localhost:3000/verify',
  uploadFileUrl: 'http://localhost:3000/upload',
  mergeFileUrl: 'http://localhost:3000/merge',
  chunkSize: 1024 * 1024 * 5, // 5MB
})

</script>


<style scoped>

</style>
