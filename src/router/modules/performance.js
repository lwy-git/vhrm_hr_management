import layout from '@/layout'
export default {
  path: '/performance',
  name: 'performance',
  component: layout,
  children: [{
    path: '',
    name: 'social',
    component: () => import('@/views/performance'),
    meta: {
      title: '绩效',
      icon: 'table'
    }
  }]
}
