const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device, // 获取当前应用所运行的设备类型
  token: state => state.user.token,
  menus: state => state.user.menus,
  Id: state => state.user.userInfo.id,
  role: state => state.user.role,
  avatar: state => state.user.userInfo.staffPhoto, // 头像
  name: state => state.user.userInfo.username,
  routes: state => state.user.routes, // 开放路由的访问信息
  company: state => state.user.userInfo.company, // 公司名称
  departmentName: state => state.user.userInfo.departmentName // 部门名称
}
export default getters
