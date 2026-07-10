/* wiki-plugin-htv 0.1.0 */
(()=>{var z=new Set(["MODE","HEIGHT","VDO","TITLE"]),R="https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js",j=(e,t,i)=>Math.max(t,Math.min(i,e)),P=e=>{let t={mode:"swarm",height:620,vdo:"",title:"Hitchhiker.tv Live Surface"};for(let i of(e||"").split(`
`)){let n=i.trim();if(!n)continue;let[h,...a]=n.split(/\s+/),r=h.replace(/:$/,"").toUpperCase(),d=a.join(" ").trim();z.has(r)&&(r==="MODE"&&(t.mode=["swarm","shatter","portal"].includes(d.toLowerCase())?d.toLowerCase():t.mode),r==="HEIGHT"&&(t.height=j(parseInt(d,10)||t.height,360,1400)),r==="VDO"&&(t.vdo=d),r==="TITLE"&&(t.title=d||t.title))}return t},V=e=>`
  <div class="htv-shell" style="height:${e.height}px">
    <div class="htv-stage"></div>
    <div class="htv-panel">
      <h3>${S(e.title)}</h3>
      <p>A live media surface rendered directly by the wiki plugin, avoiding the frame plugin sandbox.</p>
      <div class="htv-controls">
        <button type="button" data-action="synthetic">Synthetic</button>
        <button type="button" data-action="camera">Use Camera</button>
        <select data-action="mode">
          <option value="swarm"${e.mode==="swarm"?" selected":""}>Swarm</option>
          <option value="shatter"${e.mode==="shatter"?" selected":""}>Shatter</option>
          <option value="portal"${e.mode==="portal"?" selected":""}>Portal</option>
        </select>
      </div>
      <div class="htv-controls">
        <input type="url" data-action="vdo-url" placeholder="https://vdo.ninja/?view=STREAM_ID&cleanoutput" value="${G(e.vdo)}">
        <button type="button" data-action="load-vdo">Load VDO</button>
        <button type="button" data-action="hide-vdo">Hide</button>
      </div>
      <div class="htv-status" role="status">Synthetic feed active.</div>
    </div>
    <div class="htv-vdo" aria-label="VDO.Ninja live surface"></div>
    <video class="htv-video" muted playsinline autoplay></video>
    <canvas class="htv-synthetic" width="1280" height="720"></canvas>
  </div>
`,I=`
  .htv-shell{position:relative;overflow:hidden;border-radius:8px;background:#050609;color:#f3f5ee;font-family:Inter,ui-sans-serif,system-ui,sans-serif}
  .htv-stage{position:absolute;inset:0;background:#050609}
  .htv-panel{position:absolute;z-index:5;left:12px;right:12px;top:12px;max-width:430px;padding:12px;border:1px solid rgba(255,255,255,.18);border-radius:8px;background:rgba(9,12,16,.78);backdrop-filter:blur(14px)}
  .htv-panel h3{margin:0 0 6px;font-size:16px}.htv-panel p{margin:0 0 10px;color:#b9c0b6;font-size:12px;line-height:1.35}
  .htv-controls{display:flex;flex-wrap:wrap;gap:7px;margin:7px 0}.htv-controls button,.htv-controls select,.htv-controls input{min-height:31px;border:1px solid rgba(255,255,255,.24);border-radius:7px;background:rgba(255,255,255,.08);color:#f3f5ee;font:inherit;font-size:12px}.htv-controls button{padding:0 10px;cursor:pointer}.htv-controls input{flex:1 1 210px;min-width:0;padding:0 8px}.htv-controls select{padding:0 24px 0 8px}
  .htv-status{margin-top:8px;padding:7px 9px;border:1px solid rgba(255,255,255,.14);border-radius:7px;background:rgba(0,0,0,.22);color:#b9c0b6;font-size:12px;line-height:1.35}.htv-status strong{color:#87ffd8}
  .htv-vdo{position:absolute;z-index:4;right:18px;bottom:18px;width:min(42%,360px);aspect-ratio:16/9;border:1px solid rgba(135,255,216,.42);border-radius:8px;overflow:hidden;background:#07090b;box-shadow:0 16px 58px rgba(0,0,0,.45),0 0 36px rgba(135,255,216,.14);transform:perspective(800px) rotateY(-14deg) rotateX(5deg);opacity:0;pointer-events:none;transition:opacity .18s ease}
  .htv-vdo.is-visible{opacity:.9;pointer-events:auto}.htv-vdo iframe{width:100%;height:100%;border:0;background:#000}.htv-video,.htv-synthetic{position:absolute;left:-9999px;top:-9999px;width:2px;height:2px;opacity:0}
`,S=e=>String(e||"").replace(/[&<>]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;"})[t]),G=e=>S(e).replace(/"/g,"&quot;"),H=()=>{if(document.getElementById("htv-style"))return;let e=document.createElement("style");e.id="htv-style",e.textContent=I,document.head.appendChild(e)},B=(e,t)=>{H();let i=P(t.text);e.html(V(i))},X=(e,t)=>{let i=e.find(".htv-shell")[0];i&&(_(i,P(t.text)),e.on("dblclick",n=>{n.target.closest("button,input,select,iframe")||window.wiki?.textEditor&&window.wiki.textEditor(e,t)}))},f=(e,t,i="")=>{let n=e.querySelector(".htv-status");n&&(n.innerHTML=i?`<strong>${S(i)}</strong> ${S(t)}`:S(t))},F=()=>{try{return window.top!==window}catch{return!0}},Y=()=>{let e=document.permissionsPolicy||document.featurePolicy;if(!e?.allowsFeature)return!0;try{return e.allowsFeature("camera")}catch{return!0}},$=()=>{let e=document.permissionsPolicy||document.featurePolicy,t="unknown";if(e?.allowsFeature)try{t=String(e.allowsFeature("camera"))}catch(i){t=`unknown (${i.name})`}return`origin=${location.origin}; secure=${String(isSecureContext)}; framed=${String(F())}; policy.camera=${t}`},_=async(e,t)=>{let i=e.querySelector(".htv-stage"),n=e.querySelector(".htv-video"),h=e.querySelector(".htv-synthetic"),a=h.getContext("2d"),r=e.querySelector(".htv-vdo"),d=e.querySelector('[data-action="mode"]'),M=e.querySelector('[data-action="vdo-url"]'),p={mode:t.mode,pointerX:0,pointerY:0,startedAt:performance.now(),disposed:!1},c;try{c=await import(R)}catch(o){f(e,`Could not load Three.js: ${o.message}`,"Renderer failed.");return}let u=new c.WebGLRenderer({antialias:!0,alpha:!0});u.setPixelRatio(Math.min(devicePixelRatio||1,2)),i.appendChild(u.domElement);let v=new c.Scene;v.fog=new c.FogExp2(329225,.028);let x=new c.PerspectiveCamera(46,1,.1,200);x.position.set(0,.1,16);let T=new c.VideoTexture(n);T.colorSpace=c.SRGBColorSpace;let m=new c.Group;v.add(m),N(c,m,T,p),D(),t.vdo&&A();let b=()=>{let o=e.getBoundingClientRect();u.setSize(o.width,o.height),x.aspect=o.width/o.height,x.updateProjectionMatrix()},E=o=>{let s=o/1e3,g=h.width,w=h.height;a.fillStyle="#071014",a.fillRect(0,0,g,w);let C=a.createRadialGradient(g*.4,w*.5,20,g*.5,w*.5,g*.7);C.addColorStop(0,"#125e52"),C.addColorStop(.55,"#111820"),C.addColorStop(1,"#030406"),a.fillStyle=C,a.fillRect(0,0,g,w);for(let l=0;l<6;l+=1){let k=g*(.18+l%3*.31)+Math.sin(s*.7+l)*18,O=w*(.28+Math.floor(l/3)*.36)+Math.cos(s*.9+l)*16;a.beginPath(),a.arc(k,O,82+Math.sin(s+l)*10,0,Math.PI*2),a.fillStyle=`hsla(${155+l*24}, 88%, ${54+l*3}%, 0.78)`,a.fill()}a.strokeStyle="rgba(135,255,216,0.55)",a.lineWidth=3,a.beginPath();for(let l=0;l<g;l+=18){let k=w*.78+Math.sin(l*.02+s*3)*26+Math.sin(l*.006-s)*44;l===0?a.moveTo(l,k):a.lineTo(l,k)}a.stroke(),a.fillStyle="rgba(255,207,115,0.88)",a.font="600 28px system-ui, sans-serif",a.fillText("Hitchhiker.tv plugin surface",42,58)},y=o=>{if(!e.isConnected||p.disposed){u.dispose();return}E(o);let s=(o-p.startedAt)/1e3;W(m,s,p),u.render(v,x),requestAnimationFrame(y)};async function U(){try{if(!navigator.mediaDevices?.getUserMedia){f(e,`This browser context does not expose getUserMedia. ${$()}`,"Camera unavailable.");return}if(!Y()){let s=F()?"This plugin is running inside a frame that has not delegated camera permission.":"Chrome reports that this document is not allowed to request camera access.";f(e,`${s} ${$()}`,"Camera blocked.");return}L(n);let o=await navigator.mediaDevices.getUserMedia({video:{width:1280,height:720},audio:!1});n.srcObject=o,await n.play(),f(e,"Camera MediaStream is driving the shader texture.","Camera active.")}catch(o){D(!1),f(e,`${o.name}: ${o.message||"camera request failed"} ${$()}`,"Camera blocked.")}}function D(o=!0){L(n),n.srcObject=h.captureStream(60),n.play(),o&&f(e,"Synthetic feed active.")}function A(){let o=(M.value||"").trim();if(!o){f(e,"Paste a VDO.Ninja view URL before loading.","VDO needs a URL.");return}r.textContent="";let s=document.createElement("iframe");s.allow="camera; microphone; autoplay; fullscreen; display-capture",s.src=o,r.appendChild(s),r.classList.add("is-visible"),f(e,"VDO.Ninja is loaded as a live browser surface.","VDO surface active.")}function q(){r.classList.remove("is-visible"),r.textContent="",f(e,"VDO surface hidden. Texture source is unchanged.")}e.addEventListener("pointermove",o=>{let s=e.getBoundingClientRect();p.pointerX=(o.clientX-s.left)/s.width*2-1,p.pointerY=-((o.clientY-s.top)/s.height*2-1)}),e.querySelector('[data-action="synthetic"]').addEventListener("click",()=>D()),e.querySelector('[data-action="camera"]').addEventListener("click",U),e.querySelector('[data-action="load-vdo"]').addEventListener("click",A),e.querySelector('[data-action="hide-vdo"]').addEventListener("click",q),d.addEventListener("change",()=>{p.mode=d.value}),b(),window.addEventListener("resize",b),requestAnimationFrame(y)},L=e=>{e.srcObject?.getTracks&&e.srcObject.getTracks().forEach(t=>t.stop())},N=(e,t,i,n)=>{let h={uTexture:{value:i},uTime:{value:0},uPointer:{value:new e.Vector2},uMode:{value:0}},a=new e.ShaderMaterial({uniforms:h,transparent:!0,side:e.DoubleSide,vertexShader:`
      uniform float uTime; uniform vec2 uPointer; uniform float uMode;
      attribute vec2 tileUvMin; attribute vec2 tileUvMax; attribute float tileIndex; attribute float tileSeed;
      varying vec2 vUv; varying float vGlow;
      mat2 rot(float a){float s=sin(a);float c=cos(a);return mat2(c,-s,s,c);}
      void main(){
        vUv=mix(tileUvMin,tileUvMax,uv); vec3 p=position;
        float wave=sin(uTime*1.7+tileSeed*6.283); float pulse=sin(uTime*.7+tileIndex*.037);
        float pointerFalloff=1.0-clamp(length(position.xy*.08-uPointer)*1.6,0.0,1.0);
        if(uMode<.5){p.z+=wave*.85+pointerFalloff*2.8; p.xy+=normalize(vec2(position.x+.01,position.y+.01))*pulse*.08;}
        else if(uMode<1.5){p.xy=rot(wave*.18+pointerFalloff*.35)*p.xy; p.z+=abs(wave)*2.6+pointerFalloff*5.0;}
        else{float r=length(position.xy); p.z+=sin(r*1.8-uTime*2.4)*1.4; p.xy*=1.0+.07*sin(uTime+r*3.0); p.z+=pointerFalloff*3.6;}
        vGlow=pointerFalloff+.35*abs(wave); gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);
      }`,fragmentShader:`
      uniform sampler2D uTexture; uniform float uTime; varying vec2 vUv; varying float vGlow;
      void main(){
        vec2 uv=vUv; float scan=sin((uv.y+uTime*.035)*720.0)*.025; vec3 col;
        col.r=texture2D(uTexture,uv+vec2(.003+scan,0.0)).r; col.g=texture2D(uTexture,uv).g; col.b=texture2D(uTexture,uv-vec2(.004+scan,0.0)).b;
        col+=vec3(.05,.18,.14)*vGlow; float vignette=smoothstep(.9,.12,length(uv-.5)); gl_FragColor=vec4(col*(.45+vignette),.94);
      }`});t.userData.uniforms=h;let r=24,d=Math.round(r*9/16),M=12.8/r,p=7.2/d;for(let c=0;c<d;c+=1)for(let u=0;u<r;u+=1){let v=new e.PlaneGeometry(M*.94,p*.94,1,1),x=[u/r,1-(c+1)/d],T=[(u+1)/r,1-c/d],m=v.attributes.position.count;v.setAttribute("tileUvMin",new e.BufferAttribute(new Float32Array(m*2).fill(0).map((E,y)=>x[y%2]),2)),v.setAttribute("tileUvMax",new e.BufferAttribute(new Float32Array(m*2).fill(0).map((E,y)=>T[y%2]),2)),v.setAttribute("tileIndex",new e.BufferAttribute(new Float32Array(m).fill(c*r+u),1)),v.setAttribute("tileSeed",new e.BufferAttribute(new Float32Array(m).fill(Math.random()),1));let b=new e.Mesh(v,a);b.position.x=(u-r/2+.5)*M,b.position.y=(d/2-c-.5)*p,t.add(b)}},W=(e,t,i)=>{let n=e.userData.uniforms;n.uTime.value=t,n.uPointer.value.set(i.pointerX,i.pointerY),n.uMode.value=i.mode==="swarm"?0:i.mode==="shatter"?1:2,e.rotation.y=Math.sin(t*.22)*.16+i.pointerX*.12,e.rotation.x=-.06+i.pointerY*.08,e.position.z=Math.sin(t*.4)*.32};typeof window<"u"&&(window.plugins=window.plugins||{},window.plugins.htv={emit:B,bind:X});})();
//# sourceMappingURL=htv.js.map
