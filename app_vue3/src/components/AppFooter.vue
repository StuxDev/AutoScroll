<template>
  <v-footer
    app
    height="40"
  >
    <a
      v-for="item in items"
      :key="item.title"
      class="d-inline-block mx-2 social-link"
      :href="item.href"
      rel="noopener noreferrer"
      target="_blank"
      :title="item.title"
    >
      <v-icon
        :icon="item.icon"
        :size="item.icon === '$vuetify' ? 24 : 16"
      />
    </a>

    <div
      class="text-caption text-disabled"
      style="position: absolute; right: 16px;"
    >
      &copy; 2024-{{ (new Date()).getFullYear() }} <span class="d-none d-sm-inline-block">StuxieDev</span>
      -
      <a
        class="text-decoration-none on-surface"
        href="https://labs.stux.dev"
        rel="noopener noreferrer"
        target="_blank"
      >
        A Stux.Dev Labs Project
      </a>

    </div>
  </v-footer>
</template>

<script setup lang="ts">
  const items = [
    {
      title: 'A Stux.Dev Labs Project',
      icon: `mdi-test-tube`,
      href: 'https://labs.stux.dev',
    }
  ]
</script>

<style scoped lang="sass">
  .social-link :deep(.v-icon)
    color: rgba(var(--v-theme-on-background), var(--v-disabled-opacity))
    text-decoration: none
    transition: .2s ease-in-out

    &:hover
      color: #FF1F1F;
    
</style>
