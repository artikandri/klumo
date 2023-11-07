<script setup lang="ts">
import { ref, computed, inject, onMounted, defineEmits } from "vue";
import { useSearchHistory } from "@/stores/search";
import router from "@/router/index";
import { toKebabCase } from "@/utilities/utils";
import { uniqBy } from "lodash";
import BaseButton from "@/components/shared/BaseButton/BaseButton.vue";

import type IsHistoryShown from "@/types/IsHistoryShown";
import type IsReplaced from "@/types/IsReplaced";
import type Fullscreen from "@/types/Fullscreen";
import type SearchValue from "@/types/SearchValue";
import type SearchInput from "@/types/SearchInput";

// ref
const activeSearchItemId = ref("");
const tabindex = ref(-1);

// emit
const emit = defineEmits(["update:searchValue"]);

// injects
const { searchValue, setSearchValue } = inject("searchValue", {
  searchValue: ref(""),
  setSearchValue: (value: string) => {},
}) as SearchValue;
const { isHistoryShown, setIsHistoryShown } = inject("isHistoryShown", {
  isHistoryShown: false,
  setIsHistoryShown: (value: boolean) => {},
}) as unknown as IsHistoryShown;
const { setFullscreen } = inject("fullscreen") as unknown as Fullscreen;
const { setSearchInputBlur } = inject("searchInput", {
  setSearchInputBlur: () => {},
}) as unknown as SearchInput;
const { setIsReplaced } = inject("isReplaced", {
  setIsReplaced: (value: boolean) => {},
}) as unknown as IsReplaced;

// store
const { searchHistory, searchSuggestions, addSuggestions } = useSearchHistory();

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
  window.addEventListener("keydown", (e) => {
    const checkMySearch = mySearches.value.length && !searchValue.value.length;
    const target = checkMySearch ? mySearches : searchSuggestionsFiltered;
    const targetKey = checkMySearch ? `my_search_` : `search_suggestion_`;

    if (isHistoryShown.value) {
      if (e.key === "Escape") {
        setIsHistoryShown(false);
        setFullscreen(false);
      }

      if (e.key === "ArrowDown") {
        setSearchInputBlur();
        tabindex.value = 0;
        e.preventDefault();

        if (target.value.length) {
          let activeItemIdx = target.value.findIndex((x: any) => x.active);
          if (activeItemIdx !== -1) {
            if (activeItemIdx < target.value.length) {
              activeItemIdx += 1;
              if (activeItemIdx > 0) {
                target.value[activeItemIdx - 1].active = false;
              }
              if (target.value[activeItemIdx]) {
                target.value[activeItemIdx].active = true;
              }
              activeSearchItemId.value = `${targetKey}${activeItemIdx}`;
            }
          } else {
            activeItemIdx = 0;
            activeSearchItemId.value = `${targetKey}${activeItemIdx}`;
            target.value[0].active = true;
          }
        }
      }

      if (e.key === "ArrowUp") {
        setSearchInputBlur();
        tabindex.value = 0;
        e.preventDefault();

        if (target.value.length) {
          let activeItemIdx = target.value.findIndex((x: any) => x.active);
          if (activeItemIdx !== -1) {
            if (activeItemIdx > 0) {
              activeItemIdx -= 1;
              if (activeItemIdx < target.value.length - 1) {
                target.value[activeItemIdx + 1].active = false;
              }
              if (target.value[activeItemIdx]) {
                target.value[activeItemIdx].active = true;
              }
              activeSearchItemId.value = `${targetKey}${activeItemIdx}`;
            }
          } else {
            activeItemIdx = 0;
            activeSearchItemId.value = `${targetKey}${activeItemIdx}`;
            target.value[0].active = true;
          }
        }
      }

      if (e.key === "Enter") {
        if (target.value.length) {
          let activeItemIdx = target.value.findIndex((x: any) => x.active);
          if (activeItemIdx >= 0 && target.value[activeItemIdx]) {
            onSuggestionClick(target.value[activeItemIdx], checkMySearch);
            emit("update:searchValue");
            activeSearchItemId.value = "";
          }
        }
      }
    }
  });
};
const onClearHistoryButtonClick = () => {
  searchHistory.mySearches = [];
};
const onSuggestionClick = (
  suggestion: any,
  addToSuggestion: boolean = false
) => {
  setSearchValue(suggestion.text);
  setIsHistoryShown(false);
  setFullscreen(false);
  goToSearchPage(suggestion.text);
  if (window.innerWidth <= 768) {
    setIsReplaced(true);
  }
  if (addToSuggestion) {
    addSuggestions(suggestion.text);
  }
};
const onCheckAllResultsLinkClick = () => {
  setFullscreen(false);
  setIsHistoryShown(false);
  if (window.innerWidth <= 768) {
    setIsReplaced(true);
  }
};
const goToSearchPage = (text: string = "") => {
  router.push(`/search/${toKebabCase(text || searchValue.value)}`);
};
const generateLink = (text: string) => {
  return `/search/${toKebabCase(text)}`;
};
</script>
<template>
  <div
    class="history-container"
    ref="historyContainer"
    :tabindex="tabindex"
  >
    <div v-if="!searchValue">
      <div
        class="my-search"
        v-if="mySearches.length"
      >
        <div class="my-search__header">
          <h2>
            Your search history
          </h2>
          <BaseButton
            class="clear-history-button"
            @click="onClearHistoryButtonClick"
            variant="clean"
            text="Clear history"
          >
          </BaseButton>
        </div>
        <ul class="search-list --my-search">
          <li
            v-for="(mySearch, idx) in mySearches.slice(0, 5)"
            :key="`my_search_${idx}`"
            @click="onSuggestionClick(mySearch, true)"
            class="search-list__item --my-search"
            :class="{'--active': activeSearchItemId === `my_search_${idx}`}"
          >
            <RouterLink :to="generateLink(mySearch.text)">
              {{ mySearch.text }}
            </RouterLink>
          </li>
        </ul>
      </div>

      <div class="popular-search">
        <div class="popular-search__header">
          <h2>
            Popular searches
          </h2>
        </div>
        <ul class="search-list --popular">
          <li
            v-for="(popularSearch, idx) in popularSearches"
            :key="`popular_search_${idx}`"
            @click="onSuggestionClick(popularSearch, true)"
            class="search-list__item --popular"
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
      class="search-list --suggestion"
    >
      <li
        v-for="(suggestion, idx) in searchSuggestionsFiltered"
        :key="`search_suggestion_${idx}`"
        @click="onSuggestionClick(suggestion, false)"
        class="search-list__item --suggestion"
        :class="{'--active': activeSearchItemId === `search_suggestion_${idx}`}"
      >
        <RouterLink :to="generateLink(suggestion.text)">
          {{ suggestion.text }}
        </RouterLink>
      </li>
    </ul>
    <RouterLink
      v-if="!!searchValue"
      class="check-all-results-link"
      :to="generateLink(searchValue)"
      @click="onCheckAllResultsLinkClick"
    >
      Check all results for "{{ searchValue }}"
    </RouterLink>
  </div>
