/* wiki-plugin-htv 0.2.0 */
(()=>{var q=new Set(["MODE","HEIGHT","VDO","TITLE"]),O="https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js",R=(e,t,i)=>Math.max(t,Math.min(i,e)),F=e=>{let t={mode:"swarm",height:620,vdo:"",title:"Hitchhiker.tv Live Surface"};for(let i of(e||"").split(`
`)){let l=i.trim();if(!l)continue;let[u,...a]=l.split(/\s+/),o=u.replace(/:$/,"").toUpperCase(),d=a.join(" ").trim();q.has(o)&&(o==="MODE"&&(t.mode=["swarm","shatter","portal","nova"].includes(d.toLowerCase())?d.toLowerCase():t.mode),o==="HEIGHT"&&(t.height=R(parseInt(d,10)||t.height,360,1400)),o==="VDO"&&(t.vdo=d),o==="TITLE"&&(t.title=d||t.title))}return t},j=e=>`
  <div class="htv-shell" style="height:${e.height}px">
    <div class="htv-stage"></div>
    <div class="htv-panel">
      <h3>${k(e.title)}</h3>
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
`,k=e=>String(e||"").replace(/[&<>]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;"})[t]),G=e=>k(e).replace(/"/g,"&quot;"),B=()=>{if(document.getElementById("htv-style"))return;let e=document.createElement("style");e.id="htv-style",e.textContent=I,document.head.appendChild(e)},H=(e,t)=>{B();let i=F(t.text);e.html(j(i))},X=(e,t)=>{let i=e.find(".htv-shell")[0];i&&(_(i,F(t.text)),e.on("dblclick",l=>{l.target.closest("button,input,select,iframe")||window.wiki?.textEditor&&window.wiki.textEditor(e,t)}))},x=(e,t,i="")=>{let l=e.querySelector(".htv-status");l&&(l.innerHTML=i?`<strong>${k(i)}</strong> ${k(t)}`:k(t))},U=()=>{try{return window.top!==window}catch{return!0}},Y=()=>{let e=document.permissionsPolicy||document.featurePolicy;if(!e?.allowsFeature)return!0;try{return e.allowsFeature("camera")}catch{return!0}},L=()=>{let e=document.permissionsPolicy||document.featurePolicy,t="unknown";if(e?.allowsFeature)try{t=String(e.allowsFeature("camera"))}catch(i){t=`unknown (${i.name})`}return`origin=${location.origin}; secure=${String(isSecureContext)}; framed=${String(U())}; policy.camera=${t}`},_=async(e,t)=>{let i=e.querySelector(".htv-stage"),l=e.querySelector(".htv-video"),u=e.querySelector(".htv-synthetic"),a=u.getContext("2d"),o=e.querySelector(".htv-vdo"),d=e.querySelector('[data-action="mode"]'),A=e.querySelector('[data-action="vdo-url"]'),p={mode:t.mode,pointerX:0,pointerY:0,startedAt:performance.now(),disposed:!1,spinStart:null},c;try{c=await import(O)}catch(n){x(e,`Could not load Three.js: ${n.message}`,"Renderer failed.");return}let v=new c.WebGLRenderer({antialias:!0,alpha:!0});v.setPixelRatio(Math.min(devicePixelRatio||1,2)),i.appendChild(v.domElement);let h=new c.Scene;h.fog=new c.FogExp2(329225,.028);let f=new c.PerspectiveCamera(46,1,.1,200);f.position.set(0,.1,16);let E=new c.VideoTexture(l);E.colorSpace=c.SRGBColorSpace;let b=new c.Group;h.add(b),N(c,b,E,p),g(),t.vdo&&P();let C=()=>{let n=e.getBoundingClientRect();v.setSize(n.width,n.height),f.aspect=n.width/n.height,f.updateProjectionMatrix()},w=n=>{let r=n/1e3,m=u.width,y=u.height;a.fillStyle="#071014",a.fillRect(0,0,m,y);let S=a.createRadialGradient(m*.4,y*.5,20,m*.5,y*.5,m*.7);S.addColorStop(0,"#125e52"),S.addColorStop(.55,"#111820"),S.addColorStop(1,"#030406"),a.fillStyle=S,a.fillRect(0,0,m,y);for(let s=0;s<6;s+=1){let M=m*(.18+s%3*.31)+Math.sin(r*.7+s)*18,$=y*(.28+Math.floor(s/3)*.36)+Math.cos(r*.9+s)*16;a.beginPath(),a.arc(M,$,82+Math.sin(r+s)*10,0,Math.PI*2),a.fillStyle=`hsla(${155+s*24}, 88%, ${54+s*3}%, 0.78)`,a.fill()}a.strokeStyle="rgba(135,255,216,0.55)",a.lineWidth=3,a.beginPath();for(let s=0;s<m;s+=18){let M=y*.78+Math.sin(s*.02+r*3)*26+Math.sin(s*.006-r)*44;s===0?a.moveTo(s,M):a.lineTo(s,M)}a.stroke(),a.fillStyle="rgba(255,207,115,0.88)",a.font="600 28px system-ui, sans-serif",a.fillText("Hitchhiker.tv plugin surface",42,58)},T=n=>{if(!e.isConnected||p.disposed){v.dispose();return}w(n);let r=(n-p.startedAt)/1e3;W(b,r,p),v.render(h,f),requestAnimationFrame(T)};async function D(){try{if(!navigator.mediaDevices?.getUserMedia){x(e,`This browser context does not expose getUserMedia. ${L()}`,"Camera unavailable.");return}if(!Y()){let r=U()?"This plugin is running inside a frame that has not delegated camera permission.":"Chrome reports that this document is not allowed to request camera access.";x(e,`${r} ${L()}`,"Camera blocked.");return}z(l);let n=await navigator.mediaDevices.getUserMedia({video:{width:1280,height:720},audio:!1});l.srcObject=n,await l.play(),x(e,"Camera MediaStream is driving the shader texture.","Camera active.")}catch(n){g(!1),x(e,`${n.name}: ${n.message||"camera request failed"} ${L()}`,"Camera blocked.")}}function g(n=!0){z(l),l.srcObject=u.captureStream(60),l.play(),n&&x(e,"Synthetic feed active.")}function P(){let n=(A.value||"").trim();if(!n){x(e,"Paste a VDO.Ninja view URL before loading.","VDO needs a URL.");return}o.textContent="";let r=document.createElement("iframe");r.allow="camera; microphone; autoplay; fullscreen; display-capture",r.src=n,o.appendChild(r),o.classList.add("is-visible"),x(e,"VDO.Ninja is loaded as a live browser surface.","VDO surface active.")}function V(){o.classList.remove("is-visible"),o.textContent="",x(e,"VDO surface hidden. Texture source is unchanged.")}e.addEventListener("pointermove",n=>{let r=e.getBoundingClientRect();p.pointerX=(n.clientX-r.left)/r.width*2-1,p.pointerY=-((n.clientY-r.top)/r.height*2-1)}),i.addEventListener("click",n=>{let r=e.getBoundingClientRect(),m=new c.Vector2((n.clientX-r.left)/r.width*2-1,-((n.clientY-r.top)/r.height*2-1)),S=new c.Vector3(m.x,m.y,.5).unproject(f).sub(f.position).normalize(),s=f.position.clone().add(S.multiplyScalar(-f.position.z/S.z));b.worldToLocal(s);let M=(performance.now()-p.startedAt)/1e3,$=b.userData.uniforms;$.uClick.value.set(s.x,s.y),$.uClickTime.value=M,p.spinStart=M}),e.querySelector('[data-action="synthetic"]').addEventListener("click",()=>g()),e.querySelector('[data-action="camera"]').addEventListener("click",D),e.querySelector('[data-action="load-vdo"]').addEventListener("click",P),e.querySelector('[data-action="hide-vdo"]').addEventListener("click",V),d.addEventListener("change",()=>{p.mode=d.value}),C(),window.addEventListener("resize",C),requestAnimationFrame(T)},z=e=>{e.srcObject?.getTracks&&e.srcObject.getTracks().forEach(t=>t.stop())},N=(e,t,i,l)=>{let u={uTexture:{value:i},uTime:{value:0},uPointer:{value:new e.Vector2},uMode:{value:0},uClick:{value:new e.Vector2(999,999)},uClickTime:{value:-999}},a=new e.ShaderMaterial({uniforms:u,transparent:!0,side:e.DoubleSide,vertexShader:`
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
      }`});t.userData.uniforms=u;let o=24,d=Math.round(o*9/16),A=12.8/o,p=7.2/d;for(let c=0;c<d;c+=1)for(let v=0;v<o;v+=1){let h=new e.PlaneGeometry(A*.94,p*.94,1,1),f=[v/o,1-(c+1)/d],E=[(v+1)/o,1-c/d],b=(v-o/2+.5)*A,C=(d/2-c-.5)*p,w=h.attributes.position.count;h.setAttribute("tileUvMin",new e.BufferAttribute(new Float32Array(w*2).fill(0).map((D,g)=>f[g%2]),2)),h.setAttribute("tileUvMax",new e.BufferAttribute(new Float32Array(w*2).fill(0).map((D,g)=>E[g%2]),2)),h.setAttribute("tileIndex",new e.BufferAttribute(new Float32Array(w).fill(c*o+v),1)),h.setAttribute("tileSeed",new e.BufferAttribute(new Float32Array(w).fill(Math.random()),1)),h.setAttribute("tileCenter",new e.BufferAttribute(new Float32Array(w*2).fill(0).map((D,g)=>g%2===0?b:C),2));let T=new e.Mesh(h,a);T.position.x=b,T.position.y=C,t.add(T)}},W=(e,t,i)=>{let l=e.userData.uniforms;l.uTime.value=t,l.uPointer.value.set(i.pointerX,i.pointerY),l.uMode.value=i.mode==="swarm"?0:i.mode==="shatter"?1:i.mode==="portal"?2:3;let u=0,a=0;if(i.spinStart!=null){let o=(t-i.spinStart)/1.8;o>=1?i.spinStart=null:o>0&&(u=(o<.5?4*o*o*o:1-Math.pow(-2*o+2,3)/2)*Math.PI*2,a=Math.sin(o*Math.PI))}e.rotation.y=Math.sin(t*.22)*.16+i.pointerX*.12+u,e.rotation.x=-.06+i.pointerY*.08,e.position.z=Math.sin(t*.4)*.32-a*5.2};typeof window<"u"&&(window.plugins=window.plugins||{},window.plugins.htv={emit:H,bind:X});})();
//# sourceMappingURL=htv.js.map
