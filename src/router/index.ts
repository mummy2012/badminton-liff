import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import schedule from '../views/Schedule.vue'



const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/schedule/:date', name: 'Schedule', component: schedule, props: true },
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