</template>
<style lang="scss" scoped>
.history-container {
  .my-search {
    margin-bottom: 10px;
    &__header {
      display: flex;
      flex-direction: row;
      margin-bottom: 10px;
      align-items: center;

      .clear-history-button {
        margin-left: auto;
      }
    }
  }

  .popular-search {
    &__header {
      margin-bottom: 10px;
    }
  }
}
.search-list {
  &__item {
    padding: 10px;
    margin: 0;
    display: flex;

    &.--my-search {
      &::before {
        content: "";
        background-image: url("@/assets/icons/recent.png");
        background-repeat: no-repeat;
        background-size: cover;
        height: 20px;
        width: 20px;
        margin-right: 10px;
        background-position: center;
        display: inline-block;
      }
    }

    &.--suggestion {
      &::before {
        content: "";
        background-image: url("@/assets/icons/search.png");
        background-repeat: no-repeat;
        background-size: cover;
        height: 20px;
        width: 20px;
        margin-right: 10px;
        background-position: center;
        display: inline-block;
      }
    }

    > a {
      text-decoration: none;
    }

    &.--active {
      background-color: palette(grey, 600);
    }

    &:hover {
      background-color: palette(grey, 600);
      cursor: pointer;
    }
  }

  &.--popular {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    .search-list__item {
      background-color: palette(grey, 500);
      max-width: 100px;
      display: inline-block;
      text-overflow: ellipsis;
      overflow: hidden;
      border-radius: 20px;
      padding: 5px 10px;

      &:hover {
        background-color: palette(grey, 400);
      }

      > a {
        color: palette(white, base);
      }

      & + .search-list__item {
        margin-left: 5px;
      }
    }
  }
}

.check-all-results-link {
  text-decoration: none;
  padding: 10px;
  display: block;

  &:hover {
    background-color: palette(grey, 600);
  }
}
</style>