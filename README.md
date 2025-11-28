# 智能学习计划生成器 - 前端

基于 Vue 3 + Vite 构建的前端应用

## 后端仓库

本项目的后端代码仓库：[https://github.com/NIIT-workshop-of-SHZU/study_planner](https://github.com/NIIT-workshop-of-SHZU/study_planner)

## 技术栈

- Vue 3 - 渐进式 JavaScript 框架
- Vue Router - 官方路由管理器
- Pinia - Vue 官方状态管理库
- Axios - HTTP 客户端
- Bootstrap 5 - UI 框架
- Vite - 下一代前端构建工具

## 开发环境设置

### 前置要求

- Node.js 16+ 
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

开发服务器将运行在 `http://localhost:5173`

### 构建生产版本

```bash
npm run build
```

构建产物将生成在 `dist` 目录

### 预览生产构建

```bash
npm run preview
```

## 项目结构

```
frontend/
├── public/          # 静态资源
├── src/
│   ├── assets/      # 资源文件（CSS、图片等）
│   ├── components/  # Vue 组件
│   ├── views/       # 页面视图
│   ├── router/      # 路由配置
│   ├── stores/      # Pinia 状态管理
│   ├── api/         # API 接口
│   ├── utils/       # 工具函数
│   ├── App.vue      # 根组件
│   └── main.js      # 入口文件
├── index.html       # HTML 模板
├── vite.config.js   # Vite 配置
└── package.json     # 项目配置
```

## API 配置

后端 API 地址配置在 `vite.config.js` 的 proxy 选项中，默认代理到 `http://localhost:8080`

## 注意事项

- 确保后端服务已启动（默认端口 8080）
- 开发环境使用 Vite 的代理功能，生产环境需要配置 Nginx 等反向代理

