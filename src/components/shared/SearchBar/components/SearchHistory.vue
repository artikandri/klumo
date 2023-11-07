<script setup lang="ts">
import { ref, computed, inject, onMounted, defineEmits } from "vue";
import { useSearchHistory } from "@/stores/search";
import router from "@/router/index";
import { toKebabCase } from "@/utilities/utils";
import { uniqBy } from "lodash";
import BaseButton from "@/components/shared/BaseButton/BaseButton.vue";

// ref
const activeSearchItemId = ref("");

// emit
const emit = defineEmits(["update:searchValue"]);

// injects
const { searchValue, setSearchValue } = inject("searchValue");
const { isHistoryShown, setIsHistoryShown } = inject("isHistoryShown");
const { fullscreen, setFullscreen } = inject("fullscreen");

// store
const { searchHistory, searchSuggestions, addMySearchHistory, addSuggestions } =
  useSearchHistory();

// computed
const mySearches = computed(() => {
  return uniqBy(searchHistory.mySearches, "text");
});
const popularSearches = computed(() => {
  return uniqBy(searchHistory.popularSearches, "text");
});
const searchSuggestionsFiltered = computed(() => {
  return uniqBy(
    searchSuggestions.filter((s) => s.text.includes(searchValue.value)),
    "text"
  );
});

onMounted(() => {
  startKeyboardListeners();
});

// methods
const startKeyboardListeners = () => {
  window.addEventListener("keyup", (e) => {
    if (isHistoryShown.value) {
      if (e.key === "Escape") {
        setIsHistoryShown(false);
        setFullscreen(false);
      }

      if (e.key === "ArrowDown") {
        if (mySearches.value.length) {
          let activeItemIdx = mySearches.value.findIndex((x) => x.active);
          if (activeItemIdx !== -1) {
            if (activeItemIdx < mySearches.value.length) {
              activeItemIdx += 1;
              if (activeItemIdx > 0) {
                mySearches.value[activeItemIdx - 1].active = false;
              }
              if (activeItemIdx < mySearches.value.length) {
                mySearches.value[activeItemIdx].active = true;
              }
              activeSearchItemId.value = `my_search_${activeItemIdx}`;
            }
          } else {
            activeItemIdx = 0;
            activeSearchItemId.value = `my_search_${activeItemIdx}`;
            mySearches.value[0].active = true;
          }
        }
      }

      if (e.key === "ArrowUp") {
        if (mySearches.value.length) {
          let activeItemIdx = mySearches.value.findIndex((x) => x.active);
          if (activeItemIdx !== -1) {
            if (activeItemIdx > 0) {
              activeItemIdx -= 1;
              if (activeItemIdx < mySearches.value.length - 1) {
                mySearches.value[activeItemIdx + 1].active = false;
              }
              if (activeItemIdx > 0) {
                mySearches.value[activeItemIdx].active = true;
              }
              activeSearchItemId.value = `my_search_${activeItemIdx}`;
            }
          } else {
            activeItemIdx = 0;
            activeSearchItemId.value = `my_search_${activeItemIdx}`;
            mySearches.value[0].active = true;
          }
        }
      }

      if (e.key === "Enter") {
        if (mySearches.value.length) {
          let activeItemIdx = mySearches.value.findIndex((x) => x.active);
          if (activeItemIdx !== -1) {
            onSuggestionClick(mySearches.value[activeItemIdx]);
            emit("update:searchValue", mySearches.value[activeItemIdx].text);
          }
        }
      }
    }
  });
};
const onClearHistoryButtonClick = () => {
  searchHistory.mySearches = [];
};
const onSuggestionClick = (suggestion: any) => {
  searchValue.value = suggestion.text;
  goToSearchPage(suggestion.text);
  setIsHistoryShown(false);
  setFullscreen(false);
};
const onBackgroundClick = () => {
  setIsHistoryShown(false);
  setFullscreen(false);
};
const onCheckAllResultsLinkClick = () => {
  setFullscreen(false);
  setIsHistoryShown(false);
};
const goToSearchPage = (text: string) => {
  router.push(`/search/${toKebabCase(searchValue.value || text)}`);
};
const generateLink = (text: string) => {
  return `/search/${toKebabCase(text)}`;
};
</script>
<template>
  <div class="history-container">
    <div>
      <div v-if="!searchValue">
        <div v-if="mySearches.length">
          <h2>
            Your search history
          </h2>
          <BaseButton
            @click="onClearHistoryButtonClick"
            text="Clear history"
          >
          </BaseButton>
          <ul class="search-list">
            <li
              v-for="(mySearch, idx) in mySearches.slice(0, 5)"
              :key="`my_search_${idx}`"
              @click="onSuggestionClick(mySearch)"
              class="search-list__item"
              :class="{'--active': activeSearchItemId === `my_search_${idx}`}"
            >
              <RouterLink :to="generateLink(mySearch.text)">
                {{ mySearch.text }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <div>
          <h2>
            Popular searches
          </h2>
          <ul class="search-list">
            <li
              v-for="(popularSearch, idx) in popularSearches"
              :key="`popular_search_${idx}`"
              @click="onSuggestionClick(popularSearch)"
              class="search-list__item"
            >
              <RouterLink :to="generateLink(popularSearch.text)">
                {{ popularSearch.text }}
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>
      <ul
        v-else
        class="search-list"
      >
        <li
          v-for="(suggestion, idx) in searchSuggestionsFiltered"
          :key="`search_suggestion_${idx}`"
          @click="onSuggestionClick(suggestion)"
          class="search-list__item"
        >
          <RouterLink :to="generateLink(suggestion.text)">
            {{ suggestion.text }}
          </RouterLink>
        </li>
      </ul>
      <RouterLink
        v-if="searchValue"
        :to="generateLink(searchValue)"
        @click="onCheckAllResultsLinkClick"
      >
        Check all results for "{{ searchValue }}"
      </RouterLink>
    </div>
    <div
      class="background"
      @click="onBackgroundClick"
    ></div>
  </div>
</template>
<style lang="scss" scoped>
.search-list {
  &__item {
    padding: 10px;
    margin: 0;
    display: block;

    &.--active {
      background-color: palette(grey, 600);
    }

    &:hover {
      background-color: palette(grey, 600);
      cursor: pointer;
    }
  }
}
</style>