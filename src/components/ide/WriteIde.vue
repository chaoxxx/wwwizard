<template>
  <div class="ide-container">
    <!-- 顶部导航栏 -->
    <header class="ide-header">
      <button @click="router.back()" class="back-button">← 返回书架</button>
      <h1>{{ book?.book_title || '正在加载...' }}</h1>
    </header>
    
    <div class="ide-main">
      <!-- 左侧资源管理窗口 -->
      <aside class="resource-explorer">
        <div class="resource-section">
          <h2 class="section-title">设定管理</h2>
          <ul class="resource-list">
            <li @click="selectResource('characters')" :class="{ active: activeResource === 'characters' }">
              <icon name="user" /> 角色管理
            </li>
            <li @click="selectResource('items')" :class="{ active: activeResource === 'items' }">
              <icon name="box" /> 物品管理
            </li>
          </ul>
        </div>
        
        <div class="resource-section">
          <h2 class="section-title">大纲管理</h2>
          <ul class="resource-list">
            <li @click="selectResource('outline')" :class="{ active: activeResource === 'outline' }">
              <icon name="list" /> 故事大纲
            </li>
          </ul>
        </div>
        
        <div class="resource-section">
          <h2 class="section-title">正文管理</h2>
          <ul class="resource-list">
            <li @click="selectResource('volumes')" :class="{ active: activeResource === 'volumes' }">
              <icon name="book" /> 卷和章节
            </li>
          </ul>
        </div>
      </aside>
      
      <!-- 右侧详情窗口 -->
      <main class="detail-panel">
        <component 
          :is="currentComponent" 
          :book-id="bookId"
          :active-resource="activeResource"
        />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, Ref, watch } from 'vue';
import type { Component  } from 'vue'; // 导入组件类型
import { useRoute, useRouter } from 'vue-router';
import type { Book } from '@share/dbModels/Book';
import CharactersPanel from './panels/CharactersPanel.vue';
// import ItemsPanel from './panels/ItemsPanel.vue';
// import OutlinePanel from './panels/OutlinePanel.vue';
// import VolumesPanel from './panels/VolumesPanel.vue';
import Icon from './panels/Icon.vue';

// 路由相关
const route = useRoute();
const router = useRouter();
const bookId = route.params.bookId as string;

console.log('当前编辑的书籍ID:', bookId);

// 状态管理
const book = ref<Book | null>(null);
const activeResource = ref('volumes'); // 默认显示章节管理

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
.ide-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.ide-header {
  padding: 16px 24px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-button {
  padding: 8px 16px;
  background-color: #646cff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.back-button:hover {
  background-color: #535bf2;
}

.ide-main {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.resource-explorer {
  width: 240px;
  background-color: #f8f9fa;
  border-right: 1px solid #e0e0e0;
  overflow-y: auto;
}

.resource-section {
  margin-bottom: 24px;
}

.section-title {
  padding: 12px 16px;
  font-size: 14px;
  color: #666;
  text-transform: uppercase;
  margin: 0;
  border-bottom: 1px solid #e0e0e0;
}

.resource-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.resource-list li {
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.resource-list li:hover {
  background-color: #e9ecef;
}

.resource-list li.active {
  background-color: #e6e8ff;
  border-left: 3px solid #646cff;
}

.detail-panel {
  flex: 1;
  overflow: auto;
  background-color: white;
}
</style>