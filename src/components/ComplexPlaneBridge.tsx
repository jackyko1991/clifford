import {useState} from "react";
import Tex from "./Tex";
import Arrow from "./GeometryArrow";
const purple="#7c3aed",teal="#0f766e";
const btn="rounded-md border border-violet-200 bg-white px-3 py-1.5 text-xs text-violet-800 hover:bg-violet-50";
const axes=[[76,0],[-40,32],[0,-68]];
export default function ComplexPlaneBridge({l}:{l:number}){
 const [plane,setPlane]=useState("12"),[angle,setAngle]=useState(60);
 const theta=angle*Math.PI/180;
 const a=Math.abs(Math.cos(theta))<1e-9?0:Math.cos(theta),b=Math.abs(Math.sin(theta))<1e-9?0:Math.sin(theta);
 const signed=(v:number)=>`${v<0?"-":"+"}${Math.abs(v).toFixed(2)}`;
 const selected=[Number(plane[0])-1,Number(plane[1])-1];
 const o=[125,115],u=axes[selected[0]],v=axes[selected[1]];
 const corners=[o,[o[0]+u[0],o[1]+u[1]],[o[0]+u[0]+v[0],o[1]+u[1]+v[1]],[o[0]+v[0],o[1]+v[1]]];
 return <div className="space-y-3" data-testid="complex-plane-bridge" data-plane={plane}>
  <p>{l?<>複平面先把 <Tex tex="a+bi"/> 畫成一個點：橫著讀實部，直著讀虛部。現在把符號 <Tex tex="i"/> 換成一個平方為 <Tex tex="-1"/> 的定向單位平面 <Tex tex="B"/>，相同的兩個數字就寫成 <Tex tex="a+bB"/>。</>:<>The complex plane plots <Tex tex="a+bi"/> as a point: real part across, imaginary part up. Replace <Tex tex="i"/> with an oriented unit plane <Tex tex="B"/> whose square is <Tex tex="-1"/>. The same two coefficients become <Tex tex="a+bB"/>.</>}</p>
  <div className="flex flex-wrap justify-center gap-2">{["12","13","23"].map(p=><button key={p} className={btn} aria-pressed={plane===p} onClick={()=>setPlane(p)} style={{background:plane===p?"#ede9fe":"white"}}><Tex tex={`i\\;\\longleftrightarrow\\;B=e_{${p}}`}/></button>)}</div>
  <div className="grid gap-3 sm:grid-cols-2">
   <div className="min-w-0 rounded-lg border border-violet-100 bg-white p-2">
    <p className="text-center text-xs font-medium">{l?"複平面：兩個數字的位置":"Complex plane: two coefficients"}</p>
    <svg viewBox="0 0 260 225" className="mx-auto w-full max-w-72" role="img" aria-label={l?"複平面的實軸、虛軸與單位圓":"Real and imaginary axes with a unit circle"}>
     <path d="M22 112H238M130 205V18" fill="none" stroke="#cbd5e1"/>
     <circle cx="130" cy="112" r="72" fill="none" stroke="#ddd6fe"/>
     <text x="229" y="130" fontSize="12" fill={teal}>Re</text><text x="140" y="21" fontSize="12" fill={purple}>Im</text>
     <text x="203" y="128" fontSize="12" fill={teal}>1</text><text x="140" y="44" fontSize="13" fill={purple}>i</text><text x="40" y="128" fontSize="12" fill="#64748b">−1</text><text x="140" y="193" fontSize="13" fill={purple}>−i</text>
     <path d={`M${130+72*a} 112V${112-72*b}H130`} stroke="#94a3b8" strokeDasharray="3 4" fill="none"/>
     <Arrow a={[130,112]} b={[130+72*a,112-72*b]} color={purple}/>
     <circle cx={130+72*a} cy={112-72*b} r="3" fill={purple}/>
     <text x="130" y="220" textAnchor="middle" fontSize="12" fill="#64748b">{l?"點的位置是係數，不是空間中的平面":"The point records coefficients, not a spatial plane"}</text>
    </svg>
    <div className="text-center text-sm" data-testid="complex-value"><Tex tex={`z=\\textcolor{${teal}}{${a.toFixed(2)}}\\textcolor{${purple}}{${signed(b)}i}`}/></div>
   </div>
   <div className="min-w-0 rounded-lg border border-violet-100 bg-white p-2">
    <p className="text-center text-xs font-medium">{l?"幾何空間：選哪個平面來扮演 i？":"Geometric space: which plane plays i?"}</p>
    <svg viewBox="0 0 260 225" className="mx-auto w-full max-w-72" role="img" aria-label={l?`三維空間中的定向單位平面 e${plane}`:`Oriented unit plane e${plane} in 3D`}>
     <polygon points={corners.map(p=>p.join(",")).join(" ")} fill={purple} fillOpacity=".2" stroke={purple} strokeWidth="1.2"/>
     {axes.map((v,k)=><g key={k}><Arrow a={o} b={[o[0]+v[0],o[1]+v[1]]} color={selected.includes(k)?teal:"#cbd5e1"}/><text x={o[0]+v[0]+(k===1?-14:8)} y={o[1]+v[1]+(k===2?-8:15)} fontSize="13" fill={selected.includes(k)?teal:"#94a3b8"}>e<tspan baselineShift="sub" fontSize="10">{k+1}</tspan></text></g>)}
     <text x="130" y="185" textAnchor="middle" fontSize="15" fill={purple}>B = e<tspan baselineShift="sub" fontSize="11">{plane}</tspan></text>
     <text x="130" y="220" textAnchor="middle" fontSize="12" fill="#64748b">{l?"紫色平面是 B，並不是虛軸那根箭頭":"B is the purple plane, not the imaginary-axis arrow"}</text>
    </svg>
    <div className="text-center text-sm" data-testid="plane-value"><Tex tex={`Z=\\textcolor{${teal}}{${a.toFixed(2)}}\\textcolor{${purple}}{${signed(b)}e_{${plane}}}`}/></div>
   </div>
  </div>
  <label className="flex items-center gap-3 text-xs text-violet-800"><span className="shrink-0">{l?"複平面角度":"Complex-plane angle"} {angle}°</span><input className="min-w-0 flex-1 accent-violet-600" type="range" min="0" max="360" value={angle} onChange={e=>setAngle(Number(e.target.value))}/></label>
  <div className="flex flex-wrap items-center justify-center gap-2"><button className={btn} onClick={()=>setAngle(t=>(t+90)%360)}>{l?"乘 i：逆時針轉 90°":"Multiply by i: turn 90° counterclockwise"}</button><button className={btn} onClick={()=>setAngle(0)}>{l?"從 1 開始":"Start at 1"}</button></div>
  <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 rounded-lg bg-white p-3 text-sm"><Tex tex={`i^2=-1\\quad\\longleftrightarrow\\quad B^2=e_{${plane}}^2=-1`}/><Tex tex="(a+bB)B=-b+aB"/></div>
  <p>{l?<>按「乘 <Tex tex="i"/>」，兩個係數由 <Tex tex="(a,b)"/> 變成 <Tex tex="(-b,a)"/>，正好轉四分之一圈；右邊乘 <Tex tex="B"/> 也得到相同規則。所以 <Tex tex="e_{12}"/>、<Tex tex="e_{13}"/>、<Tex tex="e_{23}"/> 各自配上純量，都能構成一份複數。</>:<>Multiplying by <Tex tex="i"/> changes <Tex tex="(a,b)"/> to <Tex tex="(-b,a)"/>, a quarter turn. Multiplying by <Tex tex="B"/> follows the same rule. Each of <Tex tex="e_{12}"/>, <Tex tex="e_{13}"/> and <Tex tex="e_{23}"/>, together with scalars, therefore gives a copy of the complex numbers.</>}</p>
  <p className="text-xs text-gray-600">{l?<>這是三種不同的對應選擇，不是 <Tex tex="e_{12}=e_{13}=e_{23}=i"/>。一次固定一個平面，才是在這份複數裡運算；若把不同平面一起相乘，就走向下一頁籤的四元數結構。</>:<>These are three different identifications, not <Tex tex="e_{12}=e_{13}=e_{23}=i"/>. Fix one plane to work within one copy of the complex numbers. Multiplying different planes takes us towards the quaternion structure in the next tab.</>}</p>
 </div>;
}
