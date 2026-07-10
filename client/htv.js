/* wiki-plugin-htv 0.3.0 */
(()=>{var G=new Set(["MODE","HEIGHT","VDO","TITLE","ROOM"]),B="https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js",H=(t,o,n)=>Math.max(o,Math.min(n,t)),O=t=>{let o={mode:"swarm",height:620,vdo:"",room:"",title:"Hitchhiker.tv Live Surface"};for(let n of(t||"").split(`
`)){let d=n.trim();if(!d)continue;let[u,...h]=d.split(/\s+/),e=u.replace(/:$/,"").toUpperCase(),s=h.join(" ").trim();G.has(e)&&(e==="MODE"&&(o.mode=["swarm","shatter","portal","nova"].includes(s.toLowerCase())?s.toLowerCase():o.mode),e==="HEIGHT"&&(o.height=H(parseInt(s,10)||o.height,360,1400)),e==="VDO"&&(o.vdo=s),e==="ROOM"&&(o.room=s.replace(/[^A-Za-z0-9_]/g,"_")),e==="TITLE"&&(o.title=s||o.title))}return o},_=t=>`
  <div class="htv-shell" style="height:${t.height}px">
    <div class="htv-stage"></div>
    <div class="htv-panel">
      <h3>${E(t.title)}</h3>
      <p>A live media surface rendered directly by the wiki plugin, avoiding the frame plugin sandbox. Click the surface to spin it through the depth plane.</p>
      <div class="htv-controls">
        <button type="button" data-action="synthetic">Synthetic</button>
        <button type="button" data-action="camera">Use Camera</button>
        <select data-action="mode">
          <option value="swarm"${t.mode==="swarm"?" selected":""}>Swarm</option>
          <option value="shatter"${t.mode==="shatter"?" selected":""}>Shatter</option>
          <option value="portal"${t.mode==="portal"?" selected":""}>Portal</option>
          <option value="nova"${t.mode==="nova"?" selected":""}>Nova</option>
        </select>
      </div>
      <div class="htv-controls">
        <button type="button" data-action="join" class="htv-join">Join Room</button>
        <button type="button" data-action="watch">Watch Room</button>
        <span class="htv-room" title="VDO.Ninja room name"></span>
      </div>
      <div class="htv-controls">
        <input type="url" data-action="vdo-url" placeholder="https://vdo.ninja/?view=STREAM_ID&cleanoutput" value="${Y(t.vdo)}">
        <button type="button" data-action="load-vdo">Load VDO</button>
        <button type="button" data-action="hide-vdo">Hide</button>
      </div>
      <div class="htv-status" role="status">Synthetic feed active.</div>
    </div>
    <div class="htv-vdo" aria-label="VDO.Ninja live surface"></div>
    <video class="htv-video" muted playsinline autoplay></video>
    <canvas class="htv-synthetic" width="1280" height="720"></canvas>
  </div>
`,X=`
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
`,E=t=>String(t||"").replace(/[&<>]/g,o=>({"&":"&amp;","<":"&lt;",">":"&gt;"})[o]),Y=t=>E(t).replace(/"/g,"&quot;"),N=()=>{if(document.getElementById("htv-style"))return;let t=document.createElement("style");t.id="htv-style",t.textContent=X,document.head.appendChild(t)},W=(t,o)=>{N();let n=O(o.text);t.html(_(n))},J=(t,o)=>{let n=t.find(".htv-shell")[0];n&&(K(n,O(o.text),o),t.on("dblclick",d=>{d.target.closest("button,input,select,iframe")||window.wiki?.textEditor&&window.wiki.textEditor(t,o)}))},m=(t,o,n="")=>{let d=t.querySelector(".htv-status");d&&(d.innerHTML=n?`<strong>${E(n)}</strong> ${E(o)}`:E(o))},q=()=>{try{return window.top!==window}catch{return!0}},Z=()=>{let t=document.permissionsPolicy||document.featurePolicy;if(!t?.allowsFeature)return!0;try{return t.allowsFeature("camera")}catch{return!0}},R=()=>{let t=document.permissionsPolicy||document.featurePolicy,o="unknown";if(t?.allowsFeature)try{o=String(t.allowsFeature("camera"))}catch(n){o=`unknown (${n.name})`}return`origin=${location.origin}; secure=${String(isSecureContext)}; framed=${String(q())}; policy.camera=${o}`},K=async(t,o,n)=>{let d=t.querySelector(".htv-stage"),u=t.querySelector(".htv-video"),h=t.querySelector(".htv-synthetic"),e=h.getContext("2d"),s=t.querySelector(".htv-vdo"),M=t.querySelector('[data-action="mode"]'),j=t.querySelector('[data-action="vdo-url"]'),c={mode:o.mode,pointerX:0,pointerY:0,startedAt:performance.now(),disposed:!1,spinStart:null},l;try{l=await import(B)}catch(i){m(t,`Could not load Three.js: ${i.message}`,"Renderer failed.");return}let v=new l.WebGLRenderer({antialias:!0,alpha:!0});v.setPixelRatio(Math.min(devicePixelRatio||1,2)),d.appendChild(v.domElement);let C=new l.Scene;C.fog=new l.FogExp2(329225,.028);let f=new l.PerspectiveCamera(46,1,.1,200);f.position.set(0,.1,16);let T=new l.VideoTexture(u);T.colorSpace=l.SRGBColorSpace;let g=new l.Group;C.add(g),Q(l,g,T,c),D(),o.vdo&&P();let b=()=>{let i=t.getBoundingClientRect();v.setSize(i.width,i.height),f.aspect=i.width/i.height,f.updateProjectionMatrix()},k=i=>{let a=i/1e3,p=h.width,y=h.height;e.fillStyle="#071014",e.fillRect(0,0,p,y);let w=e.createRadialGradient(p*.4,y*.5,20,p*.5,y*.5,p*.7);w.addColorStop(0,"#125e52"),w.addColorStop(.55,"#111820"),w.addColorStop(1,"#030406"),e.fillStyle=w,e.fillRect(0,0,p,y);for(let r=0;r<6;r+=1){let S=p*(.18+r%3*.31)+Math.sin(a*.7+r)*18,L=y*(.28+Math.floor(r/3)*.36)+Math.cos(a*.9+r)*16;e.beginPath(),e.arc(S,L,82+Math.sin(a+r)*10,0,Math.PI*2),e.fillStyle=`hsla(${155+r*24}, 88%, ${54+r*3}%, 0.78)`,e.fill()}e.strokeStyle="rgba(135,255,216,0.55)",e.lineWidth=3,e.beginPath();for(let r=0;r<p;r+=18){let S=y*.78+Math.sin(r*.02+a*3)*26+Math.sin(r*.006-a)*44;r===0?e.moveTo(r,S):e.lineTo(r,S)}e.stroke(),e.fillStyle="rgba(255,207,115,0.88)",e.font="600 28px system-ui, sans-serif",e.fillText("Hitchhiker.tv plugin surface",42,58)},A=i=>{if(!t.isConnected||c.disposed){v.dispose();return}k(i);let a=(i-c.startedAt)/1e3;tt(g,a,c),v.render(C,f),requestAnimationFrame(A)};async function x(){try{if(!navigator.mediaDevices?.getUserMedia){m(t,`This browser context does not expose getUserMedia. ${R()}`,"Camera unavailable.");return}if(!Z()){let a=q()?"This plugin is running inside a frame that has not delegated camera permission.":"Chrome reports that this document is not allowed to request camera access.";m(t,`${a} ${R()}`,"Camera blocked.");return}F(u);let i=await navigator.mediaDevices.getUserMedia({video:{width:1280,height:720},audio:!1});u.srcObject=i,await u.play(),m(t,"Camera MediaStream is driving the shader texture.","Camera active.")}catch(i){D(!1),m(t,`${i.name}: ${i.message||"camera request failed"} ${R()}`,"Camera blocked.")}}function D(i=!0){F(u),u.srcObject=h.captureStream(60),u.play(),i&&m(t,"Synthetic feed active.")}let $=o.room||`htv_${String(n?.id||"lobby").replace(/[^A-Za-z0-9_]/g,"").slice(0,12)}`;t.querySelector(".htv-room").textContent=$;function z(i,a){s.textContent="";let p=document.createElement("iframe");p.allow="camera; microphone; autoplay; fullscreen; display-capture",p.src=i,s.appendChild(p),s.classList.add("is-visible"),s.classList.toggle("is-joined",!!a)}function P(){let i=(j.value||"").trim();if(!i){m(t,"Paste a VDO.Ninja view URL before loading.","VDO needs a URL.");return}z(i,!1),m(t,"VDO.Ninja is loaded as a live browser surface.","VDO surface active.")}function V(){z(`https://vdo.ninja/?room=${$}`,!0),m(t,`Allow camera and microphone, then join. Everyone on this page shares room ${$}. No app or account needed.`,"Joining the room.")}function U(){z(`https://vdo.ninja/?scene&room=${$}&cleanoutput`,!1),m(t,`Watching room ${$} as a live surface.`,"Room surface active.")}function I(){s.classList.remove("is-visible","is-joined"),s.textContent="",m(t,"VDO surface hidden and room left. Texture source is unchanged.")}t.addEventListener("pointermove",i=>{let a=t.getBoundingClientRect();c.pointerX=(i.clientX-a.left)/a.width*2-1,c.pointerY=-((i.clientY-a.top)/a.height*2-1)}),d.addEventListener("click",i=>{let a=t.getBoundingClientRect(),p=new l.Vector2((i.clientX-a.left)/a.width*2-1,-((i.clientY-a.top)/a.height*2-1)),w=new l.Vector3(p.x,p.y,.5).unproject(f).sub(f.position).normalize(),r=f.position.clone().add(w.multiplyScalar(-f.position.z/w.z));g.worldToLocal(r);let S=(performance.now()-c.startedAt)/1e3,L=g.userData.uniforms;L.uClick.value.set(r.x,r.y),L.uClickTime.value=S,c.spinStart=S}),t.querySelector('[data-action="synthetic"]').addEventListener("click",()=>D()),t.querySelector('[data-action="camera"]').addEventListener("click",x),t.querySelector('[data-action="join"]').addEventListener("click",V),t.querySelector('[data-action="watch"]').addEventListener("click",U),t.querySelector('[data-action="load-vdo"]').addEventListener("click",P),t.querySelector('[data-action="hide-vdo"]').addEventListener("click",I),M.addEventListener("change",()=>{c.mode=M.value}),b(),window.addEventListener("resize",b),requestAnimationFrame(A)},F=t=>{t.srcObject?.getTracks&&t.srcObject.getTracks().forEach(o=>o.stop())},Q=(t,o,n,d)=>{let u={uTexture:{value:n},uTime:{value:0},uPointer:{value:new t.Vector2},uMode:{value:0},uClick:{value:new t.Vector2(999,999)},uClickTime:{value:-999}},h=new t.ShaderMaterial({uniforms:u,transparent:!0,side:t.DoubleSide,vertexShader:`
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
      }`,fragmentShader:`
      uniform sampler2D uTexture; uniform float uTime; varying vec2 vUv; varying float vGlow;
      void main(){
        vec2 uv=vUv; float scan=sin((uv.y+uTime*.035)*720.0)*.025; vec3 col;
        col.r=texture2D(uTexture,uv+vec2(.003+scan,0.0)).r; col.g=texture2D(uTexture,uv).g; col.b=texture2D(uTexture,uv-vec2(.004+scan,0.0)).b;
        col+=vec3(.05,.18,.14)*vGlow; float vignette=smoothstep(.9,.12,length(uv-.5)); gl_FragColor=vec4(col*(.45+vignette),.94);
      }`});o.userData.uniforms=u;let e=24,s=Math.round(e*9/16),M=12.8/e,j=7.2/s;for(let c=0;c<s;c+=1)for(let l=0;l<e;l+=1){let v=new t.PlaneGeometry(M*.94,j*.94,1,1),C=[l/e,1-(c+1)/s],f=[(l+1)/e,1-c/s],T=(l-e/2+.5)*M,g=(s/2-c-.5)*j,b=v.attributes.position.count;v.setAttribute("tileUvMin",new t.BufferAttribute(new Float32Array(b*2).fill(0).map((A,x)=>C[x%2]),2)),v.setAttribute("tileUvMax",new t.BufferAttribute(new Float32Array(b*2).fill(0).map((A,x)=>f[x%2]),2)),v.setAttribute("tileIndex",new t.BufferAttribute(new Float32Array(b).fill(c*e+l),1)),v.setAttribute("tileSeed",new t.BufferAttribute(new Float32Array(b).fill(Math.random()),1)),v.setAttribute("tileCenter",new t.BufferAttribute(new Float32Array(b*2).fill(0).map((A,x)=>x%2===0?T:g),2));let k=new t.Mesh(v,h);k.position.x=T,k.position.y=g,o.add(k)}},tt=(t,o,n)=>{let d=t.userData.uniforms;d.uTime.value=o,d.uPointer.value.set(n.pointerX,n.pointerY),d.uMode.value=n.mode==="swarm"?0:n.mode==="shatter"?1:n.mode==="portal"?2:3;let u=0,h=0;if(n.spinStart!=null){let e=(o-n.spinStart)/1.8;e>=1?n.spinStart=null:e>0&&(u=(e<.5?4*e*e*e:1-Math.pow(-2*e+2,3)/2)*Math.PI*2,h=Math.sin(e*Math.PI))}t.rotation.y=Math.sin(o*.22)*.16+n.pointerX*.12+u,t.rotation.x=-.06+n.pointerY*.08,t.position.z=Math.sin(o*.4)*.32-h*5.2};typeof window<"u"&&(window.plugins=window.plugins||{},window.plugins.htv={emit:W,bind:J});})();
//# sourceMappingURL=htv.js.map
