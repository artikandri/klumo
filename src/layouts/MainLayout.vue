<script setup lang="ts">
import Header from "@/components/shared/Header/Header.vue";
</script>
<template>
  <div class="layout">
    <div class="header-area">
      <Header />
    </div>
    <div class="content-area">
      <slot />
    </div>
  </div>
</template>
<style lang="scss" scoped>
$gap-width: $base-space * 5;
.layout {
  display: grid;
  grid-template-rows: auto 1fr;
  align-items: start;
}

.header-area {
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 1;
}

.content-area {
  position: relative;
  z-index: 0;
  padding: $gap-width;

  @include media("<=tablet") {
    padding-top: $base-space * 12;
  }

  // for scrolling purpose:
  background-color: palette(grey, 800);
}
</style>