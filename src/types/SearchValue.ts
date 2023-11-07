import type { Ref } from 'vue';

export default interface SearchValue {
    searchValue: Ref<string>
    setSearchValue: (value: string) => void
}