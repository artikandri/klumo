<script setup lang="ts">
import { ref, onMounted, computed, defineEmits, defineProps, watch } from "vue";
import router from "@/router/index";
import { useSearchHistory } from "@/stores/search";
import { toKebabCase, randomValue } from "@/utilities/utils";
import BaseButton from "@/components/shared/BaseButton/BaseButton.vue";

// store
const { searchHistory, searchSuggestions, addMySearchHistory } =
  useSearchHistory();

// props
const props = defineProps({
  fullscreen: Boolean,
});

// emits
const emit = defineEmits(["fullscreen"]);

// data
const isHistoryShown = ref(false);
const isFocused = ref(false);
const searchValue = ref("");
const placeholder = ref("");
const searchBarKey = ref(1);
let isBlinking = ref(false);

// consts
const placeholderText = "Search for designs";
const placeholderTextOptions = ["designs", "artworks", "brands", "pictures"];

// computed
const searchSuggestionsFiltered = computed(() => {
  return searchSuggestions.filter((s) => s.text.includes(searchValue.value));
});
const isFullscreen = computed(() => {
  return props.fullscreen;
});

// methods
const onSearchInputFocus = () => {
  isFocused.value = true;
  isHistoryShown.value = true;
  emit("fullscreen", true);
};
const onSearchInputBlur = () => {
  isFocused.value = false;
};
const onSearchInputEnter = () => {
  addMySearchHistory(searchValue.value);
  router.push(`/search/${toKebabCase(searchValue.value)}`);
};
const onClearHistoryButtonClick = () => {
  searchHistory.mySearches = [];
};
const onCancelButtonClick = () => {
  isHistoryShown.value = false;
  emit("fullscreen", false);
};
const startDeletionEffect = (text: string) => {
  let currentText = text;
  let index = text.length - 1;
  const deletionEffect = setInterval(() => {
    if (index >= 0) {
      currentText = currentText.slice(0, index);
      index--;
    } else {
      clearInterval(deletionEffect);
    }
    placeholder.value = currentText;
  }, randomValue(100, 200));
};
const startTypingEffect = () => {
  let currentTextIndex = 0;
  const texts = placeholderTextOptions;

  function typeText() {
    let currentText = "";
    let index = 0;
    const typingEffect = setInterval(function () {
      const text = texts[currentTextIndex];
      if (index < text.length) {
        currentText += text[index];
        index++;
      }

      if (index === text.length) {
        clearInterval(typingEffect);
        isBlinking.value = true;
        setTimeout(() => {
          startDeletionEffect(currentText);
        }, 2000);
        setTimeout(() => {
          typeText();
          index = 0;
          currentText = "";
          isBlinking.value = false;
        }, 4000);
        currentTextIndex += 1;
      }
      if (currentTextIndex >= texts.length) {
        currentTextIndex = 0;
      }
      placeholder.value = currentText;
    }, randomValue(100, 200));
  }

  typeText();
};

// mounted
onMounted(() => {
  startTypingEffect();
});
</script>
<template>
  <div
    class="search-bar"
    :key="searchBarKey"
    :class="[isFullscreen ? '--fullscreen' : '']"
  >
    <div class="search-bar__container">
      <input
        :autofocus="isFullscreen"
        type="search"
        ref="searchInput"
        class="imitatefocus"
        autocomplete="off"
        spellcheck="false"
        v-model.trim="searchValue"
        @focus="onSearchInputFocus"
        @blur="onSearchInputBlur"
        @keydown.enter="onSearchInputEnter"
        :placeholder="isFocused ? placeholderText : ''"
      />
      <span
        class="placeholder-imitation"
        :class="{'--blinking': isBlinking, '--visible': !isFocused }"
        ref="placeholderImitation"
      >Search for {{ placeholder  }}</span>
      <BaseButton
        v-if="isFullscreen"
        text="Cancel"
        @click="onCancelButtonClick"
      />
    </div>
    <div class="search-bar__history">
      <div
        v-show="isHistoryShown"
        class="history-container"
      >
        <div>
          <div>
            <h2>
              Your search history
            </h2>
            <BaseButton
              @click="onClearHistoryButtonClick"
              text="Clear history"
            >
            </BaseButton>
          </div>
          <ul v-if="!searchValue">
            <li
              v-for="(mySearch, idx) in searchHistory.mySearches"
              :key="`my_search_${idx}`"
            >
              {{ mySearch.text }}
            </li>
          </ul>
          <ul v-else>
            <li
              v-for="(suggestion, idx) in searchSuggestionsFiltered"
              :key="`search_suggestion_${idx}`"
            >
              {{  suggestion.text }}
            </li>
          </ul>
        </div>
        <div>
          <h2>
            Popular searches
          </h2>
          <ul>
            <li
              v-for="(popularSearch, idx) in searchHistory.popularSearches"
              :key="`popular_search_${idx}`"
            >
              {{ popularSearch.text }}
            </li>
          </ul>
        </div>
      </div>

    </div>
  </div>
</template>
<style lang="scss" scoped>
@keyframes blink {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.search-bar {
  padding: 0 16px;

  @include media("<=tablet") {
    &.--fullscreen {
      display: block;
      position: fixed;
      height: 100vh;
      width: 100vw;
      left: 0;
      top: 0;
    }
  }

  &__container {
    background-color: palette(gray, 900);
    margin-bottom: 0px;
    border: 1px solid palette(black, 100);
    box-sizing: border-box;
    border-radius: 20px;
    height: 40px;
    position: relative;

    input {
      display: block;
      width: 100%;
      border: 0px;
      margin: 0px;
      line-height: 24px;
      outline: none;
      background-color: transparent;
      padding: 8px 16px;
      padding-left: 16px;
      font-size: 1rem;
      color: palette(black, base);

      &::focus + .placeholder-imitation {
        display: none;
      }
    }

    .placeholder-imitation {
      position: relative;
      display: none;
      position: absolute;
      top: 25%;
      left: 12px;
      font-size: 1rem;

      &.--visible {
        display: inline-block;
      }

      &.--blinking {
        &::after {
          content: "";
          position: absolute;
          right: -2px;
          width: 1px;
          height: 1rem;
          background-color: gray;
          top: 10%;
          animation-name: blink;
          animation-duration: 1000ms;
          animation-iteration-count: infinite;
          opacity: 1;
        }
      }
    }
  }

  &__history {
    background: palette(white, base);
  }
}
</style>