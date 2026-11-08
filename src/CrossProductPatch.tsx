import {useState} from "react";
import Tex from "./components/Tex";
import Arrow from "./components/GeometryArrow";
import {crossProductAsDual,crossProductView} from "./foundationsModel";
const purple="#7c3aed",teal="#0f766e",gray="#64748b";
const btn="rounded-md border border-violet-200 bg-white px-3 py-1.5 text-xs text-violet-800 hover:bg-violet-50";
export default function CrossProductPatch({l}:{l:number}){
 const [plane,setPlane]=useState(0),[swapped,setSwapped]=useState(false);
 const [i,j,k]=[[0,1,2],[1,2,0],[2,0,1]][plane],first=swapped?j:i,second=swapped?i:j;
 const unit=(axis:number)=>[0,1,2].map(n=>n===axis?1:0);
 const result=crossProductAsDual(unit(first),unit(second));
 const {axes}=crossProductView(plane);
 const o=[160,130],u=axes[i],v=axes[j];
 const point=(d:number[])=>[o[0]+d[0],o[1]+d[1]];
 const normal=axes.reduce((p,e,n)=>[p[0]+result.normal[n]*e[0],p[1]+result.normal[n]*e[1]],[0,0]);
 const start=axes[first],finish=axes[second];
 const arcStart=point(start.map(x=>x*.42)),arcEnd=point(finish.map(x=>x*.42)),arcControl=point(start.map((x,n)=>(x+finish[n])*.42));
 const endDirection=start.map(x=>-x),length=Math.hypot(...endDirection);
 const arcTail=arcEnd.map((x,n)=>x-7*endDirection[n]/length);
 return <details className="rounded-lg border border-violet-200 bg-violet-50/30 p-4" data-testid="cross-product-patch">
  <summary className="cursor-pointer font-semibold text-violet-900">{l?"3D 特例補丁：右手叉積，把面積換成法向箭頭":"A special 3D shortcut: the right-hand cross product"}</summary>
  <div className="mt-4 space-y-4 text-sm leading-relaxed">
   <p>{l?"你可能學過「兩支箭頭相乘，長出一支垂直的箭頭」。這就是熟悉的三維叉積：先得到兩支箭頭張出的定向面積，再用一支法向箭頭代替它。箭頭的長度代表面積大小，朝哪一側則由右手規則決定。":"You may have learned that two arrows produce a perpendicular arrow. The familiar 3D cross product first takes their oriented area, then represents it by a normal arrow. The arrow’s magnitude records the area; the right-hand rule selects its side."}</p>
   <div className="rounded-lg border-l-4 border-emerald-300 bg-emerald-50/60 p-3" data-interactive="right-hand-cross-product">
    <p className="text-xs text-gray-600">{l?"固定右手正交單位座標。右手食指沿 a，中指沿 b，拇指就是 a × b。先猜交換順序後，拇指會朝哪裡。":"Use a fixed right-handed orthonormal frame. Point the right index finger along a, middle finger along b: the thumb gives a × b. Predict where it points after swapping."}</p>
    <div className="mt-3 flex flex-wrap justify-center gap-2">{[[1,2],[2,3],[3,1]].map((pair,n)=><button key={n} className={btn} aria-pressed={plane===n} onClick={()=>{setPlane(n);setSwapped(false);}}><Tex tex={`e_${pair[0]},\\ e_${pair[1]}`}/></button>)}</div>
    <svg viewBox="15 0 310 240" className="mx-auto max-h-64 w-full max-w-md" role="img" aria-label={l?"紫色定向面積對應綠色法向箭頭，交換順序後箭頭反向":"The purple oriented area corresponds to a teal normal arrow, which reverses when the order swaps"}>
     {axes.map((axis,n)=><g key={n}><path d={`M${o}L${point(axis.map(x=>x*1.15))}`} stroke="#cbd5e1" strokeDasharray="3 4"/>{n!==k&&<text data-diagram-label={`input-${n}`} x={n===i?74:246} y="184" textAnchor={n===i?"end":"start"} fontSize="13" fill={gray}>{n===first?"a":"b"} = e<tspan baselineShift="sub" fontSize="9">{n+1}</tspan></text>}{n===k&&swapped&&<text data-diagram-label="positive-reference" x="160" y="24" textAnchor="middle" fontSize="12" fill="#94a3b8">+e<tspan baselineShift="sub" fontSize="9">{n+1}</tspan></text>}</g>)}
     <path d={`M${o}L${point(u)}L${point(u.map((x,n)=>x+v[n]))}L${point(v)}Z`} fill={purple} fillOpacity=".2" stroke={purple} strokeOpacity=".5"/>
     <Arrow a={o} b={point(start)} color={gray}/><Arrow a={o} b={point(finish)} color={gray}/>

     <path d={`M${arcStart}Q${arcControl} ${arcEnd}`} stroke={purple} strokeWidth="2" fill="none"/><Arrow a={arcTail} b={arcEnd} color={purple}/>
     <g data-normal-facing={swapped?"back":"front"}>{swapped?<><path d={`M${o}L${point(normal)}`} stroke={teal} strokeWidth="3" strokeDasharray="4 4" fill="none"/><Arrow a={point(normal.map(x=>x*.84))} b={point(normal)} color={teal}/></>:<Arrow a={o} b={point(normal)} color={teal}/>}</g><text data-diagram-label="normal" x="177" y={swapped?218:45} textAnchor="start" fontSize="13" fill={teal}>a×b = {swapped?"−":"+"}e<tspan baselineShift="sub" fontSize="9">{k+1}</tspan></text>
    </svg>
    <p className="mb-3 text-center text-xs text-gray-500">{swapped?(l?"從正法向側看：a→b 順時針，法向指向平面背面（綠色虛線）。":"Seen from the positive-normal side: a→b is clockwise; the normal points behind the plane (teal dashes)."):(l?"從正法向側看：a→b 逆時針，法向指向平面正面。":"Seen from the positive-normal side: a→b is anticlockwise; the normal points out of the front of the plane.")}</p>
    <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 rounded-lg bg-white p-3" aria-live="polite"><span style={{color:purple}}><Tex tex={`e_${first+1}\\wedge e_${second+1}=${swapped?"-":""}e_{${i+1}${j+1}}`}/></span><span style={{color:teal}}><Tex tex={`e_${first+1}\\times e_${second+1}=${swapped?"-":""}e_${k+1}`}/></span></div>
    <div className="mt-3 text-center"><button className={btn} aria-pressed={swapped} onClick={()=>setSwapped(s=>!s)}>{l?"交換 a、b，看拇指反向":"Swap a and b: reverse the thumb"}</button></div>
   </div>
   <p>{l?"這是三維特例的「補丁」，不是把所有向量相乘都定義成叉積。三維的一片面只有一條垂直方向線，所以能用法向箭頭記錄它；還要先選定長度規則與空間定向，才能固定大小和正負。":"This is a special 3D shortcut, not a definition of every vector product. In 3D, a plane has a one-dimensional normal direction. A chosen metric and spatial orientation fix the normal arrow’s magnitude and sign."}</p>
   <p>{l?"換到四維，一片面外還有兩個獨立方向，沒有唯一的垂直箭頭可直接代替它。外積仍照常記住定向面積；熟悉的三維右手叉積，就不能原封不動地搬過去。":"In 4D, a plane has two independent perpendicular directions, so there is no unique normal arrow to replace it. The wedge product still records its oriented area; the familiar 3D right-hand construction does not carry over unchanged."}</p>
   <p className="text-xs text-gray-500"><a className="text-violet-700 underline" href="https://staff.fnwi.uva.nl/l.dorst/clifford/dorst-mann-II.pdf" target="_blank" rel="noreferrer">Dorst &amp; Mann · Geometric Algebra: a Computational Framework ↗</a></p>
  </div>
 </details>;
}
