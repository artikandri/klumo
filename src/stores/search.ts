import { ref } from 'vue'
import { defineStore } from 'pinia'

import history from '@/mocks/json/search/history.json'
import suggestions from '@/mocks/json/search/suggestions.json';


export const useSearchHistory = defineStore('searchHistory', () => {
  const searchHistory = ref(history)
  const searchSuggestions = ref(suggestions);
  function addMySearchHistory(history: string) {
    searchHistory.value.mySearches.push({
      text: history,
      lastSearched: new Date().toLocaleDateString(),
    })
  }

  return { searchHistory, searchSuggestions, addMySearchHistory }
})

