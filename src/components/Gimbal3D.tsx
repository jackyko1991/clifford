import {useEffect,useRef,useState,type ReactNode} from "react";
import {eulerControlAxes} from "../extendedModels";
export default function Gimbal3D({pitch,l,children}:{pitch:number;l:number;children:ReactNode}){
 const host=useRef<HTMLDivElement>(null),latest=useRef(pitch),draw=useRef<((p:number)=>void)|null>(null),reset=useRef<(()=>void)|null>(null);
 const [ready,setReady]=useState(false);latest.current=pitch;
 useEffect(()=>{draw.current?.(pitch);},[pitch]);
 useEffect(()=>{
  let disposed=false,cleanup=()=>{};
  void(async()=>{
   const T=await import('three'),{OrbitControls}=await import('three/addons/controls/OrbitControls.js');
   if(disposed||!host.current)return;
   let renderer:InstanceType<typeof T.WebGLRenderer>;
   try{renderer=new T.WebGLRenderer({antialias:true,alpha:true});}catch{return;}
   const container=host.current,scene=new T.Scene(),camera=new T.PerspectiveCamera(40,1,.1,40);
   camera.up.set(0,0,1);camera.position.set(3.7,4.4,3);
   renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));renderer.setClearColor(0xffffff,0);
   renderer.domElement.style.touchAction='none';renderer.domElement.setAttribute('aria-label',l?'三維萬向節：拖曳旋轉視角，雙指或滾輪縮放':'3D gimbal: drag to orbit, pinch or scroll to zoom');container.appendChild(renderer.domElement);
   const controls=new OrbitControls(camera,renderer.domElement);controls.enablePan=false;controls.minDistance=4;controls.maxDistance=10;controls.update();
   scene.add(new T.AmbientLight(0xffffff,2));const light=new T.DirectionalLight(0xffffff,2.5);light.position.set(2,3,5);scene.add(light);
   const vector=(v:number[])=>new T.Vector3(...v as [number,number,number]);
   const ring=(radius:number,color:number,normal:'z'|'y'|'x')=>{
    const mesh=new T.Mesh(new T.TorusGeometry(radius,.025,12,128),new T.MeshStandardMaterial({color,roughness:.65}));
    if(normal==='y')mesh.rotation.x=Math.PI/2;if(normal==='x')mesh.rotation.y=Math.PI/2;return mesh;
   };
   scene.add(ring(1.35,0x2563eb,'z'));scene.add(ring(1.12,0x0f766e,'y'));
   const inner=new T.Group();inner.add(ring(.89,0x7c3aed,'x'));scene.add(inner);
   const body=new T.Mesh(new T.BoxGeometry(.42,.46,.3),new T.MeshStandardMaterial({color:0x64748b,roughness:.6}));inner.add(body);
   const lens=new T.Mesh(new T.CylinderGeometry(.105,.13,.25,24),new T.MeshStandardMaterial({color:0x334155,roughness:.5}));lens.rotation.z=-Math.PI/2;lens.position.x=.32;inner.add(lens);
   const glass=new T.Mesh(new T.CircleGeometry(.09,24),new T.MeshBasicMaterial({color:0x93c5fd}));glass.rotation.y=Math.PI/2;glass.position.x=.45;inner.add(glass);
   const origin=new T.Vector3();
   const yaw=new T.ArrowHelper(new T.Vector3(0,0,1),origin,1.75,0x2563eb,.15,.085),pitchArrow=new T.ArrowHelper(new T.Vector3(0,1,0),origin,1.55,0x0f766e,.15,.085),roll=new T.ArrowHelper(new T.Vector3(1,0,0),origin,1.65,0x7c3aed,.15,.085);scene.add(yaw,pitchArrow,roll);
   const dashed=(a:InstanceType<typeof T.Vector3>,b:InstanceType<typeof T.Vector3>,color:number)=>{const line=new T.Line(new T.BufferGeometry().setFromPoints([a,b]),new T.LineDashedMaterial({color,dashSize:.07,gapSize:.05,transparent:true,opacity:.55}));line.computeLineDistances();return line;};
   scene.add(dashed(new T.Vector3(0,0,-1.75),origin,0x2563eb));scene.add(dashed(new T.Vector3(0,-1.55,0),origin,0x0f766e));
   const negativeRoll=dashed(new T.Vector3(-1.65,0,0),origin,0x7c3aed);scene.add(negativeRoll);
   const label=(text:string,color:string)=>{const canvas=document.createElement('canvas');canvas.width=256;canvas.height=80;const ctx=canvas.getContext('2d')!;ctx.font='52px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=color;ctx.fillText(text,128,40);const sprite=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(canvas),depthTest:false,transparent:true}));sprite.scale.set(1.3,.40625,1);scene.add(sprite);return sprite;};
   const yawLabel=label(l?'偏航 Z':'Yaw Z','#2563eb'),pitchLabel=label(l?'俯仰 Y′':'Pitch Y′','#0f766e'),rollLabel=label(l?'滾轉 X″':'Roll X″','#7c3aed');yawLabel.position.set(0,0,2.05);pitchLabel.position.set(0,1.9,0);
   const render=()=>{if(!disposed)renderer.render(scene,camera);};
   const update=(degrees:number)=>{
    const theta=degrees*Math.PI/180,axes=eulerControlAxes(theta),direction=vector(axes.roll);
    inner.rotation.y=theta;roll.setDirection(direction);rollLabel.position.copy(direction.clone().multiplyScalar(2));
    negativeRoll.geometry.dispose();negativeRoll.geometry=new T.BufferGeometry().setFromPoints([direction.clone().multiplyScalar(-1.65),origin]);negativeRoll.computeLineDistances();render();
   };
   const resize=()=>{const w=Math.max(1,container.clientWidth),h=Math.max(1,container.clientHeight);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();render();};
   const observer=new ResizeObserver(resize);observer.observe(container);controls.addEventListener('change',render);
   reset.current=()=>{camera.position.set(3.7,4.4,3);camera.up.set(0,0,1);controls.target.set(0,0,0);controls.update();render();};
   const contextLost=(event:Event)=>{event.preventDefault();setReady(false);};renderer.domElement.addEventListener('webglcontextlost',contextLost);
   draw.current=update;resize();update(latest.current);setReady(true);
   cleanup=()=>{observer.disconnect();controls.removeEventListener('change',render);controls.dispose();renderer.domElement.removeEventListener('webglcontextlost',contextLost);const geometries=new Set<{dispose:()=>void}>(),materials=new Set<InstanceType<typeof T.Material>>();scene.traverse(object=>{const mesh=object as InstanceType<typeof T.Mesh>;if(mesh.geometry)geometries.add(mesh.geometry);if(mesh.material)(Array.isArray(mesh.material)?mesh.material:[mesh.material]).forEach(m=>materials.add(m));});geometries.forEach(g=>g.dispose());materials.forEach(m=>{const map=(m as InstanceType<typeof T.MeshBasicMaterial>).map;if(map)map.dispose();m.dispose();});renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();draw.current=null;reset.current=null;};
   if(disposed)cleanup();
  })().catch(()=>{if(!disposed)setReady(false);});
  return()=>{disposed=true;cleanup();};
 },[l]);
 const axes=eulerControlAxes(pitch*Math.PI/180);
 return <div className="relative space-y-2" data-testid="gimbal-3d" data-renderer={ready?'three':'projection'} data-roll-axis={axes.roll.join(',')} data-yaw-axis={axes.yaw.join(',')}>
  {!ready&&children}
  <div className={ready?'':'invisible absolute inset-x-0 top-0'} aria-hidden={!ready}><div ref={host} className="h-72 w-full sm:h-80" data-three-canvas="gimbal"/></div>
  {ready&&<div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs"><span className="text-blue-600">{l?'藍：偏航 Z':'Blue: yaw Z'}</span><span className="text-teal-700">{l?'綠：俯仰 Y′':'Teal: pitch Y′'}</span><span className="text-violet-600">{l?'紫：滾轉 X″':'Purple: roll X″'}</span><button className="rounded border border-violet-200 bg-white px-2 py-1 text-violet-800" onClick={()=>reset.current?.()}>{l?'重設視角':'Reset view'}</button><p className="w-full text-center text-slate-500">{l?'拖曳旋轉視角，滾輪或雙指縮放。鏡頭視角與相機模型的俯仰角互不影響。':'Drag to orbit; scroll or pinch to zoom. The viewing camera does not change the model’s pitch.'}</p></div>}
 </div>;
}
