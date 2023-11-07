import type { Ref } from 'vue';

export default interface IsHistoryShown {
  isHistoryShown: Ref<boolean>
  setIsHistoryShown: (value: boolean) => void
}