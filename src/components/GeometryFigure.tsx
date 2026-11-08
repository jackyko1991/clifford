import {useEffect,useId,useState} from "react";
import {basis,rotate,rotor} from "../algebra";
import Tex from "./Tex";
const purple="#7c3aed",teal="#0f766e",muted="#94a3b8";
export default function GeometryFigure({kind,l}:{kind:string;l:number}) {
 const [angle,setAngle]=useState(60),[playing,setPlaying]=useState(false),[circular,setCircular]=useState(false);
 const uid=useId().replaceAll(":", ""),theta=angle*Math.PI/180;
 useEffect(()=>{
  if(!playing)return;
  let id:number,last=0;
  const frame=(now:number)=>{if(last)setAngle(a=>(a+Math.min(now-last,60)*.035)%720);last=now;id=requestAnimationFrame(frame);};
  id=requestAnimationFrame(frame);return()=>cancelAnimationFrame(id);
 },[playing]);
 useEffect(()=>{const q=matchMedia("(prefers-reduced-motion: reduce)");const stop=()=>{if(q.matches)setPlaying(false);};q.addEventListener("change",stop);return()=>q.removeEventListener("change",stop);},[]);
 const v=rotate(basis(1),theta),R=rotor(theta),bx=90*Math.cos(theta),by=-90*Math.sin(theta);
 const arrow=(x1:number,y1:number,x2:number,y2:number,color=purple)=><path d={`M${x1} ${y1}L${x2} ${y2}`} fill="none" stroke={color} strokeWidth="3" markerEnd={`url(#${uid})`}/>;
 const label=(x:number,y:number,text:string)=><text x={x} y={y} fill="#475569" fontSize="12" textAnchor="middle">{text}</text>;
 const descriptions:Record<string,string[]>={
 product:["Move b: the scalar is cos θ; the shaded oriented area is sin θ.","移動 b：純量是 cos θ，陰影定向面積是 sin θ。"],
 rotor:["The vector follows the full angle; the rotor coefficients use the half-angle.","向量轉完整角度，轉子分量使用半角。"],
 spinor:["A vector returns at 360°. A spin component’s phase returns at 720°.","向量在 360° 復原，自旋分量的相位在 720° 復原。"],
 grades:["Grade counts in Cl(3,0): 1 scalar, 3 vectors, 3 bivectors, 1 trivector.","Cl(3,0) 各階分量：1 純量、3 向量、3 雙向量、1 三向量。"],
 relations:["Related structures, not a ranking of theories. Arrows indicate construction or representation.","互相關聯的結構，不是理論的高低排名。箭頭代表構造或表示。"],
 motor:["A rigid shape rotates, then translates. This is a 2D slice of rigid motion.","剛體形狀先旋轉再平移：三維剛體運動的二維切片。"],
 boost:["Boost the time direction: the transformed unit timelike vector stays inside the light cone.","推進時間方向：變換後的單位類時向量仍在光錐內。"],
 wave:["A classical plane wave: E and cB are transverse and mutually perpendicular; the propagation direction is z.","經典平面波：E 與 cB 橫向且互相垂直，傳播方向為 z。"],
 holonomy:["Loop transport accumulates a phase around excluded flux. Schematic, not a local force diagram.","沿封閉路徑移動，繞過排除的磁通後累積相位。這是示意圖，不是局域受力圖。"],
 equivariance:["Rotate the input, then apply f; or apply f, then rotate. The outputs coincide for this norm-dependent scaling.","先旋轉再套用 f，或先套用 f 再旋轉：依長度縮放的映射讓兩者結果重合。"]};
 const staticKind=["grades","relations"].includes(kind);
 const points=(offset:number,color:string)=>{const pts=Array.from({length:81},(_,i)=>{const z=i/80*7*Math.PI,phase=z-theta;const e=Math.sin(phase),other=circular?Math.cos(phase):0;return `${55+i*5.4+(offset?20*e:20*other)},${130+(offset?-12*other:-52*e)}`;}).join(" ");return <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5"/>;};
 return <figure className="geometry rounded-lg border border-violet-100 bg-violet-50/40 p-4" data-diagram={kind}>
  <svg viewBox="0 0 550 250" className="w-full" role="img" aria-label={descriptions[kind]?.[l]}>
   <defs><marker id={uid} markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto-start-reverse"><path d="M0 0L6 3L0 6" fill="none" stroke="context-stroke" strokeWidth="1.4"/></marker></defs>
   {kind==="product" && <>
    <path d={`M160 130l90 0l${bx} ${by}l-90 0Z`} fill={purple} opacity={.13}/>
    {arrow(160,130,250,130,teal)}{arrow(160,130,160+bx,130+by)}
    <path d={`M${160+bx} ${130+by}V130`} stroke={muted} strokeDasharray="4 4"/>
    {label(265,150,"a = e₁")}{label(160+bx,115+by,"b")}{label(405,90,`a·b = ${Math.cos(theta).toFixed(3)}`)}{label(405,120,`a∧b = ${Math.sin(theta).toFixed(3)} e₁₂`)}
   </>}
   {(kind==="rotor"||kind==="spinor") && <>
    {[145,405].map(cx=><circle key={cx} cx={cx} cy="105" r="65" stroke="#ddd6fe" fill="white"/>)}
    {arrow(145,105,145+60*v[1],105-60*v[2],teal)}
    {arrow(405,105,405+60*R[0],105+60*R[3])}
    {label(145,200,l?"向量 · 完整角":"Vector · full angle")}{label(405,200,l?"相位示意 · 半角":"Phase schematic · half angle")}
    {label(145,224,`(${v[1].toFixed(2)}, ${v[2].toFixed(2)})`)}{label(405,224,`R = ${R[0].toFixed(2)} ${R[3]<0?"−":"+"} ${Math.abs(R[3]).toFixed(2)} e₁₂`)}
   </>}
   {kind==="grades" && <>
    {[1,3,3,1].map((count,k)=><g key={k}>
     <rect x={30+k*132} y="32" width="110" height="164" rx="12" fill="white" stroke="#ddd6fe"/>
     {label(85+k*132,58,`Grade ${k}`)}
     {k===0?<circle cx="85" cy="112" r="6" fill={purple}/>:k===1?arrow(187,140,224,90):k===2?<path d="M308 140L325 90L365 110L348 160Z" fill={purple} opacity=".4"/>:<path d="M443 100l35-18l33 20v45l-35 17l-33-19Z M443 100l33 18l35-16 M476 118v46" fill="#ddd6fe" stroke={purple}/>}
     {label(85+k*132,181,`${count} ${l?"分量":"coefficients"}`)}
    </g>)}{label(275,229,"1 + 3 + 3 + 1 = 8")}
   </>}
   {kind==="relations" && <>
    {[["T(V)",275,35],["Cl(V,q)",275,110],["ℂ / ℍ",110,200],["Spin / rotors",430,200]].map(([t,x,y])=><g key={t}><rect x={Number(x)-75} y={Number(y)-20} width="150" height="40" rx="10" fill="white" stroke="#c4b5fd"/>{label(Number(x),Number(y)+5,String(t))}</g>)}
    {arrow(275,56,275,88)}{arrow(243,133,145,177)}{arrow(305,133,395,177)}{label(365,74,"v² = q(v)")}
   </>}
   {kind==="motor" && <>
    <path d="M50 200H510M100 220V25" stroke="#cbd5e1"/>
    <path d="M100 165L145 165L110 115Z" fill={teal} opacity=".3"/>
    <g transform={`translate(${200+50*Math.sin(theta/2)} 128) rotate(${-angle})`}><path d="M0 0L45 0L10-50Z" fill={purple} opacity=".65"/></g>
    {arrow(140,170,260,140)}{label(115,235,l?"原始剛體":"Original")}{label(365,225,l?"M = 平移 × 旋轉":"M = translation × rotation")}
   </>}
   {kind==="boost" && <>
    <path d="M135 225V20M25 205H330M135 205L30 40M135 205L240 40" fill="none" stroke="#cbd5e1"/>
    <path d="M135 205L30 40H240Z" fill="#ddd6fe" opacity=".3"/>
    {arrow(135,205,135,130,teal)}{arrow(135,205,135+70*Math.sinh((angle/720)*1.1),205-70*Math.cosh((angle/720)*1.1))}
    {label(140,14,"t")}{label(335,210,"x")}{label(400,90,`η = ${(angle/720*1.1).toFixed(2)}`)}{label(400,120,`β = ${Math.tanh(angle/720*1.1).toFixed(3)}`)}
    {label(400,160,"t′² − x′² = 1")}
   </>}
   {kind==="wave" && <>
    {arrow(35,130,520,130,muted)}{points(0,purple)}{points(1,teal)}
    {label(520,150,"z")}{label(80,36,"E")}{label(160,36,"cB")}
    <path d="M68 45h25" stroke={purple} strokeWidth="3"/><path d="M145 45h30" stroke={teal} strokeWidth="3"/>
    {label(275,230,circular?(l?"圓偏振 · 橫向旋轉":"Circular polarization · transverse rotation"):(l?"線偏振 · 透視投影":"Linear polarization · perspective projection"))}
   </>}
   {kind==="holonomy" && <>
    <circle cx="210" cy="120" r="76" fill="none" stroke="#c4b5fd" strokeWidth="2" strokeDasharray="5 4"/>
    <circle cx="210" cy="120" r="30" fill="#7c3aed" opacity=".18"/>{label(210,125,"Φ")}
    <circle cx={210+76*Math.cos(theta)} cy={120-76*Math.sin(theta)} r="7" fill={teal}/>
    <circle cx="430" cy="120" r="45" fill="white" stroke="#ddd6fe"/>{arrow(430,120,430+38*Math.cos(theta/3),120-38*Math.sin(theta/3))}
    {label(430,195,l?"累積相位 · 示意":"Accumulated phase · schematic")}
   </>}
   {kind==="equivariance" && <>
    {arrow(70,170,120,170,muted)}{arrow(70,170,70+80*Math.cos(theta),170-80*Math.sin(theta),teal)}
    {arrow(300,170,300+(80/(1+Math.exp(-1)))*Math.cos(theta),170-(80/(1+Math.exp(-1)))*Math.sin(theta),purple)}
    <circle cx={300+85*Math.cos(theta)} cy={170-85*Math.sin(theta)} r="8" stroke={teal} strokeWidth="2" fill="white"/>
    {label(110,224,l?"旋轉輸入":"Rotate input")}{label(380,224,"f(ρ(g)x) = ρ(g)f(x)")}
   </>}
  </svg>
  {!staticKind && <div className="mt-2 space-y-3">
   <label className="flex items-center gap-3 text-xs font-medium text-violet-900"><span className="w-20 shrink-0">{kind==="boost"?"η":kind==="wave"?(l?"相位":"Phase"):"θ"} {kind==="boost"?(angle/720*1.1).toFixed(2):`${Math.round(angle)}°`}</span>
    <input aria-label={l?"圖解參數":"Diagram parameter"} className="min-w-0 flex-1 accent-violet-600" type="range" min="0" max="720" value={angle} onChange={e=>{setPlaying(false);setAngle(Number(e.target.value));}}/>
   </label>
   <div className="flex flex-wrap gap-2">
    <button className="control" onClick={()=>setPlaying(p=>!p)}>{playing?(l?"暫停":"Pause"):(l?"播放動畫":"Play animation")}</button>
    {[0,90,360,720].map(a=><button key={a} className="control" onClick={()=>{setPlaying(false);setAngle(a);}}>{a}°</button>)}
    {kind==="wave"&&<button className="control" aria-pressed={circular} onClick={()=>setCircular(c=>!c)}>{circular?(l?"圓偏振":"Circular"):(l?"線偏振":"Linear")}</button>}
   </div>
  </div>}
  <figcaption className="mt-3 text-xs leading-relaxed text-gray-600">{descriptions[kind]?.[l]}</figcaption>
  {kind==="product"&&<div className="mt-3"><Tex tex={`ab=${Math.cos(theta).toFixed(3)}${Math.sin(theta)<0?"-":"+"}${Math.abs(Math.sin(theta)).toFixed(3)}e_{12}`} display/></div>}
 </figure>;
}
