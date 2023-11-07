<script setup lang="ts">
import { ref, inject } from "vue";
import router from "@/router/index";
import type IsMobileMenuVisible from "@/types/IsMobileMenuVisible";

// inject
const { isMobileMenuVisible, setIsMobileMenuVisible } = inject(
  "isMobileMenuVisible"
) as IsMobileMenuVisible;

const popularUrls = ref([
  {
    url: "/collections/posters",
    text: "Posters",
  },
  {
    url: "/collections/bestseller-posters",
    text: "Bestsellers",
  },
  {
    url: "/collections/new-arrival-posters",
    text: "New Arrivals",
  },
]);

const onUrlClick = (url: string = "") => {
  url && router.push(url);
  setIsMobileMenuVisible(false);
};
</script>

<template>
  <div class="shortcuts-list-container">
    <ul
      class="shortcuts-list"
      :class="{'--mobile': isMobileMenuVisible }"
    >
      <li
        class="shortcuts-list__item"
        v-for="(popularUrl, idx) in popularUrls"
        :key="`popular_url_${idx}`"
        @click="onUrlClick(popularUrl.url)"
      >
        {{ popularUrl.text }}
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.shortcuts-list-container {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.shortcuts-list {
  padding: 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 16px;
  text-align: center;

  &__item {
    > a {
      text-decoration: none;
    }

    &:hover {
      cursor: pointer;
      color: darken(palette(cyan, base), 50%);
    }
  }

  &.--mobile {
    .shortcuts-list__item {
      font-weight: 600;
      display: block;
      padding: 10px 0;
      width: 100%;

      &:hover {
        background-color: palette(grey, 800);
        cursor: pointer;
      }

      &:not(:last-child) {
        border-bottom: 1px solid palette(grey, 600);
      }
    }
  }

  @include media("<=tablet") {
    flex-direction: column;
    display: none;

    &.--mobile {
      display: flex;
      text-align: left;
      align-items: start;
      justify-content: flex-start;
      width: 100%;
      gap: 0;
    }
  }
}
</style>