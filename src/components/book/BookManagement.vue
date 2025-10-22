<template>
  <div class="p-6">
    <h1 class="m-0 mb-6 text-center text-gray-800 text-2xl font-semibold">测试网页</h1>
    <div class="flex flex-wrap justify-center mt-6 gap-4">
      <BookCard 
        v-for="book in books" 
        :key="book.id" 
        :book="book" 
        :on-click="handleBookClick"
      />
      <AddBookButton @click="showAddBookDialog = true" />
    </div>
    
    <AddBookDialog 
      v-if="showAddBookDialog" 
      @close="showAddBookDialog = false"
      @save="handleAddBook"
    />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'; // 添加导入
import type { Book } from '@share/dbModels/Book';
import { ref, onMounted } from 'vue';
import BookCard from './BookCard.vue';
import AddBookButton from './AddBookButton.vue';
import AddBookDialog from './AddBookDialog.vue';
const books = ref<Book[]>([]);
const showAddBookDialog = ref(false);

// 在setup中获取路由实例
const router = useRouter();

// 修改处理书籍点击的方法
const handleBookClick = (book: Book) => {
  // 跳转到写作页面
  router.push({ name: 'Writer', params: { bookId: book.id } });
};

// 加载所有书籍
const loadBooks = async () => {
  try {
      const data = await window.ipcRenderer.getAllBooks();
    books.value = data;
  } catch (error) {
    console.error('加载书籍失败:', error);
  }
};

// 处理新增书籍
const handleAddBook = async (bookData: { book_title: string; book_desc: string }) => {
  try {
    const newBook = await window.ipcRenderer.addBook(bookData);    
    books.value.push(newBook);
    showAddBookDialog.value = false;    
  } catch (error) {
    console.error('添加书籍失败:', error);
  }
};

// 组件挂载时加载书籍
onMounted(() => {
  loadBooks();
});
</script>
