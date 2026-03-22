<template>
  <v-app>
    <v-app-bar :elevation="10">
      <v-app-bar-title>
        <div class="d-flex align-center">
          <!-- todo: use router-link in the future -->
          <!-- <router-link to="/">  -->
          <v-img
            alt="AutoScroll"
            class="shrink mr-2"
            cover
            max-width="50"
            src="@/assets/logo-white.png"
            transition="scale-transition"
          />
          <!-- </router-link> -->
          <!-- <router-link to="/"> -->
          <v-img
            alt="AutoScroll"
            class="shrink mt-1"
            cover
            max-width="100"
            src="@/assets/navbar.png"
          />
          <!-- </router-link> -->
        </div>
      </v-app-bar-title>

      <v-btn @click="settingsDialog = true">
        <v-icon size="large">
          mdi-cog
        </v-icon>
      </v-btn>

      <v-dialog max-width="500">
        <template #activator="{ props: activatorProps }">
          <v-btn v-bind="activatorProps">
            <v-icon size="large">
              mdi-information
            </v-icon>
          </v-btn>
        </template>

        <template #default="{ isActive }">
          <v-card>
            <v-card-title
              class="text-h5 bg-grey-lighten-2"
              primary-title
            >
              What is this?
            </v-card-title>

            <v-card-text>
              This is a small side project made during 2024. I wanted to take the time to learn more about Vue.js and Vuetify. I was inspired by <a
                href="http://www.imagoid.com/"
                target="_blank"
              >Imagoid</a>
              and so created a very simple auto scroller for Reddit image posts. 
              I hope you enjoy, and if you find any issues, you can contact me at <a 
                href="mailto:contact@stuxie.dev"
                target="_blank"
              >contact@stuxie.dev</a>!

              <br><br>
              You can find my socials on my <a
                href="https://links.stuxie.dev"
                target="_blank"
              >links page</a> for any further questions or inquiries.

              <br><br>
              All content belongs to Reddit and the users that uploaded it. I take no responsibility for what is displayed or searched.
            </v-card-text>

            <v-divider />
            <br>
            <v-card-text>
              Boring Legal Stuff:
              <p style="font-size: 12px;">
                Privacy policy: This site collects no analytics or any other identifiable data.
                <br>
                Cookie policy: This site sets no cookies.
              </p>
            </v-card-text>

            <v-divider />

            <v-card-actions>
              <v-spacer />
              <v-btn
                color="primary"
                href="https://labs.stux.dev"
                target="_blank"
              >
                See more labs
              </v-btn>
              <v-btn
                color="primary"
                @click="isActive.value = false"
              >
                Close
              </v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
    <SettingsDialog v-model="settingsDialog" />
    <AppFooter />
  </v-app>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import SettingsDialog from '@/components/SettingsDialog.vue'

  const settingsDialog = ref(false)
</script>
<style lang="sass">
.v-card-title
  background-color: #FF1F1F !important;
  color: white !important;

.v-card-text
  padding: 24px;
.v-card-text a
  color: #FF1F1F;

.v-card-actions
  padding: 1rem 0.5rem 0.5rem 0.5rem;
</style>
