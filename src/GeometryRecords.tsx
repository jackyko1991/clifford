import {useState} from "react";
import Tex from "./components/Tex";
import Arrow from "./components/GeometryArrow";
import {dimensionCounts,gradeColors} from "./foundationsModel";
const btn="rounded-md border border-violet-200 bg-white px-3 py-1.5 text-xs text-violet-800 hover:bg-violet-50";
const binDimensions={width:50,depth:22.5,height:42.5};
function StorageBoxAssembly({x,y,columns=1,rows=1,layers=1,color}:{x:number;y:number;columns?:number;rows?:number;layers?:number;color:string}){
 const {width,depth,height}=binDimensions;
 const at=(col:number,row:number,layer:number)=>[x+col*width+row*depth,y-row*depth*.78-layer*height];
 const front=`M${at(0,0,0)}L${at(columns,0,0)}L${at(columns,0,layers)}L${at(0,0,layers)}Z`;
 const side=`M${at(columns,0,0)}L${at(columns,rows,0)}L${at(columns,rows,layers)}L${at(columns,0,layers)}Z`;
 const top=`M${at(0,0,layers)}L${at(columns,0,layers)}L${at(columns,rows,layers)}L${at(0,rows,layers)}Z`;
 const visible:string[]=[],hidden:string[]=[`M${at(0,0,0)}L${at(0,rows,0)}L${at(0,rows,layers)} M${at(0,rows,0)}L${at(columns,rows,0)}`];
 for(let col=1;col<columns;col++){
  visible.push(`M${at(col,0,0)}L${at(col,0,layers)}L${at(col,rows,layers)}`);
  hidden.push(`M${at(col,0,0)}L${at(col,rows,0)}L${at(col,rows,layers)}`);
 }
 for(let row=1;row<rows;row++){
  visible.push(`M${at(columns,row,0)}L${at(columns,row,layers)}L${at(0,row,layers)}`);
  hidden.push(`M${at(0,row,layers)}L${at(0,row,0)}L${at(columns,row,0)}`);
 }
 for(let layer=1;layer<layers;layer++){
  visible.push(`M${at(0,0,layer)}L${at(columns,0,layer)}L${at(columns,rows,layer)}`);
  hidden.push(`M${at(0,0,layer)}L${at(0,rows,layer)}L${at(columns,rows,layer)}`);
 }
 return <g data-storage-style="shared-open-box" data-bin-grid={`${columns},${rows},${layers}`} data-box-count={columns*rows*layers} data-cell-width={width} data-cell-depth={depth} data-cell-height={height} stroke={color} strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round">
  <path d={front} fill="white"/><path data-box-face="front" d={front} fill={color} fillOpacity=".14"/>
  <path d={side} fill="white"/><path data-box-face="side" d={side} fill={color} fillOpacity=".24"/>
  <path data-box-face="opening" d={top} fill="white"/>
  <path d={visible.join(' ')} fill="none"/>
  <path data-diagram={layers>1?"hidden-volume-edges":"hidden-box-edges"} d={hidden.join(' ')} fill="none" strokeDasharray="3 4" strokeOpacity=".45"/>
 </g>;
}
export function GeometryRecordBuilder({l}:{l:number}){
 const [stage,setStage]=useState(0);
 const titles=l?["有幾箱？","往哪裡排？","底面占多大？","往上堆多高？"]:["How many boxes?","Which way to line up?","How much floor area?","How high to stack?"];
 const explanations=l?[
  "先數一數：有兩個收納箱。但『兩箱』還沒告訴你箱子擺在哪裡、往哪裡排。只記大小或數量，不帶方向，這叫純量。",
  "把箱子往右排成一列。現在要記住的不只是有多長，還有這一列往哪裡延伸：這種有長度、有方向的紀錄，就是向量。圖中把整排長度取成一個單位。",
  "再往後排，箱子占出一片底面。雙向量記住兩個方向張出的面積、所在平面與定向；它不逐一記住每個箱子的位置，也不單獨保留底面的長寬。",
  "最後往上疊，箱子占據一塊立體空間。三向量記住這塊空間的大小與定向，也就是定向體積；每個箱子放在哪一格，則是另一份擺放紀錄。"
 ]:[
  "First count two storage boxes. ‘Two boxes’ does not tell you where they sit or which way they line up. A size or count without a direction is a scalar.",
  "Line the boxes up to the right. Record both the row’s length and the direction it extends: that is a vector. Here the whole row is one unit long.",
  "Add a row behind it and the boxes cover a footprint. A bivector records the spanned area, its plane and orientation; it does not store each box’s position or the footprint’s separate side lengths.",
  "Stack upward and the boxes occupy a volume. A trivector records its magnitude and orientation. The position of each individual box belongs to a separate arrangement record."
 ];
 const formulas=["s=2","v=e_1","A=e_1\\wedge e_2=e_{12}","V=e_1\\wedge e_2\\wedge e_3=e_{123}"];
 const corner=(col:number,row:number,layer:number)=>[70+col*binDimensions.width+row*binDimensions.depth,150-row*binDimensions.depth*.78-layer*binDimensions.height];
 const o=corner(0,0,0),x=corner(2,0,0),y=corner(0,2,0),z=corner(0,0,2);
 return <figure data-interactive="geometry-record-builder" className="space-y-3">
  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{titles.map((title,k)=><button key={k} className={btn} aria-pressed={stage===k} onClick={()=>setStage(k)} style={{color:gradeColors[k],background:stage===k?"#f5f3ff":"white"}}>{title}</button>)}</div>
  <svg viewBox="0 0 290 190" className="mx-auto max-h-52 w-full max-w-sm" role="img" aria-label={titles[stage]}>
   {stage===0?<>
    {[55,162.5].map(x=><StorageBoxAssembly key={x} x={x} y={150} color={gradeColors[0]}/>)}
    <text x="145" y="65" textAnchor="middle" fontSize="14" fill={gradeColors[0]}>{l?"兩個收納箱":"Two storage boxes"}</text>
   </>:<>
    <StorageBoxAssembly x={o[0]} y={o[1]} columns={2} rows={stage>=2?2:1} layers={stage===3?2:1} color={gradeColors[stage]}/>
    <Arrow a={o} b={x} color={gradeColors[1]}/><text x="182" y="164" fontSize="13" fill={gradeColors[1]}>e₁</text>
    {stage>=2&&<><Arrow a={o} b={y} color={gradeColors[1]}/><text x="124" y="111" fontSize="13" stroke="white" strokeWidth="3" paintOrder="stroke" fill={gradeColors[1]}>e₂</text></>}
    {stage===3&&<><Arrow a={o} b={z} color={gradeColors[1]}/><text x="54" y="56" fontSize="13" fill={gradeColors[1]}>e₃</text></>}
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
 const [revealed,setRevealed]=useState(false),[general,setGeneral]=useState(false),[n,setN]=useState(4),[chosen,setChosen]=useState([1,2]);
 const counts=dimensionCounts(n),blade=chosen.length?`e_{${chosen.join("")}}`:"1";
 return <section className="space-y-3 rounded-lg border border-violet-200 bg-violet-50/40 p-4" data-interactive="dimension-question">
  <h3 className="font-semibold text-violet-950">{l?"那 2D、4D 與 nD 呢？還是八個分量嗎？":"What about 2D, 4D and nD? Still eight coefficients?"}</h3>
  <p>{l?"剛才的八格來自三維。如果只有兩個方向，哪些格子會消失？增加到四個方向，又會多出哪些平面和體？先選 2D 或 4D 比較，再看看任意 n 維的規則。":"The eight slots came from 3D. With only two directions, which slots disappear? With four directions, which new planes and volumes appear? Compare 2D and 4D, then explore the rule for arbitrary n."}</p>
  <div className="flex flex-wrap gap-2">{[2,4].map(d=><button key={d} className={`${btn} aria-pressed:bg-violet-100 aria-pressed:ring-1 aria-pressed:ring-violet-400`} aria-pressed={revealed&&!general&&n===d} onClick={()=>{setGeneral(false);setN(d);setChosen(old=>old.filter(i=>i<=d));setRevealed(true);}}>{l?`看看 ${d}D`:`Explore ${d}D`}</button>)}<button className={`${btn} aria-pressed:bg-violet-100 aria-pressed:ring-1 aria-pressed:ring-violet-400`} aria-expanded={revealed&&general} aria-pressed={general} onClick={()=>{setGeneral(true);setRevealed(true);}}>{l?"一般 nD 的規則":"The general nD rule"}</button></div>
  {revealed&&<div className="space-y-4" data-testid="dimension-answer">
   {general&&<div className="space-y-2 rounded-lg border border-violet-200 bg-white p-3" data-testid="general-dimension-rule">
    <h4 className="font-semibold text-violet-900">{l?"一般 n 維：每個方向，選或不選":"Any n dimensions: include each direction or leave it out"}</h4>
    <div className="flex flex-wrap justify-center gap-4"><Tex tex={"\\dim\\Lambda^k(V)=\\binom{n}{k}"}/><Tex tex={"\\sum_{k=0}^{n}\\binom{n}{k}=2^n"}/></div>
    <p className="text-xs text-gray-600">{l?"n 是空間維度，k 是選取的方向數；下方可換不同維度，檢查這條通用規則。":"n is the space dimension and k counts chosen directions. Change the dimension below to check the general rule."}</p>
   </div>}
   <p>{l?"每個基底方向，都可以「選」或「不選」。不選任何方向，留下純量；選一個，得到向量基底；選兩個，得到平面基底。一路選到 n 個，就得到最高的 n 階。":"Each basis direction can be included or left out. Choose none for the scalar, one for a vector basis element, two for a plane basis element, and so on up to grade n."}</p>
   <label className="flex items-center gap-3 text-sm"><span>{l?"空間維度":"Space dimension"}</span><select value={n} aria-label={l?"空間維度 n":"Space dimension n"} className="rounded-md border border-violet-200 bg-white px-3 py-2" onChange={e=>{const next=Number(e.target.value);setN(next);setChosen(old=>old.filter(i=>i<=next));}}>{[1,2,3,4,5,6].map(k=><option key={k} value={k}>{k}D</option>)}</select></label>
   <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{counts.map((count,k)=><div key={k} className="rounded-lg border border-violet-100 bg-white p-3 text-center"><p className="text-xs text-gray-500">{k} {l?"階":"grade"}</p><p className="mt-1 text-lg font-semibold text-violet-800">{count}</p><Tex tex={`\\binom{${n}}{${k}}`}/></div>)}</div>
   <div className="rounded-lg bg-white p-3 text-center" aria-live="polite"><p className="mb-2 text-xs text-gray-500">{l?"一個完整多重向量，最多需要的獨立分量數":"Number of independent coefficient slots in a full multivector"}</p><div className="flex flex-wrap justify-center gap-2"><Tex tex={`${counts.join("+")}=`}/><Tex tex={`2^{${n}}=${2**n}`}/></div></div>
   <p>{l?"想數第 k 階，就從 n 個方向中選 k 個；選法的數量就是下式。順序交換只改定向的正負，不多開一格；同一方向若在外積中重複出現，結果為零。":"For grade k, choose k of the n basis directions. Reordering changes orientation, not the number of slots; repeating a direction in a wedge product gives zero."}</p>
   <fieldset className="rounded-lg border border-violet-100 bg-white p-3"><legend className="px-1 text-xs text-violet-900">{l?"自己選一個基底項：要哪些方向？":"Build one basis element: which directions belong?"}</legend><div className="flex flex-wrap gap-3">{Array.from({length:n},(_,i)=>i+1).map(i=><label key={i} className="flex items-center gap-1 text-sm"><input className="accent-violet-600" type="checkbox" checked={chosen.includes(i)} onChange={()=>setChosen(old=>old.includes(i)?old.filter(v=>v!==i):[...old,i].sort((a,b)=>a-b))}/><Tex tex={`e_${i}`}/></label>)}</div><div className="mt-3 text-center" aria-live="polite"><Tex tex={blade}/><span className="ml-3 text-xs text-gray-600">{chosen.length} {l?"階":"grade"}</span></div></fieldset>
   <p className="text-xs text-gray-600">{l?"高維時，同一階的紀錄可以把幾個不同面元相加。例如四維的雙向量可以同時記住兩個獨立平面的面積，未必能畫成單獨一片平面。這裡數的是獨立的基底項。":"In higher dimensions, one grade can combine several different elements. For example, a 4D bivector can record areas in two independent planes and need not be a single plane. Here we count independent basis elements."}</p>
   <p className="text-xs text-gray-600">{l?"所以 2D 是 1＋2＋1＝4；3D 是 1＋3＋3＋1＝8；4D 是 1＋4＋6＋4＋1＝16。多重向量不只存在於三維，也不是每一份紀錄都要把所有格子填成非零；只是完整代數有這麼多獨立位置。":"Thus 2D has 1+2+1=4 slots; 3D has 1+3+3+1=8; 4D has 1+4+6+4+1=16. Multivectors are not restricted to 3D. A particular record can leave many slots zero; this count describes the full algebra."}</p>
  </div>}
 </section>;
}
