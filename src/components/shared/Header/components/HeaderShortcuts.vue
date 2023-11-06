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
  <ul class="shortcuts-list">
    <li
      v-for="(popularUrl, idx) in popularUrls"
      :key="`popular_url_${idx}`"
    >
      <RouterLink :to="popularUrl.url"> {{ popularUrl.text }}</RouterLink>
    </li>
  </ul>
</template>