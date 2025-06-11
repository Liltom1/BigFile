<template>
  <BigFileUpload :options="options" :file-list="fileList" :on-change="handleChange" ></BigFileUpload>
</template>

<script setup>
import BigFileUpload from './packages/BigFileUpload/index.vue'
import { ref, reactive } from 'vue'

const fileList = ref([])

const options = ref({
  checkFileUrl: 'http://localhost:3000/verify',
  uploadFileUrl: 'http://localhost:3000/upload',
  mergeFileUrl: 'http://localhost:3000/merge',
  chunkSize: 1024 * 1024 * 5, // 5MB
  CONCURRENT_LIMIT: 5, // 并发上传限制
})


const handleChange = (file,files,type) => {
  fileList.value = files
  console.log('File selected:', file);
  console.log('Files array:', files);
}

</script>


<style scoped>

</style>
