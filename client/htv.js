/* wiki-plugin-htv 0.3.1 */
(()=>{var B=new Set(["MODE","HEIGHT","VDO","TITLE","ROOM"]),H="https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js",_=(e,o,n)=>Math.max(o,Math.min(n,e)),U=e=>{let o={mode:"swarm",height:620,vdo:"",room:"",title:"Hitchhiker.tv Live Surface"};for(let n of(e||"").split(`
`)){let d=n.trim();if(!d)continue;let[u,...m]=d.split(/\s+/),t=u.replace(/:$/,"").toUpperCase(),r=m.join(" ").trim();B.has(t)&&(t==="MODE"&&(o.mode=["swarm","shatter","portal","nova"].includes(r.toLowerCase())?r.toLowerCase():o.mode),t==="HEIGHT"&&(o.height=_(parseInt(r,10)||o.height,360,1400)),t==="VDO"&&(o.vdo=r),t==="ROOM"&&(o.room=r.replace(/[^A-Za-z0-9_]/g,"_")),t==="TITLE"&&(o.title=r||o.title))}return o},N=e=>`
  <div class="htv-shell" style="height:${e.height}px">
    <div class="htv-stage"></div>
    <div class="htv-panel">
      <h3>${$(e.title)}</h3>
      <p>A live media surface rendered directly by the wiki plugin, avoiding the frame plugin sandbox. Click the surface to spin it through the depth plane.</p>
      <div class="htv-controls">
        <button type="button" data-action="synthetic">Synthetic</button>
        <button type="button" data-action="camera">Use Camera</button>
        <select data-action="mode">
          <option value="swarm"${e.mode==="swarm"?" selected":""}>Swarm</option>
          <option value="shatter"${e.mode==="shatter"?" selected":""}>Shatter</option>
          <option value="portal"${e.mode==="portal"?" selected":""}>Portal</option>
          <option value="nova"${e.mode==="nova"?" selected":""}>Nova</option>
        </select>
      </div>
      <div class="htv-controls">
        <button type="button" data-action="join" class="htv-join">Join Room</button>
        <button type="button" data-action="watch">Watch Room</button>
        <span class="htv-room" title="VDO.Ninja room name"></span>
      </div>
      <div class="htv-controls">
        <input type="url" data-action="vdo-url" placeholder="https://vdo.ninja/?view=STREAM_ID&cleanoutput" value="${Y(e.vdo)}">
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
  .htv-vdo.is-joined{left:3%;right:3%;top:3%;bottom:3%;width:auto;aspect-ratio:auto;transform:none;opacity:1;border-color:rgba(255,207,115,.55);z-index:6}
  .htv-shell.is-joined .htv-panel{opacity:0;pointer-events:none}
  .htv-leave{position:absolute;top:10px;right:10px;z-index:2;min-height:31px;padding:0 12px;border:1px solid rgba(255,207,115,.6);border-radius:7px;background:rgba(9,12,16,.85);color:#ffcf73;font:inherit;font-size:12px;cursor:pointer}
  .htv-join{background:rgba(135,255,216,.16)!important;border-color:rgba(135,255,216,.5)!important}
  .htv-room{align-self:center;padding:0 8px;color:#87ffd8;font-size:11px;font-family:ui-monospace,monospace}
`,$=e=>String(e||"").replace(/[&<>]/g,o=>({"&":"&amp;","<":"&lt;",">":"&gt;"})[o]),Y=e=>$(e).replace(/"/g,"&quot;"),W=()=>{if(document.getElementById("htv-style"))return;let e=document.createElement("style");e.id="htv-style",e.textContent=X,document.head.appendChild(e)},J=(e,o)=>{W();let n=U(o.text);e.html(N(n))},Z=(e,o)=>{let n=e.find(".htv-shell")[0];n&&(Q(n,U(o.text),o),e.on("dblclick",d=>{d.target.closest("button,input,select,iframe")||window.wiki?.textEditor&&window.wiki.textEditor(e,o)}))},f=(e,o,n="")=>{let d=e.querySelector(".htv-status");d&&(d.innerHTML=n?`<strong>${$(n)}</strong> ${$(o)}`:$(o))},V=()=>{try{return window.top!==window}catch{return!0}},K=()=>{let e=document.permissionsPolicy||document.featurePolicy;if(!e?.allowsFeature)return!0;try{return e.allowsFeature("camera")}catch{return!0}},R=()=>{let e=document.permissionsPolicy||document.featurePolicy,o="unknown";if(e?.allowsFeature)try{o=String(e.allowsFeature("camera"))}catch(n){o=`unknown (${n.name})`}return`origin=${location.origin}; secure=${String(isSecureContext)}; framed=${String(V())}; policy.camera=${o}`},Q=async(e,o,n)=>{let d=e.querySelector(".htv-stage"),u=e.querySelector(".htv-video"),m=e.querySelector(".htv-synthetic"),t=m.getContext("2d"),r=e.querySelector(".htv-vdo"),C=e.querySelector('[data-action="mode"]'),y=e.querySelector('[data-action="vdo-url"]'),c={mode:o.mode,pointerX:0,pointerY:0,startedAt:performance.now(),disposed:!1,spinStart:null},l;try{l=await import(H)}catch(i){f(e,`Could not load Three.js: ${i.message}`,"Renderer failed.");return}let v=new l.WebGLRenderer({antialias:!0,alpha:!0});v.setPixelRatio(Math.min(devicePixelRatio||1,2)),d.appendChild(v.domElement);let T=new l.Scene;T.fog=new l.FogExp2(329225,.028);let g=new l.PerspectiveCamera(46,1,.1,200);g.position.set(0,.1,16);let k=new l.VideoTexture(u);k.colorSpace=l.SRGBColorSpace;let b=new l.Group;T.add(b),ee(l,b,k,c),z(),o.vdo&&F();let x=()=>{let i=e.getBoundingClientRect();v.setSize(i.width,i.height),g.aspect=i.width/i.height,g.updateProjectionMatrix()},E=i=>{let a=i/1e3,p=m.width,h=m.height;t.fillStyle="#071014",t.fillRect(0,0,p,h);let S=t.createRadialGradient(p*.4,h*.5,20,p*.5,h*.5,p*.7);S.addColorStop(0,"#125e52"),S.addColorStop(.55,"#111820"),S.addColorStop(1,"#030406"),t.fillStyle=S,t.fillRect(0,0,p,h);for(let s=0;s<6;s+=1){let M=p*(.18+s%3*.31)+Math.sin(a*.7+s)*18,j=h*(.28+Math.floor(s/3)*.36)+Math.cos(a*.9+s)*16;t.beginPath(),t.arc(M,j,82+Math.sin(a+s)*10,0,Math.PI*2),t.fillStyle=`hsla(${155+s*24}, 88%, ${54+s*3}%, 0.78)`,t.fill()}t.strokeStyle="rgba(135,255,216,0.55)",t.lineWidth=3,t.beginPath();for(let s=0;s<p;s+=18){let M=h*.78+Math.sin(s*.02+a*3)*26+Math.sin(s*.006-a)*44;s===0?t.moveTo(s,M):t.lineTo(s,M)}t.stroke(),t.fillStyle="rgba(255,207,115,0.88)",t.font="600 28px system-ui, sans-serif",t.fillText("Hitchhiker.tv plugin surface",42,58)},L=i=>{if(!e.isConnected||c.disposed){v.dispose();return}E(i);let a=(i-c.startedAt)/1e3;te(b,a,c),v.render(T,g),requestAnimationFrame(L)};async function w(){try{if(!navigator.mediaDevices?.getUserMedia){f(e,`This browser context does not expose getUserMedia. ${R()}`,"Camera unavailable.");return}if(!K()){let a=V()?"This plugin is running inside a frame that has not delegated camera permission.":"Chrome reports that this document is not allowed to request camera access.";f(e,`${a} ${R()}`,"Camera blocked.");return}q(u);let i=await navigator.mediaDevices.getUserMedia({video:{width:1280,height:720},audio:!1});u.srcObject=i,await u.play(),f(e,"Camera MediaStream is driving the shader texture.","Camera active.")}catch(i){z(!1),f(e,`${i.name}: ${i.message||"camera request failed"} ${R()}`,"Camera blocked.")}}function z(i=!0){q(u),u.srcObject=m.captureStream(60),u.play(),i&&f(e,"Synthetic feed active.")}let A=o.room||`htv_${String(n?.id||"lobby").replace(/[^A-Za-z0-9_]/g,"").slice(0,12)}`;e.querySelector(".htv-room").textContent=A;let P=`https://vdo.ninja/?scene&room=${A}&cleanoutput`;y.value||(y.value=P);function D(i,a){r.textContent="";let p=document.createElement("iframe");if(p.allow="camera; microphone; autoplay; fullscreen; display-capture",p.src=i,r.appendChild(p),a){let h=document.createElement("button");h.type="button",h.className="htv-leave",h.textContent="Leave Room",h.addEventListener("click",O),r.appendChild(h)}r.classList.add("is-visible"),r.classList.toggle("is-joined",!!a),e.classList.toggle("is-joined",!!a),y.value=i}function F(){let i=(y.value||"").trim();if(!i){f(e,"Paste a VDO.Ninja view URL before loading.","VDO needs a URL.");return}D(i,!1),f(e,"VDO.Ninja is loaded as a live browser surface.","VDO surface active.")}function I(){D(`https://vdo.ninja/?room=${A}`,!0),f(e,`Allow camera and microphone, then join. Everyone on this page shares room ${A}. No app or account needed.`,"Joining the room.")}function G(){D(P,!1),f(e,`Watching room ${A} as a live surface.`,"Room surface active.")}function O(){r.classList.remove("is-visible","is-joined"),e.classList.remove("is-joined"),r.textContent="",f(e,"VDO surface hidden and room left. Texture source is unchanged.")}e.addEventListener("pointermove",i=>{let a=e.getBoundingClientRect();c.pointerX=(i.clientX-a.left)/a.width*2-1,c.pointerY=-((i.clientY-a.top)/a.height*2-1)}),d.addEventListener("click",i=>{let a=e.getBoundingClientRect(),p=new l.Vector2((i.clientX-a.left)/a.width*2-1,-((i.clientY-a.top)/a.height*2-1)),S=new l.Vector3(p.x,p.y,.5).unproject(g).sub(g.position).normalize(),s=g.position.clone().add(S.multiplyScalar(-g.position.z/S.z));b.worldToLocal(s);let M=(performance.now()-c.startedAt)/1e3,j=b.userData.uniforms;j.uClick.value.set(s.x,s.y),j.uClickTime.value=M,c.spinStart=M}),e.querySelector('[data-action="synthetic"]').addEventListener("click",()=>z()),e.querySelector('[data-action="camera"]').addEventListener("click",w),e.querySelector('[data-action="join"]').addEventListener("click",I),e.querySelector('[data-action="watch"]').addEventListener("click",G),e.querySelector('[data-action="load-vdo"]').addEventListener("click",F),e.querySelector('[data-action="hide-vdo"]').addEventListener("click",O),C.addEventListener("change",()=>{c.mode=C.value}),x(),window.addEventListener("resize",x),requestAnimationFrame(L)},q=e=>{e.srcObject?.getTracks&&e.srcObject.getTracks().forEach(o=>o.stop())},ee=(e,o,n,d)=>{let u={uTexture:{value:n},uTime:{value:0},uPointer:{value:new e.Vector2},uMode:{value:0},uClick:{value:new e.Vector2(999,999)},uClickTime:{value:-999}},m=new e.ShaderMaterial({uniforms:u,transparent:!0,side:e.DoubleSide,vertexShader:`
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
      }`});o.userData.uniforms=u;let t=24,r=Math.round(t*9/16),C=12.8/t,y=7.2/r;for(let c=0;c<r;c+=1)for(let l=0;l<t;l+=1){let v=new e.PlaneGeometry(C*.94,y*.94,1,1),T=[l/t,1-(c+1)/r],g=[(l+1)/t,1-c/r],k=(l-t/2+.5)*C,b=(r/2-c-.5)*y,x=v.attributes.position.count;v.setAttribute("tileUvMin",new e.BufferAttribute(new Float32Array(x*2).fill(0).map((L,w)=>T[w%2]),2)),v.setAttribute("tileUvMax",new e.BufferAttribute(new Float32Array(x*2).fill(0).map((L,w)=>g[w%2]),2)),v.setAttribute("tileIndex",new e.BufferAttribute(new Float32Array(x).fill(c*t+l),1)),v.setAttribute("tileSeed",new e.BufferAttribute(new Float32Array(x).fill(Math.random()),1)),v.setAttribute("tileCenter",new e.BufferAttribute(new Float32Array(x*2).fill(0).map((L,w)=>w%2===0?k:b),2));let E=new e.Mesh(v,m);E.position.x=k,E.position.y=b,o.add(E)}},te=(e,o,n)=>{let d=e.userData.uniforms;d.uTime.value=o,d.uPointer.value.set(n.pointerX,n.pointerY),d.uMode.value=n.mode==="swarm"?0:n.mode==="shatter"?1:n.mode==="portal"?2:3;let u=0,m=0;if(n.spinStart!=null){let t=(o-n.spinStart)/1.8;t>=1?n.spinStart=null:t>0&&(u=(t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2)*Math.PI*2,m=Math.sin(t*Math.PI))}e.rotation.y=Math.sin(o*.22)*.16+n.pointerX*.12+u,e.rotation.x=-.06+n.pointerY*.08,e.position.z=Math.sin(o*.4)*.32-m*5.2};typeof window<"u"&&(window.plugins=window.plugins||{},window.plugins.htv={emit:J,bind:Z});})();
//# sourceMappingURL=htv.js.map
