<template>
  <div class="book-card" @click="() => onClick(book)">
    <div class="book-cover" :style="{ backgroundImage: coverUrl }">
      <div v-if="!coverUrl" class="default-cover">
        {{ title.substring(0, 2) }}
      </div>
    </div>
    <div class="book-info">
      <h3 class="book-title">{{ title }}</h3>
      <p class="book-meta">
        {{ formatWordCount(wordCount) }} | 
        {{ formatTime(lastEditTime) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Book } from '@share/models/Book';
import { format } from 'date-fns'; // 可以安装date-fns处理日期

const props = defineProps<{
  book: Book;
  onClick: (book: Book) => void;
}>();

const { book } = props;
const { title, cover, wordCount, lastEditTime } = book;

const coverUrl = cover ? `url(${cover})` : '';

const formatWordCount = (count: number) => {
  if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}万字`;
  }
  return `${count}字`;
};

const formatTime = (time: number) => {
  return format(new Date(time), 'yyyy-MM-dd');
};
</script>

<style scoped>
.book-card {
  width: 160px;
  margin: 16px;
  cursor: pointer;
  transition: transform 0.2s;
}

.book-card:hover {
  transform: translateY(-4px);
}

.book-cover {
  width: 160px;
  height: 220px;
  border-radius: 8px;
  background-size: cover;
  background-position: center;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.default-cover {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #646cff;
  color: white;
  font-size: 32px;
  font-weight: bold;
  border-radius: 8px;
}

.book-info {
  padding: 8px 0;
}

.book-title {
  font-size: 16px;
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.book-meta {
  font-size: 12px;
  color: #888;
  margin: 0;
}
</style>