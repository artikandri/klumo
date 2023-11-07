<script setup lang="ts">
import { ref, onMounted, computed, provide, inject } from "vue";
import router from "@/router/index";
import { useSearchHistory } from "@/stores/search";
import { toKebabCase, randomValue } from "@/utilities/utils";
import BaseButton from "@/components/shared/BaseButton/BaseButton.vue";
import SearchHistory from "./components/SearchHistory.vue";
import closeIcon from "@/assets/icons/close.png";

// store
const { addMySearchHistory, setAllMySearchesInactive, addSuggestions } =
  useSearchHistory();

// inject
const { fullscreen, setFullscreen } = inject("fullscreen");

// data
const isHistoryShown = ref(false);
const isFocused = ref(false);
const searchValue = ref("");
const placeholder = ref("");
let isBlinking = ref(false);
const searchInput = ref("searchInput");

// provide
provide("searchValue", {
  searchValue,
  setSearchValue: (value: string) => {
    searchValue.value = value;
  },
});
provide("isHistoryShown", {
  isHistoryShown,
  setIsHistoryShown: (value: boolean) => {
    isHistoryShown.value = value;
  },
});

// static
const placeholderText = "Search for designs";
const placeholderTextOptions = ["designs", "artworks", "brands", "pictures"];

// mounted
onMounted(() => {
  startTypingEffect();
});

// methods
const goToSearchPage = () => {
  router.push(`/search/${toKebabCase(searchValue.value)}`);
};
const onSearchInputFocus = () => {
  isFocused.value = true;
  setFullscreen(true);
  isHistoryShown.value = true;
};
const onSearchInputBlur = () => {
  isFocused.value = false;
};
const onSearchInputEnter = (event: any) => {
  if (searchValue.value) {
    addMySearchHistory(searchValue.value);
    addSuggestions(searchValue.value);
    goToSearchPage();
    isHistoryShown.value = false;
    setFullscreen(false);
    event.target.blur();
    setAllMySearchesInactive();
  }
};
const onCancelButtonClick = () => {
  isHistoryShown.value = false;
  setFullscreen(false);
  searchValue.value = "";
};
const onDeleteButtonClick = () => {
  searchValue.value = "";
  isBlinking.value = false;
};
const onUpdateSearchValueEvent = () => {
  isHistoryShown.value = false;
  isFocused.value = false;
  setFullscreen(false);
  searchInput.value.blur();
  setAllMySearchesInactive();
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
</script>
<template>
  <div
    class="search-bar"
    :class="[fullscreen ? '--fullscreen' : '']"
  >
    <div class="search-bar__container">
      <div class="search-bar-border">
        <img
          src="@/assets/icons/search.png"
          alt="search"
          class="svg-icon"
        />
        <input
          :autofocus="fullscreen"
          type="search"
          ref="searchInput"
          autocomplete="off"
          spellcheck="false"
          v-model.trim="searchValue"
          @focus="onSearchInputFocus"
          @blur="onSearchInputBlur"
          @keydown.enter="onSearchInputEnter"
          :placeholder="isFocused && !searchValue ? placeholderText : ''"
        />
        <span
          class="placeholder-imitation"
          :class="{'--blinking': isBlinking, '--visible': !isFocused && !searchValue }"
          ref="placeholderImitation"
        >Search for {{ placeholder  }}</span>
        <BaseButton
          v-if="searchValue"
          :icon="closeIcon"
          class="delete-button"
          text=""
          @click="onDeleteButtonClick"
        />
      </div>

      <BaseButton
        v-show="fullscreen"
        text="Cancel"
        class="cancel-button"
        @click="onCancelButtonClick"
      />
    </div>
    <div
      v-show="isHistoryShown"
      class="search-bar__history"
    >
      <SearchHistory @update:searchValue="onUpdateSearchValueEvent" />
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
  position: relative;

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
    display: flex;
    flex-direction: row;
    position: relative;
    z-index: 1;
    .search-bar-border {
      background-color: palette(gray, 900);
      margin-bottom: 0px;
      border: 1px solid palette(black, 100);
      box-sizing: border-box;
      border-radius: 20px;
      height: 40px;
      display: flex;
      flex-direction: row;
      width: calc(100% - 50px);
    }

    .cancel-button {
      @include media(">tablet") {
        display: none;
      }
    }

    input {
      display: block;
      width: calc(100% - 50px);
      border: 0px;
      margin: 0px;
      line-height: 24px;
      outline: none;
      background-color: transparent;
      padding: 8px 16px;
      padding-left: 16px;
      font-size: 1rem;
      color: palette(black, base);
      z-index: 1;
      position: relative;

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
      z-index: 0;

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
    padding: 50px 20px 20px;
    display: block;
    border: 1px solid #ddd;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 0;
    width: 100%;

    .background {
      height: 100vh;
      width: 100vw;
      background: transparent;
      z-index: 1;
      position: absolute;
      left: 0;
      top: 0;
      display: block;
    }
  }
}
</style>