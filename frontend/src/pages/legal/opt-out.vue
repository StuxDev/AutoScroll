<template>
  <LegalPage
    title="Opt-Out Preferences"
    lead="There's nothing to sell, so there's nothing to opt out of."
    meta="Last updated: September 2026"
  >
    <h2>No data sale, no ad targeting</h2>
    <p>AutoScroll doesn't sell, rent, or share your data with advertisers or data brokers — there's no such pipeline to opt out of. There is no login, no user profile, and no cross-site tracking.</p>

    <h2>What you can still control</h2>
    <div class="info-card">
      <div class="info-row">
        <span class="info-label">Proxy mode</span>
        <span class="info-value">Toggle it off in Settings to have your browser talk directly to Reddit instead of through the AutoScroll backend — see the <a href="/legal/privacy">Privacy Policy</a> for what changes when proxy mode is on.</span>
      </div>
      <div class="info-row">
        <span class="info-label">Local preferences</span>
        <span class="info-value">Clearing your browser's site data for AutoScroll removes every preference stored in <code>localStorage</code>/<code>sessionStorage</code> — slideshow interval, sort order, NSFW consent, and proxy preference.</span>
      </div>
    </div>

    <h2>Anonymous analytics</h2>
    <p>The only usage data AutoScroll collects (in proxy mode) is an aggregated, anonymous per-country request count with no way to trace it back to an individual visitor — see <a href="/legal/privacy">Privacy Policy</a>. Because nothing is tied to you personally, there's no individual record to opt out of or delete.</p>

    <h2>Contact</h2>
    <p>Questions about any of this? Reach out at <a href="mailto:contact@stux.dev">contact@stux.dev</a>.</p>
  </LegalPage>
</template>

<script setup lang="ts">
//
</script>
