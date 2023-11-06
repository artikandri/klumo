<script lang="ts">
import SearchBar from "@/components/shared/SearchBar/SearchBar.vue";
import BaseButton from "@/components/shared/BaseButton/BaseButton.vue";
import HeaderShortcuts from "@/components/shared/Header/components/HeaderShortcuts.vue";

import wishlistIcon from "@/assets/icons/wishlist.png";
import accountIcon from "@/assets/icons/account.png";
import cartIcon from "@/assets/icons/cart.png";
import searchIcon from "@/assets/icons/search.png";
import closeIcon from "@/assets/icons/close.png";

export default {
  name: "Header",
  components: {
    SearchBar,
    BaseButton,
    HeaderShortcuts,
  },
  data() {
    return {
      accountIcon,
      cartIcon,
      wishlistIcon,
      searchIcon,
      closeIcon,
      isReplaced: false,
      isFullscreen: false,
      isMobileMenuVisible: false,
    };
  },
  mounted() {
    window.addEventListener("scroll", this.onHeaderScroll);
  },
  unmounted() {
    window.removeEventListener("scroll", this.onHeaderScroll);
  },
  methods: {
    onHeaderScroll() {
      const hasReachedPoint = window.scrollY >= 100;
      this.isReplaced = hasReachedPoint;
    },
    onSearchButtonClick() {
      this.isReplaced = false;
      this.isFullscreen = true;
    },
    onToggleButtonClick() {
      this.isMobileMenuVisible = !this.isMobileMenuVisible;
    },
    onCloseButtonClick() {
      this.isMobileMenuVisible = false;
    },
    onFullscreenEventChange(fullscreen: boolean) {
      this.isFullscreen = fullscreen;
    },
  },
};
</script>
<template>
  <header
    ref="header"
    class="header-container"
    :class="{'--fixed': isReplaced }"
  >
    <div class="header">
      <div class="header__slogan">
        <p>
          Free delivery until end of November
        </p>
      </div>
      <div class="header__content">
        <div class="menu-area">
          <BaseButton
            class="menu-toggle"
            @click="onToggleButtonClick"
          >
            <span
              aria-hidden="true"
              class="icon-menu"
            ></span><span class="menu-toggle-text"> menu</span>
          </BaseButton>
        </div>
        <div class="logo-area">
          <img
            src="@/assets/logo.svg"
            class="logo"
            alt="Klumo logo"
          />
        </div>
        <div class="search-area">
          <div v-show="!isReplaced">
            <SearchBar
              ref="searchBar"
              :fullscreen="isFullscreen"
              @fullscreen="onFullscreenEventChange"
            />
          </div>
        </div>
        <div class="actions-area">
          <BaseButton
            v-if="isReplaced"
            :icon="searchIcon"
            text="Search"
            @click="onSearchButtonClick"
          />
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
      </div>
      <div
        class="header__shortcuts"
        :class="{'--mobile' : isMobileMenuVisible, '--visible': !isReplaced, '--hidden': isReplaced }"
      >
        <HeaderShortcuts :class="{'--visible' : isMobileMenuVisible}" />
        <BaseButton
          v-if="isMobileMenuVisible"
          :icon="closeIcon"
          text="Close"
          @click="onCloseButtonClick"
        />
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.header-container {
  position: fixed;
  width: 100%;
}

.header {
  position: relative;
  display: flex;
  flex-direction: column;

  &__slogan {
    background-color: palette(cyan, base);
    display: block;
    text-align: center;
    height: 37px;
    font-weight: 300;
  }

  &__content {
    display: flex;
    flex-direction: row;
    padding: 0 16px;

    .menu-area {
      display: none;
      @include media("<=tablet") {
        display: block;
      }
    }

    .logo {
      height: 40px;
    }

    .search-area {
      margin-left: auto;
      margin-right: auto;
      width: 100%;
    }

    .actions-area {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 16px;
      margin-left: auto;
    }
  }

  &__shortcuts {
    width: 100%;
    transition: margin-top 0.3s ease 0s;

    &.--visible {
      margin-top: 0;
    }

    &.--hidden {
      margin-top: -57px;
    }

    &.--mobile {
      height: 100vh;
      width: 100vh;
      display: block;
      position: fixed;
      top: 0;
      left: 0;
    }

    .shortcuts-list {
      display: flex;
      flex-direction: row;
      justify-content: center;
      gap: 8px;

      @include media("<=tablet") {
        flex-direction: column;
        display: none;

        &.--visible {
          display: block;
        }
      }
    }
  }
}
</style>