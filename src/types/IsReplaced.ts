import type { Ref } from 'vue';

export default interface IsReplaced {
  isReplaced: Ref<boolean>
  setIsReplaced: (value: boolean) => void
}