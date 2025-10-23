<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="w-full max-w-md bg-white rounded-lg shadow-lg">
      <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <h2 class="text-xl font-semibold">新增角色</h2>
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
            <label for="title" class="block mb-2 font-medium">角色名称 *</label>
            <input 
              type="text" 
              id="title" 
              v-model="formData.character_full_name" 
              required
              placeholder="请输入角色名称"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>

          <div class="mb-5">
            <label for="title" class="block mb-2 font-medium">角色性别 *</label>
            <input 
              type="text" 
              id="title" 
              v-model="formData.character_gender" 
              required
              placeholder="请输入角色性别"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>          
          
          <div class="mb-5">
            <label for="description" class="block mb-2 font-medium">角色描述</label>
            <textarea 
              id="description" 
              v-model="formData.character_remark" 
              rows="4"
              placeholder="请输入角色描述"
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
  (e: 'save', data: { character_full_name: string;character_gender:string;character_remark:string; }): void;
}>();

const formData = ref({
  character_full_name: '',
  character_gender: '',
  character_remark: ''
});

const handleClose = () => {
  emit('close');
};

const handleSubmit = () => {
  if (!formData.value.character_full_name.trim()) {
    alert('请输入书籍标题');
    return;
  }
  
  emit('save', {
    character_full_name: formData.value.character_full_name.trim(),
    character_gender: formData.value.character_gender.trim(),
    character_remark: formData.value.character_remark.trim()
  });
};
</script>
