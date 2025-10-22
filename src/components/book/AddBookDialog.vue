<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="w-full max-w-md bg-white rounded-lg shadow-lg">
      <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <h2 class="text-xl font-semibold">新增书籍</h2>
        <button 
          class="text-gray-500 hover:text-gray-800 text-2xl transition-colors" 
          @click="handleClose"
        >
          ×
        </button>
      </div>
      
      <div class="p-6">
        <form @submit.prevent="handleSubmit">
          <div class="mb-5">
            <label for="title" class="block mb-2 font-medium">书籍标题 *</label>
            <input 
              type="text" 
              id="title" 
              v-model="formData.book_title" 
              required
              placeholder="请输入书籍标题"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          
          <div class="mb-5">
            <label for="description" class="block mb-2 font-medium">书籍简介</label>
            <textarea 
              id="description" 
              v-model="formData.book_desc" 
              rows="4"
              placeholder="请输入书籍简介"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            ></textarea>
          </div>
          
          <div class="flex justify-end gap-3 mt-8">
            <button 
              type="button" 
              class="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
              @click="handleClose"
            >
              取消
            </button>
            <button 
              type="submit" 
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              创建
            </button>
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
  (e: 'save', data: { book_title: string; book_desc: string }): void;
}>();

const formData = ref({
  book_title: '',
  book_desc: ''
});

const handleClose = () => {
  emit('close');
};

const handleSubmit = () => {
  if (!formData.value.book_title.trim()) {
    alert('请输入书籍标题');
    return;
  }
  
  emit('save', {
    book_title: formData.value.book_title.trim(),
    book_desc: formData.value.book_desc.trim()
  });
};
</script>
