<template>
  <div class="dialog-overlay">
    <div class="dialog-container">
      <div class="dialog-header">
        <h2>新增书籍</h2>
        <button class="close-button" @click="handleClose">×</button>
      </div>
      
      <div class="dialog-body">
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="title">书籍标题 *</label>
            <input 
              type="text" 
              id="title" 
              v-model="formData.title" 
              required
              placeholder="请输入书籍标题"
            >
          </div>
          
          <div class="form-group">
            <label for="description">书籍简介</label>
            <textarea 
              id="description" 
              v-model="formData.description" 
              rows="4"
              placeholder="请输入书籍简介"
            ></textarea>
          </div>
          
          <div class="form-actions">
            <button type="button" class="cancel-button" @click="handleClose">取消</button>
            <button type="submit" class="submit-button">创建</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'save', data: { title: string; description: string }): void;
}>();

const formData = ref({
  title: '',
  description: ''
});

const handleClose = () => {
  emit('close');
};

const handleSubmit = () => {
  if (!formData.value.title.trim()) {
    alert('请输入书籍标题');
    return;
  }
  
  emit('save', {
    title: formData.value.title.trim(),
    description: formData.value.description.trim()
  });
};
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog-container {
  width: 500px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.dialog-header {
  padding: 16px 24px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-header h2 {
  margin: 0;
  font-size: 20px;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #888;
  padding: 0;
  line-height: 1;
}

.close-button:hover {
  color: #333;
}

.dialog-body {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.form-group textarea {
  resize: vertical;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
}

.cancel-button,
.submit-button {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.cancel-button {
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  color: #333;
}

.submit-button {
  background-color: #646cff;
  border: 1px solid #646cff;
  color: white;
}

.submit-button:hover {
  background-color: #535bf2;
}
</style>