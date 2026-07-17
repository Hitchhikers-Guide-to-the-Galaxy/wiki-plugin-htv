import Hls from 'hls.js'

const COMMANDS = new Set(['MODE', 'HEIGHT', 'VDO', 'TITLE', 'ROOM', 'UI', 'STREAM', 'JELLYFIN', 'ITEM', 'KEY'])
const THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js'

const clamp = (value, min, max) => Math.max(min, Math.min(max, value))

export const parseText = text => {
  const out = {
    mode: 'swarm',
    height: 620,
    vdo: '',
    room: '',
    ui: 'studio',
    stream: '',
    title: 'Hitchhiker.tv Live Surface',
    jellyfin: '',
    item: '',
    key: ''
  }

  for (const raw of (text || '').split('\n')) {
    const line = raw.trim()
    if (!line) continue
    const [head, ...rest] = line.split(/\s+/)
    const key = head.replace(/:$/, '').toUpperCase()
    const value = rest.join(' ').trim()
    if (!COMMANDS.has(key)) continue

    if (key === 'MODE') out.mode = ['swarm', 'shatter', 'portal', 'nova', 'video'].includes(value.toLowerCase()) ? value.toLowerCase() : out.mode
    if (key === 'HEIGHT') out.height = clamp(parseInt(value, 10) || out.height, 360, 1400)
    if (key === 'VDO') out.vdo = value
    if (key === 'ROOM') out.room = value.replace(/[^A-Za-z0-9_]/g, '_')
    if (key === 'UI') out.ui = ['join', 'watch', 'studio'].includes(value.toLowerCase()) ? value.toLowerCase() : out.ui
    if (key === 'STREAM') out.stream = value
    if (key === 'TITLE') out.title = value || out.title
    if (key === 'JELLYFIN') out.jellyfin = value.replace(/\/$/, '')
    if (key === 'ITEM') out.item = value.trim()
    if (key === 'KEY') out.key = value.trim()
  }

  return out
}

const controlsFor = spec => {
  if (spec.ui === 'join')
    return `
      <div class="htv-controls">
        <button type="button" data-action="join" class="htv-join htv-big">Join Room</button>
        <button type="button" data-action="fullscreen" title="Fullscreen">⛶</button>
      </div>
      <div class="htv-controls"><span class="htv-room" title="VDO.Ninja room name"></span></div>`
  if (spec.ui === 'watch')
    return `
      <div class="htv-controls">
        <button type="button" data-action="watch" class="htv-join htv-big">Watch</button>
        <button type="button" data-action="fullscreen" title="Fullscreen">⛶</button>
      </div>
      <div class="htv-controls"><span class="htv-room" title="VDO.Ninja room name"></span></div>`
  return `
      <p>A live media surface rendered directly by the wiki plugin, avoiding the frame plugin sandbox. Click the surface to spin it through the depth plane.</p>
      <div class="htv-controls">
        <button type="button" data-action="synthetic">Synthetic</button>
        <button type="button" data-action="camera">Use Camera</button>
        <select data-action="mode">
          <option value="swarm"${spec.mode === 'swarm' ? ' selected' : ''}>Swarm</option>
          <option value="shatter"${spec.mode === 'shatter' ? ' selected' : ''}>Shatter</option>
          <option value="portal"${spec.mode === 'portal' ? ' selected' : ''}>Portal</option>
          <option value="nova"${spec.mode === 'nova' ? ' selected' : ''}>Nova</option>
        </select>
        <button type="button" data-action="fullscreen" title="Fullscreen">⛶</button>
      </div>
      <div class="htv-controls">
        <button type="button" data-action="join" class="htv-join">Join Room</button>
        <button type="button" data-action="watch">Watch Room</button>
        <span class="htv-room" title="VDO.Ninja room name"></span>
      </div>
      <div class="htv-controls">
        <input type="url" data-action="vdo-url" placeholder="https://vdo.ninja/?view=STREAM_ID&cleanoutput" value="${escapeAttr(spec.vdo)}">
        <button type="button" data-action="load-vdo">Load VDO</button>
        <button type="button" data-action="hide-vdo">Hide</button>
      </div>`
}

const html = spec => `
  <div class="htv-shell" style="height:${spec.height}px">
    <div class="htv-stage"></div>
    <div class="htv-panel">
      <h3>${escapeHTML(spec.title)}</h3>
      ${controlsFor(spec)}
      <div class="htv-status" role="status">Synthetic feed active.</div>
    </div>
    <div class="htv-vdo" aria-label="VDO.Ninja live surface"></div>
    <video class="htv-video" muted playsinline autoplay></video>
    <canvas class="htv-synthetic" width="1280" height="720"></canvas>
  </div>
`

