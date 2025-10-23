<template>
  <div class="ide-container flex flex-col h-screen bg-gray-50 text-gray-900">
    <!-- 顶部导航栏 -->
    <header class="ide-header flex items-center gap-3 px-5 py-3 border-b border-gray-200 bg-white z-10">
      <button @click="router.back()" class="back-button p-2 rounded-md hover:bg-gray-100 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      <h1 class="text-sm font-medium truncate">{{ book?.book_title || '正在加载...' }}</h1>
    </header>
    
    <div class="ide-main flex flex-1 overflow-hidden">
      <!-- 左侧资源管理窗口 -->
      <aside class="resource-explorer w-64 border-r border-gray-200 bg-white overflow-y-auto">
        <div class="p-3">
          <!-- 设定管理（可折叠） -->
          <div class="resource-section mb-5">
            <!-- 分类标题（可点击折叠） -->
            <div 
              @click="toggleSection('setting')"
              class="section-header flex items-center justify-between px-3 py-1 mb-2 cursor-pointer"
            >
              <h2 class="section-title text-xs font-semibold text-gray-500 uppercase tracking-wider">设定管理</h2>
              <!-- 折叠/展开箭头 -->
              <svg 
                :class="collapsedSections.setting ? 'rotate-0' : 'rotate-90'"
                xmlns="http://www.w3.org/2000/svg" 
                width="14" 
                height="14" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="2" 
                stroke-linecap="round" 
                stroke-linejoin="round"
                class="text-gray-400 transition-transform duration-150"
              >
                <polyline points="9 6 15 12 9 18"></polyline>
              </svg>
            </div>
            <!-- 分类列表（根据折叠状态显示/隐藏） -->
            <ul 
              class="resource-list space-y-1"
              :class="collapsedSections.setting ? 'h-0 overflow-hidden' : 'h-auto overflow-visible'"
              style="transition: height 0.15s ease-in-out"
            >
              <li 
                @click="selectResource('characters')" 
                :class="activeResource === 'characters' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'"
                class="px-3 py-2 rounded-md text-sm flex items-center gap-2 cursor-pointer transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                角色管理
              </li>
              <li 
                @click="selectResource('items')" 
                :class="activeResource === 'items' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'"
                class="px-3 py-2 rounded-md text-sm flex items-center gap-2 cursor-pointer transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                物品管理
              </li>
            </ul>
          </div>
          
          <!-- 大纲管理（可折叠） -->
          <div class="resource-section mb-5">
            <div 
              @click="toggleSection('outline')"
              class="section-header flex items-center justify-between px-3 py-1 mb-2 cursor-pointer"
            >
              <h2 class="section-title text-xs font-semibold text-gray-500 uppercase tracking-wider">大纲管理</h2>
              <svg 
                :class="collapsedSections.outline ? 'rotate-0' : 'rotate-90'"
                xmlns="http://www.w3.org/2000/svg" 
                width="14" 
                height="14" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="2" 
                stroke-linecap="round" 
                stroke-linejoin="round"
                class="text-gray-400 transition-transform duration-150"
              >
                <polyline points="9 6 15 12 9 18"></polyline>
              </svg>
            </div>
            <ul 
              class="resource-list space-y-1"
              :class="collapsedSections.outline ? 'h-0 overflow-hidden' : 'h-auto overflow-visible'"
              style="transition: height 0.15s ease-in-out"
            >
              <li 
                @click="selectResource('outline')" 
                :class="activeResource === 'outline' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'"
                class="px-3 py-2 rounded-md text-sm flex items-center gap-2 cursor-pointer transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
                故事大纲
              </li>
            </ul>
          </div>
          
          <!-- 正文管理（可折叠） -->
          <div class="resource-section">
            <div 
              @click="toggleSection('content')"
              class="section-header flex items-center justify-between px-3 py-1 mb-2 cursor-pointer"
            >
              <h2 class="section-title text-xs font-semibold text-gray-500 uppercase tracking-wider">正文管理</h2>
              <svg 
                :class="collapsedSections.content ? 'rotate-0' : 'rotate-90'"
                xmlns="http://www.w3.org/2000/svg" 
                width="14" 
                height="14" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="2" 
                stroke-linecap="round" 
                stroke-linejoin="round"
                class="text-gray-400 transition-transform duration-150"
              >
                <polyline points="9 6 15 12 9 18"></polyline>
              </svg>
            </div>
            <ul 
              class="resource-list space-y-1"
              :class="collapsedSections.content ? 'h-0 overflow-hidden' : 'h-auto overflow-visible'"
              style="transition: height 0.15s ease-in-out"
            >
              <li 
                @click="selectResource('volumes')" 
                :class="activeResource === 'volumes' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'"
                class="px-3 py-2 rounded-md text-sm flex items-center gap-2 cursor-pointer transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
                卷和章节
              </li>
            </ul>
          </div>
        </div>
      </aside>
      
      <!-- 右侧详情窗口 -->
      <main class="detail-panel flex-1 overflow-auto bg-gray-50 p-6">
        <div class="max-w-6xl mx-auto bg-white rounded-lg border border-gray-200 shadow-sm min-h-[calc(100%-1.5rem)] p-5">
          <component 
            :is="currentComponent" 
            :book-id="bookId"
            :active-resource="activeResource"
          />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import type { Component } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { Book } from '@share/dbModels/Book';
import CharactersPanel from './panels/CharactersPanel.vue';
// import ItemsPanel from './panels/ItemsPanel.vue';
// import OutlinePanel from './panels/OutlinePanel.vue';
// import VolumesPanel from './panels/VolumesPanel.vue';

// 路由相关
const route = useRoute();
const router = useRouter();
const bookId = route.params.bookId as string;

console.log('当前编辑的书籍ID:', bookId);

// 状态管理
const book = ref<Book | null>(null);
const activeResource = ref('volumes'); // 默认显示章节管理
// 折叠状态管理：key对应分类，value为是否折叠（true=折叠，false=展开）
const collapsedSections = ref({
  setting: false,   // 设定管理
  outline: false,   // 大纲管理
  content: false    // 正文管理
});

// 加载书籍信息
const loadBookInfo = async () => {
  try {
    const allBooks = await window.ipcRenderer.getAllBooks();
    book.value = allBooks.find(b => b.id === bookId) || null;
  } catch (error) {
    console.error('加载书籍信息失败:', error);
  }
};

// 选择资源
const selectResource = (resource: string) => {
  activeResource.value = resource;
};

// 切换分类折叠/展开状态
const toggleSection = (section: 'setting' | 'outline' | 'content') => {
  collapsedSections.value[section] = !collapsedSections.value[section];
};

// 获取当前要显示的组件
const currentComponent = ref<Component | null>(null);
watch(activeResource, (val) => {
  switch(val) {
    case 'characters':
      currentComponent.value = CharactersPanel;
      break;
    // case 'items':
    //   currentComponent.value = ItemsPanel;
    //   break;
    // case 'outline':
    //   currentComponent.value = OutlinePanel;
    //   break;
    // case 'volumes':
    //   currentComponent.value = VolumesPanel;
    //   break;
  }
}, { immediate: true });

onMounted(() => {
  loadBookInfo();
});
</script>

<style scoped>
/* 移除组件引入，直接使用内联SVG图标保持Notion风格一致性 */
/* 保留基础样式防止冲突 */
.ide-container, .ide-header, .ide-main {
  box-sizing: border-box;
}
</style>