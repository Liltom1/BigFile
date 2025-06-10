<template>
  <div>
    <button class="uploadButton" @click="startUpload" @keydown.self.enter.space="handleKeydown">+ 点击上传</button>
    <input style="display: none;" ref="inputRef" type="file" id="file" :multiple="true" @change="onChange" @click.stop>
  </div>
</template>
<script lang='js' setup>
import { ref, reactive, shallowRef } from 'vue'
const props = defineProps({
  onChange: {
    type: Function,
    default: () => { },
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
<style scoped>
.uploadButton {
  --el-button-disabled-text-color: rgba(255, 255, 255, .5);
  display: inline-flex;
  justify-content: center;
  align-items: center;
  line-height: 1;
  height: 32px;
  white-space: nowrap;
  cursor: pointer;
  color: #ffffff;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  transition: .1s;
  font-weight: 500;
  user-select: none;
  vertical-align: middle;
  -webkit-appearance: none;
  background-color: #409eff;
  border: 1px solid #4C4D4F;
  border-color: #409eff;
  padding: 8px 15px;
  font-size: 14px;
  border-radius: 4px;
}
</style>