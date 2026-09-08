<template>
  <LegalPage
    title="Privacy Policy"
    lead="The short version: there's no login, no account, and nothing about you is stored long-term."
    meta="Last updated: September 2026"
  >
    <h2>What we collect</h2>
    <p>AutoScroll has no accounts and no sign-up — there's nothing to attach a profile to. What little data does pass through the app falls into a few categories:</p>

    <div class="info-card">
      <div class="info-row">
        <span class="info-label">Subreddit and sort choices</span>
        <span class="info-value">Kept only in your browser's <code>localStorage</code> (slideshow interval, sort option, NSFW consent) so your preferences survive a page reload. Never sent anywhere except back to the backend as part of the request you're already making.</span>
      </div>
      <div class="info-row">
        <span class="info-label">Your IP address</span>
        <span class="info-value">Used transiently by the Firebase Functions backend to enforce per-IP rate limits. It's base64-encoded into a short-lived Firestore document, never logged in plain text, and automatically deleted by a scheduled cleanup job once the rate-limit window expires.</span>
      </div>
      <div class="info-row">
        <span class="info-label">Approximate country</span>
        <span class="info-value">Derived from your IP via a local GeoIP lookup on the backend, then discarded — only an aggregated, anonymous per-country request count is kept (see Analytics below). The IP itself is never written to that count.</span>
      </div>
      <div class="info-row">
        <span class="info-label">Cookies</span>
        <span class="info-value">None. AutoScroll doesn't set or read any cookies.</span>
      </div>
    </div>

    <h2>How requests are handled</h2>
    <p>Reddit shut down its public .json API in May 2026, so every request now goes through AutoScroll's own Firebase Cloud Function backend, which fetches the content on your behalf — from a free Reddit archive where possible, falling back to the Apify Reddit Scraper otherwise — and returns it to you. This is where the IP/rate-limiting/analytics handling above applies.</p>

    <h2>Analytics</h2>
    <p>The backend increments an anonymous, aggregated counter for each request's country and endpoint — for example, "France: 42 requests to redditProxy this month." No individual request, IP address, or session is ever recorded — only the running totals. These aggregates are automatically deleted after six months.</p>

    <h2>NSFW content</h2>
    <p>Adult content is hidden by default. Choosing to view it records a simple yes/no consent flag in your browser's <code>localStorage</code> — nothing about that choice is sent to or stored on any server.</p>

    <h2>Third parties</h2>
    <p>Requests you make are ultimately served by Reddit, via a Reddit archive or the Apify Reddit Scraper acting on AutoScroll's behalf. Those parties handle the request under their own privacy policies once it leaves AutoScroll. AutoScroll does not share any data with advertisers, analytics networks, or other third parties beyond what's described above.</p>

    <h2>Children's privacy</h2>
    <p>AutoScroll is intended for users aged 18 and over and does not knowingly collect data from children.</p>

    <h2>Changes to this policy</h2>
    <p>If this policy changes materially, the "last updated" date above will change with it.</p>

    <h2>Contact</h2>
    <p>Questions about this policy? Reach out at <a href="mailto:legal@stux.dev">legal@stux.dev</a>.</p>
  </LegalPage>
</template>

<script setup lang="ts">
//
</script>
