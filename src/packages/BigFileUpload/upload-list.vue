<template>
    <ul class="list-group">
        <li class="list-group-item" v-for="(file, index) in uploadFiles" :key="index" :tabindex="index">
            <div class="list-group-item-info">
                <p>
                    <span>{{ file.name }}</span>
                    <span v-if="file.state === 'pending'">上传进度</span>
                </p>
                <Progress v-if="file.state === 'pending'" :percentage="Number(percentage)" />
            </div>
            <label class="list-group-item-label">
                    <svg width="20" height="20" viewBox="0 0 20 20">
                        <path d="M10 10l5.09-5.09L10 10l5.09 5.09L10 10zm0 0L4.91 4.91 10 10l-5.09 5.09L10 10z"
                            stroke="currentColor" fill="none" fill-rule="evenodd" stroke-linecap="round"
                            stroke-linejoin="round"></path>
                    </svg>
            </label>
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

<style scoped>
.list-group {
    position: relative;
    margin: 10px 0px 0px;
    padding: 0px;
    list-style: none;
}

.list-group-item {
    font-size: 14px;
    color: black;
    margin-bottom: 5px;
    position: relative;
    box-sizing: border-box;
    width: 100%;
    transition: 0.5s cubic-bezier(0.55, 0, 0.1, 1);
    border-radius: 4px;
}

.list-group-item :hover {
    
    background-color: #ccc7c7;

}

.list-group-item-info {
    display: inline-flex;
    justify-content: center;
    flex-direction: column;
    width: calc(100% - 0px);
    margin-left: 4px;
}

.list-group-item-label:hover + .list-group-item-info{
    background-color: #ccc7c7;
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

.list-group-item-label:hover ~ .list-group-item {
    background-color: #ccc7c7;
}

p {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0px;
}
</style>