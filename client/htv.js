/* wiki-plugin-htv 0.4.0 */
(()=>{var X=new Set(["MODE","HEIGHT","VDO","TITLE","ROOM","UI","STREAM"]),Y="https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js",J=(t,e,a)=>Math.max(e,Math.min(a,t)),q=t=>{let e={mode:"swarm",height:620,vdo:"",room:"",ui:"studio",stream:"",title:"Hitchhiker.tv Live Surface"};for(let a of(t||"").split(`
`)){let h=a.trim();if(!h)continue;let[v,...b]=h.split(/\s+/),i=v.replace(/:$/,"").toUpperCase(),s=b.join(" ").trim();X.has(i)&&(i==="MODE"&&(e.mode=["swarm","shatter","portal","nova"].includes(s.toLowerCase())?s.toLowerCase():e.mode),i==="HEIGHT"&&(e.height=J(parseInt(s,10)||e.height,360,1400)),i==="VDO"&&(e.vdo=s),i==="ROOM"&&(e.room=s.replace(/[^A-Za-z0-9_]/g,"_")),i==="UI"&&(e.ui=["join","watch","studio"].includes(s.toLowerCase())?s.toLowerCase():e.ui),i==="STREAM"&&(e.stream=s),i==="TITLE"&&(e.title=s||e.title))}return e},Z=t=>t.ui==="join"?`
      <div class="htv-controls">
        <button type="button" data-action="join" class="htv-join htv-big">Join Room</button>
        <button type="button" data-action="fullscreen" title="Fullscreen">\u26F6</button>
      </div>
      <div class="htv-controls"><span class="htv-room" title="VDO.Ninja room name"></span></div>`:t.ui==="watch"?`
      <div class="htv-controls">
        <button type="button" data-action="watch" class="htv-join htv-big">Watch</button>
        <button type="button" data-action="fullscreen" title="Fullscreen">\u26F6</button>
      </div>
      <div class="htv-controls"><span class="htv-room" title="VDO.Ninja room name"></span></div>`:`
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
        <button type="button" data-action="fullscreen" title="Fullscreen">\u26F6</button>
      </div>
      <div class="htv-controls">
        <button type="button" data-action="join" class="htv-join">Join Room</button>
        <button type="button" data-action="watch">Watch Room</button>
        <span class="htv-room" title="VDO.Ninja room name"></span>
      </div>
      <div class="htv-controls">
        <input type="url" data-action="vdo-url" placeholder="https://vdo.ninja/?view=STREAM_ID&cleanoutput" value="${tt(t.vdo)}">
        <button type="button" data-action="load-vdo">Load VDO</button>
        <button type="button" data-action="hide-vdo">Hide</button>
      </div>`,K=t=>`
  <div class="htv-shell" style="height:${t.height}px">
    <div class="htv-stage"></div>
    <div class="htv-panel">
      <h3>${F(t.title)}</h3>
      ${Z(t)}
      <div class="htv-status" role="status">Synthetic feed active.</div>
    </div>
    <div class="htv-vdo" aria-label="VDO.Ninja live surface"></div>
    <video class="htv-video" muted playsinline autoplay></video>
    <canvas class="htv-synthetic" width="1280" height="720"></canvas>
  </div>
`,Q=`
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
`,F=t=>String(t||"").replace(/[&<>]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;"})[e]),tt=t=>F(t).replace(/"/g,"&quot;"),et=()=>{if(document.getElementById("htv-style"))return;let t=document.createElement("style");t.id="htv-style",t.textContent=Q,document.head.appendChild(t)},ot=(t,e)=>{et();let a=q(e.text);t.html(K(a))},it=(t,e)=>{let a=t.find(".htv-shell")[0];a&&(at(a,q(e.text),e),t.on("dblclick",h=>{h.target.closest("button,input,select,iframe")||window.wiki?.textEditor&&window.wiki.textEditor(t,e)}))},p=(t,e,a="")=>{let h=t.querySelector(".htv-status");h&&(h.innerHTML=a?`<strong>${F(a)}</strong> ${F(e)}`:F(e))},H=()=>{try{return window.top!==window}catch{return!0}},nt=()=>{let t=document.permissionsPolicy||document.featurePolicy;if(!t?.allowsFeature)return!0;try{return t.allowsFeature("camera")}catch{return!0}},P=()=>{let t=document.permissionsPolicy||document.featurePolicy,e="unknown";if(t?.allowsFeature)try{e=String(t.allowsFeature("camera"))}catch(a){e=`unknown (${a.name})`}return`origin=${location.origin}; secure=${String(isSecureContext)}; framed=${String(H())}; policy.camera=${e}`},at=async(t,e,a)=>{let h=t.querySelector(".htv-stage"),v=t.querySelector(".htv-video"),b=t.querySelector(".htv-synthetic"),i=b.getContext("2d"),s=t.querySelector(".htv-vdo"),j=t.querySelector('[data-action="mode"]'),y=t.querySelector('[data-action="vdo-url"]'),u={mode:e.mode,pointerX:0,pointerY:0,startedAt:performance.now(),disposed:!1,spinStart:null},d;try{d=await import(Y)}catch(o){p(t,`Could not load Three.js: ${o.message}`,"Renderer failed.");return}let m=new d.WebGLRenderer({antialias:!0,alpha:!0});m.setPixelRatio(Math.min(devicePixelRatio||1,2)),h.appendChild(m.domElement);let k=new d.Scene;k.fog=new d.FogExp2(329225,.028);let w=new d.PerspectiveCamera(46,1,.1,200);w.position.set(0,.1,16);let $=new d.VideoTexture(v);$.colorSpace=d.SRGBColorSpace;let S=new d.Group;k.add(S),rt(d,S,$,u),R(),e.vdo&&z(e.vdo,!1);let x=()=>{let o=t.getBoundingClientRect();m.setSize(o.width,o.height),w.aspect=o.width/o.height,w.updateProjectionMatrix()},E=o=>{let n=o/1e3,c=b.width,r=b.height;i.fillStyle="#071014",i.fillRect(0,0,c,r);let f=i.createRadialGradient(c*.4,r*.5,20,c*.5,r*.5,c*.7);f.addColorStop(0,"#125e52"),f.addColorStop(.55,"#111820"),f.addColorStop(1,"#030406"),i.fillStyle=f,i.fillRect(0,0,c,r);for(let l=0;l<6;l+=1){let g=c*(.18+l%3*.31)+Math.sin(n*.7+l)*18,D=r*(.28+Math.floor(l/3)*.36)+Math.cos(n*.9+l)*16;i.beginPath(),i.arc(g,D,82+Math.sin(n+l)*10,0,Math.PI*2),i.fillStyle=`hsla(${155+l*24}, 88%, ${54+l*3}%, 0.78)`,i.fill()}i.strokeStyle="rgba(135,255,216,0.55)",i.lineWidth=3,i.beginPath();for(let l=0;l<c;l+=18){let g=r*.78+Math.sin(l*.02+n*3)*26+Math.sin(l*.006-n)*44;l===0?i.moveTo(l,g):i.lineTo(l,g)}i.stroke(),i.fillStyle="rgba(255,207,115,0.88)",i.font="600 28px system-ui, sans-serif",i.fillText("Hitchhiker.tv plugin surface",42,58)},A=o=>{if(!t.isConnected||u.disposed){m.dispose();return}E(o);let n=(o-u.startedAt)/1e3;st(S,n,u),m.render(k,w),requestAnimationFrame(A)};async function C(){try{if(!navigator.mediaDevices?.getUserMedia){p(t,`This browser context does not expose getUserMedia. ${P()}`,"Camera unavailable.");return}if(!nt()){let n=H()?"This plugin is running inside a frame that has not delegated camera permission.":"Chrome reports that this document is not allowed to request camera access.";p(t,`${n} ${P()}`,"Camera blocked.");return}I(v);let o=await navigator.mediaDevices.getUserMedia({video:{width:1280,height:720},audio:!1});v.srcObject=o,await v.play(),p(t,"Camera MediaStream is driving the shader texture.","Camera active.")}catch(o){R(!1),p(t,`${o.name}: ${o.message||"camera request failed"} ${P()}`,"Camera blocked.")}}function R(o=!0){I(v),v.srcObject=b.captureStream(60),v.play(),o&&p(t,"Synthetic feed active.")}let M=e.room||`htv_${String(a?.id||"lobby").replace(/[^A-Za-z0-9_]/g,"").slice(0,12)}`,O=t.querySelector(".htv-room");O&&(O.textContent=M),y&&!y.value&&(y.value=`https://vdo.ninja/?room=${M}`);function U(o,n,c){if(s.textContent="",s.appendChild(o),n){let r=document.createElement("button");r.type="button",r.className="htv-leave",r.textContent=c,r.addEventListener("click",V),s.appendChild(r)}s.classList.add("is-visible"),s.classList.toggle("is-joined",!!n),t.classList.toggle("is-joined",!!n)}function L(o){let n=document.createElement("iframe");return n.allow="camera; microphone; autoplay; fullscreen; display-capture",n.src=o,n}function z(o,n,c="Leave Room"){U(L(o),n,c),y&&(y.value=o)}async function G(o){let n=o.match(/(?:youtube(?:-nocookie)?\.com\/(?:watch\?.*v=|live\/|embed\/)|youtu\.be\/)([\w-]{6,})/);if(n)return L(`https://www.youtube-nocookie.com/embed/${n[1]}?autoplay=1`);let c=o.match(/twitch\.tv\/([\w]+)/);if(c)return L(`https://player.twitch.tv/?channel=${c[1]}&parent=${location.hostname}&autoplay=true`);if(/\.m3u8(\?|$)/.test(o)){let r=document.createElement("video");if(r.autoplay=!0,r.playsInline=!0,r.controls=!0,r.muted=!0,window.Hls||await new Promise((f,l)=>{let g=document.createElement("script");g.src="https://cdn.jsdelivr.net/npm/hls.js@1/dist/hls.min.js",g.onload=f,g.onerror=l,document.head.appendChild(g)}).catch(()=>{}),window.Hls?.isSupported()){let f=new window.Hls;f.loadSource(o),f.attachMedia(r)}else r.src=o;return r.play().catch(()=>{}),r}return L(o)}function B(){let o=(y?.value||"").trim();if(!o){p(t,"Paste a VDO.Ninja view URL before loading.","VDO needs a URL.");return}z(o,!1),p(t,"VDO.Ninja is loaded as a live browser surface.","VDO surface active.")}function N(){z(`https://vdo.ninja/?room=${M}`,!0),p(t,`Allow camera and microphone, then join. Everyone on this page shares room ${M}. No app or account needed.`,"Joining the room.")}async function W(){if(e.stream){try{U(await G(e.stream),!0,"Stop Watching"),p(t,"Playing the broadcast stream.","Broadcast active.")}catch(o){p(t,`Could not load the stream: ${o.message||o}`,"Stream failed.")}return}z(`https://vdo.ninja/?room=${M}&videodevice=0&audiodevice=0`,!0,"Stop Watching"),p(t,`Watching joins room ${M} as a visible, silent guest \u2014 everyone can see who is watching.`,"Watching the room.")}function _(){document.fullscreenElement?document.exitFullscreen():t.requestFullscreen().catch(o=>p(t,`Fullscreen unavailable: ${o.message}`,"No fullscreen."))}function V(){s.classList.remove("is-visible","is-joined"),t.classList.remove("is-joined"),s.textContent="",p(t,"Surface hidden and room left. Texture source is unchanged.")}t.addEventListener("pointermove",o=>{let n=t.getBoundingClientRect();u.pointerX=(o.clientX-n.left)/n.width*2-1,u.pointerY=-((o.clientY-n.top)/n.height*2-1)}),h.addEventListener("click",o=>{let n=t.getBoundingClientRect(),c=new d.Vector2((o.clientX-n.left)/n.width*2-1,-((o.clientY-n.top)/n.height*2-1)),f=new d.Vector3(c.x,c.y,.5).unproject(w).sub(w.position).normalize(),l=w.position.clone().add(f.multiplyScalar(-w.position.z/f.z));S.worldToLocal(l);let g=(performance.now()-u.startedAt)/1e3,D=S.userData.uniforms;D.uClick.value.set(l.x,l.y),D.uClickTime.value=g,u.spinStart=g});let T=(o,n,c="click")=>{let r=t.querySelector(`[data-action="${o}"]`);r&&r.addEventListener(c,n)};T("synthetic",()=>R()),T("camera",C),T("join",N),T("watch",W),T("load-vdo",B),T("hide-vdo",V),T("fullscreen",_),j&&j.addEventListener("change",()=>{u.mode=j.value}),e.ui==="join"?p(t,`Join with camera and microphone \u2014 everyone in room ${M} is visible. No app or account needed.`):e.ui==="watch"&&p(t,e.stream?"Press Watch to play the broadcast.":`Watching joins room ${M} as a visible, silent guest.`),x(),window.addEventListener("resize",x),document.addEventListener("fullscreenchange",x),requestAnimationFrame(A)},I=t=>{t.srcObject?.getTracks&&t.srcObject.getTracks().forEach(e=>e.stop())},rt=(t,e,a,h)=>{let v={uTexture:{value:a},uTime:{value:0},uPointer:{value:new t.Vector2},uMode:{value:0},uClick:{value:new t.Vector2(999,999)},uClickTime:{value:-999}},b=new t.ShaderMaterial({uniforms:v,transparent:!0,side:t.DoubleSide,vertexShader:`
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
      }`});e.userData.uniforms=v;let i=24,s=Math.round(i*9/16),j=12.8/i,y=7.2/s;for(let u=0;u<s;u+=1)for(let d=0;d<i;d+=1){let m=new t.PlaneGeometry(j*.94,y*.94,1,1),k=[d/i,1-(u+1)/s],w=[(d+1)/i,1-u/s],$=(d-i/2+.5)*j,S=(s/2-u-.5)*y,x=m.attributes.position.count;m.setAttribute("tileUvMin",new t.BufferAttribute(new Float32Array(x*2).fill(0).map((A,C)=>k[C%2]),2)),m.setAttribute("tileUvMax",new t.BufferAttribute(new Float32Array(x*2).fill(0).map((A,C)=>w[C%2]),2)),m.setAttribute("tileIndex",new t.BufferAttribute(new Float32Array(x).fill(u*i+d),1)),m.setAttribute("tileSeed",new t.BufferAttribute(new Float32Array(x).fill(Math.random()),1)),m.setAttribute("tileCenter",new t.BufferAttribute(new Float32Array(x*2).fill(0).map((A,C)=>C%2===0?$:S),2));let E=new t.Mesh(m,b);E.position.x=$,E.position.y=S,e.add(E)}},st=(t,e,a)=>{let h=t.userData.uniforms;h.uTime.value=e,h.uPointer.value.set(a.pointerX,a.pointerY),h.uMode.value=a.mode==="swarm"?0:a.mode==="shatter"?1:a.mode==="portal"?2:3;let v=0,b=0;if(a.spinStart!=null){let i=(e-a.spinStart)/1.8;i>=1?a.spinStart=null:i>0&&(v=(i<.5?4*i*i*i:1-Math.pow(-2*i+2,3)/2)*Math.PI*2,b=Math.sin(i*Math.PI))}t.rotation.y=Math.sin(e*.22)*.16+a.pointerX*.12+v,t.rotation.x=-.06+a.pointerY*.08,t.position.z=Math.sin(e*.4)*.32-b*5.2};typeof window<"u"&&(window.plugins=window.plugins||{},window.plugins.htv={emit:ot,bind:it});})();
//# sourceMappingURL=htv.js.map
