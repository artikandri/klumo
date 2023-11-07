
<script lang="ts">
import type { PropType, ButtonHTMLAttributes, ImgHTMLAttributes } from "vue";

export default {
  name: "BaseButton",
  props: {
    type: {
      type: String as PropType<ButtonHTMLAttributes["type"]>,
      default: "button",
    },
    variant: {
      type: String,
      default: "default",
    },
    iconSize: {
      type: String,
      default: "small",
    },
    text: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String as PropType<ImgHTMLAttributes["src"]>,
      default: "",
    },
  },
  computed: {
    iconClass(): string {
      return this.iconSize ? `--${this.iconSize}` : "";
    },
  },
};
</script>
<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="{ '--disabled': disabled, '--has-icon': icon, [`--${variant}`]: variant }"
    class="base-button"
    v-bind="$attrs"
  >
    <div v-show="icon">
      <img
        :src="icon"
        class="svg-icon"
        :class="iconClass"
      />
    </div>
    <span
      v-if="text"
      class="button-text"
    >
      {{  text  }}
    </span>
  </button>
</template>
<style lang="scss" scoped>
.base-button {
  display: flex;
  flex-direction: column;
  border: 0;
  background-color: transparent;
  padding: 10px;
  cursor: pointer;
  opacity: 1;

  &.--default {
    &:hover {
      text-decoration: underline;
      opacity: 0.8;
    }
  }

  &.--clean {
    font-weight: 500;

    &:hover {
      color: darken(palette(cyan, base), 50%);
    }
  }

  &.--has-icon {
    .button-text {
      font-size: 0.75rem;
      margin-top: 5px;
      display: inline-block;
      text-align: center;
    }
  }
}
</style>