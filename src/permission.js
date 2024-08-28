
import router from './router'
import store from './store'
// import { Message } from 'element-ui'
import nprogress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'
const writeList = ['/login', '/404']
router.beforeEach((to, from, next) => {
  nprogress.start() // 开启进度条
  if (store.getters.token) {
    if (to.path === '/login') {
      next('/')
      nprogress.done()
    } else {
      if (!store.getters.userId) {
        store.dispatch('user/getUserInfo')
      }
      next()
    }
  } else {
    if (writeList.includes(to.path)) { next() } else {
      next('/login')
    }
  }
}
)
router.afterEach(() => {
  console.log(111)
  nprogress.done()// 关闭进度条
})
