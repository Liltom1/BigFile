<template>
    <ul class="list-group">
        <li class="list-group-item" v-for="(file, index) in uploadFiles" :key="index" :tabindex="index">
            <div class="list-group-item-info">
                <span>{{ file.name }}</span>
                <span v-if="file.state === 'pending'">上传进度</span>
                <label class="list-group-item-label" @click="removeFile(file)" >x</label>
            </div>
            <Progress v-if="file.state === 'pending'" :percentage="Number(percentage)" />
        </li>
    </ul>
</template>

<script setup lang='js'>
import { ref, reactive, defineEmits } from 'vue'
import Progress from '../Progress/index.vue'
const props = defineProps({
    uploadFiles: {
        type: Array,
        default: () => [],
    },
    percentage: {
        type: Number,
        default: 0,
    },
})

const emit = defineEmits(['removeFile'])

function removeFile (file) {
    if (file.state === 'pending') {
        alert('文件正在上传中，请稍后再删除');
        return;
    }
    emit('removeFile', file)
}

</script>

<style scoped>
.list-group {
    position: relative;
    margin: 10px 0px 0px;
    padding: 0px;
    list-style: none;
}

.list-group-item {
    font-size: 14px;
    color: #606266;
    margin-bottom: 5px;
    position: relative;
    box-sizing: border-box;
    width: 100%;
    transition: 0.5s cubic-bezier(0.55, 0, 0.1, 1);
    border-radius: 4px;
}

.list-group-item :hover {
    background-color: #f5f7fa;
}

.list-group-item-info {
    position: relative;
    display: inline-flex;
    justify-content: center;
    flex-direction: column;
    width: calc(100% - 0px);
    margin-left: 4px;
}

.list-group-item-label {
    display: inline-flex;
    position: absolute;
    right: 5px;
    top: 0px;
    line-height: inherit;
    height: 100%;
    justify-content: center;
    align-items: center;
    /* transition: opacity 0s; */
}

.list-group-item-label:hover {
    color: #409eff;
}

p {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0px;
}
</style>