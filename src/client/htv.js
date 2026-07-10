const COMMANDS = new Set(['MODE', 'HEIGHT', 'VDO', 'TITLE', 'ROOM'])
const THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js'

const clamp = (value, min, max) => Math.max(min, Math.min(max, value))

export const parseText = text => {
  const out = {
    mode: 'swarm',
    height: 620,
    vdo: '',
    room: '',
    title: 'Hitchhiker.tv Live Surface'
  }

  for (const raw of (text || '').split('\n')) {
    const line = raw.trim()
    if (!line) continue
    const [head, ...rest] = line.split(/\s+/)
    const key = head.replace(/:$/, '').toUpperCase()
    const value = rest.join(' ').trim()
    if (!COMMANDS.has(key)) continue

    if (key === 'MODE') out.mode = ['swarm', 'shatter', 'portal', 'nova'].includes(value.toLowerCase()) ? value.toLowerCase() : out.mode
    if (key === 'HEIGHT') out.height = clamp(parseInt(value, 10) || out.height, 360, 1400)
    if (key === 'VDO') out.vdo = value
    if (key === 'ROOM') out.room = value.replace(/[^A-Za-z0-9_]/g, '_')
    if (key === 'TITLE') out.title = value || out.title
  }

  return out
}

const html = spec => `
  <div class="htv-shell" style="height:${spec.height}px">
    <div class="htv-stage"></div>
    <div class="htv-panel">
      <h3>${escapeHTML(spec.title)}</h3>
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
      </div>
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
  .htv-vdo.is-joined{left:5%;right:5%;top:9%;bottom:7%;width:auto;aspect-ratio:auto;transform:none;opacity:1;border-color:rgba(255,207,115,.55)}
  .htv-join{background:rgba(135,255,216,.16)!important;border-color:rgba(135,255,216,.5)!important}
  .htv-room{align-self:center;padding:0 8px;color:#87ffd8;font-size:11px;font-family:ui-monospace,monospace}
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
  div.html(html(spec))
}

export const bind = (div, item) => {
  const root = div.find('.htv-shell')[0]
  if (!root) return
  initSurface(root, parseText(item.text), item)
  div.on('dblclick', event => {
    if (event.target.closest('button,input,select,iframe')) return
    if (window.wiki?.textEditor) window.wiki.textEditor(div, item)
  })
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
  if (spec.vdo) loadVdo()

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
  root.querySelector('.htv-room').textContent = room

  function showVdo(url, joined) {
    vdoSurface.textContent = ''
    const iframe = document.createElement('iframe')
    iframe.allow = 'camera; microphone; autoplay; fullscreen; display-capture'
    iframe.src = url
    vdoSurface.appendChild(iframe)
    vdoSurface.classList.add('is-visible')
    vdoSurface.classList.toggle('is-joined', !!joined)
  }

  function loadVdo() {
    const url = (vdoInput.value || '').trim()
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

  function watchRoom() {
    showVdo(`https://vdo.ninja/?scene&room=${room}&cleanoutput`, false)
    setStatus(root, `Watching room ${room} as a live surface.`, 'Room surface active.')
  }

  function hideVdo() {
    vdoSurface.classList.remove('is-visible', 'is-joined')
    vdoSurface.textContent = ''
    setStatus(root, 'VDO surface hidden and room left. Texture source is unchanged.')
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
  root.querySelector('[data-action="synthetic"]').addEventListener('click', () => useSynthetic())
  root.querySelector('[data-action="camera"]').addEventListener('click', useCamera)
  root.querySelector('[data-action="join"]').addEventListener('click', joinRoom)
  root.querySelector('[data-action="watch"]').addEventListener('click', watchRoom)
  root.querySelector('[data-action="load-vdo"]').addEventListener('click', loadVdo)
  root.querySelector('[data-action="hide-vdo"]').addEventListener('click', hideVdo)
  modeSelect.addEventListener('change', () => { state.mode = modeSelect.value })

  resize()
  window.addEventListener('resize', resize)
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
  window.plugins.htv = { emit, bind }
}
