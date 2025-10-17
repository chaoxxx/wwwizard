<template>
  <div class="writer-page">
    <!-- 顶部导航栏 -->
    <header class="writer-header">
      <button @click="router.back()" class="back-button">← 返回书架</button>
      <h1>{{ book?.title || '正在加载...' }}</h1>
    </header>
    
    <div class="writer-container">
      <!-- 左侧章节列表 -->
      <div class="chapter-sidebar">
        <div class="sidebar-header">
          <h2>卷和章节</h2>
          <div class="action-buttons">
            <button @click="showAddVolumeDialog = true">+ 新增卷</button>
            <button @click="showAddChapterDialog = true">+ 新增章节</button>
          </div>
        </div>
        
        <div class="volume-list">
          <div v-for="volume in volumes" :key="volume.id" class="volume-item">
            <div class="volume-header">
              <h3>{{ volume.title }}</h3>
            </div>
            <div class="chapter-list">
              <div 
                v-for="chapter in getChaptersByVolumeId(volume.id)" 
                :key="chapter.id"
                :class="['chapter-item', { 'active': currentChapter?.id === chapter.id }]"
                @click="selectChapter(chapter)"
              >
                <span class="chapter-order">{{ chapter.order }}.</span>
                <span class="chapter-title">{{ chapter.title }}</span>
                <span class="chapter-word-count">{{ formatWordCount(chapter.wordCount) }}</span>
              </div>
            </div>
          </div>
          
          <!-- 没有归属卷的章节 -->
          <div v-if="getChaptersByVolumeId().length > 0" class="volume-item">
            <div class="volume-header">
              <h3>未分类章节</h3>
            </div>
            <div class="chapter-list">
              <div 
                v-for="chapter in getChaptersByVolumeId()" 
                :key="chapter.id"
                :class="['chapter-item', { 'active': currentChapter?.id === chapter.id }]"
                @click="selectChapter(chapter)"
              >
                <span class="chapter-order">{{ chapter.order }}.</span>
                <span class="chapter-title">{{ chapter.title }}</span>
                <span class="chapter-word-count">{{ formatWordCount(chapter.wordCount) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 右侧编辑器区域 -->
      <div class="editor-container">
        <div v-if="!currentChapter" class="editor-placeholder">
          请选择或创建一个章节开始写作
        </div>
        
        <div v-else class="editor-wrapper">
          <div class="chapter-editor-header">
            <input 
              v-model="currentChapter.title" 
              class="chapter-title-input"
              @change="updateChapterTitle"
            >
            <div class="chapter-stats">
              <span>字数: {{ currentChapter.wordCount }}</span>
              <span>最后编辑: {{ formatTime(currentChapter.lastEditTime) }}</span>
            </div>
          </div>
          
          <!-- Tiptap编辑器 -->
          <div class="tiptap-editor">
            <editor-content :editor="editor" />
            
            <!-- 编辑器工具栏 -->
            <div class="editor-toolbar">
              <button @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()">H1</button>
              <button @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()">H2</button>
              <button @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()">H3</button>
              <separator />
              <button @click="editor?.chain().focus().toggleBold().run()">粗体</button>
              <button @click="editor?.chain().focus().toggleItalic().run()">斜体</button>
              <button @click="editor?.chain().focus().toggleStrike().run()">删除线</button>
              <separator />
              <button @click="editor?.chain().focus().toggleBulletList().run()">无序列表</button>
              <button @click="editor?.chain().focus().toggleOrderedList().run()">有序列表</button>
              <button @click="editor?.chain().focus().toggleBlockquote().run()">引用</button>
              <separator />
              <button @click="saveContent">保存</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 新增卷对话框 -->
    <AddVolumeDialog 
      v-if="showAddVolumeDialog" 
      @close="showAddVolumeDialog = false"
      @save="handleAddVolume"
    />
    
    <!-- 新增章节对话框 -->
    <AddChapterDialog 
      v-if="showAddChapterDialog" 
      @close="showAddChapterDialog = false"
      @save="handleAddChapter"
      :volumes="volumes"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Editor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import Paragraph from '@tiptap/extension-paragraph';
import type { Book } from '@share/models/Book';
import type { Chapter, Volume } from '@share/models/Chapter';
import { format } from 'date-fns';
import AddVolumeDialog from './AddVolumeDialog.vue';
import AddChapterDialog from './AddChapterDialog.vue';

// 路由相关
const route = useRoute();
const router = useRouter();
const bookId = route.params.bookId as string;

// 状态管理
const book = ref<Book | null>(null);
const volumes = ref<Volume[]>([]);
const chapters = ref<Chapter[]>([]);
const currentChapter = ref<Chapter | null>(null);
const showAddVolumeDialog = ref(false);
const showAddChapterDialog = ref(false);

// 初始化编辑器
const editor = ref<Editor>();

// 格式化字数
const formatWordCount = (count: number) => {
  if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}万字`;
  }
  return `${count}字`;
};

// 格式化时间
const formatTime = (time: number) => {
  return format(new Date(time), 'yyyy-MM-dd HH:mm');
};

// 根据卷ID获取章节
const getChaptersByVolumeId = (volumeId?: string) => {
  return chapters.value.filter(chapter => chapter.volumeId === volumeId);
};

// 加载书籍信息
const loadBookInfo = async () => {
  try {
    const allBooks = await window.ipcRenderer.getAllBooks();
    book.value = allBooks.find(b => b.id === bookId) || null;
  } catch (error) {
    console.error('加载书籍信息失败:', error);
  }
};

// 加载卷信息
const loadVolumes = async () => {
  try {
    volumes.value = await window.ipcRenderer.getVolumesByBookId(bookId);
  } catch (error) {
    console.error('加载卷信息失败:', error);
  }
};

// 加载章节信息
const loadChapters = async () => {
  try {
    // 先加载所有章节
    const allChapters: Chapter[] = [];
    for (const volume of volumes.value) {
      const volumeChapters = await window.ipcRenderer.getChaptersByVolumeId(volume.id);
      allChapters.push(...volumeChapters);
    }
    
    // 加载无卷章节
    const noVolumeChapters = await window.ipcRenderer.getChaptersByVolumeId();
    allChapters.push(...noVolumeChapters.filter(chapter => chapter.bookId === bookId));
    
    chapters.value = allChapters;
    
    // 如果有章节，默认选中第一个
    if (allChapters.length > 0 && !currentChapter.value) {
      selectChapter(allChapters[0]);
    }
  } catch (error) {
    console.error('加载章节信息失败:', error);
  }
};

// 选择章节
const selectChapter = async (chapter: Chapter) => {
  currentChapter.value = chapter;
  
  // 初始化编辑器
  if (editor.value) {
    editor.value.destroy();
  }
  
  editor.value = new Editor({
    extensions: [
      StarterKit,
      Heading.configure({ levels: [1, 2, 3] }),
      Paragraph
    ],
    content: chapter.content || '<p>开始写作...</p>',
    autofocus: true
  });
};

// 保存章节内容
const saveContent = async () => {
  if (!editor.value || !currentChapter.value) return;
  
  const content = editor.value.getHTML();
  try {
    const updatedChapter = await window.ipcRenderer.updateChapterContent(
      currentChapter.value.id, 
      content
    );
    
    if (updatedChapter) {
      currentChapter.value = updatedChapter;
      
      // 更新章节列表中的数据
      const index = chapters.value.findIndex(c => c.id === updatedChapter.id);
      if (index !== -1) {
        chapters.value[index] = updatedChapter;
      }
      
      console.log('内容已保存');
    }
  } catch (error) {
    console.error('保存内容失败:', error);
  }
};

// 自动保存
let saveTimeout: NodeJS.Timeout | null = null;
watch(
  () => editor.value?.getHTML(),
  (newValue, oldValue) => {
    if (newValue !== oldValue && editor.value && currentChapter.value) {
      // 延迟保存，避免频繁保存
      if (saveTimeout) clearTimeout(saveTimeout);
      saveTimeout = setTimeout(saveContent, 3000);
    }
  }
);

// 添加新卷
const handleAddVolume = async (volumeTitle: string) => {
  try {
    if (!bookId || !volumeTitle.trim()) return;
    
    const newVolume = await window.ipcRenderer.createVolume({
      bookId,
      title: volumeTitle.trim()
    });
    
    volumes.value.push(newVolume);
  } catch (error) {
    console.error('添加卷失败:', error);
  }
};

// 添加新章节
const handleAddChapter = async (data: { title: string; volumeId?: string }) => {
  try {
    if (!bookId || !data.title.trim()) return;
    
    const newChapter = await window.ipcRenderer.createChapter({
      bookId,
      title: data.title.trim(),
      volumeId: data.volumeId,
      content: ''
    });
    
    chapters.value.push(newChapter);
    // 自动选中新创建的章节
    selectChapter(newChapter);
  } catch (error) {
    console.error('添加章节失败:', error);
  }
};

// 更新章节标题
const updateChapterTitle = async () => {
  // 这里简化处理，实际项目中可能需要添加专门的更新标题的API
  if (currentChapter.value) {
    const index = chapters.value.findIndex(c => c.id === currentChapter.value!.id);
    if (index !== -1) {
      chapters.value[index].title = currentChapter.value.title;
    }
  }
};

// 组件挂载时加载数据
onMounted(async () => {
  await loadBookInfo();
  await loadVolumes();
  await loadChapters();
});

// 组件卸载时清理编辑器
onUnmounted(() => {
  if (editor.value) {
    editor.value.destroy();
  }
});
</script>

<style scoped>
.writer-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.writer-header {
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

.writer-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.chapter-sidebar {
  width: 300px;
  border-right: 1px solid #e0e0e0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-buttons button {
  flex: 1;
  padding: 8px;
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  cursor: pointer;
}

.action-buttons button:hover {
  background-color: #e9e9e9;
}

.volume-list {
  flex: 1;
  overflow-y: auto;
}

.volume-item {
  margin-bottom: 16px;
}

.volume-header {
  padding: 8px 16px;
  background-color: #f0f0f0;
  font-weight: bold;
}

.chapter-list {
  padding-left: 8px;
}

.chapter-item {
  padding: 8px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  border-left: 3px solid transparent;
}

.chapter-item:hover {
  background-color: #f5f5f5;
}

.chapter-item.active {
  background-color: #e6e8ff;
  border-left-color: #646cff;
}

.chapter-order {
  color: #888;
  width: 24px;
}

.chapter-title {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chapter-word-count {
  font-size: 12px;
  color: #888;
}

.editor-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.editor-placeholder {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
}

.editor-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chapter-editor-header {
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.chapter-title-input {
  font-size: 20px;
  font-weight: bold;
  border: none;
  padding: 8px 0;
  border-bottom: 1px solid transparent;
}

.chapter-title-input:focus {
  outline: none;
  border-bottom-color: #646cff;
}

.chapter-stats {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #888;
}

.tiptap-editor {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.editor-toolbar {
  padding: 8px 16px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 8px;
  background-color: #f5f5f5;
}

.editor-toolbar button {
  padding: 4px 8px;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  cursor: pointer;
}

.editor-toolbar button:hover {
  background-color: #f0f0f0;
}

.editor-toolbar separator {
  width: 1px;
  background-color: #e0e0e0;
  margin: 0 4px;
}

.editor-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}
</style>