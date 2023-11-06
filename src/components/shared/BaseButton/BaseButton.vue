
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
      default: "Button",
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
    class="button"
  >
    <div v-show="icon">
      <img
        :src="icon"
        class="svg-icon"
        alt="icon"
      />
    </div>

    {{  text  }}
    <slot />
  </button>
</template>