
<script lang="ts">
import type { PropType, ButtonHTMLAttributes, ImgHTMLAttributes } from "vue";

export default {
  name: "BaseButton",
  props: {
    type: {
      type: String as PropType<ButtonHTMLAttributes["type"]>,
      default: "button",
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
};
</script>
<template>
  <button
    :type="type"
    :disabled="disabled"
    class="base-button"
  >
    <div v-show="icon">
      <img
        :src="icon"
        class="svg-icon"
      />
    </div>
    {{  text  }}
  </button>
</template>
<style lang="scss" scoped>
.base-button {
  border: 0;
  background-color: transparent;

  &:hover {
    background-color: palette(grey, 600);
    text-decoration: underline;
  }
}
</style>