import {useEffect,useState} from "react";
import Arrow from "./GeometryArrow";
import {collisionFilm,type FilmTransforms} from "../cptModel";
const btn="rounded-md border border-violet-200 bg-white px-3 py-1.5 text-xs text-violet-800 hover:bg-violet-50 aria-pressed:bg-violet-100 aria-pressed:ring-1 aria-pressed:ring-violet-400 disabled:opacity-40";
const original={mirror:false,reverse:false,conjugate:false};
function Scene({progress,transforms,l,changed}:{progress:number;transforms:FilmTransforms;l:number;changed:boolean}){
 const frame=collisionFilm(progress,transforms),color=changed?"#7c3aed":"#64748b";
 return <div className="min-w-0 rounded-lg border border-violet-100 bg-white p-3 text-center" data-cpt-scene={changed?"transformed":"original"}>
  <p className="text-xs font-medium" style={{color}}>{changed?(l?"套用操作後":"After transformations"):(l?"原始影片":"Original film")}</p>
  <svg viewBox="0 0 300 160" className="mx-auto max-h-48 w-full" role="img" aria-label={l?"兩顆帶標記的粒子接近、碰撞再分開；R 圖案顯示鏡像":"Two labelled particles approach, collide and separate; an R marker makes mirroring visible"}>
   <path d="M35 105H265" stroke="#cbd5e1"/><path d="M150 55V135" stroke="#ddd6fe" strokeDasharray="3 4"/>
   <g transform={`translate(${150-65*frame.handedness} 33) scale(${frame.handedness} 1)`}><path d="M-18-18H18V8H3L-5 17V8H-18Z" fill="#ede9fe" stroke="#c4b5fd"/><text x="0" y="1" fontSize="18" textAnchor="middle" fill="#7c3aed">R</text></g>
   {frame.particles.map((p,i)=>{const x=150+100*p.x,c=i===0?"#7c3aed":"#0f766e";return <g key={i} data-cpt-particle={i} data-x={p.x} data-velocity={p.velocity}><circle cx={x} cy="100" r="10" fill={p.antiparticle?"white":c} stroke={c} strokeWidth="2"/><Arrow a={[x,75]} b={[x+32*p.velocity,75]} color={c}/><text x={x} y="136" textAnchor="middle" fontSize="14" fill={c}>{p.name}</text>{p.antiparticle&&<path d={`M${x-5} 121h10`} stroke={c}/>}</g>;})}
   <text x="150" y="155" fontSize="10" textAnchor="middle" fill="#94a3b8">x = 0</text>
  </svg>
  <p className="text-xs text-gray-500">{l?"影片時間":"Film time"}: {frame.time.toFixed(2)} / 1.00</p>
 </div>;
}
export default function CptMirror({l}:{l:number}){
 const [progress,setProgress]=useState(.25),[transforms,setTransforms]=useState<FilmTransforms>(original),[playing,setPlaying]=useState(false),[speed,setSpeed]=useState(1);
 useEffect(()=>{if(!playing)return;const timer=setInterval(()=>setProgress(p=>Math.min(1,p+.01)),45/speed);return()=>clearInterval(timer);},[playing,speed]);
 useEffect(()=>{if(progress>=1)setPlaying(false);},[progress]);
 const toggle=(key:keyof FilmTransforms)=>setTransforms(t=>({...t,[key]:!t[key]}));const all=Object.values(transforms).every(Boolean);
 return <figure data-interactive="cpt-mirror" className="space-y-3">
  <p className="text-xs text-gray-600">{l?"先播放原片，再只開一個操作。看粒子的位置、速度箭頭、R 圖案與標籤：哪些變了，哪些沒有？":"Play the original, then enable one transformation. Watch the positions, velocity arrows, R marker and labels. Which change, and which stay?"}</p>
  <div className="flex flex-wrap gap-2" role="group" aria-label={l?"對影片套用的操作":"Film transformations"}>
   <button className={btn} aria-pressed={transforms.mirror} onClick={()=>toggle("mirror")}>{l?"左右鏡像 · P 示意":"Mirror · P picture"}</button>
   <button className={btn} aria-pressed={transforms.reverse} onClick={()=>toggle("reverse")}>{l?"影片倒放 · T 示意":"Rewind · T picture"}</button>
   <button className={btn} aria-pressed={transforms.conjugate} onClick={()=>toggle("conjugate")}>{l?"換反粒子標籤 · C 示意":"Antiparticle labels · C picture"}</button>
   <button className={btn} aria-pressed={all} onClick={()=>setTransforms(all?original:{mirror:true,reverse:true,conjugate:true})}>{l?"三者一起":"All three"}</button>
  </div>
  <div className="grid gap-3 sm:grid-cols-2"><Scene progress={progress} transforms={original} l={l} changed={false}/><Scene progress={progress} transforms={transforms} l={l} changed/></div>
  <label className="flex flex-wrap items-center gap-3 text-xs text-gray-600"><span>{l?"播放進度":"Playback progress"}: {Math.round(progress*100)}%</span><input className="min-w-0 flex-1 accent-violet-600" type="range" min="0" max="1" step=".01" value={progress} aria-label={l?"碰撞影片進度":"Collision film progress"} onChange={e=>{setPlaying(false);setProgress(Number(e.target.value));}}/></label>
  <div className="flex flex-wrap items-center justify-center gap-2">
   <button className={btn} disabled={progress<=0} onClick={()=>{setPlaying(false);setProgress(p=>Math.max(0,p-.01));}}>{l?"‹ 上一步":"‹ Previous"}</button>
   <button className={btn} aria-pressed={playing} onClick={()=>{if(progress>=1)setProgress(0);setPlaying(p=>!p);}}>{playing?(l?"暫停":"Pause"):(l?"▶ 播放":"▶ Play")}</button>
   <button className={btn} disabled={progress>=1} onClick={()=>{setPlaying(false);setProgress(p=>Math.min(1,p+.01));}}>{l?"下一步 ›":"Next ›"}</button>
   <button className={btn} onClick={()=>{setPlaying(false);setProgress(0);}}>{l?"重新開始":"Restart"}</button>
   <select className="rounded border border-violet-200 bg-white p-1 text-xs" aria-label={l?"播放速度":"Playback speed"} value={speed} onChange={e=>setSpeed(Number(e.target.value))}>{[.5,1,2].map(v=><option key={v} value={v}>{v}×</option>)}</select>
  </div>
  <figcaption className="space-y-2 text-xs leading-relaxed text-gray-600" aria-live="polite">
   <p>{transforms.mirror?(l?"鏡像：位置與速度左右反向，R 圖案也翻面。":"Mirror: positions and velocities reverse left/right, and the R marker flips."):(l?"鏡像關閉：保留原本左右方向。":"Mirror off: original left/right directions.")}</p>
   {transforms.reverse&&<p>{l?"倒放：從原片較晚的畫格往回讀，速度箭頭反向。":"Rewind: read later original frames backwards, reversing velocity arrows."}</p>}
   {transforms.conjugate&&<p>{l?"換標籤：a、b 換成反粒子 ā、b̄，不靠移動位置完成。":"Relabelling: a and b become antiparticle labels ā and b̄ without moving their positions."}</p>}
   <p className="border-t border-violet-100 pt-2">{l?"這是操作影片記錄的示意，不是粒子碰撞預測。圖中只鏡射左右；完整宇稱 P 反轉三個空間座標，量子 T、C 也作用在此圖未表示的狀態資訊。動畫不證明 CPT 定理，也不解釋弱作用的左右偏好。":"This transforms a film record, not a particle-scattering prediction. The picture mirrors left/right; full parity reverses all three spatial coordinates, and quantum T and C also act on state information absent here. It does not prove CPT or explain the weak interaction’s handedness."}</p>
  </figcaption>
 </figure>;
}
