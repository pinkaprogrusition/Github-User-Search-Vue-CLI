import { createRouter, createWebHashHistory } from "vue-router"

import SearchComponent from './components/Search.vue'
import UserComponent from './components/User.vue'

export default createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/search',
            component: SearchComponent,
            alias: '/'
        },
        {
            path: '/user/:username',
            component: UserComponent
        }
    ]
})