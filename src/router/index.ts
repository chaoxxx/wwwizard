// filePath: wwwizard/src/router/index.ts
import { createRouter, createWebHashHistory } from 'vue-router';
import BookManagement from '../components/book/BookManagement.vue';
import WriterPage from '../components/writer/WriterPage.vue';
import WriteIde  from '../components/ide/WriteIde.vue';  

const routes = [
  { path: '/', name: 'BookManagement', component: BookManagement },
  { path: '/write/:bookId', name: 'Writer', component: WriteIde, props: true }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;