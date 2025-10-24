import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import router from './router'
import './demos/ipc'
// If you want use Node.js, the`nodeIntegration` needs to be enabled in the Main process.
// import './demos/node'



createApp(App)
  .use(router)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  });

// Preline UI
// import("preline/dist/index.js");

// const app = createApp(App)
//   .use(router)
//   .mount('#app');
// // 在 Vue 挂载完成后，再导入并初始化 Preline
// app.$nextTick(async () => {
//   postMessage({ payload: 'removeLoading' }, '*')
//   // 动态导入 Preline 并初始化
//   const preline = await import("preline/dist/index.js");
//   // 部分版本的 Preline 需要手动触发初始化（根据实际版本调整）
//   if (window.HSStaticMethods) {
    window.HSStaticMethods.autoInit();
//     console.log('Preline initialized');
//   }
// });
