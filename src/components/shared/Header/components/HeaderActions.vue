<script lang="ts">
import BaseButton from "@/components/shared/BaseButton/BaseButton.vue";

import wishlistIcon from "@/assets/icons/wishlist.png";
import accountIcon from "@/assets/icons/account.png";
import cartIcon from "@/assets/icons/cart.png";

export default {
  components: {
    BaseButton,
  },
  data() {
    return {
      wishlistIcon,
      accountIcon,
      cartIcon,
    };
  },
};
</script>

<template>
  <div class="header-actions">
    <slot name="searchIcon" />
    <BaseButton
      :icon="wishlistIcon"
      text="Wishlist"
    />
    <BaseButton
      :icon="accountIcon"
      text="Account"
    />
    <BaseButton
      :icon="cartIcon"
      text="Cart"
    />
  </div>
</template>

<style lang="scss" scoped>
.header-actions {
  display: flex;
  flex-direction: row;

  @include media("<=phoneLarge") {
    > * {
      display: none;
    }
  }
}
</style>