import type { Ref } from 'vue';

export default interface Fullscreen {
  fullscreen: Ref<boolean>
  setFullscreen: (value: boolean) => void
}