// filePath: wwwizard/src/router/index.ts
import { createRouter, createWebHashHistory } from 'vue-router';
import BookManagement from '../components/book/BookManagement.vue';
import WriterPage from '../components/writer/WriterPage.vue';
import WriteIde  from '../components/ide/WriteIde.vue';  
import perlin from 'preline/dist/index.js'

const routes = [
  { path: '/', name: 'BookManagement', component: BookManagement },
  { path: '/write/:bookId', name: 'Writer', component: WriteIde, props: true }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});


// router.afterEach(async (to, from, failure) => {
//   if (!failure) setTimeout(() => window.HSStaticMethods.autoInit(), 100);
// });

router.afterEach(async (to, from, failure) => {
  if (!failure) {
    // 等待 Preline 加载完成后再执行 autoInit
    await perlin;
    // window.HSStaticMethods?.autoInit() // 此时一定存在，无需 setTimeout
    if (!failure) setTimeout(() => window.HSStaticMethods.autoInit(), 100);    
  }
})

export default router;