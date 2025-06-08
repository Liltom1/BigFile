<template>
    <div>
        <div class="progress progress-striped active">
            <div role="progressbar" class="progress-bar" :style="`width:${percentage}%;`" :aria-valuenow="percentage"
                aria-valuemin="0" aria-valuemax="100">{{ percentage }}%</div>
        </div>
    </div>
</template>

<script setup lang='js'>
import { ref, reactive } from 'vue'
defineOptions({
  name: 'Progress'
})
const props = defineProps({
  percentage: {
    type: Number,
    default: 0,
  },
})

</script>
<style scoped>
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