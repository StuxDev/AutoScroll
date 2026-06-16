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
              <v-icon size="36" color="grey-darken-1">mdi-image-broken-variant</v-icon>
            </div>
          </template>
        </v-img>

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
  if (post.postData.thumbnail && post.postData.thumbnail.startsWith('http')) {
    return post.postData.thumbnail
  }
  if ((post.mediaType === 'video' || post.mediaType === 'embed') && post.postData.preview?.images?.[0]?.source?.url) {
    return post.postData.preview.images[0].source.url.replace(/&amp;/g, '&')
  }
  if (post.mediaType === 'album') return post.images[0]
  if (post.mediaType === 'image') return post.postData.url
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
  align-items: center;
  justify-content: center;
  background: #2a2a2a;
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
}

.load-more-spinner {
  display: flex;
  justify-content: center;
  padding: 32px 0;
}
</style>
