import {useState} from "react";
import Tex from "./components/Tex";
import Arrow from "./components/GeometryArrow";
import {dimensionCounts,gradeColors} from "./foundationsModel";
const btn="rounded-md border border-violet-200 bg-white px-3 py-1.5 text-xs text-violet-800 hover:bg-violet-50";
export function GeometryRecordBuilder({l}:{l:number}){
 const [stage,setStage]=useState(1);
 const titles=l?["只記大小","放進一個方向","再加一個方向","再加第三個方向"]:["Size only","Add one direction","Add a second","Add a third"];
 const explanations=l?[
  "只記一個數，例如 2，還沒選任何方向。這叫純量，記作 0 階。它不是一個幾何點。",
  "選一個方向，就能記一支箭頭。這叫向量，是 1 階；箭頭前的數字記住它有多長。",
  "第二個方向和第一個方向不平行，就能張出一片面。雙向量記住這片面的大小、所在平面與定向，是 2 階。",
  "第三個方向若不在前兩個方向張成的平面內，就能撐出一塊體積。三向量記住它的大小與定向，是 3 階。"
 ]:[
  "A number such as 2 chooses no direction. This is a scalar, grade 0. It is not a geometric point.",
  "Choose one direction to record an arrow. This is a vector, grade 1; its coefficient records the length.",
  "A second nonparallel direction spans a patch. A bivector records its size, plane and orientation: grade 2.",
  "A third direction outside that plane spans a volume. A trivector records its size and orientation: grade 3."
 ];
 const formulas=["s=2","v=e_1","A=e_1\\wedge e_2=e_{12}","V=e_1\\wedge e_2\\wedge e_3=e_{123}"];
 const o=[70,150],x=[170,150],y=[115,115],xy=[215,115],z=[70,65],xz=[170,65],yz=[115,30],xyz=[215,30];
 return <figure data-interactive="geometry-record-builder" className="space-y-3">
  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{titles.map((title,k)=><button key={k} className={btn} aria-pressed={stage===k} onClick={()=>setStage(k)} style={{color:gradeColors[k],background:stage===k?"#f5f3ff":"white"}}>{title}</button>)}</div>
  <svg viewBox="0 0 290 190" className="mx-auto max-h-52 w-full max-w-sm" role="img" aria-label={titles[stage]}>
   {stage===0?<><rect x="95" y="55" width="100" height="80" rx="12" fill="white" stroke={gradeColors[0]}/><text x="145" y="107" textAnchor="middle" fontSize="34" fill={gradeColors[0]}>2</text></>:<>
    {stage===3&&<g fill={gradeColors[3]} fillOpacity=".16" stroke={gradeColors[3]}><path d={`M${o}L${x}L${xz}L${z}Z`}/><path d={`M${x}L${xy}L${xyz}L${xz}Z`}/><path d={`M${z}L${xz}L${xyz}L${yz}Z`}/><path d={`M${o}L${y}L${yz}M${y}L${xy}`} fill="none" strokeDasharray="3 4"/></g>}
    {stage===2&&<path d={`M${o}L${x}L${xy}L${y}Z`} fill={gradeColors[2]} fillOpacity=".25" stroke={gradeColors[2]}/>}
    <Arrow a={o} b={x} color={gradeColors[1]}/><text x="182" y="157" fontSize="14" fill={gradeColors[1]}>e₁</text>
    {stage>=2&&<><Arrow a={o} b={y} color={gradeColors[1]}/><text x="112" y="108" fontSize="14" fill={gradeColors[1]}>e₂</text></>}
    {stage===3&&<><Arrow a={o} b={z} color={gradeColors[1]}/><text x="54" y="56" fontSize="14" fill={gradeColors[1]}>e₃</text></>}
   </>}
  </svg>
  <div className="text-center" aria-live="polite" style={{color:gradeColors[stage]}}><Tex tex={formulas[stage]}/></div>
  <figcaption className="rounded-lg bg-white/80 p-3 text-sm leading-relaxed" aria-live="polite">{explanations[stage]}</figcaption>
 </figure>;
}
export function ThreeDRecordTable({l}:{l:number}){
 const rows=l?[
  ["不選方向","純量","1"],["三個方向中選一個","向量","3"],["三個方向中選一對","雙向量","3"],["三個方向全部選上","三向量","1"]
 ]:[
  ["Choose no direction","Scalar","1"],["Choose one of three","Vector","3"],["Choose a pair of three","Bivector","3"],["Choose all three","Trivector","1"]
 ];
 const basis=["1","e_1,\\ e_2,\\ e_3","e_{12},\\ e_{13},\\ e_{23}","e_{123}"];
 return <div className="grid gap-2 sm:grid-cols-2" data-testid="three-dimensional-records">{rows.map((row,k)=><div key={k} className="rounded-lg border bg-white p-3" style={{borderColor:gradeColors[k]+"55"}}>
  <div className="flex items-baseline justify-between gap-2"><span className="text-sm font-semibold" style={{color:gradeColors[k]}}>{row[1]} · {k} {l?"階":"grade"}</span><span className="text-xs text-gray-500">{row[2]} {l?"格":"slots"}</span></div>
  <p className="mt-1 text-xs text-gray-600">{row[0]}</p><div className="mt-2" style={{color:gradeColors[k]}}><Tex tex={basis[k]}/></div>
 </div>)}</div>;
}
export function DimensionQuestion({l}:{l:number}){
 const [revealed,setRevealed]=useState(false),[n,setN]=useState(4),[chosen,setChosen]=useState([1,2]);
 const counts=dimensionCounts(n),blade=chosen.length?`e_{${chosen.join("")}}`:"1";
 return <section className="space-y-3 rounded-lg border border-violet-200 bg-violet-50/40 p-4" data-interactive="dimension-question">
  <h3 className="font-semibold text-violet-950">{l?"換成 n 維，還是八個分量嗎？":"In n dimensions, are there still eight coefficients?"}</h3>
  <p>{l?"如果空間多一個獨立方向，原本那八格還夠用嗎？先想想：多出來的方向，能和舊方向張出哪些新平面？":"If space gains one independent direction, are the original eight slots enough? First ask: which new planes can the extra direction span with the old ones?"}</p>
  <button className={btn} aria-expanded={revealed} onClick={()=>setRevealed(r=>!r)}>{revealed?(l?"收起解釋":"Hide explanation"):(l?"看看 n 維怎麼數":"Explore the n-dimensional count")}</button>
  {revealed&&<div className="space-y-4" data-testid="dimension-answer">
   <p>{l?"每個基底方向，都可以「選」或「不選」。不選任何方向，留下純量；選一個，得到向量基底；選兩個，得到平面基底。一路選到 n 個，就得到最高的 n 階。":"Each basis direction can be included or left out. Choose none for the scalar, one for a vector basis element, two for a plane basis element, and so on up to grade n."}</p>
   <label className="flex items-center gap-3 text-sm"><span>{l?"空間維度":"Space dimension"}</span><select value={n} aria-label={l?"空間維度 n":"Space dimension n"} className="rounded-md border border-violet-200 bg-white px-3 py-2" onChange={e=>{const next=Number(e.target.value);setN(next);setChosen(old=>old.filter(i=>i<=next));}}>{[1,2,3,4,5,6].map(k=><option key={k} value={k}>{k}D</option>)}</select></label>
   <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{counts.map((count,k)=><div key={k} className="rounded-lg border border-violet-100 bg-white p-3 text-center"><p className="text-xs text-gray-500">{k} {l?"階":"grade"}</p><p className="mt-1 text-lg font-semibold text-violet-800">{count}</p><Tex tex={`\\binom{${n}}{${k}}`}/></div>)}</div>
   <div className="rounded-lg bg-white p-3 text-center" aria-live="polite"><p className="mb-2 text-xs text-gray-500">{l?"一個完整多重向量，最多需要的獨立分量數":"Number of independent coefficient slots in a full multivector"}</p><div className="flex flex-wrap justify-center gap-2"><Tex tex={`${counts.join("+")}=`}/><Tex tex={`2^{${n}}=${2**n}`}/></div></div>
   <p>{l?"想數第 k 階，就從 n 個方向中選 k 個；選法的數量就是下式。順序交換只改定向的正負，不多開一格；同一方向若在外積中重複出現，結果為零。":"For grade k, choose k of the n basis directions. Reordering changes orientation, not the number of slots; repeating a direction in a wedge product gives zero."}</p>
   <div className="flex flex-wrap justify-center gap-4"><Tex tex={"\\dim\\Lambda^k(V)=\\binom{n}{k}"}/><Tex tex={"\\sum_{k=0}^{n}\\binom{n}{k}=2^n"}/></div>
   <fieldset className="rounded-lg border border-violet-100 bg-white p-3"><legend className="px-1 text-xs text-violet-900">{l?"自己選一個基底項：要哪些方向？":"Build one basis element: which directions belong?"}</legend><div className="flex flex-wrap gap-3">{Array.from({length:n},(_,i)=>i+1).map(i=><label key={i} className="flex items-center gap-1 text-sm"><input className="accent-violet-600" type="checkbox" checked={chosen.includes(i)} onChange={()=>setChosen(old=>old.includes(i)?old.filter(v=>v!==i):[...old,i].sort((a,b)=>a-b))}/><Tex tex={`e_${i}`}/></label>)}</div><div className="mt-3 text-center" aria-live="polite"><Tex tex={blade}/><span className="ml-3 text-xs text-gray-600">{chosen.length} {l?"階":"grade"}</span></div></fieldset>
   <p className="text-xs text-gray-600">{l?"高維時，同一階的紀錄可以把幾個不同面元相加。例如四維的雙向量可以同時記住兩個獨立平面的面積，未必能畫成單獨一片平面。這裡數的是獨立的基底項。":"In higher dimensions, one grade can combine several different elements. For example, a 4D bivector can record areas in two independent planes and need not be a single plane. Here we count independent basis elements."}</p>
   <p className="text-xs text-gray-600">{l?"所以 3D 是 1＋3＋3＋1＝8；4D 是 1＋4＋6＋4＋1＝16。多重向量不只存在於三維，也不是每一份紀錄都要把所有格子填成非零；只是完整代數有這麼多獨立位置。":"Thus 3D has 1+3+3+1=8 slots; 4D has 1+4+6+4+1=16. Multivectors are not restricted to 3D. A particular record can leave many slots zero; this count describes the full algebra."}</p>
  </div>}
 </section>;
}
