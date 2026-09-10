<template>
  <div class="search-bar-wrap">
    <v-autocomplete
      v-model="subreddit"
      v-model:search="searchQuery"
      v-model:menu="isMenuOpen"
      :items="subredditItems"
      :loading="loading"
      clearable
      label="Search subreddit"
      hide-details
      @keyup.enter="search"
      @focus="handleFocus"
      @update:search="handleSearchUpdate"
    >
      <template #prepend-inner>
        <span class="prefix-label">r/</span>
      </template>
      <template #append-inner>
        <v-btn
          color="primary"
          icon
          size="small"
          title="Search"
          :disabled="!searchQuery"
          @click="search"
        >
          <v-icon>fa-solid fa-magnifying-glass</v-icon>
        </v-btn>
      </template>
    </v-autocomplete>

    <div class="sort-chips mt-2">
      <span class="text-caption text-medium-emphasis me-2">Sort:</span>
      <v-chip
        v-for="s in sortOptions"
        :key="s"
        size="small"
        class="me-1"
        :color="sortOption === s ? 'primary' : undefined"
        :variant="sortOption === s ? 'flat' : 'outlined'"
        @click="updateSort(s)"
      >
        {{ s }}
      </v-chip>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useGalleryStore } from '@/stores/gallery'
import { debounce } from 'lodash'

const props = defineProps({
  subreddit: { type: String, default: '' },
  sortOption: { type: String, default: 'hot' },
})

const emit = defineEmits(['update:subreddit', 'update:sortOption', 'search', 'reset'])

const galleryStore = useGalleryStore()

const subreddit = ref(props.subreddit)
const searchQuery = ref(props.subreddit)
const sortOption = ref(props.sortOption)
const subredditItems = ref([])
const loading = ref(false)
const isMenuOpen = ref(false)
const justSearched = ref(false)

const sortOptions = ['hot', 'new', 'top', 'rising']

watch(() => props.subreddit, (newValue) => {
  subreddit.value = newValue
  searchQuery.value = newValue
})

watch(() => subreddit.value, (newValue) => {
  if (newValue && newValue !== searchQuery.value) {
    searchQuery.value = newValue
    isMenuOpen.value = false
    justSearched.value = true
  }
})

watch(() => props.sortOption, (newValue) => {
  sortOption.value = newValue
})

const search = () => {
  emit('update:subreddit', searchQuery.value)
  emit('search')
  isMenuOpen.value = false
  justSearched.value = true
}

const handleFocus = () => {
  justSearched.value = false
}

const handleSearchUpdate = (newValue) => {
  if (newValue !== searchQuery.value) {
    justSearched.value = false
  }
}

const updateSort = (sort) => {
  sortOption.value = sort
  emit('update:sortOption', sort)
}

const fetchSubredditSuggestions = async (query) => {
  if (!query || query.length < 2) {
    subredditItems.value = []
    return
  }
  loading.value = true
  subredditItems.value = await galleryStore.searchSubreddits(query)
  if (!justSearched.value) {
    isMenuOpen.value = subredditItems.value.length > 0
  }
  loading.value = false
}

const debouncedSearch = debounce(fetchSubredditSuggestions, 300)

watch(searchQuery, (newValue) => {
  if (newValue !== subreddit.value) {
    debouncedSearch(newValue)
  }
})
</script>

<style scoped>
.search-bar-wrap {
  padding: 8px 0 4px;
}

.prefix-label {
  font-size: 14px;
  color: rgba(var(--v-theme-on-surface), 0.6);
  margin-right: 2px;
  line-height: 1;
}

.sort-chips {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
</style>
