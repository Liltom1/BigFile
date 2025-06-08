<template>
    <ul class="list-group">
        <li class="list-group-item" v-for="(file, index) in uploadFiles" :key="index">
            <span>{{ file.name }}</span>
            <span v-if="file.state === 'pending'">上传进度</span>
            <Progress v-if="file.state === 'pending'" :percentage="Number(percentage)" />
        </li>
    </ul>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
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


</script>

<style scoped></style>