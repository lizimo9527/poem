import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useFavoritesStore = defineStore('favorites', () => {
  const favorites = ref<number[]>(
    JSON.parse(localStorage.getItem('favoritePoems') || '[]')
  )

  watch(favorites, (newFavorites) => {
    localStorage.setItem('favoritePoems', JSON.stringify(newFavorites))
  }, { deep: true })

  const addFavorite = (poemId: number) => {
    if (!favorites.value.includes(poemId)) {
      favorites.value.push(poemId)
    }
  }

  const removeFavorite = (poemId: number) => {
    favorites.value = favorites.value.filter(id => id !== poemId)
  }

  const isFavorite = (poemId: number) => {
    return favorites.value.includes(poemId)
  }

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite
  }
})