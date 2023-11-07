<script setup lang="ts">
import BaseHeader from "../components/shared/Header/BaseHeader.vue";
</script>
<template>
  <div class="layout --body1">
    <div class="header-area">
      <BaseHeader />
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
  min-height: 150vh;

  @include media("<=tablet") {
    padding-top: $base-space * 12;
  }

  @include media("<=phoneLarge") {
    padding: $base-space * 3;
    padding-top: $base-space * 12;
  }

  // for scrolling purpose:
  background-color: palette(grey, 800);
}
</style>