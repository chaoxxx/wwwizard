<template>
  <!-- 动态渲染对应名称的SVG图标 -->
  <svg 
    :class="['icon', customClass]" 
    :width="size" 
    :height="size" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    stroke-width="2" 
    stroke-linecap="round" 
    stroke-linejoin="round"
    :title="title"
  >
    <use :xlink:href="`#icon-${name}`" />
  </svg>
</template>

<script setup lang="ts">
// import { defineProps } from 'vue';

// 定义组件Props
const props = defineProps({
  /** 图标名称，对应SVG sprite中的id */
  name: {
    type: String,
    required: true,
    validator: (value: string) => {
      // 可选：校验传入的图标名称是否在预设列表中，避免无效图标
      const validIcons = ['user', 'box', 'list', 'book', 'plus', 'edit', 'delete', 'back', 'save'];
      return validIcons.includes(value);
    }
  },
  /** 图标尺寸，默认24px */
  size: {
    type: [Number, String],
    default: 24
  },
  /** 自定义样式类名 */
  customClass: {
    type: String,
    default: ''
  },
  /** 图标提示文本 */
  title: {
    type: String,
    default: ''
  }
});
</script>

<style scoped>
.icon {
  /* 基础样式，确保图标垂直居中 */
  display: inline-block;
  vertical-align: middle;
  /* 继承父元素颜色，方便主题切换 */
  color: inherit;
  /* 禁止选择 */
  user-select: none;
  /* 过渡效果，提升交互体验 */
  transition: all 0.2s ease;
}

/* 可选：hover效果，根据需求添加 */
.icon:hover {
  opacity: 0.8;
}
</style>