<template>
  <div>
    <upload-content :on-change="handleChange"></upload-content>
    <UploadList :uploadFiles="uploadFiles" :percentage="percentage" />
  </div>
</template>
<script lang='js' setup name="BigFileUpload">
import { ref, reactive, shallowRef } from 'vue'
import UploadList from './upload-list.vue'
import uploadContent from './upload-content.vue'
defineOptions({
  name: 'BigFileUpload'
})

const worker = new Worker('../worker.js')
const chunks = [];
const props = defineProps({
  options: {
    type: Object,
    default: () => {
      return {
        checkFileUrl: '',
        uploadFileUrl: '',
        mergeFileUrl: '',
        chunkSize: 1024 * 1024 * 5, // 5MB
      }
    },
  },
})

const uploadFiles = ref([]);

const handleChange = (e) => {
  // inputRef.value.click()
  const files = e.target.files;
  // console.log(e, 'e');
  const fs = files[0]; //读取文件内容
  // console.log(fs.name);
  fs.state = 'pending'; //设置文件状态为待上传

  uploadFiles.value = [...uploadFiles.value, fs];
  const total = Math.ceil(fs.size / props.options.chunkSize); //切割的总数 也就是我们要掉23次接口
  console.log(total, 'total');

  //0-5 5-10 10-15 15-20 20-25 将文件分装成5M的块 并放入chunks数组中 props.options.chunkSize是按大小多少进行切分
  chunks.push(...Array.from({ length: total }, (_, i) => fs.slice(i * props.options.chunkSize, (i + 1) * props.options.chunkSize)));

  console.log(chunks, 'chunks');
  //将切片数组传到web worker，多线程脚本运行上传到后端
  //向worker.js发送消息  worker.js会接收这个消息
  worker.postMessage({
    chunks,
    filename: fs.name,
  });

  console.log(worker, 'worker');
}

const percentage = ref(0);

worker.onmessage = async function (e) {
  // console.log(e, 'e');
  inputRef.value.value = ''
  const { filename, hash } = e.data;
  const res = await fetch(`${props.options.checkFileUrl}?hash=${hash}`)
  const { files } = await res.json(); //接收后端反文件，如果后端已存在文件直接将文件返回，如果没有就返回空数组
  const set = new Set(files)
  //这一步是用来做断点续传使用，假如分片上传了一部分，后端会将已上传的分片返回给前端，前端就可以根据这个数组来判断哪些分片已经上传过了
  //tasks就是剩余还需要上传的分片
  const tasks = chunks.map((chunk, index) => ({ chunk, index })).filter(({ index }) => {
    return !set.has(`${filename}-${index}`)
  })


  const CONCURRENT_LIMIT = 3; // 并发数
  const total = tasks.length;
  for (let i = 0; i < total; i += CONCURRENT_LIMIT) {
    await Promise.all(
      tasks.slice(i, i + CONCURRENT_LIMIT)
        .map((_, idx) => uploadChunk(_.chunk, i + idx, filename, hash,total ))
    );
    console.log(`已上传 ${Math.min(i + CONCURRENT_LIMIT, total)}/${total}`);
  }


  //所有分片上传完毕，开始合并
  await fetch(`${props.options.mergeFileUrl}?hash=${hash}&filename=${filename}`)

  //合并完毕后，清空chunks数组
  chunks.length = 0;
  //更新文件状态为已上传
  const fileIndex = uploadFiles.value.findIndex(file => file.name === filename);
  if (fileIndex !== -1) {
    uploadFiles.value[fileIndex].state = 'uploaded';
  }
  uploadFiles.value = [...uploadFiles.value];
  percentage.value = 0; // 重置进度条
  console.log('所有分片上传完毕，文件已合并');
}


const uploadChunk = async (chunk, index, filename, hash ,total) => {
  const formData = new FormData();
  formData.append("filename", filename);
  formData.append("hash", hash);
  formData.append("index", index);
  formData.append("file", chunk);
  // console.log('上传分片:', index, '文件名:', filename, '哈希值:', hash);
  return new Promise((resolve) => {
    fetch(props.options.uploadFileUrl, {
      method: "POST",
      body: formData
    }).then(response => {
      console.log('上传分片:', index, '响应状态:', response.status);
      if (response.status === 200) {
        return resolve(response.json());
      } else {
        throw new Error('网络错误');
      }
    }).then(data => {
      // 更新进度条
      if (chunks.length === total) {
        //这里可以用来更新进度条
        percentage.value = ((index + 1) / chunks.length).toFixed(2) * 100;
      } else {
        percentage.value = ((((index + 1) + (chunks.length - total)) / chunks.length).toFixed(2) * 100);
      }
    }).catch(error => {
      console.error('上传失败:', error);
    });
  })


};

</script>
<style scoped>

</style>