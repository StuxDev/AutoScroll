<template>
  <div class="empty-state">
    <v-icon size="80" color="primary" class="mb-6">mdi-image-search</v-icon>
    <h2 class="text-h5 font-weight-bold mb-3">Browse Reddit Media</h2>
    <p class="text-body-2 text-medium-emphasis mb-8">
      Enter a subreddit name above to browse images, videos, and galleries in a clean slideshow.
    </p>
    <div class="suggestions">
      <span class="text-caption text-medium-emphasis d-block mb-3">Popular subreddits to try:</span>
      <div class="chip-wrap">
        <v-chip
          v-for="sub in suggestions"
          :key="sub"
          size="small"
          class="me-2 mb-2"
          variant="outlined"
          color="primary"
          @click="$emit('select', sub)"
        >
          r/{{ sub }}
        </v-chip>
      </div>
    </div>
  </div>
</template>

<script setup>
defineEmits(['select'])

const suggestions = [
  'pics', 'EarthPorn', 'itookapicture', 'spaceporn',
  'aww', 'videos', 'Art', 'astrophotography',
]
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 80px 24px;
  min-height: 60vh;
}

.chip-wrap {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 480px;
}
</style>
