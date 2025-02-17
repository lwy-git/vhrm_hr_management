import router from './router'
import store from './store'
// import { Message } from 'element-ui'
import nprogress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 进度条样式
import { asyncRoutes } from '@/router' // 引入动态路由
// import { getToken } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'
const whiteList = ['/login', '/404']
router.beforeEach(async(to, from, next) => {
  nprogress.start() // 开启进度条
  if (store.getters.token) {
    if (to.path === '/login') {
      next('/')
      nprogress.done()
    } else {
      if (!store.getters.userId) {
        // const { menus } = await store.dispatch('user/login')
        const menus = store.getters.menus
        console.log(menus) // 数组 不确定 可能是8个 1个 0个
        console.log(asyncRoutes) // 数组 8个
        const filterRoutes = asyncRoutes.filter(item => {
          // 选出当前角色的权限路由
          return menus.includes(item.name)
        }) // 筛选后的路由
        console.log('filterRoutes', filterRoutes)
        // 动态添加路由到vuex修改state.routes
        store.commit('user/setRoutes', filterRoutes)
        router.addRoutes([...filterRoutes, { path: '*', redirect: '/404', hidden: true }]) // 添加动态路由信息到路由表
        // router添加动态路由之后 需要转发一下
        console.log('to.path', to.path)
        // next(to.path) // 目的是让路由拥有信息
        next()
      } else {
        next() // 放行
      }
    }
  } else {
    // 没有token
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login') // 拦截到登录页
      nprogress.done()
    }
  }
}
)
router.afterEach(() => {
  console.log(111)
  nprogress.done()// 关闭进度条
})
