<template>
  <div class="form-container">
    <h2>个人信息表单</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>姓名:</label>
        <input 
          type="text" 
          v-model="formData.name" 
          required
          placeholder="请输入姓名"
        >
      </div>

      <div class="form-group">
        <label>年龄:</label>
        <input 
          type="number" 
          v-model.number="formData.age" 
          required
          min="0"
          max="150"
          placeholder="请输入年龄"
        >
      </div>

      <div class="form-group">
        <label>身份证号:</label>
        <input 
          type="text" 
          v-model="formData.idCard" 
          required
          placeholder="请输入身份证号"
          @input="validateIdCard"
        >
        <span class="error-message" v-if="idCardError">{{ idCardError }}</span>
      </div>

      <button type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? '保存中...' : '提交' }}
      </button>
    </form>

    <div v-if="message" class="message {{ messageType }}">
      {{ message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

const formData = reactive({
  name: '',
  age: 0,
  idCard: ''
});

const isSubmitting = ref(false);
const message = ref('');
const messageType = ref('');
const idCardError = ref('');

// 简单的身份证号验证
const validateIdCard = (e: Event) => {
  const value = (e.target as HTMLInputElement).value;
  // 简单验证18位
  const reg = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  if (!reg.test(value)) {
    idCardError.value = '请输入有效的18位身份证号';
  } else {
    idCardError.value = '';
  }
};

const handleSubmit = async () => {
  if (idCardError.value) return;
  
  isSubmitting.value = true;
  message.value = '';
  
  try {
    const result = await window.ipcRenderer.invoke('save-user-info', {
      name: formData.name,
      age: formData.age,
      id_card: formData.idCard
    });

    if (result.success) {
      messageType.value = 'success';
      message.value = result.message;
      // 重置表单
      formData.name = '';
      formData.age = 0;
      formData.idCard = '';
    } else {
      messageType.value = 'error';
      message.value = result.message;
    }
  } catch (err) {
    messageType.value = 'error';
    message.value = err instanceof Error ? err.message : '保存失败，请重试';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.form-container {
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

input {
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

button {
  width: 100%;
  padding: 0.8rem;
  background-color: #646cff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.25s;
}

button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #535bf2;
}

.message {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 4px;
  text-align: center;
}

.success {
  background-color: #d4edda;
  color: #155724;
}

.error {
  background-color: #f8d7da;
  color: #721c24;
}

.error-message {
  color: #721c24;
  font-size: 0.875rem;
}
</style>