const css = `
  .htv-shell{position:relative;overflow:hidden;border-radius:8px;background:#050609;color:#f3f5ee;font-family:Inter,ui-sans-serif,system-ui,sans-serif}
  .htv-stage{position:absolute;inset:0;background:#050609}
  .htv-panel{position:absolute;z-index:5;left:12px;right:12px;top:12px;max-width:430px;padding:12px;border:1px solid rgba(255,255,255,.18);border-radius:8px;background:rgba(9,12,16,.78);backdrop-filter:blur(14px)}
  .htv-panel h3{margin:0 0 6px;font-size:16px}.htv-panel p{margin:0 0 10px;color:#b9c0b6;font-size:12px;line-height:1.35}
  .htv-controls{display:flex;flex-wrap:wrap;gap:7px;margin:7px 0}.htv-controls button,.htv-controls select,.htv-controls input{min-height:31px;border:1px solid rgba(255,255,255,.24);border-radius:7px;background:rgba(255,255,255,.08);color:#f3f5ee;font:inherit;font-size:12px}.htv-controls button{padding:0 10px;cursor:pointer}.htv-controls input{flex:1 1 210px;min-width:0;padding:0 8px}.htv-controls select{padding:0 24px 0 8px}
  .htv-status{margin-top:8px;padding:7px 9px;border:1px solid rgba(255,255,255,.14);border-radius:7px;background:rgba(0,0,0,.22);color:#b9c0b6;font-size:12px;line-height:1.35}.htv-status strong{color:#87ffd8}
  .htv-vdo{position:absolute;z-index:4;right:18px;bottom:18px;width:min(42%,360px);aspect-ratio:16/9;border:1px solid rgba(135,255,216,.42);border-radius:8px;overflow:hidden;background:#07090b;box-shadow:0 16px 58px rgba(0,0,0,.45),0 0 36px rgba(135,255,216,.14);transform:perspective(800px) rotateY(-14deg) rotateX(5deg);opacity:0;pointer-events:none;transition:opacity .18s ease}
  .htv-vdo.is-visible{opacity:.9;pointer-events:auto}.htv-vdo iframe{width:100%;height:100%;border:0;background:#000}.htv-video,.htv-synthetic{position:absolute;left:-9999px;top:-9999px;width:2px;height:2px;opacity:0}
  .htv-vdo.is-joined{left:3%;right:3%;top:3%;bottom:3%;width:auto;aspect-ratio:auto;transform:none;opacity:1;border-color:rgba(255,207,115,.55);z-index:6}
  .htv-shell.is-joined .htv-panel{opacity:0;pointer-events:none}
  .htv-leave{position:absolute;top:10px;right:10px;z-index:2;min-height:31px;padding:0 12px;border:1px solid rgba(255,207,115,.6);border-radius:7px;background:rgba(9,12,16,.85);color:#ffcf73;font:inherit;font-size:12px;cursor:pointer}
  .htv-join{background:rgba(135,255,216,.16)!important;border-color:rgba(135,255,216,.5)!important}
  .htv-big{flex:1 1 auto;min-height:44px!important;font-size:15px!important;font-weight:600}
  .htv-room{align-self:center;padding:0 8px;color:#87ffd8;font-size:11px;font-family:ui-monospace,monospace}
  .htv-shell:fullscreen{height:100vh!important;border-radius:0}
  .htv-vdo video{width:100%;height:100%;object-fit:contain;background:#000}
  .htv-video-shell{position:relative;overflow:hidden;border-radius:8px;background:#000;color:#f3f5ee;font-family:Inter,ui-sans-serif,system-ui,sans-serif}
  .htv-video-shell:fullscreen{height:100vh!important;border-radius:0}
  .htv-video-shell video{width:100%;height:100%;object-fit:contain;background:#000;display:block}
  .htv-video-shell video:fullscreen,.htv-video-shell video:-webkit-full-screen{width:100vw;height:100vh;object-fit:contain;background:#000}
  .htv-v-poster{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;background:radial-gradient(circle at 50% 40%,#0d1f1b,#050609);text-align:center;padding:16px}
  .htv-v-title{font-size:15px;font-weight:600;color:#e8efe8;max-width:80%;opacity:.92}
  .htv-v-play{min-height:46px;padding:0 22px;border:1px solid rgba(135,255,216,.5);border-radius:9px;background:rgba(135,255,216,.16);color:#eafff7;font:inherit;font-size:15px;font-weight:600;cursor:pointer}
  .htv-v-play:hover{background:rgba(135,255,216,.26)}
  .htv-v-status{font-size:12px;color:#b9c0b6;min-height:16px}
  .htv-v-bar{position:absolute;z-index:3;right:10px;bottom:10px;display:flex;gap:7px;opacity:.85}
  .htv-v-bar button,.htv-v-bar a{min-height:30px;display:inline-flex;align-items:center;padding:0 10px;border:1px solid rgba(255,255,255,.24);border-radius:7px;background:rgba(9,12,16,.72);color:#f3f5ee;font:inherit;font-size:12px;text-decoration:none;cursor:pointer}
  .htv-video-shell.is-playing .htv-v-poster{display:none}
`

