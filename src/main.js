import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import BigFileUpload from 'bigfilesupload'
// import BigFileUpload from '../dist/bigFileUpload.js'
import '../node_modules/bigfilesupload/bigFileUpload.css'



export const app = createApp(App)
app.use(BigFileUpload)
app.mount('#app')
