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

### 前后端共用

1. 前后端共用的类库，放在`share`目录下

## 声明

本项目基于[electron-vite-vue](https://github.com/electron-vite/electron-vite-vue.git)开发
