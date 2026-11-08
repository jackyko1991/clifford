import {useEffect,useId,useState} from "react";
import {basis,rotate,rotor} from "../algebra";
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
 evidence:["A rule leads to a prediction, which can be compared with measured data.","從規則算出預測，再和實際量測比較。"],
 timeline:["Different contributors built different parts of the connected toolkit.","不同人物，建立這套互相關聯的工具中的不同部分。"],
 path:["First two arrows, then a turn, then an application to light.","先學兩支箭頭，再做旋轉，最後用到光的例子。"],
 state:["Two simple spin records and their outcome probabilities in a chosen measurement basis. This is not a solved Dirac evolution.","兩份簡單自旋紀錄，在選定量測方向下的結果機率；這不是已解出的狄拉克演變。"],
 product:["Turn the second arrow: compare alignment with the shaded area.","轉動第二支箭頭，比較平行程度和陰影面積。"],
 rotor:["The left hand makes the full turn; the right hand moves at half speed.","左邊轉完整角度，右邊只走一半速度。"],
 spinor:["A vector returns at 360°. A spin component’s phase returns at 720°.","向量在 360° 復原，自旋分量的相位在 720° 復原。"],
 grades:["Count the slots: one number, three arrows, three planes and one volume.","數一數位置：1 個數、3 支箭頭、3 種平面、1 塊體積。"],
 relations:["Different records can describe related geometric actions.","不同的紀錄方式，可以描述互相關聯的幾何動作。"],
 motor:["A rigid shape rotates, then translates. This is a 2D slice of rigid motion.","剛體形狀先旋轉再平移：三維剛體運動的二維切片。"],
 boost:["Boost the time direction: the transformed unit timelike vector stays inside the light cone.","推進時間方向：變換後的單位類時向量仍在光錐內。"],
 wave:["A classical plane wave: the electric and magnetic parts point across the direction of travel, at right angles to each other.","經典平面波：電場與磁場都橫向於前進方向，也互相垂直。"],
 holonomy:["Loop transport accumulates a phase around excluded flux. Schematic, not a local force diagram.","沿封閉路徑移動，繞過排除的磁通後累積相位。這是示意圖，不是局域受力圖。"],
 equivariance:["Rotate the input, then apply f; or apply f, then rotate. The outputs coincide for this norm-dependent scaling.","先旋轉再套用 f，或先套用 f 再旋轉：依長度縮放的映射讓兩者結果重合。"]};
 const staticKind=["grades","relations","evidence","timeline","path","state"].includes(kind);
 const points=(offset:number,color:string)=>{const pts=Array.from({length:81},(_,i)=>{const z=i/80*7*Math.PI,phase=z-theta;const e=Math.sin(phase),other=circular?Math.cos(phase):0;return `${55+i*5.4+(offset?30*e:30*other)},${130+(offset?52*other-18*e:-52*e-18*other)}`;}).join(" ");return <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5"/>;};
 return <figure className="geometry rounded-lg border border-violet-100 bg-violet-50/40 p-4" data-diagram={kind}>
  <svg viewBox="0 0 550 250" className="w-full" role="img" aria-label={descriptions[kind]?.[l]}>
   <defs><marker id={uid} viewBox="0 0 10 10" markerWidth="4" markerHeight="4" refX="7" refY="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="context-stroke"/></marker></defs>
   {kind==="product" && <>
    <path d={`M160 130l90 0l${bx} ${by}l-90 0Z`} fill={purple} opacity={.13}/>
    {arrow(160,130,250,130,teal)}{arrow(160,130,160+bx,130+by)}
    <path d={`M${160+bx} ${130+by}V130`} stroke={muted} strokeDasharray="4 4"/>
    {label(265,150,"a")}{label(160+bx,115+by,"b")}{label(405,90,`${l?"平行程度":"Alignment"}: ${Math.cos(theta).toFixed(3)}`)}{label(405,120,`${l?"定向面積":"Oriented area"}: ${Math.sin(theta).toFixed(3)}`)}
   </>}
   {(kind==="rotor"||kind==="spinor") && <>
    {[145,405].map(cx=><circle key={cx} cx={cx} cy="105" r="65" stroke="#ddd6fe" fill="white"/>)}
    {arrow(145,105,145+60*v[1],105-60*v[2],teal)}
    {arrow(405,105,405+60*R[0],105+60*R[3])}
    {label(145,200,l?"向量 · 完整角":"Vector · full angle")}{label(405,200,l?"半速錶盤 · 相位示意":"Half-speed dial · phase schematic")}
    {label(145,224,`(${v[1].toFixed(2)}, ${v[2].toFixed(2)})`)}{label(405,224,`${l?"半角":"Half angle"}: ${(angle/2).toFixed(0)}°`)}
   </>}
   {kind==="grades" && <>
    {[1,3,3,1].map((count,k)=><g key={k}>
     <rect x={30+k*132} y="32" width="110" height="164" rx="12" fill="white" stroke="#ddd6fe"/>
     {label(85+k*132,58,(l?["數量","箭頭","平面","體積"]:["Number","Arrow","Plane","Volume"])[k])}
     <g transform={`translate(${85+k*132} 114)`}>
      {k===0?<circle r="6" fill={purple}/>:k===1?arrow(-18.5,25,18.5,-25):k===2?<path d="M-28.5 15L-11.5-35L28.5-15L11.5 35Z" fill={purple} opacity=".4"/>:<path d="M-34-23l35-18l33 20v45l-35 17l-33-19Z M-34-23l33 18l35-16 M-1-5v46" fill="#ddd6fe" stroke={purple}/>}
     </g>
     {label(85+k*132,181,`${count} ${l?"分量":"coefficients"}`)}
    </g>)}{label(275,229,"1 + 3 + 3 + 1 = 8")}
   </>}
   {["evidence","path","timeline"].includes(kind) && <>
    {(kind==="evidence"?(l?["規則","預測","量測"]:["Rule","Prediction","Measurement"]):kind==="path"?(l?["兩支箭頭","做一次旋轉","光的例子"]:["Two arrows","One turn","A light wave"]):["Hamilton","Grassmann","Clifford","Grossmann"]).map((t,i,all)=>{
      const w=all.length===4?118:155, x=15+i*(all.length===4?136:180);
      return <g key={t}><rect x={x} y="75" width={w} height="70" rx="10" fill="white" stroke="#c4b5fd"/>{label(x+w/2,115,t)}{i<all.length-1&&<path d={`M${x+w+3} 110h12l-5-4m5 4-5 4`} stroke={purple} fill="none"/>}</g>;
    })}
   </>}
   {kind==="state" && <>
    {[0,1].map(i=><g key={i}><rect x={35+i*280} y="25" width="200" height="170" rx="12" fill="white" stroke="#c4b5fd"/>{label(135+i*280,53,i?"(0, 1)":"(1, 0)")}
      <rect x={75+i*280} y={i?151:77} width="35" height={i?2:76} fill={teal}/>
      <rect x={155+i*280} y={i?77:151} width="35" height={i?76:2} fill={purple}/>
      {label(93+i*280,178,i?"0%":"100%")}{label(173+i*280,178,i?"100%":"0%")}
    </g>)}
   </>}
   {kind==="relations" && <>
    {[[(l?"箭頭與長度規則":"Arrows + length rule"),275,35],[(l?"幾何乘法":"Geometric product"),275,110],[(l?"複數與四元數":"Complex / quaternions"),110,200],[(l?"旋轉紀錄":"Rotation records"),430,200]].map(([t,x,y])=><g key={t}><rect x={Number(x)-75} y={Number(y)-20} width="150" height="40" rx="10" fill="white" stroke="#c4b5fd"/>{label(Number(x),Number(y)+5,String(t))}</g>)}
    {arrow(275,56,275,88)}{arrow(243,133,145,177)}{arrow(305,133,395,177)}{label(365,74,l?"定義乘法":"Define multiplication")}
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
    {label(140,14,l?"時間":"Time")}{label(335,210,l?"距離":"Distance")}{label(400,90,`${l?"時間分量":"Time part"}: ${Math.cosh(angle/720*1.1).toFixed(2)}`)}{label(400,120,`${l?"距離分量":"Distance part"}: ${Math.sinh(angle/720*1.1).toFixed(2)}`)}
    {label(400,160,l?"光錐的邊界不變":"Light-cone boundary preserved")}
   </>}
   {kind==="wave" && <>
    {arrow(35,130,520,130,muted)}{points(0,purple)}{points(1,teal)}
    {label(520,150,"z")}{label(90,36,l?"電場 E":"Electric field E")}{label(245,36,l?"磁場（換成同尺度）":"Magnetic (same scale)")}
    <path d="M68 45h25" stroke={purple} strokeWidth="3"/><path d="M230 45h30" stroke={teal} strokeWidth="3"/>
    {label(275,230,circular?(l?"圓偏振 · 橫向旋轉":"Circular polarization · transverse rotation"):(l?"線偏振 · 透視投影":"Linear polarization · perspective projection"))}
   </>}
   {kind==="holonomy" && <>
    <circle cx="210" cy="120" r="76" fill="none" stroke="#c4b5fd" strokeWidth="2" strokeDasharray="5 4"/>
    <circle cx="210" cy="120" r="30" fill="#7c3aed" opacity=".18"/>{label(210,125,l?"磁通":"Flux")}
    <circle cx={210+76*Math.cos(theta)} cy={120-76*Math.sin(theta)} r="7" fill={teal}/>
    <circle cx="430" cy="120" r="45" fill="white" stroke="#ddd6fe"/>{arrow(430,120,430+38*Math.cos(theta/3),120-38*Math.sin(theta/3))}
    {label(430,195,l?"累積相位 · 示意":"Accumulated phase · schematic")}
   </>}
   {kind==="equivariance" && <>
    {arrow(70,170,120,170,muted)}{arrow(70,170,70+80*Math.cos(theta),170-80*Math.sin(theta),teal)}
    {arrow(300,170,300+(80/2)*Math.cos(theta),170-(80/2)*Math.sin(theta),purple)}
    <circle cx={300+85*Math.cos(theta)} cy={170-85*Math.sin(theta)} r="8" stroke={teal} strokeWidth="2" fill="white"/>
    {label(110,224,l?"旋轉輸入":"Rotate input")}{label(380,224,l?"兩條計算路線，答案重合":"Both calculation routes agree")}
   </>}
  </svg>
  {!staticKind && <div className="mt-2 space-y-3">
   <label className="flex items-center gap-3 text-xs font-medium text-violet-900"><span className="w-20 shrink-0">{kind==="boost"?(l?"速度 / 光速":"Speed / c"):kind==="wave"?(l?"週期位置":"Cycle position"):(l?"角度":"Angle")} {kind==="boost"?Math.tanh(angle/720*1.1).toFixed(2):`${Math.round(angle)}°`}</span>
    <input aria-label={l?"圖解參數":"Diagram parameter"} className="min-w-0 flex-1 accent-violet-600" type="range" min="0" max="720" value={angle} onChange={e=>{setPlaying(false);setAngle(Number(e.target.value));}}/>
   </label>
   <div className="flex flex-wrap gap-2">
    <button className="control" onClick={()=>setPlaying(p=>!p)}>{playing?(l?"暫停":"Pause"):(l?"播放動畫":"Play animation")}</button>
    {[0,90,360,720].map(a=><button key={a} className="control" onClick={()=>{setPlaying(false);setAngle(a);}}>{kind==="boost"?`${Math.round(Math.tanh(a/720*1.1)*100)}%`:`${a}°`}</button>)}
    {kind==="wave"&&<button className="control" aria-pressed={circular} onClick={()=>setCircular(c=>!c)}>{circular?(l?"圓偏振":"Circular"):(l?"線偏振":"Linear")}</button>}
   </div>
  </div>}
  <figcaption className="mt-3 text-xs leading-relaxed text-gray-600">{descriptions[kind]?.[l]}</figcaption>
 </figure>;
}
