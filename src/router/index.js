import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import departmentRouter from './modules/department'
import approvalRouter from './modules/approval'
import attendanceRouter from './modules/attendance'
import employeeRouter from './modules/employee'
import permissionRouter from './modules/permission'
import roleRouter from './modules/role'
import salaryRouter from './modules/salary'
import performanceRouter from './modules/performance'

/**
 * 仅当路由的子路由长度大于等于 1 时，子菜单才会显示
 *
 * hidden: true                  （如果设置为 true，该项将不会在侧边栏中显示，默认值为 false）
 * alwaysShow: true               （如果设置为 true，将始终显示根菜单；如果未设置 alwaysShow，当该项有多个子路由时，它将变为嵌套模式，否则不显示根菜单）
 * redirect: noRedirect          （如果设置为 noRedirect，在面包屑导航中就不会进行重定向）
 * name:'router-name'             （该名称供<keep-alive>使用（必须设置！！！））
 * meta : {
    roles: ['admin','editor']    （用于控制页面角色（可设置多个角色））
    title: 'title'               （在侧边栏和面包屑导航中显示的名称（建议设置））
    icon: 'svg-name'/'el-icon-x' （在侧边栏中显示的图标）
    breadcrumb: false           （如果设置为 false，该项将在面包屑导航中隐藏，默认值为 true）
    activeMenu: '/example/list'  （如果设置了路径，侧边栏将高亮显示你所设置的路径）
  }
 */

/**
 * constantRoutes
没有权限要求的基础页面，所有角色均可访问
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  departmentRouter,
  roleRouter,
  employeeRouter,
  permissionRouter,
  attendanceRouter,
  approvalRouter,
  salaryRouter,
  performanceRouter
]

// 动态路由
// export const asyncRoutes = [
//   departmentRouter,
//   roleRouter,
//   employeeRouter,
//   permissionRouter,
//   attendanceRouter,
//   approvalRouter,
//   salaryRouter
//   // socialRouter
// ]
const createRouter = () => new Router({
  // mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  // 指定当切换路由时页面滚动的位置，这里设置为让页面在垂直方向（y轴）滚动到坐标0的位置，也就是滚动到顶部
  routes: constantRoutes // 默认引入静态路由
})

const router = createRouter()

export function resetRouter() {
  // 创建一个新的路由器实例
  const newRouter = createRouter()
  // 将当前路由器（router）的匹配器（matcher）替换为新创建的路由器实例的匹配器，以此来重置路由器
  router.matcher = newRouter.matcher
}

export default router