const escapeHTML = value => String(value || '').replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]))
const escapeAttr = value => escapeHTML(value).replace(/"/g, '&quot;')

const ensureStyle = () => {
  if (document.getElementById('htv-style')) return
  const style = document.createElement('style')
  style.id = 'htv-style'
  style.textContent = css
  document.head.appendChild(style)
}

export const emit = (div, item) => {
  ensureStyle()
  const spec = parseText(item.text)
  if (spec.mode === 'video') { div.html(videoHtml(spec)); return }
  div.html(html(spec))
}

export const bind = (div, item) => {
  const spec = parseText(item.text)
  const editOnDblClick = event => {
    if (event.target.closest('button,input,select,iframe,video,a')) return
    if (window.wiki?.textEditor) window.wiki.textEditor(div, item)
  }
  if (spec.mode === 'video') {
    const root = div.find('.htv-video-shell')[0]
    if (root) initVideoMode(root, spec, item)
    div.on('dblclick', editOnDblClick)
    return
  }
  const root = div.find('.htv-shell')[0]
  if (!root) return
  initSurface(root, spec, item)
  div.on('dblclick', editOnDblClick)
}

// Optional teardown hook (see issue.localhost "Plugin Teardown Hook"). The wiki
// client does not call this yet, so bind() also self-manages via a watcher — but
// exporting it means the plugin is ready the day the client adds the hook.
export const dispose = (div, item) => {
  const shell = div.find?.('.htv-video-shell')[0] || div.querySelector?.('.htv-video-shell')
  if (shell?._htvTeardown) shell._htvTeardown()
  const surface = div.find?.('.htv-shell')[0] || div.querySelector?.('.htv-shell')
  if (surface?._htvDispose) surface._htvDispose()
}

// ---- Lightweight video mode (no Three.js / WebGL) ----------------------------
// Plays a Jellyfin item (or a raw HLS/MP4 STREAM url) in a plain <video> the same
// way it plays in Chrome via Jellyfin: HLS with the video remuxed (copied) when the
// browser can decode it, transcoded otherwise. Fullscreen + open-in-new-tab.

const videoHtml = spec => `
  <div class="htv-video-shell" style="height:${spec.height}px">
    <div class="htv-v-poster">
      <div class="htv-v-title">${escapeHTML(spec.title)}</div>
      <button type="button" class="htv-v-play" data-action="play">▶ Play</button>
      <div class="htv-v-status" role="status"></div>
    </div>
    <div class="htv-v-bar">
      <a class="htv-v-tab" target="_blank" rel="noopener" style="display:none">Open in new tab ↗</a>
    </div>
  </div>`

// One shared HLS attach path, used by both video mode and the STREAM watch card.
// hls.js is bundled (offline/CSP-clean). Returns the Hls instance (or null for
// native playback) so callers can destroy it on teardown.
const attachHls = (video, url) => {
  if (/\.m3u8(\?|$)/.test(url) && Hls.isSupported()) {
    const hls = new Hls({ maxBufferLength: 30, backBufferLength: 10, enableWorker: true })
    hls.loadSource(url)
    hls.attachMedia(video)
    return hls
  }
  video.src = url // Safari native HLS, or a progressive mp4
  return null
}

const canDecode = codecs => {
  try {
    return typeof MediaSource !== 'undefined' && MediaSource.isTypeSupported(`video/mp4; codecs="${codecs}"`)
  } catch (error) {
    return false
  }
}

// Declare the browser's real codec support so Jellyfin copies the video (remux,
// cheap) rather than re-encoding when it doesn't have to.
const deviceProfile = () => {
  const hevc = canDecode('hvc1.1.6.L120.90')
  const videoCodec = hevc ? 'hevc,h264' : 'h264'
  return {
    MaxStreamingBitrate: 120000000,
    DirectPlayProfiles: [{ Container: 'mp4,m4v', Type: 'Video', VideoCodec: videoCodec, AudioCodec: 'aac,mp3,ac3,eac3' }],
    TranscodingProfiles: [{ Container: 'mp4', Type: 'Video', VideoCodec: videoCodec, AudioCodec: 'aac', Protocol: 'hls', Context: 'Streaming' }]
  }
}

const jget = (url) => fetch(url, { headers: { Accept: 'application/json' } }).then(r => r.json())

// Resolve a Jellyfin item to a playable URL via PlaybackInfo (like jellyfin-web).
const resolveJellyfin = async (base, itemId, apiKey) => {
  let uid = ''
  try { uid = (await jget(`${base}/Users?api_key=${apiKey}`))[0]?.Id || '' } catch (error) { /* fall through */ }
  const info = await fetch(`${base}/Items/${itemId}/PlaybackInfo?api_key=${apiKey}${uid ? `&UserId=${uid}` : ''}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ DeviceProfile: deviceProfile() })
  }).then(r => r.json())
  const ms = (info.MediaSources || [])[0] || {}
  const rel = ms.TranscodingUrl || ms.DirectStreamUrl
  const url = rel ? base + rel : `${base}/Videos/${itemId}/stream?static=true&api_key=${apiKey}`
  let deviceId = ''
  try { deviceId = new URLSearchParams((rel || '').split('?')[1]).get('DeviceId') || '' } catch (error) { /* direct play */ }
  return { url, sessionId: info.PlaySessionId || '', deviceId }
}

function initVideoMode (root, spec) {
  const poster = root.querySelector('.htv-v-poster')
  const status = root.querySelector('.htv-v-status')
  const playBtn = root.querySelector('[data-action="play"]')
  const tab = root.querySelector('.htv-v-tab')

  const say = text => { if (status) status.textContent = text || '' }

  // "Open in new tab": the Jellyfin details page, or the raw stream url.
  const tabUrl = spec.jellyfin && spec.item
    ? `${spec.jellyfin}/web/#/details?id=${encodeURIComponent(spec.item)}`
    : (spec.stream || '')
  if (tab && tabUrl) { tab.href = tabUrl; tab.style.display = '' }

  const teardown = () => {
    const p = root._htvPlayer
    if (p) {
      clearInterval(p.watch)
      try { p.hls?.destroy() } catch (error) { /* ignore */ }
      if (p.video) { try { p.video.pause(); p.video.removeAttribute('src'); p.video.load() } catch (error) { /* ignore */ } }
      // Kill the server-side transcode/remux so no ffmpeg is orphaned on the Pi.
      // DELETE /Videos/ActiveEncodings is the authoritative stop; keepalive lets
      // it survive a page unload too.
      if (p.base && (p.deviceId || p.sessionId)) {
        const qs = new URLSearchParams({ api_key: p.key })
        if (p.deviceId) qs.set('deviceId', p.deviceId)
        if (p.sessionId) qs.set('playSessionId', p.sessionId)
        try { fetch(`${p.base}/Videos/ActiveEncodings?${qs}`, { method: 'DELETE', keepalive: true }).catch(() => {}) } catch (error) { /* ignore */ }
      }
      window.removeEventListener('pagehide', onHide)
      root._htvPlayer = null
    }
  }
  // The interval watcher catches in-page removal (item delete, lineup truncation),
  // but a full navigation / tab close kills the page before it fires — so also tear
  // down on pagehide (keepalive fetch survives the unload) to stop the Pi transcode.
  const onHide = () => teardown()
  root._htvTeardown = teardown

  async function play () {
    if (root._htvPlayer) return // already playing / building
    if (!(spec.jellyfin && spec.item) && !spec.stream) { say('No JELLYFIN item or STREAM url set.'); return }
    playBtn && (playBtn.disabled = true)
    say('Loading…')
    const video = document.createElement('video')
    video.controls = true
    video.playsInline = true
    video.setAttribute('playsinline', '')
    const player = { video, hls: null, sessionId: '', deviceId: '', base: spec.jellyfin, key: spec.key, watch: 0 }
    root._htvPlayer = player
    // Watcher: the wiki client never tells us we were removed, and a paused
    // <video> runs no rAF loop — so poll for detachment and tear down.
    player.watch = setInterval(() => { if (!root.isConnected) teardown() }, 2000)
    window.addEventListener('pagehide', onHide)
    try {
      let url = spec.stream
      if (spec.jellyfin && spec.item) {
        const resolved = await resolveJellyfin(spec.jellyfin, spec.item, spec.key)
        url = resolved.url
        player.sessionId = resolved.sessionId
        player.deviceId = resolved.deviceId
      }
      if (!root._htvPlayer) return // torn down while resolving
      player.hls = attachHls(video, url)
      root.insertBefore(video, root.firstChild)
      root.classList.add('is-playing')
      say('')
      video.play().catch(() => {})
    } catch (error) {
      say(`Could not play: ${error.message || error}`)
      teardown()
      playBtn && (playBtn.disabled = false)
    }
  }

  // Fullscreen is handled by the native <video controls> control once playing —
  // no custom button needed.
  if (playBtn) playBtn.addEventListener('click', play)
}

const setStatus = (root, text, strong = '') => {
  const status = root.querySelector('.htv-status')
  if (!status) return
  status.innerHTML = strong ? `<strong>${escapeHTML(strong)}</strong> ${escapeHTML(text)}` : escapeHTML(text)
}

const isFramed = () => {
  try {
    return window.top !== window
  } catch (error) {
    return true
  }
}

const cameraAllowedByPolicy = () => {
  const policy = document.permissionsPolicy || document.featurePolicy
  if (!policy?.allowsFeature) return true
  try {
    return policy.allowsFeature('camera')
  } catch (error) {
    return true
  }
}

const cameraDiagnostics = () => {
  const policy = document.permissionsPolicy || document.featurePolicy
  let policyAllows = 'unknown'
  if (policy?.allowsFeature) {
    try {
      policyAllows = String(policy.allowsFeature('camera'))
    } catch (error) {
      policyAllows = `unknown (${error.name})`
    }
  }
  return `origin=${location.origin}; secure=${String(isSecureContext)}; framed=${String(isFramed())}; policy.camera=${policyAllows}`
}

const initSurface = async (root, spec, item) => {
  const stage = root.querySelector('.htv-stage')
  const video = root.querySelector('.htv-video')
  const synthetic = root.querySelector('.htv-synthetic')
  const ctx = synthetic.getContext('2d')
  const vdoSurface = root.querySelector('.htv-vdo')
  const modeSelect = root.querySelector('[data-action="mode"]')
  const vdoInput = root.querySelector('[data-action="vdo-url"]')
  const state = { mode: spec.mode, pointerX: 0, pointerY: 0, startedAt: performance.now(), disposed: false, spinStart: null }

  let three
  try {
    three = await import(THREE_URL)
  } catch (error) {
    setStatus(root, `Could not load Three.js: ${error.message}`, 'Renderer failed.')
    return
  }

  const renderer = new three.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2))
  stage.appendChild(renderer.domElement)

  const scene = new three.Scene()
  scene.fog = new three.FogExp2(0x050609, 0.028)
  const camera = new three.PerspectiveCamera(46, 1, 0.1, 200)
  camera.position.set(0, 0.1, 16)
  const texture = new three.VideoTexture(video)
  texture.colorSpace = three.SRGBColorSpace
  const group = new three.Group()
  scene.add(group)

  buildTiles(three, group, texture, state)
  useSynthetic()
  if (spec.vdo) showVdo(spec.vdo, false)

  const resize = () => {
    const rect = root.getBoundingClientRect()
    renderer.setSize(rect.width, rect.height)
    camera.aspect = rect.width / rect.height
    camera.updateProjectionMatrix()
  }

  const drawSynthetic = now => {
    const t = now / 1000
    const w = synthetic.width
    const h = synthetic.height
    ctx.fillStyle = '#071014'
    ctx.fillRect(0, 0, w, h)
    const grd = ctx.createRadialGradient(w * 0.4, h * 0.5, 20, w * 0.5, h * 0.5, w * 0.7)
    grd.addColorStop(0, '#125e52')
    grd.addColorStop(0.55, '#111820')
    grd.addColorStop(1, '#030406')
    ctx.fillStyle = grd
    ctx.fillRect(0, 0, w, h)
    for (let i = 0; i < 6; i += 1) {
      const cx = w * (0.18 + (i % 3) * 0.31) + Math.sin(t * 0.7 + i) * 18
      const cy = h * (0.28 + Math.floor(i / 3) * 0.36) + Math.cos(t * 0.9 + i) * 16
      ctx.beginPath()
      ctx.arc(cx, cy, 82 + Math.sin(t + i) * 10, 0, Math.PI * 2)
      ctx.fillStyle = `hsla(${155 + i * 24}, 88%, ${54 + i * 3}%, 0.78)`
      ctx.fill()
    }
    ctx.strokeStyle = 'rgba(135,255,216,0.55)'
    ctx.lineWidth = 3
    ctx.beginPath()
    for (let x = 0; x < w; x += 18) {
      const y = h * 0.78 + Math.sin(x * 0.02 + t * 3) * 26 + Math.sin(x * 0.006 - t) * 44
      if (x === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
    ctx.fillStyle = 'rgba(255,207,115,0.88)'
    ctx.font = '600 28px system-ui, sans-serif'
    ctx.fillText('Hitchhiker.tv plugin surface', 42, 58)
  }

  const animate = now => {
    if (!root.isConnected || state.disposed) {
      renderer.dispose()
      cleanup()
      return
    }
    drawSynthetic(now)
    const seconds = (now - state.startedAt) / 1000
    updateTiles(group, seconds, state)
    renderer.render(scene, camera)
    requestAnimationFrame(animate)
  }

  async function useCamera() {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setStatus(root, `This browser context does not expose getUserMedia. ${cameraDiagnostics()}`, 'Camera unavailable.')
        return
      }
      if (!cameraAllowedByPolicy()) {
        const message = isFramed()
          ? 'This plugin is running inside a frame that has not delegated camera permission.'
          : 'Chrome reports that this document is not allowed to request camera access.'
        setStatus(root, `${message} ${cameraDiagnostics()}`, 'Camera blocked.')
        return
      }
      stopTracks(video)
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 }, audio: false })
      video.srcObject = stream
      await video.play()
      setStatus(root, 'Camera MediaStream is driving the shader texture.', 'Camera active.')
    } catch (error) {
      useSynthetic(false)
      setStatus(root, `${error.name}: ${error.message || 'camera request failed'} ${cameraDiagnostics()}`, 'Camera blocked.')
    }
  }

  function useSynthetic(announce = true) {
    stopTracks(video)
    video.srcObject = synthetic.captureStream(60)
    video.play()
    if (announce) setStatus(root, 'Synthetic feed active.')
  }

  const room = spec.room || `htv_${String(item?.id || 'lobby').replace(/[^A-Za-z0-9_]/g, '').slice(0, 12)}`
  const roomLabel = root.querySelector('.htv-room')
  if (roomLabel) roomLabel.textContent = room
  if (vdoInput && !vdoInput.value) vdoInput.value = `https://vdo.ninja/?room=${room}`

  function showSurface(element, expand, exitLabel) {
    vdoSurface.textContent = ''
    vdoSurface.appendChild(element)
    if (expand) {
      const exit = document.createElement('button')
      exit.type = 'button'
      exit.className = 'htv-leave'
      exit.textContent = exitLabel
      exit.addEventListener('click', hideVdo)
      vdoSurface.appendChild(exit)
    }
    vdoSurface.classList.add('is-visible')
    vdoSurface.classList.toggle('is-joined', !!expand)
    root.classList.toggle('is-joined', !!expand)
  }

  function vdoIframe(url) {
    const iframe = document.createElement('iframe')
    iframe.allow = 'camera; microphone; autoplay; fullscreen; display-capture'
    iframe.src = url
    return iframe
  }

  function showVdo(url, expand, exitLabel = 'Leave Room') {
    showSurface(vdoIframe(url), expand, exitLabel)
    if (vdoInput) vdoInput.value = url
  }

  async function streamElement(url) {
    const yt = url.match(/(?:youtube(?:-nocookie)?\.com\/(?:watch\?.*v=|live\/|embed\/)|youtu\.be\/)([\w-]{6,})/)
    if (yt) return vdoIframe(`https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1`)
    const tw = url.match(/twitch\.tv\/([\w]+)/)
    if (tw) return vdoIframe(`https://player.twitch.tv/?channel=${tw[1]}&parent=${location.hostname}&autoplay=true`)
    if (/\.m3u8(\?|$)/.test(url)) {
      const media = document.createElement('video')
      media.autoplay = true
      media.playsInline = true
      media.controls = true
      media.muted = true
      attachHls(media, url) // bundled hls.js, shared with video mode
      media.play().catch(() => {})
      return media
    }
    return vdoIframe(url)
  }

  function loadVdo() {
    const url = (vdoInput?.value || '').trim()
    if (!url) {
      setStatus(root, 'Paste a VDO.Ninja view URL before loading.', 'VDO needs a URL.')
      return
    }
    showVdo(url, false)
    setStatus(root, 'VDO.Ninja is loaded as a live browser surface.', 'VDO surface active.')
  }

  function joinRoom() {
    showVdo(`https://vdo.ninja/?room=${room}`, true)
    setStatus(root, `Allow camera and microphone, then join. Everyone on this page shares room ${room}. No app or account needed.`, 'Joining the room.')
  }

  async function watchRoom() {
    if (spec.stream) {
      try {
        showSurface(await streamElement(spec.stream), true, 'Stop Watching')
        setStatus(root, 'Playing the broadcast stream.', 'Broadcast active.')
      } catch (error) {
        setStatus(root, `Could not load the stream: ${error.message || error}`, 'Stream failed.')
      }
      return
    }
    showVdo(`https://vdo.ninja/?room=${room}&videodevice=0&audiodevice=0`, true, 'Stop Watching')
    setStatus(root, `Watching joins room ${room} as a visible, silent guest — everyone can see who is watching.`, 'Watching the room.')
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      root.requestFullscreen().catch(error => setStatus(root, `Fullscreen unavailable: ${error.message}`, 'No fullscreen.'))
    }
  }

  function hideVdo() {
    vdoSurface.classList.remove('is-visible', 'is-joined')
    root.classList.remove('is-joined')
    vdoSurface.textContent = ''
    setStatus(root, 'Surface hidden and room left. Texture source is unchanged.')
  }

  root.addEventListener('pointermove', event => {
    const rect = root.getBoundingClientRect()
    state.pointerX = (event.clientX - rect.left) / rect.width * 2 - 1
    state.pointerY = -((event.clientY - rect.top) / rect.height * 2 - 1)
  })
  stage.addEventListener('click', event => {
    const rect = root.getBoundingClientRect()
    const ndc = new three.Vector2(
      (event.clientX - rect.left) / rect.width * 2 - 1,
      -(((event.clientY - rect.top) / rect.height) * 2 - 1)
    )
    const probe = new three.Vector3(ndc.x, ndc.y, 0.5).unproject(camera)
    const dir = probe.sub(camera.position).normalize()
    const hit = camera.position.clone().add(dir.multiplyScalar(-camera.position.z / dir.z))
    group.worldToLocal(hit)
    const seconds = (performance.now() - state.startedAt) / 1000
    const uniforms = group.userData.uniforms
    uniforms.uClick.value.set(hit.x, hit.y)
    uniforms.uClickTime.value = seconds
    state.spinStart = seconds
  })
  const wire = (action, handler, event = 'click') => {
    const el = root.querySelector(`[data-action="${action}"]`)
    if (el) el.addEventListener(event, handler)
  }
  wire('synthetic', () => useSynthetic())
  wire('camera', useCamera)
  wire('join', joinRoom)
  wire('watch', watchRoom)
  wire('load-vdo', loadVdo)
  wire('hide-vdo', hideVdo)
  wire('fullscreen', toggleFullscreen)
  if (modeSelect) modeSelect.addEventListener('change', () => { state.mode = modeSelect.value })

  if (spec.ui === 'join') {
    setStatus(root, `Join with camera and microphone — everyone in room ${room} is visible. No app or account needed.`)
  } else if (spec.ui === 'watch') {
    setStatus(root, spec.stream ? 'Press Watch to play the broadcast.' : `Watching joins room ${room} as a visible, silent guest.`)
  }

  const cleanup = () => {
    window.removeEventListener('resize', resize)
    document.removeEventListener('fullscreenchange', resize)
  }
  root._htvDispose = () => { state.disposed = true; cleanup() }

  resize()
  window.addEventListener('resize', resize)
  document.addEventListener('fullscreenchange', resize)
  requestAnimationFrame(animate)
}

