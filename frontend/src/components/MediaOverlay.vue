<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    :scrim="false"
    transition="dialog-bottom-transition"
    @after-leave="close"
    @keydown.esc="close"
  >
    <v-card class="overlay-card" color="black">
      <!-- Top info bar -->
      <div v-if="currentPost" class="top-bar">
        <div class="top-bar-info">
          <p class="post-title">{{ currentPost.postData?.title }}</p>
          <div class="post-meta">
            <span>
              <v-icon size="13">fa-solid fa-arrow-up</v-icon>
              {{ formatScore(currentPost.postData?.score) }}
            </span>
            <span class="ms-3">
              <v-icon size="13">fa-regular fa-comment</v-icon>
              {{ formatScore(currentPost.postData?.num_comments) }}
            </span>
            <span v-if="currentPost.isAlbum" class="ms-3">
              <v-icon size="13">fa-solid fa-images</v-icon>
              {{ currentImageIndex + 1 }} / {{ currentPost.images.length }}
            </span>
          </div>
        </div>
        <v-btn
          icon
          variant="plain"
          color="white"
          size="small"
          title="View on Reddit"
          @click="$emit('goToLink')"
        >
          <v-icon>fa-solid fa-arrow-up-right-from-square</v-icon>
        </v-btn>
      </div>

      <!-- Close button -->
      <v-btn
        class="close-btn"
        icon
        variant="plain"
        color="white"
        size="small"
        @click="close"
      >
        <v-icon>fa-solid fa-xmark</v-icon>
      </v-btn>

      <!-- Media area -->
      <div class="media-area">
        <v-progress-circular
          v-if="mediaLoading"
          class="loader"
          color="primary"
          indeterminate
          size="64"
        />

        <div v-if="currentPost" class="media-wrapper">
          <v-img
            v-if="currentPost.mediaType === 'image' || currentPost.mediaType === 'album'"
            :key="currentPost.images[currentImageIndex]"
            class="full-size-media"
            :src="currentPost.images[currentImageIndex]"
            contain
            @load="mediaLoading = false"
          />
          <video
            v-else-if="currentPost.mediaType === 'video' || currentPost.mediaType === 'gif'"
            :key="currentPost.images[0]"
            :src="currentPost.images[0]"
            class="full-size-media"
            autoplay
            loop
            muted
            controls
            preload="metadata"
            @loadeddata="mediaLoading = false"
            @ended="$emit('mediaEnded')"
          >
            Your browser does not support the video tag.
          </video>
          <div
            v-else-if="currentPost.mediaType === 'embed'"
            class="embed-container"
            v-html="currentPost.images[0]"
          />
        </div>
      </div>

      <!-- Bottom action bar -->
      <div class="bottom-bar">
        <v-btn
          icon
          variant="plain"
          color="white"
          size="large"
          :disabled="!hasPrevious"
          title="Previous (←)"
          @click="$emit('prevImage')"
        >
          <v-icon>fa-solid fa-arrow-left</v-icon>
        </v-btn>

        <v-btn
          icon
          variant="plain"
          color="white"
          size="large"
          title="Toggle slideshow (Space)"
          @click="$emit('toggleSlideshow')"
        >
          <v-icon>{{ isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play' }}</v-icon>
        </v-btn>

        <v-btn
          icon
          variant="plain"
          color="white"
          size="large"
          title="Skip post"
          @click="$emit('skipPost')"
        >
          <v-icon>fa-solid fa-forward-step</v-icon>
        </v-btn>

        <v-btn
          icon
          variant="plain"
          color="white"
          size="large"
          :disabled="!hasNext"
          title="Next (→)"
          @click="$emit('nextImage')"
        >
          <v-icon>fa-solid fa-arrow-right</v-icon>
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  currentPost: { type: Object, default: () => ({}) },
  currentImageIndex: { type: Number, default: 0 },
  hasPrevious: Boolean,
  hasNext: Boolean,
  isPlaying: Boolean,
})

const emit = defineEmits([
  'update:modelValue', 'goToLink', 'prevImage', 'nextImage',
  'toggleSlideshow', 'stopSlideshow', 'skipPost', 'mediaEnded',
])

const dialog = ref(props.modelValue)
const mediaLoading = ref(true)

const formatScore = (n) => {
  if (!n && n !== 0) return '0'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return n.toString()
}

watch(() => props.modelValue, async (newValue) => {
  dialog.value = newValue
  if (newValue) {
    mediaLoading.value = true
    if (props.currentPost?.mediaType === 'embed') {
      await nextTick()
      setTimeout(() => { mediaLoading.value = false }, 1000)
    }
  }
})

watch(dialog, (newValue) => emit('update:modelValue', newValue))

watch(() => props.currentPost, async (newPost) => {
  mediaLoading.value = true
  if (newPost?.mediaType === 'embed') {
    await nextTick()
    setTimeout(() => { mediaLoading.value = false }, 1000)
  }
})

const close = () => {
  emit('stopSlideshow')
  dialog.value = false
}

const handleKeydown = (event) => {
  if (!dialog.value) return
  switch (event.key) {
    case 'ArrowLeft':
      if (props.hasPrevious) { event.preventDefault(); emit('prevImage') }
      break
    case 'ArrowRight':
      if (props.hasNext) { event.preventDefault(); emit('nextImage') }
      break
    case ' ':
      event.preventDefault()
      emit('toggleSlideshow')
      break
    case 'Escape':
      close()
      break
  }
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>

<style scoped>
.overlay-card {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  position: relative;
}

.top-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 20;
  background: linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, transparent 100%);
  padding: 16px 56px 32px 16px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.top-bar-info {
  flex: 1;
  min-width: 0;
}

.post-title {
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  margin: 0 0 4px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-meta {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 30;
}

.media-area {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
}

.media-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.full-size-media {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.embed-container {
  width: 100%;
  max-width: 90vw;
  aspect-ratio: 16 / 9;
  background: black;
}

.embed-container ::v-deep(iframe) {
  width: 100%;
  height: 100%;
}

.loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}

.bottom-bar {
  flex-shrink: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 20px 16px 24px;
}
</style>
