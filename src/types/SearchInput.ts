import type { Ref } from 'vue';

export default interface SearchInput {
    searchInput: Ref<{}>
    setSearchInputBlur: () => void
}