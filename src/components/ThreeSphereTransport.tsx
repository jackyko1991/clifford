import {useEffect,useRef} from "react";
import {sphereTransport} from "../extendedModels";
export default function ThreeSphereTransport({progress,reversed,l,onReady}:{progress:number;reversed:boolean;l:number;onReady:(ready:boolean)=>void}){
 const host=useRef<HTMLDivElement>(null),latest=useRef({progress,reversed}),update=useRef<((p:number,r:boolean)=>void)|null>(null),reset=useRef<(()=>void)|null>(null);
 latest.current={progress,reversed};
 useEffect(()=>{update.current?.(progress,reversed);},[progress,reversed]);
 useEffect(()=>{
  let disposed=false,cleanup=()=>{};
  void (async()=>{
   const T=await import('three'),{OrbitControls}=await import('three/addons/controls/OrbitControls.js');
   if(disposed||!host.current)return;
   let renderer:InstanceType<typeof T.WebGLRenderer>;
   try{renderer=new T.WebGLRenderer({antialias:true,alpha:true});}catch{onReady(false);return;}
   const container=host.current,scene=new T.Scene(),camera=new T.PerspectiveCamera(38,1,.1,30);
   camera.up.set(0,0,1);camera.position.set(2.4,2.8,2.2);
   renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));renderer.setClearColor(0xffffff,0);
   renderer.domElement.style.touchAction='none';renderer.domElement.setAttribute('aria-label','Interactive sphere: drag to orbit, pinch or scroll to zoom');container.appendChild(renderer.domElement);
   const controls=new OrbitControls(camera,renderer.domElement);controls.enablePan=false;controls.minDistance=2.8;controls.maxDistance=9;controls.target.set(0,0,0);controls.update();
   scene.add(new T.AmbientLight(0xffffff,1.7));const light=new T.DirectionalLight(0xffffff,2.2);light.position.set(-3,-4,6);scene.add(light);
   const sphere=new T.Mesh(new T.SphereGeometry(1,64,40),new T.MeshStandardMaterial({color:0xd9ece5,roughness:.8}));scene.add(sphere);
   const vec=(v:number[],s=1)=>new T.Vector3(v[0]*s,v[1]*s,v[2]*s);
   const line=(points:InstanceType<typeof T.Vector3>[],color:number,opacity=1)=>new T.Line(new T.BufferGeometry().setFromPoints(points),new T.LineBasicMaterial({color,transparent:opacity<1,opacity}));
   for(let lat=-60;lat<=60;lat+=30){const t=lat*Math.PI/180;scene.add(line(Array.from({length:129},(_,j)=>{const a=j*Math.PI/64;return new T.Vector3(Math.cos(t)*Math.cos(a),Math.cos(t)*Math.sin(a),Math.sin(t)).multiplyScalar(1.003);}),0x749d97,.35));}
   for(let lon=0;lon<180;lon+=30){const t=lon*Math.PI/180;scene.add(line(Array.from({length:129},(_,j)=>{const a=j*Math.PI/64;return new T.Vector3(Math.cos(a)*Math.cos(t),Math.cos(a)*Math.sin(t),Math.sin(a)).multiplyScalar(1.003);}),0x749d97,.35));}
   const route=line([],0x0f766e);scene.add(route);
   const tracedGeometry=new T.BufferGeometry(),tracedPositions=new Float32Array(181*3);tracedGeometry.setAttribute('position',new T.BufferAttribute(tracedPositions,3));const traced=new T.Line(tracedGeometry,new T.LineBasicMaterial({color:0x7c3aed}));scene.add(traced);
   const arrow=new T.ArrowHelper(new T.Vector3(0,1,0),new T.Vector3(1.025,0,0),.48,0x7c3aed,.13,.07);scene.add(arrow);
   const reference=new T.ArrowHelper(new T.Vector3(0,1,0),new T.Vector3(1.022,0,0),.48,0x64748b,.10,.055);scene.add(reference);
   const moving=new T.Mesh(new T.SphereGeometry(.027,16,12),new T.MeshBasicMaterial({color:0x7c3aed}));scene.add(moving);
   const vertices=[0,1,2].map(()=>{const dot=new T.Mesh(new T.SphereGeometry(.025,16,12),new T.MeshBasicMaterial({color:0x0f766e}));scene.add(dot);return dot;});
   const labels=['A','B','C'].map(text=>{const canvas=document.createElement('canvas');canvas.width=128;canvas.height=64;const ctx=canvas.getContext('2d')!;ctx.font='bold 42px sans-serif';ctx.fillStyle='#0f766e';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,64,32);const sprite=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(canvas),transparent:true}));sprite.scale.set(.28,.14,1);scene.add(sprite);return sprite;});
   const routeArrows=[0,1,2].map(()=>{const a=new T.ArrowHelper(new T.Vector3(1,0,0),new T.Vector3(),.16,0x0f766e,.06,.035);scene.add(a);return a;});
   const patchGeometry=new T.BufferGeometry(),patchPositions=new Float32Array(12);patchGeometry.setAttribute('position',new T.BufferAttribute(patchPositions,3));patchGeometry.setIndex([0,1,2,0,2,3]);const patch=new T.Mesh(patchGeometry,new T.MeshBasicMaterial({color:0x7c3aed,transparent:true,opacity:.14,side:T.DoubleSide,depthWrite:false}));scene.add(patch);
   const render=()=>{if(!disposed)renderer.render(scene,camera);};
   let previousReverse:boolean|undefined;
   const draw=(p:number,rev:boolean)=>{
    const state=sphereTransport(p,rev),point=vec(state.point,1.025),direction=vec(state.vector);
    if(previousReverse!==rev){
     previousReverse=rev;route.geometry.dispose();route.geometry=new T.BufferGeometry().setFromPoints(Array.from({length:181},(_,j)=>vec(sphereTransport(j/60,rev).point,1.009)));
     state.vertices.slice(0,3).forEach((v,i)=>{vertices[i].position.copy(vec(v,1.014));labels[i].position.copy(vec(v,1.17));const w=state.vertices[i+1],t=Math.PI/4,mid=v.map((x,k)=>x*Math.cos(t)+w[k]*Math.sin(t)),tangent=v.map((x,k)=>-x*Math.sin(t)+w[k]*Math.cos(t));routeArrows[i].position.copy(vec(mid,1.018));routeArrows[i].setDirection(vec(tangent).normalize());});
    }
    for(let j=0;j<=180;j++){const q=sphereTransport(p*j/180,rev).point;tracedPositions[j*3]=q[0]*1.015;tracedPositions[j*3+1]=q[1]*1.015;tracedPositions[j*3+2]=q[2]*1.015;}
    tracedGeometry.attributes.position.needsUpdate=true;tracedGeometry.computeBoundingSphere();
    arrow.position.copy(point);arrow.setDirection(direction);moving.position.copy(point);
    const side=vec(state.point).cross(direction).normalize();[[-.1,-.16],[.55,-.16],[.55,.16],[-.1,.16]].forEach(([a,b],i)=>{const v=point.clone().addScaledVector(direction,a).addScaledVector(side,b);patchPositions[i*3]=v.x;patchPositions[i*3+1]=v.y;patchPositions[i*3+2]=v.z;});patchGeometry.attributes.position.needsUpdate=true;patchGeometry.computeBoundingSphere();render();
   };
   const resize=()=>{const width=Math.max(1,container.clientWidth),height=Math.max(1,container.clientHeight);renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();render();};
   const observer=new ResizeObserver(resize);observer.observe(container);controls.addEventListener('change',render);reset.current=()=>{camera.position.set(2.4,2.8,2.2);camera.up.set(0,0,1);controls.target.set(0,0,0);controls.update();render();};
   const contextLost=(event:Event)=>{event.preventDefault();onReady(false);};renderer.domElement.addEventListener('webglcontextlost',contextLost);
   update.current=draw;resize();draw(latest.current.progress,latest.current.reversed);onReady(true);
   cleanup=()=>{observer.disconnect();controls.removeEventListener('change',render);controls.dispose();renderer.domElement.removeEventListener('webglcontextlost',contextLost);const geometries=new Set<{dispose:()=>void}>(),materials=new Set<InstanceType<typeof T.Material>>();scene.traverse(object=>{const mesh=object as InstanceType<typeof T.Mesh>;if(mesh.geometry)geometries.add(mesh.geometry);if(mesh.material)(Array.isArray(mesh.material)?mesh.material:[mesh.material]).forEach(m=>materials.add(m));});geometries.forEach(g=>g.dispose());materials.forEach(m=>{const map=(m as InstanceType<typeof T.MeshBasicMaterial>).map;if(map)map.dispose();m.dispose();});renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();update.current=null;reset.current=null;};
   if(disposed)cleanup();
  })().catch(()=>{if(!disposed)onReady(false);});
  return()=>{disposed=true;cleanup();};
 },[onReady]);
 return <div className="space-y-2" data-three-sphere="true"><div ref={host} className="mx-auto h-64 w-full max-w-2xl sm:h-80" data-three-canvas="sphere"/><div className="flex flex-wrap items-center justify-center gap-3 text-xs"><span className="text-teal-700">{l?"綠：路徑":"Teal: route"}</span><span className="text-violet-700">{l?"紫：平移中的箭頭":"Purple: transported arrow"}</span><span className="text-slate-500">{l?"灰：起始方向":"Grey: initial direction"}</span><button className="rounded border border-violet-200 bg-white px-2 py-1 text-violet-800" onClick={()=>reset.current?.()}>{l?"重設視角":"Reset view"}</button></div><p className="text-center text-xs text-slate-500">{l?"拖曳球面旋轉視角；滾輪或雙指縮放。換視角不會改變平移的計算結果。":"Drag to orbit; scroll or pinch to zoom. Changing the view leaves the transport calculation unchanged."}</p></div>;
}
