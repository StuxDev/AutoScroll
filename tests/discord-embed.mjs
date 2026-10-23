// Validates the Discord component embed in frontend/index.html.
// Run with: node tests/discord-embed.mjs
import { readFileSync } from 'node:fs'
import assert from 'node:assert/strict'

const root = new URL('../', import.meta.url)
const html = readFileSync(new URL('frontend/index.html', root), 'utf-8')
const m = html.match(/<script id="discord:component-embed" type="application\/json">([\s\S]*?)<\/script>/)
assert.ok(m, 'embed script tag is present in <head>')
assert.ok(html.indexOf(m[0]) < html.indexOf('</head>'), 'embed is inside <head>')
assert.ok(Buffer.byteLength(m[1]) <= 3000, 'embed is within 3,000 bytes')
assert.ok(!m[1].includes('</'), '"</" is escaped so the tag cannot close early')
assert.ok(!m[1].includes('$1'), 'no unreplaced "$1" escape artefacts')
const root17 = JSON.parse(m[1]).component
assert.equal(root17.type, 17, 'one root Container')
const allowed = new Set([1, 2, 9, 10, 11, 12, 14, 17])
let count = 0
const walk = (c, depth) => {
  count++
  assert.ok(allowed.has(c.type), `component type ${c.type} is allowed`)
  if (depth > 0) assert.notEqual(c.type, 17, 'no nested Containers')
  if (c.type === 2) {
    assert.equal(c.style, 5, 'buttons are link buttons')
    assert.ok(/^https?:\/\//.test(c.url), 'button URL is http(s)')
    for (const k of Object.keys(c)) assert.ok(['id', 'type', 'url', 'style', 'label', 'emoji', 'disabled'].includes(k), `button key ${k}`)
  }
  for (const k of c.components ?? []) walk(k, depth + 1)
  if (c.accessory) walk(c.accessory, depth + 1)
}
walk(root17, 0)
assert.ok(count <= 40, 'at most 40 components')
for (const tag of ['rel="icon" href="/favicon.ico"', 'rel="apple-touch-icon"', 'rel="manifest" href="/site.webmanifest"']) {
  assert.ok(html.includes(tag), `head has ${tag}`)
}
console.log(`ok - discord embed valid (${Buffer.byteLength(m[1])} bytes, ${count} components)`)
