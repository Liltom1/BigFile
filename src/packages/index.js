import BigFileUpload from './BigFileUpload/index.vue'
import Progress from './Progress/index.vue'
const component = [BigFileUpload,Progress]; // 将来如果有其它组件，都可以写到这个数组里

const install = function (Vue) {
  component.forEach((com) => {
    Vue.component(com.name, com);
  });
};

export default { install };

