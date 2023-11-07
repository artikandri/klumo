import { ref } from 'vue'
import { defineStore } from 'pinia'

import history from '@/mocks/json/search/history.json'
import suggestions from '@/mocks/json/search/suggestions.json';

import { randomValue } from "@/utilities/utils.js"

export const useSearchHistory = defineStore('searchHistory', () => {
  const searchHistory = ref(history)
  const searchSuggestions = ref(suggestions);
  function addMySearchHistory(history: string) {
    searchHistory.value.mySearches.unshift({
      text: history,
      lastSearched: new Date().toLocaleDateString(),
    })
  }

  function addSuggestions(suggestion: string) {
    searchSuggestions.value.unshift({
      text: suggestion,
      similarity: randomValue(0, 1)
    })
  }

  return { searchHistory, searchSuggestions, addMySearchHistory, addSuggestions }
})

