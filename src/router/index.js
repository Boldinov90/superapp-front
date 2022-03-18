import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login'
import Registration from '../views/Registration'
import Home from '../views/Home'
import ToDo from '../views/ToDo'
import CssAnimate from '../views/CssAnimate'
import Calculate from '../views/Calculate'

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes: [
        {path: '/', component: Home},
        {path: '/todo', component: ToDo},
        {path: '/css-animate', component: CssAnimate},
        {path: '/login', component: Login},
        {path: '/registration', component: Registration},
        {path: '/calculate', component: Calculate}
    ],
    linkActiveClass: 'active',
    linkExactActiveClass: 'active'
})

export default router
