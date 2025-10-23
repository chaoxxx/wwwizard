<template>
  <div class="characters-panel">
    <div class="panel-header">
      <h2>角色管理</h2>
      <button @click="showAddCharacterDialog = true" class="add-button">+ 新增角色</button>
    </div>
    
    <div class="characters-list">
      <div v-for="character in characters" :key="character.id" class="character-card">
        <h3>{{ character.character_full_name }}</h3>
        <p>{{ character.character_remark }}</p>
        <div class="card-actions">
          <button @click="editCharacter(character)">编辑</button>
        </div>
      </div>
    </div>
    
    <AddCharacterDialog 
      v-if="showAddCharacterDialog" 
      @close="showAddCharacterDialog = false"
      @save="addCharacter"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Character } from '@share/dbModels/Character';
import AddCharacterDialog from './AddCharacterDialog.vue';

const props = defineProps<{
  bookId: string;
}>();

const characters = ref<Character[]>([]);
const showAddCharacterDialog = ref(false);

// 加载角色列表
const loadCharacters = async () => {
  try {
    // 实际项目中调用IPC获取数据
    characters.value = await window.ipcRenderer.getAllCharactersByBookId(props.bookId);
    // characters.value = []; // 临时数据
  } catch (error) {
    console.error('加载角色失败:', error);
  }
};

// 添加角色
const addCharacter = async (characterData: any) => {
  try {
    // 实际项目中调用IPC保存数据
    const newCharacter = await window.ipcRenderer.addCharacter({
      ...characterData,
      book_id: props.bookId
    });
    characters.value.push(newCharacter);
    showAddCharacterDialog.value = false;
  } catch (error) {
    console.error('添加角色失败:', error);
  }
};

// 编辑角色
const editCharacter = (character: Character) => {
  // 编辑逻辑
};

onMounted(() => {
  loadCharacters();
});
</script>

<style scoped>
.characters-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.panel-header {
  padding: 16px 24px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.add-button {
  padding: 8px 16px;
  background-color: #646cff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.characters-list {
  flex: 1;
  padding: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  overflow-y: auto;
}

.character-card {
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  transition: box-shadow 0.2s;
}

.character-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.card-actions {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.card-actions button {
  padding: 4px 8px;
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  cursor: pointer;
}
</style>