<template>
  <v-container fluid class="px-md-4">
    <SearchBar
      v-model:sort-option="galleryStore.sortOption"
      v-model:subreddit="galleryStore.subreddit"
      @reset="galleryStore.resetSearch"
      @search="galleryStore.fetchRedditImages(true)"
    />

    <NSFWAlert
      v-model:is-open="galleryStore.isNSFWDialogOpen"
      @accept="galleryStore.acceptNSFW"
      @decline="galleryStore.declineNSFW"
    />

    <v-alert
      v-if="galleryStore.error"
      type="error"
      class="mt-3"
    >{{ galleryStore.error }}</v-alert>

    <EmptyState
      v-if="showEmptyState"
      @select="selectSuggestion"
    />

    <ImageGridSkeleton v-if="galleryStore.fetchingImages && galleryStore.posts.length === 0" />

    <ImageGrid
      v-if="!showEmptyState"
      :agreed-to-n-s-f-w="galleryStore.agreedToNSFW"
      :fetching-images="galleryStore.fetchingImages"
      :posts="galleryStore.visiblePosts"
      @select-image="galleryStore.setOverlayImage"
      @load-more="galleryStore.fetchRedditImages"
    />

    <MediaOverlay
      v-model="galleryStore.imageOverlay"
      :current-post="galleryStore.currentPost"
      :current-image-index="galleryStore.currentImageIndex"
      :has-next="galleryStore.hasNext"
      :has-previous="galleryStore.hasPrevious"
      :is-playing="galleryStore.isPlaying"
      @go-to-link="galleryStore.goToLink"
      @next-image="galleryStore.nextImage"
      @prev-image="galleryStore.prevImage"
      @skip-post="galleryStore.skipPost"
      @stop-slideshow="galleryStore.stopSlideshow"
      @toggle-slideshow="galleryStore.toggleSlideshow"
      @media-ended="galleryStore.handleMediaEnded"
    />

    <ProxyPromptDialog />
  </v-container>
</template>

<script setup>
import { computed } from 'vue'
import { useGalleryStore } from '@/stores/gallery'
import { useRoute } from 'vue-router'
import { watch } from 'vue'

const galleryStore = useGalleryStore()
const route = useRoute()

if (route.params.subreddit) {
  galleryStore.subreddit = route.params.subreddit
}
if (route.query.type) {
  galleryStore.sortOption = route.query.type
}

const showEmptyState = computed(() =>
  !galleryStore.subreddit &&
  galleryStore.visiblePosts.length === 0 &&
  !galleryStore.fetchingImages
)

const selectSuggestion = (sub) => {
  galleryStore.subreddit = sub
  galleryStore.fetchRedditImages(true)
}

watch(() => galleryStore.currentIndex, (newValue) => {
  if (
    galleryStore.visiblePosts.length > 0 &&
    newValue >= galleryStore.visiblePosts.length - 6 &&
    !galleryStore.fetchingImages &&
    !galleryStore.error
  ) {
    galleryStore.fetchRedditImages()
  }
})
</script>
