<template>
  <div 
    class="w-[160px] h-[220px] m-4 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-200 hover:border-[#646cff] hover:bg-[rgba(100,108,255,0.05)]"
    @click="onClick"
  >
    <div class="text-6xl text-gray-300 mb-4 transition-all duration-200 group-hover:text-[#646cff]">+</div>
    <p class="text-gray-600 m-0 transition-colors duration-200 group-hover:text-[#646cff]">新增书籍</p>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'click'): void;
}>();

const onClick = () => {
  emit('click');
};
</script>
