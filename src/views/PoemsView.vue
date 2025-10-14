<template>
  <div class="poems-view">
    <h2>诗词浏览</h2>
    <div class="poem-list">
      <PoemCard 
        v-for="poem in poems" 
        :key="poem.id" 
        :poem="poem" 
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { poems } from '@/data/poems'
import PoemCard from '@/components/PoemCard.vue'
</script>

<style scoped>
.poems-view {
  padding: 2rem;
}

.poem-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .poem-list {
    grid-template-columns: 1fr;
  }
}
</style>