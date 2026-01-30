

# vHRM - Vue 人力资源管理系统

基于 [vue-admin-template](https://github.com/PanJiaChen/vue-admin-template) 搭建的人力资源管理系统前端项目，采用 Vue.js + Element UI 技术栈。

## 项目简介

vHRM 是一个现代化的人力资源管理前端解决方案，提供了完整的人力资源管理功能模块，包括员工管理、部门管理、考勤管理、薪资管理、绩效管理、审批流程等。

## 功能模块

### 核心功能
- **员工管理**: 员工信息的增删改查、导入导出、详情查看
- **部门管理**: 组织架构管理、部门层级设置
- **考勤管理**: 考勤设置、考勤数据导入、考勤记录查询
- **薪资管理**: 薪资结构管理、工资条查看
- **绩效管理**: 绩效评估、绩效报表
- **审批管理**: 各类审批流程处理
- **权限管理**: 角色权限配置、菜单权限控制

### 个人中心
- **我的考勤**: 个人考勤记录查询
- **我的薪资**: 工资条查看
- **我的绩效**: 绩效记录查看
- **我的申请**: 审批进度跟踪

## 技术栈

- **框架**: Vue.js 2.x
- **UI 组件库**: Element UI
- **状态管理**: Vuex
- **路由**: Vue Router
- **HTTP 客户端**: Axios
- **构建工具**: vue-cli
- **代码规范**: ESLint
- **样式预处理**: SCSS

## 项目结构

```
src/
├── api/                  # API 接口模块
│   ├── approval.js       # 审批相关接口
│   ├── attendance.js     # 考勤相关接口
│   ├── dashboard.js      # 仪表盘接口
│   ├── department.js     # 部门相关接口
│   ├── employee.js       # 员工相关接口
│   ├── performance.js    # 绩效相关接口
│   ├── permission.js     # 权限相关接口
│   ├── role.js           # 角色相关接口
│   ├── salary.js         # 薪资相关接口
│   └── user.js           # 用户相关接口
├── assets/               # 静态资源
├── components/           # 公共组件
│   ├── Breadcrumb/       # 面包屑导航
│   ├── Hamburger/        # 汉堡菜单
│   └── SvgIcon/          # SVG 图标
├── icons/                # SVG 图标库
├── layout/               # 布局组件
│   ├── components/
│   │   ├── AppMain.vue
│   │   ├── Navbar.vue
│   │   └── Sidebar/
│   └── index.vue
├── router/               # 路由配置
│   ├── index.js
│   └── modules/          # 各模块路由
├── store/                # Vuex 状态管理
│   ├── index.js
│   ├── getters.js
│   └── modules/
│       ├── app.js
│       ├── settings.js
│       └── user.js
├── styles/               # 样式文件
├── utils/                # 工具函数
│   ├── auth.js           # 认证相关
│   ├── get-page-title.js # 页面标题
│   ├── index.js
│   ├── request.js        # HTTP 请求封装
│   └── validate.js       # 表单验证
├── views/                # 页面组件
│   ├── approval/
│   ├── attendance/
│   ├── dashboard/
│   ├── department/
│   ├── employee/
│   ├── login/
│   ├── myApply/
│   ├── myAttendance/
│   ├── myPerformance/
│   ├── mySalary/
│   ├── performance/
│   ├── permission/
│   ├── role/
│   └── salary/
├── App.vue
└── main.js
├── permission.js         # 路由权限控制
└── settings.js           # 项目配置
```

## 快速开始

### 环境要求

- Node.js >= 10.x
- npm >= 6.x

### 安装依赖

```bash
# 克隆项目
git clone https://gitee.com/longwangyang/vHRM.git

# 进入项目目录
cd vHRM

# 安装依赖
npm install
```

> **注意**: 建议不要直接使用 cnpm 安装依赖，可能会出现各种诡异的 bug。如果 npm 下载速度慢，可以配置国内镜像源或使用淘宝镜像。

### 启动开发服务器

```bash
npm run dev
```

启动后自动打开 http://localhost:9528

### 构建部署

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

### 其他命令

```bash
# 预览构建效果
npm run preview

# 预览构建效果 + 静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix
```

## 开发指南

### 添加新模块

1. 在 `src/api/` 目录下创建对应的 API 文件
2. 在 `src/router/modules/` 目录下创建路由配置文件
3. 在 `src/views/` 目录下创建页面组件
4. 在 `src/store/modules/` 目录下创建状态管理模块（如需要）

### 组件开发

项目提供了以下公共组件可直接使用：
- `Breadcrumb`: 面包屑导航组件
- `Hamburger`: 汉堡菜单组件
- `SvgIcon`: SVG 图标组件

### 样式规范

项目使用 SCSS 预处理器，样式文件位于 `src/styles/` 目录：
- `element-ui.scss`: Element UI 样式覆盖
- `index.scss`: 全局样式
- `mixin.scss`: 样式混入
- `sidebar.scss`: 侧边栏样式
- `transition.scss`: 过渡动画
- `variables.scss`: 样式变量

## 相关页面
1. 登录页
<img width="1919" height="966" alt="image" src="https://github.com/user-attachments/assets/40b9f27f-5585-4853-89ed-6451f1c20417" />
2. 首页
<img width="1919" height="967" alt="image" src="https://github.com/user-attachments/assets/5f01593a-6fd4-4f1c-9bee-2e8f2c95909f" />
3. 组织架构
<img width="1919" height="849" alt="image" src="https://github.com/user-attachments/assets/387fcd81-8375-44d9-aed9-38b89c40892e" />
4.员工管理
<img width="1914" height="928" alt="image" src="https://github.com/user-attachments/assets/7d809803-77ff-4701-93b2-77ceb46893e9" />
5.角色管理
<img width="1912" height="896" alt="image" src="https://github.com/user-attachments/assets/0ac9e795-bbc5-42a2-83c0-075d89e010ce" />
6.权限管理
<img width="1895" height="829" alt="image" src="https://github.com/user-attachments/assets/24ac0662-eb3b-4eab-ba14-a5c7aa599502" />
7.考勤管理
<img width="1914" height="928" alt="image" src="https://github.com/user-attachments/assets/86ece75d-a04f-4e06-8ab6-0cbc26cd2fdd" />
8.申请审批
<img width="1919" height="849" alt="image" src="https://github.com/user-attachments/assets/548813bf-07dc-4837-8a72-d00d45e10484" />
9.绩效评估
<img width="1908" height="961" alt="image" src="https://github.com/user-attachments/assets/3219590e-0acb-46ba-a06e-2b8161b59a96" />
10.薪酬管理
<img width="1913" height="907" alt="image" src="https://github.com/user-attachments/assets/0b575a4f-a737-4cf2-98c6-9a4b5bd54e65" />


## 浏览器支持

支持现代浏览器和 IE10+：

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari |
| --------- | --------- | --------- | --------- |
| IE10, IE11, Edge| last 2 versions| last 2 versions| last 2 versions |

## 相关项目

- [vue-admin-template](https://github.com/PanJiaChen/vue-admin-template): 本项目基于的基础模板
- [vue-element-admin](https://github.com/PanJiaChen/vue-element-admin): 完整的后台前端解决方案
- [electron-vue-admin](https://github.com/PanJiaChen/electron-vue-admin): Electron 桌面版后台管理系统

## 许可证

本项目基于 [MIT](https://opensource.org/licenses/MIT) 许可证开源。

## 致谢

感谢 [PanJiaChen](https://github.com/PanJiaChen) 提供优秀的 vue-admin-template 开源项目。
