<template>
  <div>
    <button @click="startUpload" @keydown.self.enter.space="handleKeydown">开始上传</button>
    <input style="display: none;" ref="inputRef" type="file" id="file" :multiple="true" @change="onChange"
      @click.stop>
  </div>
</template>
<script lang='js' setup>
import { ref, reactive, shallowRef } from 'vue'
const props = defineProps({
  onChange : {
    type: Function,
    default: () => {},
  },
})
//大型数据结构的性能优化 
const inputRef = shallowRef()


const handleKeydown = () => {
  startUpload()
}

const startUpload = () => {
  inputRef.value.value = ''
  inputRef.value.click()
}

</script>
<style lang='less' scoped>
</style>