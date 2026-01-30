

# vHRM - Vue 人力资源管理系统

基于 [vue-admin-template](https://github.com/PanJiaChen/vue-admin-template) 搭建的人力资源管理系统前端项目，采用 Vue.js + Element UI 技术栈。

## 项目简介

vHRM 是一个现代化的人力资源管理前端解决方案，提供了完整的人力资源管理功能模块，包括员工管理、部门管理、考勤管理、薪资管理、绩效管理、审批流程等。本项目基于 vue-admin-template 模板构建，继承了其优秀的前端架构设计。

## 功能模块

### 核心功能
- **员工管理**: 员工信息的增删改查、导入导出、详情查看
- **部门管理**: 组织架构管理、部门层级设置
- **考勤管理**: 考勤设置、考勤数据导入、考勤记录查询
- **薪资管理**: 薪资结构管理、工资条查看
- **绩效管理**: 绩效评估、绩效报表
- **审批管理**: 各类审批流程处理
- **权限管理**: 角色权限配置、菜单权限控制
- **角色管理**: 系统角色配置与管理

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
- **测试框架**: Jest

## 项目结构

```
vHRM/
├── mock/                      # Mock 数据模拟
│   ├── index.js               # Mock 入口配置
│   ├── mock-server.js         # Mock 服务器
│   ├── table.js               # 表格数据模拟
│   ├── user.js                # 用户数据模拟
│   └── utils.js               # Mock 工具函数
├── public/                    # 静态资源
│   ├── favicon.ico            # 网站图标
│   └── index.html             # HTML 模板
├── src/                       # 源代码目录
│   ├── api/                   # API 接口模块
│   │   ├── approval.js        # 审批相关接口
│   │   ├── attendance.js      # 考勤相关接口
│   │   ├── dashboard.js       # 仪表盘接口
│   │   ├── department.js      # 部门相关接口
│   │   ├── employee.js        # 员工相关接口
│   │   ├── performance.js     # 绩效相关接口
│   │   ├── permission.js      # 权限相关接口
│   │   ├── role.js            # 角色相关接口
│   │   ├── salary.js          # 薪资相关接口
│   │   └── user.js            # 用户相关接口
│   ├── assets/                # 静态资源图片
│   ├── components/            # 公共组件
│   │   ├── Breadcrumb/        # 面包屑导航组件
│   │   ├── Hamburger/         # 汉堡菜单组件
│   │   └── SvgIcon/           # SVG 图标组件
│   ├── icons/                 # SVG 图标库
│   ├── layout/                # 布局组件
│   │   ├── components/
│   │   │   ├── AppMain.vue    # 主内容区域
│   │   │   ├── Navbar.vue     # 顶部导航栏
│   │   │   └── Sidebar/       # 侧边栏组件
│   │   │       ├── FixiOSBug.js
│   │   │       ├── Item.vue
│   │   │       ├── Link.vue
│   │   │       ├── Logo.vue
│   │   │       ├── SidebarItem.vue
│   │   │       └── index.vue
│   │   ├── mixin/             # 布局混入
│   │   └── index.vue          # 布局入口
│   ├── router/                # 路由配置
│   │   ├── index.js           # 路由入口
│   │   └── modules/           # 各模块路由
│   │       ├── approval.js    # 审批路由
│   │       ├── attendance.js  # 考勤路由
│   │       ├── department.js  # 部门路由
│   │       ├── employee.js    # 员工路由
│   │       ├── performance.js # 绩效路由
│   │       ├── permission.js  # 权限路由
│   │       ├── role.js        # 角色路由
│   │       └── salary.js      # 薪资路由
│   ├── store/                 # Vuex 状态管理
│   │   ├── index.js           # Store 入口
│   │   ├── getters.js         # Getter 定义
│   │   └── modules/           # 状态模块
│   │       ├── app.js         # 应用状态
│   │       ├── settings.js    # 设置状态
│   │       └── user.js        # 用户状态
│   ├── styles/                # 样式文件
│   ├── utils/                 # 工具函数
│   │   ├── auth.js            # 认证相关
│   │   ├── get-page-title.js  # 页面标题
│   │   ├── index.js           # 工具函数入口
│   │   ├── request.js         # HTTP 请求封装
│   │   └── validate.js        # 表单验证
│   ├── views/                 # 页面组件
│   │   ├── approval/          # 审批管理页面
│   │   ├── attendance/        # 考勤管理页面
│   │   │   └── components/    # 考勤组件
│   │   ├── dashboard/         # 仪表盘页面
│   │   ├── department/        # 部门管理页面
│   │   │   └── components/    # 部门组件
│   │   ├── employee/          # 员工管理页面
│   │   │   └── components/    # 员工组件
│   │   ├── login/             # 登录页面
│   │   ├── myApply/           # 我的申请页面
│   │   ├── myAttendance/      # 我的考勤页面
│   │   ├── myPerformance/     # 我的绩效页面
│   │   ├── mySalary/          # 我的薪资页面
│   │   ├── performance/       # 绩效管理页面
│   │   ├── permission/        # 权限管理页面
│   │   ├── role/              # 角色管理页面
│   │   ├── salary/            # 薪资管理页面
│   │   └── 404.vue            # 404 页面
│   ├── App.vue                # 根组件
│   ├── main.js                # 应用入口
│   ├── permission.js          # 路由权限控制
│   └── settings.js            # 项目配置
├── tests/                     # 测试文件
│   └── unit/                  # 单元测试
├── .editorconfig              # 编辑器配置
├── .env.development           # 开发环境配置
├── .env.production            # 生产环境配置
├── .env.staging               # 预发布环境配置
├── .eslintignore              # ESLint 忽略配置
├── .eslintrc.js               # ESLint 配置
├── .gitignore                 # Git 忽略配置
├── .travis.yml                # Travis CI 配置
├── babel.config.js            # Babel 配置
├── jest.config.js             # Jest 配置
├── jsconfig.json              # JavaScript 配置
├── package.json               # 项目依赖配置
├── postcss.config.js          # PostCSS 配置
├── vue.config.js              # Vue CLI 配置
└── README.md                  # 项目说明文档
```

## 快速开始

### 环境要求

- **Node.js**: >= 10.x
- **npm**: >= 6.x
- **Git**: 用于克隆项目

### 安装步骤

```bash
# 克隆项目
git clone https://gitee.com/longwangyang/vHRM.git

# 进入项目目录
cd vHRM

# 安装依赖
npm install
```

> **注意**: 建议不要直接使用 cnpm 安装依赖，可能会出现各种诡异的问题。如果 npm 下载速度慢，可以配置国内镜像源或使用淘宝镜像。

### 开发环境

启动开发服务器：

```bash
npm run dev
```

启动后访问 http://localhost:9528

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

项目采用模块化开发方式，添加新模块需要按以下步骤进行：

1. **API 接口开发**: 在 `src/api/` 目录下创建对应的 API 文件
2. **路由配置**: 在 `src/router/modules/` 目录下创建路由配置文件
3. **页面开发**: 在 `src/views/` 目录下创建页面组件目录
4. **状态管理**: 在 `src/store/modules/` 目录下创建状态管理模块（如需要）

### 公共组件

项目提供了以下公共组件可直接使用：

| 组件 | 路径 | 说明 |
|------|------|------|
| Breadcrumb | `src/components/Breadcrumb/` | 面包屑导航组件 |
| Hamburger | `src/components/Hamburger/` | 汉堡菜单组件 |
| SvgIcon | `src/components/SvgIcon/` | SVG 图标组件 |

### 样式规范

项目使用 SCSS 预处理器，样式文件位于 `src/styles/` 目录：

| 文件 | 说明 |
|------|------|
| `element-ui.scss` | Element UI 样式覆盖 |
| `index.scss` | 全局样式 |
| `mixin.scss` | 样式混入 |
| `sidebar.scss` | 侧边栏样式 |
| `transition.scss` | 过渡动画 |
| `variables.scss` | 样式变量 |

### Mock 数据

项目内置 Mock 数据模拟功能，用于前端独立开发和测试：

- Mock 服务器入口: `mock/index.js`
- Mock 服务配置: `mock/mock-server.js`
- 模拟数据: `mock/table.js`, `mock/user.js`
- 工具函数: `mock/utils.js`

## 浏览器支持

支持现代浏览器和 IE10+：

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari |
| :---: | :---: | :---: | :---: |
| IE10, IE11, Edge | last 2 versions | last 2 versions | last 2 versions |

## 相关项目

- [vue-admin-template](https://github.com/PanJiaChen/vue-admin-template): 本项目基于的基础模板
- [vue-element-admin](https://github.com/PanJiaChen/vue-element-admin): 完整的后台前端解决方案
- [electron-vue-admin](https://github.com/PanJiaChen/electron-vue-admin): Electron 桌面版后台管理系统

## 许可证

本项目基于 [MIT](https://opensource.org/licenses/MIT) 许可证开源。

## 致谢

感谢 [PanJiaChen](https://github.com/PanJiaChen) 提供优秀的 vue-admin-template 开源项目，为本项目奠定了良好的前端架构基础。