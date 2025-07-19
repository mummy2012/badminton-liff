import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from './router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import liff from '@line/liff'

const initLiff = async () => {
  try {
    await liff.init({ liffId: '2007729444-MPKyn88m' }) // from LINE Developer Console
    console.log('LIFF init success')
  } catch (err) {
    console.error('LIFF init error:', err)
  }
}

initLiff()


createApp(App).use(router).use(Antd).mount('#app')
