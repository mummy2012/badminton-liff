import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Contact from '../views/Contact.vue'



const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/contact', name: 'Contact', component: Contact }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
