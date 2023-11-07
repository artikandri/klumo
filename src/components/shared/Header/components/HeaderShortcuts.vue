<script setup lang="ts">
import { ref } from "vue";
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
</script>

<template>
  <div class="shortcuts-list-area">
    <ul class="shortcuts-list">
      <li
        v-for="(popularUrl, idx) in popularUrls"
        :key="`popular_url_${idx}`"
      >
        <RouterLink :to="popularUrl.url"> {{ popularUrl.text }}</RouterLink>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.shortcuts-list-area {
  width: 100%;
  padding: 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.shortcuts-list {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 8px;
  text-align: center;

  @include media("<=tablet") {
    flex-direction: column;
    display: none;

    &.--visible {
      display: block;
    }
  }
}
</style>