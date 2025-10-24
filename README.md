## 文本编辑器

Tiptap + 自定义扩展

## 开发环境

node `v22.14.0`
开发工具`visual studio code`

```
git clone https://github.com/chaoxxx/wwwizard.git
cnpm install
```

## 开发环境启动

```
npm run dev
```

## 打包

```
npm run build
```

## 业务代码开发

### 后端业务逻辑

1. 在`electron\main`中创建业务模块
1. 在`electron\main\index.ts`末尾定义IPC接口
1. 在`electron\preload\index.ts`文件的 `// You can expose other APTs you need here.`后定义IPC接口，暴露给前端调用

### 前端页面渲染

1. 在`src\components`模块下创建业务模块
1. 在`src\vite-env.d.ts`文件中添加后端暴露的接口，避免`visual studio code`IDE提示错误
1. 在`src\router\index.ts`文件中添加路由跳转

### 前后端共用

1. 前后端共用的类库，放在`share`目录下

## 开发过程中可能遇到的问题

### Electron 解决与nodejs版本不一致的问题

错误提示如下
```
NODE_MODULE_VERSION 127. This version of Node.js requires
NODE_MODULE_VERSION 139. Please try re-compiling or re-installing
```

执行以下命令，重新编译
```
.\node_modules\.bin\electron-rebuild
```

## 引入的第三方库

### vue-codemirror 

`vue`封装的`codemirror`编辑器，详情见[vue-codemirror](https://www.npmjs.com/package/vue-codemirror)

### better-sqlite

作为数据存储

### electron-log

作为日志记录框架

### perlin 前端库

详情见[preline](https://www.preline.co/docs/)

## 开发路线

|版本|功能|
|---|---|
|1.0.0|实现基本的文本编辑器|
|1.1.0|实现角色管理功能|

## 声明

本项目基于[electron-vite-vue](https://github.com/electron-vite/electron-vite-vue.git)开发
