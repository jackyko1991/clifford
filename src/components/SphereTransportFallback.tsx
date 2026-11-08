import {useId,useState} from "react";
import Arrow from "./GeometryArrow";
import {sphereTransport} from "../extendedModels";

type Vec=number[];
const teal="#0f766e",purple="#7c3aed";
const dot=(a:Vec,b:Vec)=>a.reduce((s,x,i)=>s+x*b[i],0);
const add=(a:Vec,b:Vec,k=1)=>a.map((x,i)=>x+k*b[i]);
const circle=(a:Vec,b:Vec,t:number)=>a.map((x,i)=>x*Math.cos(t)+b[i]*Math.sin(t));

/** Orthographic projection of actual unit-sphere points and transported 3D vectors. */
export default function SphereTransportFallback({progress,reversed,l}:{progress:number;reversed:boolean;l:number}){
 const id=useId().replace(/:/g,""),[yaw,setYaw]=useState(Math.PI/4),[elevation,setElevation]=useState(.55);
 const r=sphereTransport(progress,reversed),right=[-Math.sin(yaw),Math.cos(yaw),0],up=[-Math.sin(elevation)*Math.cos(yaw),-Math.sin(elevation)*Math.sin(yaw),Math.cos(elevation)],eye=[Math.cos(elevation)*Math.cos(yaw),Math.cos(elevation)*Math.sin(yaw),Math.sin(elevation)];
 const project=(v:Vec)=>[280+130*dot(v,right),177-130*dot(v,up)];
 const segment=(a:Vec,b:Vec,key:string,color:string,width:number,dashed=false)=><path key={key} d={`M${project(a)}L${project(b)}`} fill="none" stroke={color} strokeWidth={width} strokeDasharray={dashed?"3 4":undefined} opacity={dot(add(a,b),eye)<0?.22:1}/>;
 const grid=[];
 for(let latitude=-60;latitude<=60;latitude+=30){const t=latitude*Math.PI/180;for(let j=0;j<120;j++){const at=(a:number)=>[Math.cos(t)*Math.cos(a),Math.cos(t)*Math.sin(a),Math.sin(t)];const a=at(j*Math.PI/60),b=at((j+1)*Math.PI/60);grid.push(segment(a,b,`lat${latitude}-${j}`,"#8faeb3",.8,dot(add(a,b),eye)<0));}}
 for(let longitude=0;longitude<180;longitude+=30){const t=longitude*Math.PI/180;for(let j=0;j<120;j++){const at=(a:number)=>[Math.cos(a)*Math.cos(t),Math.cos(a)*Math.sin(t),Math.sin(a)];const a=at(j*Math.PI/60),b=at((j+1)*Math.PI/60);grid.push(segment(a,b,`lon${longitude}-${j}`,"#8faeb3",.8,dot(add(a,b),eye)<0));}}
 const routes=r.vertices.slice(0,3).flatMap((a,i)=>{const b=r.vertices[i+1];return Array.from({length:60},(_,j)=>segment(circle(a,b,j*Math.PI/120),circle(a,b,(j+1)*Math.PI/120),`route${i}-${j}`,i+(j+.5)/60<=progress?purple:teal,3));});
 const origin=project(r.point),tip=project(add(r.point,r.vector,.48));
 const start=project([1,0,0]),initialTip=project([1,.48,0]);
 // Tangent patch: both spanning vectors are perpendicular to the surface normal.
 const side=[r.point[1]*r.vector[2]-r.point[2]*r.vector[1],r.point[2]*r.vector[0]-r.point[0]*r.vector[2],r.point[0]*r.vector[1]-r.point[1]*r.vector[0]];
 const patch=[[-.16,-.18],[.58,-.18],[.58,.18],[-.16,.18]].map(([a,b])=>project(add(add(r.point,r.vector,a),side,b)).join(",")).join(" ");
 const button="rounded border border-violet-200 bg-white px-2 py-1 text-xs text-violet-800 hover:bg-violet-50";
 return <div data-testid="sphere-transport-projection">
  <svg viewBox="80 20 400 325" className="mx-auto w-full max-w-2xl" role="img" aria-label={l?"立體球面上的大圓路徑、切平面與平行移動的箭頭，可旋轉視角":"Great-circle paths, tangent plane and a parallel-transported arrow on a rotatable 3D sphere"}>
   <defs><radialGradient id={`${id}-surface`} cx="32%" cy="24%" r="80%"><stop offset="0" stopColor="#ffffff"/><stop offset=".6" stopColor="#e4f1ee"/><stop offset="1" stopColor="#a1bdbb"/></radialGradient><radialGradient id={`${id}-shadow`}><stop stopColor="#0f766e" stopOpacity=".18"/><stop offset="1" stopColor="#0f766e" stopOpacity="0"/></radialGradient></defs>
   <ellipse cx="280" cy="322" rx="145" ry="16" fill={`url(#${id}-shadow)`}/>
   <circle cx="280" cy="177" r="130" fill={`url(#${id}-surface)`} stroke="#93b4b1"/>
   {grid}{routes}
   {r.vertices.slice(0,3).map((a,i)=>{const b=r.vertices[i+1];return <g key={i} opacity={dot(circle(a,b,Math.PI/4),eye)<0?.3:1}><Arrow a={project(circle(a,b,.70))} b={project(circle(a,b,.84))} color={teal}/></g>;})}
   {r.vertices.slice(0,3).map((v,i)=>{const p=project(v),label=project(v.map(x=>x*1.16));return <g key={i}><circle cx={p[0]} cy={p[1]} r="4" fill={teal} stroke="white" strokeWidth="1.5"/><text x={label[0]} y={label[1]} textAnchor="middle" dominantBaseline="middle" fontSize="13" fill={teal}>{i===0?(l?"起點 A":"Start A"):i===1?"B":"C"}</text></g>;})}
   <polygon points={patch} fill={purple} fillOpacity=".08" stroke={purple} strokeOpacity=".25"/>
   <g opacity={dot([1,0,0],eye)<0?.35:.7}><Arrow a={start} b={initialTip} color="#64748b"/></g>
   <g opacity={dot(r.point,eye)<0?.4:1}><Arrow a={origin} b={tip} color={purple}/><circle cx={origin[0]} cy={origin[1]} r="4" fill={purple} stroke="white" strokeWidth="1.5"/></g>
   <g transform="translate(110 300)">{[[1,0,0],[0,1,0],[0,0,1]].map((v,i)=><g key={i}><Arrow a={[0,0]} b={[28*dot(v,right),-28*dot(v,up)]} color="#94a3b8"/><text x={40*dot(v,right)} y={-40*dot(v,up)} textAnchor="middle" dominantBaseline="middle" fill="#64748b" fontSize="11">{["x","y","z"][i]}</text></g>)}</g>
  </svg>
  <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs"><span style={{color:teal}}>{l?"綠：球面路徑與行進方向":"Teal: surface route and direction"}</span><span style={{color:purple}}>{l?"紫：平移中的箭頭／已走路段":"Purple: transported arrow / completed route"}</span><span className="text-slate-500">{l?"灰：起點的原方向":"Grey: initial direction"}</span></div>
  <div className="mt-3 flex flex-wrap items-center justify-center gap-2" aria-label={l?"球面視角":"Sphere view"}><span className="text-xs text-slate-500">{l?"旋轉視角":"Rotate view"}</span><button className={button} onClick={()=>setYaw(v=>v-.3)}>{l?"向左":"Left"}</button><button className={button} onClick={()=>setYaw(v=>v+.3)}>{l?"向右":"Right"}</button><button className={button} onClick={()=>setElevation(v=>Math.min(1.2,v+.2))}>{l?"俯看":"Above"}</button><button className={button} onClick={()=>setElevation(v=>Math.max(-.3,v-.2))}>{l?"降低":"Lower"}</button><button className={button} onClick={()=>{setYaw(Math.PI/4);setElevation(.55);}}>{l?"重設視角":"Reset view"}</button></div>
  <p className="mt-2 text-center text-xs text-slate-500">{l?"箭頭始終貼著當地的切平面；轉動視角不會改變平移結果。背面的線以淡色虛線顯示。":"The arrow stays tangent to the sphere. Changing the view does not change transport. Rear grid lines are faint and dashed."}</p>
 </div>;
}

