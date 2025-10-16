<template>
  <div class="book-management">
    <h1>我的书籍</h1>
    <div class="books-container">
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

import type { Book } from '@share/models/Book';
import { ref, onMounted } from 'vue';
import BookCard from './BookCard.vue';
import AddBookButton from './AddBookButton.vue';
import AddBookDialog from './AddBookDialog.vue';


const books = ref<Book[]>([]);
const showAddBookDialog = ref(false);

// 加载所有书籍
const loadBooks = async () => {
  try {
      const data = await window.ipcRenderer.getAllBooks();
    books.value = data;
  } catch (error) {
    console.error('加载书籍失败:', error);
  }
};

// 处理书籍点击
const handleBookClick = (book: Book) => {
  // 这里可以实现打开书籍的逻辑
  console.log('打开书籍:', book);
};

// 处理新增书籍
const handleAddBook = async (bookData: { title: string; description: string }) => {
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

<style scoped>
.book-management {
  padding: 24px;
}

.books-container {
  display: flex;
  flex-wrap: wrap;
  margin-top: 24px;
}

h1 {
  margin: 0 0 24px 16px;
  color: #333;
}
</style>