const stopTracks = video => {
  if (video.srcObject?.getTracks) video.srcObject.getTracks().forEach(track => track.stop())
}

const buildTiles = (three, group, texture, state) => {
  const uniforms = {
    uTexture: { value: texture },
    uTime: { value: 0 },
    uPointer: { value: new three.Vector2() },
    uMode: { value: 0 },
    uClick: { value: new three.Vector2(999, 999) },
    uClickTime: { value: -999 }
  }
  const material = new three.ShaderMaterial({
    uniforms,
    transparent: true,
    side: three.DoubleSide,
    vertexShader: `
      uniform float uTime; uniform vec2 uPointer; uniform float uMode; uniform vec2 uClick; uniform float uClickTime;
      attribute vec2 tileUvMin; attribute vec2 tileUvMax; attribute float tileIndex; attribute float tileSeed; attribute vec2 tileCenter;
      varying vec2 vUv; varying float vGlow;
      mat2 rot(float a){float s=sin(a);float c=cos(a);return mat2(c,-s,s,c);}
      void main(){
        vUv=mix(tileUvMin,tileUvMax,uv); vec3 p=position;
        float wave=sin(uTime*1.7+tileSeed*6.283); float pulse=sin(uTime*.7+tileIndex*.037);
        float pointerFalloff=1.0-clamp(length(position.xy*.08-uPointer)*1.6,0.0,1.0);
        float boom=0.0;
        if(uMode<.5){p.z+=wave*.85+pointerFalloff*2.8; p.xy+=normalize(vec2(position.x+.01,position.y+.01))*pulse*.08;}
        else if(uMode<1.5){p.xy=rot(wave*.18+pointerFalloff*.35)*p.xy; p.z+=abs(wave)*2.6+pointerFalloff*5.0;}
        else if(uMode<2.5){float r=length(position.xy); p.z+=sin(r*1.8-uTime*2.4)*1.4; p.xy*=1.0+.07*sin(uTime+r*3.0); p.z+=pointerFalloff*3.6;}
        else{
          float cyc=fract(uTime*.16);
          boom=smoothstep(.02,.14,cyc)*(1.0-smoothstep(.5,.92,cyc));
          vec3 dir=normalize(vec3(tileCenter+vec2(.001),.35+1.3*fract(tileSeed*7.31)));
          p.xy=rot(boom*(tileSeed-.5)*12.566)*p.xy;
          p+=dir*boom*(1.5+8.5*fract(tileSeed*3.17));
          p.z+=pointerFalloff*3.0;
        }
        float age=uTime-uClickTime;
        if(age>0.0&&age<2.2){
          float cd=length(tileCenter-uClick);
          float att=exp(-cd*.35)*(1.0-age/2.2);
          float ring=sin(cd*2.6-age*9.0);
          p.z+=ring*att*3.2;
          vGlow=att*max(ring,0.0);
        } else { vGlow=0.0; }
        vGlow+=pointerFalloff+.35*abs(wave)+boom*1.4; gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);
      }`,
    fragmentShader: `
      uniform sampler2D uTexture; uniform float uTime; varying vec2 vUv; varying float vGlow;
      void main(){
        vec2 uv=vUv; float scan=sin((uv.y+uTime*.035)*720.0)*.025; vec3 col;
        col.r=texture2D(uTexture,uv+vec2(.003+scan,0.0)).r; col.g=texture2D(uTexture,uv).g; col.b=texture2D(uTexture,uv-vec2(.004+scan,0.0)).b;
        col+=vec3(.05,.18,.14)*vGlow; float vignette=smoothstep(.9,.12,length(uv-.5)); gl_FragColor=vec4(col*(.45+vignette),.94);
      }`
  })
  group.userData.uniforms = uniforms
  const cols = 24
  const rows = Math.round(cols * 9 / 16)
  const planeW = 12.8 / cols
  const planeH = 7.2 / rows
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const geo = new three.PlaneGeometry(planeW * 0.94, planeH * 0.94, 1, 1)
      const uvMin = [x / cols, 1 - (y + 1) / rows]
      const uvMax = [(x + 1) / cols, 1 - y / rows]
      const centerX = (x - cols / 2 + 0.5) * planeW
      const centerY = (rows / 2 - y - 0.5) * planeH
      const count = geo.attributes.position.count
      geo.setAttribute('tileUvMin', new three.BufferAttribute(new Float32Array(count * 2).fill(0).map((_, i) => uvMin[i % 2]), 2))
      geo.setAttribute('tileUvMax', new three.BufferAttribute(new Float32Array(count * 2).fill(0).map((_, i) => uvMax[i % 2]), 2))
      geo.setAttribute('tileIndex', new three.BufferAttribute(new Float32Array(count).fill(y * cols + x), 1))
      geo.setAttribute('tileSeed', new three.BufferAttribute(new Float32Array(count).fill(Math.random()), 1))
      geo.setAttribute('tileCenter', new three.BufferAttribute(new Float32Array(count * 2).fill(0).map((_, i) => (i % 2 === 0 ? centerX : centerY)), 2))
      const mesh = new three.Mesh(geo, material)
      mesh.position.x = centerX
      mesh.position.y = centerY
      group.add(mesh)
    }
  }
}

const updateTiles = (group, seconds, state) => {
  const uniforms = group.userData.uniforms
  uniforms.uTime.value = seconds
  uniforms.uPointer.value.set(state.pointerX, state.pointerY)
  uniforms.uMode.value = state.mode === 'swarm' ? 0 : state.mode === 'shatter' ? 1 : state.mode === 'portal' ? 2 : 3
  let spin = 0
  let dive = 0
  if (state.spinStart != null) {
    const phase = (seconds - state.spinStart) / 1.8
    if (phase >= 1) {
      state.spinStart = null
    } else if (phase > 0) {
      const ease = phase < 0.5 ? 4 * phase * phase * phase : 1 - Math.pow(-2 * phase + 2, 3) / 2
      spin = ease * Math.PI * 2
      dive = Math.sin(phase * Math.PI)
    }
  }
  group.rotation.y = Math.sin(seconds * 0.22) * 0.16 + state.pointerX * 0.12 + spin
  group.rotation.x = -0.06 + state.pointerY * 0.08
  group.position.z = Math.sin(seconds * 0.4) * 0.32 - dive * 5.2
}

if (typeof window !== 'undefined') {
  window.plugins = window.plugins || {}
  window.plugins.htv = { emit, bind, dispose }
}
