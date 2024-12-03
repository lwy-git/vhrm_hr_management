import layout from '@/layout'
export default {
  path: '/employee',
  component: layout,
  children: [{
    path: '',
    name: 'employee',
    component: () => import('@/views/employee'),
    meta: {
      title: '员工',
      icon: 'people'
    }
  }, {
    // ? 标识可有可无，可以传id也可以选择不传，
    // 员工详情的地址有id就查询详情数据无id新增
    path: '/employee/detail/:id?',
    component: () => import('@/views/employee/components/detail.vue'),
    hidden: true, // 表示隐藏在左侧菜单
    meta: {
      title: '员工详情' // 显示在导航的文本
    }
  }]
}
