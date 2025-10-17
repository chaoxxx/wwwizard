<template>
  <div class="w-[160px] m-4 cursor-pointer transition-transform duration-200 hover:-translate-y-1" @click="() => onClick(book)">
    <div 
      class="w-[160px] h-[220px] rounded-lg bg-cover bg-center relative shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
      :style="{ backgroundImage: coverUrl }"
    >
      <div 
        v-if="!coverUrl" 
        :class="`w-full h-full flex items-center justify-center text-white text-3xl font-bold rounded-lg`"
        :style="{ backgroundColor: coverColor }"
      >
        {{ title.substring(0, 2) }}
      </div>
    </div>
    <div class="pt-2 pb-0">
      <h3 class="text-base m-0 mb-1 text-center whitespace-nowrap overflow-hidden text-ellipsis">
        {{ title }}
      </h3>
      <p class="text-xs text-center text-gray-600 m-0">
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
const { title, cover, wordCount, lastEditTime,id } = book;

const coverUrl = cover ? `url(${cover})` : '';

// 生成一组美观协调的背景色
const coverColors = [
  '#646cff',    // 主色调：靛蓝色
  '#36d399',    // 绿色
  '#f59e0b',    // 琥珀色
  '#ec4899',    // 粉色
  '#8b5cf6',    // 紫色
  '#06b6d4',    // 青色
  '#ef4444',    // 红色
  '#6366f1',    // 靛蓝色变体
  '#10b981',    // 绿色变体
  '#f97316',    // 橙色
];

// 基于书籍ID生成固定的颜色索引，确保同一本书始终显示相同颜色
const getColorIndex = (id: string | number) => {
  // 简单的哈希函数将ID转换为索引
  let hash = 0;
  const str = String(id);
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % coverColors.length;
};

// 获取当前书籍的背景色
const coverColor = coverColors[getColorIndex(id)];

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
