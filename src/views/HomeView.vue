<script setup lang="ts">
import MainLayout from "@/layouts/MainLayout.vue";
import ipsum from "@/mocks/json/lorem/ipsum.json";
</script>

<template>
  <MainLayout>
    <div class="content">
      <p>
        Home
      </p>
      <p>
        {{ ipsum.text.repeat(100) }}}
      </p>
    </div>
  </MainLayout>
</template>
