import type { Ref } from 'vue';

export default interface IsMobileMenuVisible {
    isMobileMenuVisible: Ref<boolean>
    setIsMobileMenuVisible: (value: boolean) => void
}