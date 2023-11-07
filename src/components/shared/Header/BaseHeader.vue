<script lang="ts">
import { provide, ref } from "vue";
import SearchBar from "@/components/shared/SearchBar/SearchBar.vue";
import BaseButton from "@/components/shared/BaseButton/BaseButton.vue";
import HeaderShortcuts from "@/components/shared/Header/components/HeaderShortcuts.vue";
import HeaderActions from "@/components/shared/Header/components/HeaderActions.vue";

import searchIcon from "@/assets/icons/search.png";
import closeIcon from "@/assets/icons/close.png";
import menuIcon from "@/assets/icons/menu.png";
import cartIcon from "@/assets/icons/cart.png";

export default {
  name: "BaseHeader",
  components: {
    SearchBar,
    BaseButton,
    HeaderShortcuts,
    HeaderActions,
  },
  data() {
    return {
      searchIcon,
      closeIcon,
      menuIcon,
      cartIcon,
      windowWidth: 0,
      key: 0,
      isMobile: true,
    };
  },
  setup() {
    const fullscreen = ref(false);
    const setFullscreen = (value: boolean) => {
      fullscreen.value = value;
    };

    const isMobileMenuVisible = ref(false);
    const setIsMobileMenuVisible = (value: boolean) => {
      isMobileMenuVisible.value = value;
    };

    const isReplaced = ref(false);
    const setIsReplaced = (value: boolean) => {
      isReplaced.value = value;
    };

    provide("fullscreen", { fullscreen, setFullscreen });
    provide("isMobileMenuVisible", {
      isMobileMenuVisible,
      setIsMobileMenuVisible,
    });
    provide("isReplaced", {
      isReplaced,
      setIsReplaced,
    });

    return {
      fullscreen,
      isMobileMenuVisible,
      isReplaced,
      setFullscreen,
      setIsMobileMenuVisible,
      setIsReplaced,
    };
  },
  mounted() {
    this.setWindowWidth();
    if (this.windowWidth > 768) {
      window.addEventListener("scroll", this.onHeaderScroll);
    }
  },
  unmounted() {
    window.removeEventListener("scroll", this.onHeaderScroll);
  },
  methods: {
    setWindowWidth() {
      this.windowWidth = window.innerWidth;
      if (this.windowWidth <= 768) {
        this.setIsReplaced(true);
        this.isMobile = true;
      }
    },
    onHeaderScroll() {
      const hasReachedPoint = window.scrollY >= 100;
      this.setIsReplaced(hasReachedPoint);
    },
    onSearchButtonClick() {
      const base = this.$refs.searchBar as any;
      this.setIsReplaced(false);
      this.setFullscreen(true);
      this.fullscreen = true;
      this.key += 1;
      base && base.setInputFocus(true);
    },
    onToggleButtonClick() {
      this.isMobileMenuVisible = !this.isMobileMenuVisible;
    },
    onCloseButtonClick() {
      this.isMobileMenuVisible = false;
    },
    onClickingOutsideSearchEvent() {
      const base = this.$refs.searchBar as any;
      if (base && base.isHistoryShown) {
        base.setIsHistoryShown(false);
        this.setFullscreen(false);
      }
    },
  },
};
</script>
<template>
  <header
    ref="header"
    class="header-container"
    :key="key"
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
            :icon="menuIcon"
            class="menu-toggle"
            icon-size="2x"
            style="padding: 0; "
            @click="onToggleButtonClick"
          >
          </BaseButton>
        </div>
        <div class="logo-area">
          <RouterLink to="/">
            <img
              src="@/assets/logo.svg"
              class="logo"
              alt="Klumo logo"
            />
          </RouterLink>
        </div>
        <div
          class="search-area"
          v-click-out="onClickingOutsideSearchEvent"
        >
          <div v-if="!isReplaced">
            <SearchBar ref="searchBar" />
          </div>
        </div>
        <div class="actions-area">
          <HeaderActions>
            <template v-slot:searchIcon>
              <BaseButton
                v-if="isReplaced"
                :icon="searchIcon"
                class="search-button"
                text="Search"
                @click="onSearchButtonClick"
              />
            </template>
          </HeaderActions>
        </div>
      </div>
      <div
        class="header__shortcuts"
        :class="{'--mobile' : isMobileMenuVisible, '--down': !isReplaced, '--up': isReplaced }"
      >
        <div
          class="mobile-menu-area"
          v-if="isMobileMenuVisible"
        >

          <BaseButton
            :icon="cartIcon"
            text="Cart"
            variant="clean"
            class="cart-icon --phone-large-only"
          />

          <BaseButton
            :icon="closeIcon"
            text="Close"
            variant="clean"
            @click="onCloseButtonClick"
          />
        </div>
        <div class="shortcuts-list-area">
          <HeaderShortcuts :class="{'--visible' : isMobileMenuVisible}" />
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.header-container {
  position: sticky;
  top: 0;
  left: 0;
}

.header {
  position: relative;
  display: flex;
  flex-direction: column;

  &__slogan {
    background-color: palette(cyan, base);
    display: flex;
    align-items: center;
    justify-content: center;
    height: 37px;
    font-weight: 300;
    border-bottom: 1px solid palette(grey, 600);
  }

  &__content {
    display: flex;
    flex-direction: row;
    padding: 20px $base-space * 5;
    align-items: center;
    width: 100%;
    background-color: palette(white, base);
    border-bottom: 1px solid palette(grey, 600);

    @include media("<=phoneLarge") {
      padding: 20px $base-space * 3;
    }
    .menu-area {
      display: none;

      @include media("<=tablet") {
        display: block;
        flex-shrink: 0;
        z-index: 1;
      }
    }

    .logo-area {
      flex-shrink: 0;
      z-index: 1;

      .logo {
        height: 40px;

        @include media("<=phoneLarge") {
          height: 30px;
        }
      }
    }

    .search-area {
      margin-left: auto;
      margin-right: auto;
      width: 100%;
      z-index: 2;
    }

    .actions-area {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 16px;
      margin-left: auto;
      flex-shrink: 0;
      z-index: 1;

      .search-button {
        @include media(">tablet") {
          display: none;
        }
      }
    }
  }

  &__shortcuts {
    width: 100%;
    transition: margin-top 0.3s ease 0s, background-color 0.3s ease-out 0s;
    border-bottom: 1px solid palette(grey, 600);

    .cart-icon {
      display: none;

      @include media("<=phoneLarge") {
        display: block;
      }
    }
    .mobile-menu-area {
      text-align: right;
      padding: 20px;
      display: flex;
      justify-content: flex-end;
    }

    @include media("<=tablet") {
      border-bottom: 0;
    }

    &.--down {
      margin-top: 0;
      background-color: palette(white, base);
    }

    &.--up {
      border-bottom: 0;
      margin: -80px auto 0;
      background-color: transparent;
      z-index: 0;
    }

    &.--mobile {
      height: 100vh;
      width: 100vw;
      display: block;
      position: fixed;
      top: 80px;
      left: 0;
      z-index: 10;
      background: palette(white, base);

      .shortcuts-list-area {
        z-index: 11;
        position: relative;
      }
    }
  }
}
</style>