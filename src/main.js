import { createApp } from 'vue'
import App from './App.vue'

import router from './router'
import store from './store'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faChevronLeft, faChevronRight, faArrowUpWideShort, faArrowDownWideShort } from '@fortawesome/free-solid-svg-icons'

library.add(faChevronLeft)
library.add(faChevronRight)
library.add(faArrowUpWideShort)
library.add(faArrowDownWideShort)

const app = createApp(App)

app.use(router)
app.use(store)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')
