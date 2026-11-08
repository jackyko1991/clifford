import {useEffect,useState} from "react";
import Tex from "./Tex";
import Arrow from "./GeometryArrow";
import {inverseMotion} from "../toolkitModel";
import {numberText} from "../foundationsModel";
const purple="#7c3aed",orange="#d97706",teal="#0f766e";
const button="rounded border border-violet-200 bg-white px-3 py-1.5 text-xs text-violet-800 hover:bg-violet-50 disabled:opacity-40";
export default function InverseMotion({l,scale}:{l:number;scale:number}){
 const [progress,setProgress]=useState(0),[playing,setPlaying]=useState(false),[speed,setSpeed]=useState(1);
 useEffect(()=>{if(!playing)return;const timer=setInterval(()=>setProgress(p=>Math.min(2,p+.02)),40/speed);return()=>clearInterval(timer);},[playing,speed]);
 useEffect(()=>{if(progress>=2)setPlaying(false);},[progress]);
 useEffect(()=>{setPlaying(false);},[scale]);
 const theta=Math.PI/3,max=Math.max(1.4,scale*scale+.3,scale+.3),zoom=Math.min(185/max,80/Math.max(1,scale/2));
 const project=(p:number[])=>[28+zoom*p[0],63-zoom*p[1]];
 const sample=(p:number,invert:boolean)=>inverseMotion(scale,theta,p,invert);
 const route=(from:number,to:number,invert:boolean)=>Array.from({length:51},(_,i)=>sample(from+(to-from)*i/50,invert)).filter((p):p is number[]=>p!==null).map(p=>project(p).join(',')).join(' ');
 const pauseAt=(p:number)=>{setPlaying(false);setProgress(p);};
 return <div className="space-y-3" data-testid="inverse-motion" data-progress={progress} data-scale={scale}>
  <p className="text-xs">{l?<>把 <Tex tex="a+b e_{12}"/> 畫在係數平面上：橫軸是純量，縱軸是 <Tex tex="e_{12}"/> 的係數。紫色軌跡先乘 <Tex tex="Q"/>；第二段分別乘反轉或反元素，看看能不能回到起點。</>:<>Plot <Tex tex="a+b e_{12}"/> in its coefficient plane: scalar across, the coefficient of <Tex tex="e_{12}"/> up. The purple path first multiplies by <Tex tex="Q"/>. The second stage multiplies by its reverse or inverse: which returns to the start?</>}</p>
  <div className="grid gap-3 sm:grid-cols-2">{[false,true].map(invert=>{
   const current=sample(progress,invert),color=invert?teal:orange,end=sample(2,invert);
   return <div key={String(invert)} className="min-w-0 rounded-lg border bg-white p-2" style={{borderColor:color+"55"}} data-motion-branch={invert?"inverse":"reverse"} data-point={current?.join(',')??"undefined"}>
    <p className="text-center text-xs" style={{color}}><Tex tex={invert?"1\\;\\to\\;Q\\;\\to\\;QQ^{-1}":"1\\;\\to\\;Q\\;\\to\\;Q\\widetilde Q"}/></p>
    <svg viewBox="0 0 230 170" className="mx-auto w-full max-w-72" role="img" aria-label={invert?(l?"先乘 Q 再乘反元素的係數軌跡":"Coefficient trajectory multiplying by Q then its inverse"):(l?"先乘 Q 再乘反轉的係數軌跡":"Coefficient trajectory multiplying by Q then its reverse")}>
     <path d="M18 63H221M28 145V17" fill="none" stroke="#cbd5e1"/>
     <text x="34" y="18" fontSize="12" fill={purple}>e<tspan baselineShift="sub" fontSize="9">12</tspan></text><text x="183" y="53" fill="#64748b" fontSize="11">{l?"純量":"scalar"}</text>
     {[0,1,2,3,4].filter(v=>v<=max-.15).map(v=><g key={v}><path d={`M${project([v,0])[0]} 60v6`} stroke="#94a3b8"/><text x={project([v,0])[0]} y="82" textAnchor="middle" fontSize="11" fill="#64748b">{v}</text></g>)}
     {[0,1].map(stage=><g key={stage}>
      <polyline points={route(stage,stage+1,invert)} fill="none" stroke={stage===0?purple:color} strokeDasharray="4 4" opacity=".35" strokeWidth="2"/>
      <polyline points={route(stage,Math.max(stage,Math.min(stage+1,progress)),invert)} fill="none" stroke={stage===0?purple:color} strokeWidth="2.5"/>
      {progress>stage+.15&&(()=>{const a=sample(stage+Math.min(1,progress-stage)*.5,invert),b=sample(stage+Math.min(1,progress-stage)*.65,invert);return a&&b?<Arrow a={project(a)} b={project(b)} color={stage===0?purple:color}/>:null;})()}
     </g>)}
     <circle cx={project([1,0])[0]} cy="63" r="6" fill="white" stroke="#2563eb" strokeWidth="1.5"/>
     <text x={project([1,0])[0]} y="98" textAnchor="middle" fontSize="11" fill="#2563eb">{l?"起點 1":"start 1"}</text>
     <text x={project(sample(1,invert)!)[0]+8} y={project(sample(1,invert)!)[1]+17} fontSize="12" fill={purple}>Q</text>
     {current&&<circle data-moving-point="true" cx={project(current)[0]} cy={project(current)[1]} r="4" fill={progress<=1?purple:color}/>}
     <text x="115" y="163" textAnchor="middle" fontSize="12" fill={color}>{end?(invert?(l?"終點：1，回到藍圈":"Finish: 1, back to the blue ring"):(l?`終點：s² = ${numberText(scale*scale)}`:`Finish: s² = ${numberText(scale*scale)}`)):(l?"s = 0：反元素不存在":"s = 0: no inverse exists")}</text>
    </svg>
    <p className="text-center text-xs" aria-live="polite">{current?<Tex tex={`z\\approx ${numberText(current[0])}${current[1]<-1e-9?"-":"+"}${numberText(Math.abs(current[1]))}e_{12}`}/>:<span className="text-amber-800">{l?"無法進行第二步":"The second step is undefined"}</span>}</p>
   </div>;
  })}</div>
  <div className="flex flex-wrap justify-center gap-2">{[0,1,2].map(p=><button className={button} key={p} aria-pressed={progress===p} onClick={()=>pauseAt(p)}>{p===0?(l?"0 · 從 1 出發":"0 · Start at 1"):p===1?(l?"1 · 乘 Q":"1 · Multiply by Q"):(l?"2 · 比較返回位置":"2 · Compare the return")}</button>)}</div>
  <label className="flex items-center gap-3 text-xs"><span>{l?"沿路進度":"Progress"}</span><input className="min-w-0 flex-1 accent-violet-600" aria-label={l?"反轉與反元素的運動進度":"Reverse and inverse motion progress"} type="range" min="0" max="2" step=".01" value={progress} onChange={e=>pauseAt(Number(e.target.value))}/></label>
  <div className="flex flex-wrap items-center justify-center gap-2"><button className={button} disabled={progress<=0} onClick={()=>pauseAt(Math.max(0,Math.ceil(progress)-1))}>{l?"‹ 上一步":"‹ Previous"}</button><button className={button} aria-pressed={playing} onClick={()=>{if(progress>=2)setProgress(0);setPlaying(p=>!p);}}>{playing?(l?"暫停":"Pause"):(l?"▶ 播放":"▶ Play")}</button><button className={button} disabled={progress>=2} onClick={()=>pauseAt(Math.min(2,Math.floor(progress)+1))}>{l?"下一步 ›":"Next ›"}</button><button className={button} onClick={()=>pauseAt(0)}>{l?"重新開始":"Restart"}</button><label className="flex items-center gap-1 text-xs">{l?"速度":"Speed"}<select className="rounded border border-violet-200 bg-white p-1" value={speed} onChange={e=>setSpeed(Number(e.target.value))}>{[.5,1,2].map(v=><option key={v} value={v}>{v}×</option>)}</select></label></div>
  <p className="text-xs text-gray-600">{l?"這是代數元素的乘法路徑，不是空間中的夾乘旋轉。回程抵銷了轉角，但反轉沒有抵銷倍率；只有 s=1 時兩條回程才重合。":"This plots multiplication of algebra elements, not a spatial sandwich rotation. The return cancels the turn, but reversion does not cancel the scale. The two return paths coincide only when s=1."}</p>
 </div>;
}
