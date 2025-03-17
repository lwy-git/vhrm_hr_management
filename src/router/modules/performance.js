import layout from '@/layout'
export default {
  path: '/performance',
  name: 'performance',
  component: layout,
  children: [{
    path: '',
    name: 'performance',
    component: () => import('@/views/performance'),
    meta: {
      title: '绩效评估',
      icon: 'table'
    }
  }]
}
