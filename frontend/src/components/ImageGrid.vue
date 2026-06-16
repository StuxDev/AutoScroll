<template>
  <div class="image-grid-wrap">
    <div v-if="posts.length > 0" class="image-grid">
      <div
        v-for="post in postsWithIndex"
        :key="post.postData.id"
        class="grid-card"
        @click="$emit('selectImage', post.originalIndex)"
      >
        <v-img
          :aspect-ratio="1"
          :src="getThumbnail(post)"
          cover
          class="grid-img"
        >
          <template #error>
            <div class="img-error">
              <v-icon size="28" color="grey-darken-1" class="mb-2">mdi-image-off-outline</v-icon>
              <p class="img-error-title">{{ post.postData.title }}</p>
            </div>
          </template>
        </v-img>

        <!-- NSFW badge (top-left) -->
        <div v-if="post.postData.over_18" class="nsfw-badge">NSFW</div>

        <!-- Media type badge (top-right) -->
        <div v-if="post.mediaType === 'album'" class="media-badge">
          <v-icon size="12" color="white">mdi-image-multiple</v-icon>
          <span>{{ post.images.length }}</span>
        </div>
        <div v-else-if="post.mediaType === 'video'" class="media-badge">
          <v-icon size="12" color="white">mdi-play</v-icon>
        </div>
        <div v-else-if="post.mediaType === 'embed'" class="media-badge">
          <v-icon size="12" color="white">mdi-youtube</v-icon>
        </div>

        <!-- Hover overlay -->
        <div class="card-overlay">
          <p class="overlay-title">{{ post.postData.title }}</p>
          <div class="overlay-meta">
            <span>
              <v-icon size="12">mdi-arrow-up</v-icon>
              {{ formatScore(post.postData.score) }}
            </span>
            <span class="ms-2">
              <v-icon size="12">mdi-comment-outline</v-icon>
              {{ formatScore(post.postData.num_comments) }}
            </span>
            <span v-if="post.postData.author" class="ms-2 overlay-author">
              u/{{ post.postData.author }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading spinner for infinite scroll -->
    <div v-if="fetchingImages && posts.length > 0" class="load-more-spinner">
      <v-progress-circular :size="36" :width="3" color="primary" indeterminate />
    </div>

    <v-fab
      v-if="showBackToTop"
      icon="mdi-arrow-up"
      class="ma-4 mb-12"
      location="bottom end"
      fixed
      @click="scrollToTop"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'

const props = defineProps({
  posts: { type: Array, default: () => [] },
  agreedToNSFW: Boolean,
  fetchingImages: Boolean,
})

const emit = defineEmits(['selectImage', 'loadMore'])

const showBackToTop = ref(false)

const formatScore = (n) => {
  if (!n && n !== 0) return '0'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return n.toString()
}

const getThumbnail = (post) => {
  // Prefer Reddit's sized preview images — these are CDN URLs at a reasonable
  // resolution (320–640px), load fast, and exist for all media types.
  const previewImg = post.postData.preview?.images?.[0]
  if (previewImg) {
    // Pick the smallest resolution that is still at least 320px wide.
    const res = previewImg.resolutions?.find(r => r.width >= 320)
      ?? previewImg.resolutions?.at(-1)
      ?? previewImg.source
    if (res?.url) return res.url.replace(/&amp;/g, '&')
  }

  // Reddit low-res thumbnail (reliable fallback, ~70–140px).
  if (post.postData.thumbnail?.startsWith('http')) {
    return post.postData.thumbnail
  }

  // Album: first pre-processed image URL from media_metadata.
  if (post.mediaType === 'album' && post.images?.[0]) return post.images[0]

  // Standard image: direct URL (only when no preview is available).
  if (post.mediaType === 'image' && post.postData.url) return post.postData.url

  return ''
}

const postsWithIndex = computed(() =>
  props.posts.map((post, index) => ({ ...post, originalIndex: index }))
)

const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const clientHeight = window.innerHeight
  const scrollHeight = document.documentElement.scrollHeight

  if (props.posts.length > 0 && scrollTop + clientHeight >= scrollHeight - 600 && !props.fetchingImages) {
    emit('loadMore')
  }
  showBackToTop.value = scrollTop > 300
}

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped>
.image-grid-wrap {
  padding: 8px;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 10px;
}

.grid-card {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  background: #1e1e1e;
}

.grid-card:hover .card-overlay {
  opacity: 1;
}

.grid-img {
  display: block;
  width: 100%;
  transition: transform 0.2s ease;
}

.grid-card:hover .grid-img {
  transform: scale(1.03);
}

.img-error {
  width: 100%;
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #2a2a2a;
  padding: 12px;
}

.img-error-title {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
  text-align: center;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
}

.media-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.75);
  border-radius: 12px;
  padding: 3px 7px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: white;
  font-weight: 600;
  line-height: 1;
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.88) 0%, transparent 55%);
  opacity: 0;
  transition: opacity 0.18s ease;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 12px;
}

.overlay-title {
  font-size: 12px;
  font-weight: 500;
  color: #fff;
  line-height: 1.4;
  margin: 0 0 4px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.overlay-meta {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.75);
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 2px;
}

.overlay-author {
  opacity: 0.6;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.nsfw-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: #FF4500;
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 10px;
  font-weight: 700;
  color: white;
  letter-spacing: 0.5px;
  z-index: 2;
}

.load-more-spinner {
  display: flex;
  justify-content: center;
  padding: 32px 0;
}
</style>
