<template>
  <div>
    <input type="file" id="file" :multiple="true" @change="handleChange" @click.stop>
    <li class="list-group-item" v-for="(file, index) in uploadFiles" :key="index">
      <span>{{ file.name }}</span>
      <span>上传进度</span>
      <div class="progress progress-striped active" v-if="file.state === 'pending'">
        <div role="progressbar" class="progress-bar" :style="`width:${percentage}%;`" :aria-valuenow="percentage"
          aria-valuemin="0" aria-valuemax="100">{{ percentage }}%</div>
      </div>
    </li>
  </div>
</template>
<script lang='js' setup name="BigFileUpload">
import { ref, reactive } from 'vue'
defineOptions({
  name: 'BigFileUpload'
})
const worker = new Worker('../worker.js')
const chunks = [];
const props =  defineProps({
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
console.log(props.options);


const handleChange = (e) => {
  const files = e.target.files[0];
  const fs = files; //读取文件内容
  console.log(fs.name);
  fs.state = 'pending'; //设置文件状态为待上传

  uploadFiles.value = [...uploadFiles.value,fs];
  const total = Math.ceil(fs.size / props.options.chunkSize); //切割的总数 也就是我们要掉23次接口
  console.log(total,'total');
  
  //0-5 5-10 10-15 15-20 20-25 将文件分装成5M的块 并放入chunks数组中
  chunks.push(...Array.from({ length: total }, (_, i) => fs.slice(i * props.options.chunkSize, (i + 1) * props.options.chunkSize)));
  
  console.log(chunks, 'chunks');
  //将切片数组传到web worker，多线程脚本运行上传到后端
  //向worker.js发送消息  worker.js会接收这个消息
  worker.postMessage({
    chunks,
    filename: fs.name,
  });
  
  console.log(worker,'worker');
}

const percentage = ref(0);

worker.onmessage = async function (e) {
  console.log(e,'e');
  const { filename, hash } = e.data;
  const res = await fetch(`${props.options.checkFileUrl}?hash=${hash}`)
  const { files } = await res.json(); //接收后端反文件，如果后端已存在文件直接将文件返回，如果没有就返回空数组
  const set = new Set(files)
  //这一步是用来做断点续传使用，假如分片上传了一部分，后端会将已上传的分片返回给前端，前端就可以根据这个数组来判断哪些分片已经上传过了
  //tasks就是剩余还需要上传的分片
  const tasks = chunks.map((chunk, index) => ({ chunk, index })).filter(({ index }) => {
    return !set.has(`${filename}-${index}`)
  })

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  for (const { chunk, index } of tasks) {
    const formData = new FormData();
    formData.append("filename", filename);
    formData.append("hash", hash);
    formData.append("index", index);
    formData.append("file", chunk);
    await fetch(props.options.uploadFileUrl, {
      method: "POST",
      body: formData
    })
    // console.log((chunks.length - tasks.length), chunks.length);
    if (chunks.length === tasks.length) {
      //这里可以用来更新进度条
      percentage.value = ((index + 1) / chunks.length).toFixed(2) * 100;
      // document.querySelector('#result').innerText = `${((index + 1) / chunks.length).toFixed(2) * 100}%`
    }else{
      percentage.value = ((((index + 1) + (chunks.length - tasks.length)) / chunks.length).toFixed(2) * 100);
      // document.querySelector('#result').innerText = `${((((index+1) + (chunks.length - tasks.length)) / chunks.length).toFixed(2) * 100)}%`
    }
    await sleep(2000)
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
}


</script>
<style  scoped>
.progress {
  height: 15px;
  margin-bottom: 20px;
  overflow: hidden;
  background-color: #f5f5f5;
  border-radius: 4px;
  -webkit-box-shadow: inset 0 1px 2px rgba(0, 0, 0, .1);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, .1);
}
.progress-bar {
  float: left;
  width: 0;
  height: 100%;
  font-size: 8px;
  line-height: 15px;
  color: #fff;
  text-align: center;
  background-color: #428bca;
  -webkit-box-shadow: inset 0 -1px 0 rgba(0, 0, 0, .15);
  box-shadow: inset 0 -1px 0 rgba(0, 0, 0, .15);
  -webkit-transition: width .6s ease;
  transition: width .6s ease;
}
.progress-striped .progress-bar {
  background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);
  background-image: linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);
  background-size: 40px 40px;
}

.progress.active .progress-bar {
  -webkit-animation: progress-bar-stripes 2s linear infinite;
  animation: progress-bar-stripes 2s linear infinite;
}

@-webkit-keyframes progress-bar-stripes {
  from {
    background-position: 40px 0;
  }

  to {
    background-position: 0 0;
  }
}

@keyframes progress-bar-stripes {
  from {
    background-position: 40px 0;
  }

  to {
    background-position: 0 0;
  }
}
</style>