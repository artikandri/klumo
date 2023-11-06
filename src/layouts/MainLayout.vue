<script setup lang="ts">
import Header from "@/components/shared/Header/Header.vue";
</script>
<template>
  <div class="layout">
    <div class="header-area">
      <Header />
    </div>
    <slot />
  </div>
</template>
<style lang="scss" scoped>
$gap-width: $base-space * 7;
.layout {
  display: grid;
  grid-template-columns: $sidebarMenuWidth $gap-width 1fr $gap-width;
  grid-template-rows: auto auto minmax(0, 1fr) $base-space * 2 auto;
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  transition: 0.4s ease-in-out;
  min-height: 100vh;

  // for scrolling purpose:
  height: 150vh;
}

.header-area {
  grid-area: 1 / 1 / 2 / 6;
}
</style>