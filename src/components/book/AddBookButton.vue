<template>
  <div class="add-book-button" @click="onClick">
    <div class="plus-icon">+</div>
    <p>新增书籍</p>
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

<style scoped>
.add-book-button {
  width: 160px;
  height: 220px;
  margin: 16px;
  border: 2px dashed #ccc;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.add-book-button:hover {
  border-color: #646cff;
  background-color: rgba(100, 108, 255, 0.05);
}

.plus-icon {
  font-size: 48px;
  color: #ccc;
  margin-bottom: 16px;
  transition: all 0.2s;
}

.add-book-button:hover .plus-icon {
  color: #646cff;
}

.add-book-button p {
  color: #888;
  margin: 0;
}

.add-book-button:hover p {
  color: #646cff;
}
</style>