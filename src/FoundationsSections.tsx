import {useEffect,useState,type ReactNode} from "react";
import Tex from "./components/Tex";
import CodeBlock from "./components/CodeBlock";
import {HamiltonTool} from "./LearningSections";
import {bladeSlots,gradeColors,gradeTex,numberText,productTex,projectGrade,vectorProduct2D} from "./foundationsModel";
const btn="rounded-md border border-violet-200 bg-white px-3 py-1.5 text-xs text-violet-800 hover:bg-violet-50";
const teal="#0f766e",purple="#7c3aed";
function Arrow({a,b,color=purple}:{a:number[];b:number[];color?:string}){
 const dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy);
 if(len<.5)return <circle cx={a[0]} cy={a[1]} r="2" fill={color}/>;
 const h=Math.min(9,len*.4),ux=dx/len,uy=dy/len,x=b[0]-ux*h,y=b[1]-uy*h;
 return <g fill={color}><path d={`M${a}L${x} ${y}`} stroke={color} strokeWidth="3" fill="none"/><polygon points={`${b} ${x-uy*h/2},${y+ux*h/2} ${x+uy*h/2},${y-ux*h/2}`}/></g>;
}
function Card({id,n,title,children}:{id:string;n:number;title:string;children:ReactNode}){
 return <section id={id} data-foundation-section={id} data-lesson={id} className="scroll-mt-20 rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
  <h2 className="flex items-baseline gap-3 text-lg font-semibold"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-600 text-sm text-white">{n}</span>{title}</h2>
  <div className="mt-4 space-y-4 text-sm leading-relaxed text-gray-700">{children}</div>
 </section>;
}
function Example({children}:{children:ReactNode}){return <div className="rounded-lg border-l-4 border-emerald-300 bg-emerald-50/60 p-3 sm:p-4">{children}</div>;}
function Sources({l}:{l:number}){return <details className="border-t border-gray-100 pt-3 text-xs"><summary className="cursor-pointer text-violet-800">{l?"來源與延伸閱讀":"Sources and further reading"}</summary><div className="mt-3 space-y-2"><p><a className="text-violet-700 underline" href="https://davidhestenes.net/geocalc/GA_Primer/GA_Primer/introduction-to-geometric/defining-and-interpreting.html" target="_blank" rel="noreferrer">David Hestenes · Defining and Interpreting the Geometric Product ↗</a></p><p><a className="text-violet-700 underline" href="https://lambda.gsfc.nasa.gov/product/websites/AMI/mrao.cam.ac.uk/~clifford/introduction/intro/node6.html" target="_blank" rel="noreferrer">Doran, Lasenby &amp; Gull · Geometric Algebra of the Plane ↗</a></p></div></details>;}
function ProductExplorer({l}:{l:number}){
 const [angle,setAngle]=useState(60),[a,setA]=useState(1),[b,setB]=useState(1),[swapped,setSwapped]=useState(false),[playing,setPlaying]=useState(false);
 useEffect(()=>{if(!playing)return;const id=setInterval(()=>setAngle(t=>t>=180?-180:t+2),60);return()=>clearInterval(id);},[playing]);
 const t=angle*Math.PI/180,av=[a,0],bv=[b*Math.cos(t),b*Math.sin(t)],parts=vectorProduct2D(swapped?bv:av,swapped?av:bv);
 const origin=[145,140],ap=[145+50*a,140],bp=[145+50*bv[0],140-50*bv[1]],end=[ap[0]+50*bv[0],bp[1]];
 return <figure data-interactive="foundation-product" className="space-y-3">
  <svg viewBox="0 15 440 260" className="mx-auto max-h-[220px] w-full max-w-md" role="img" aria-label={l?"調整兩支箭頭的長度與夾角，讀出同向程度、定向面積和完整幾何積":"Change lengths and angle to inspect alignment, oriented area and the full geometric product"}>
   <path d={`M${origin}L${ap}L${end}L${bp}Z`} fill={purple} fillOpacity=".17" stroke={purple} strokeOpacity=".35"/>
   <path d={`M${bp}V140`} stroke={teal} strokeDasharray="4 4"/>
   <path d={`M145 148h${50*bv[0]}`} stroke={teal} strokeWidth="4" strokeLinecap="round"/>
   <Arrow a={origin} b={ap} color={teal}/><Arrow a={origin} b={bp}/>
   <text x={ap[0]+10} y="159" fontSize="13" fill={teal}>a</text><text x={bp[0]} y={bp[1]+(bp[1]<140?-12:20)} textAnchor="middle" fontSize="13" fill={purple}>b</text>
  </svg>
  <figcaption className="text-center text-xs text-gray-600">{l?"虛線讀出 b 沿 a 方向的投影，再乘 a 的長度，就得到同向程度。":"The dashed line reads b along a’s direction; multiply by a’s length to get the dot product."}</figcaption>
  <div className="grid grid-cols-2 gap-2 text-center text-xs"><div className="rounded-lg border border-teal-100 bg-white p-2" style={{color:teal}}><p>{l?"同向程度":"Alignment"}</p><Tex tex={`a\\cdot b=${numberText(parts.scalar)}`}/></div><div className="rounded-lg border border-violet-100 bg-white p-2" style={{color:purple}}><p>{l?"定向面積":"Oriented area"}</p><Tex tex={`${swapped?"b\\wedge a":"a\\wedge b"}=${numberText(parts.area)}e_{12}`}/></div></div>
  <div className="rounded-lg border border-violet-100 bg-white p-3 text-center" aria-live="polite"><p className="mb-1 text-xs text-gray-500">{l?"完整幾何積":"Complete geometric product"}</p><Tex tex={`${swapped?"ba":"ab"}=${productTex(parts.scalar,parts.area)}`}/></div>
  <div className="grid gap-3 text-xs sm:grid-cols-2">{[[l?"a 的長度":"Length of a",a,setA],[l?"b 的長度":"Length of b",b,setB]].map(([title,value,set],i)=><label key={i} className="flex items-center gap-2"><span className="shrink-0">{String(title)}: {numberText(Number(value))}</span><input className="min-w-0 flex-1 accent-violet-600" type="range" aria-label={String(title)} min="0" max="2" step=".1" value={Number(value)} onChange={e=>{setPlaying(false);(set as typeof setA)(Number(e.target.value));}}/></label>)}</div>
  <label className="flex items-center gap-3 text-xs"><span className="w-20 shrink-0">{l?"夾角":"Angle"}: {angle}°</span><input className="min-w-0 flex-1 accent-violet-600" aria-label={l?"兩箭頭的夾角":"Angle between arrows"} type="range" min="-180" max="180" value={angle} onChange={e=>{setPlaying(false);setAngle(Number(e.target.value));}}/></label>
  <div className="flex flex-wrap gap-2"><button className={btn} aria-pressed={playing} onClick={()=>setPlaying(p=>!p)}>{playing?(l?"暫停":"Pause"):(l?"▶ 播放":"▶ Play")}</button>{[0,90,180].map(v=><button className={btn} key={v} onClick={()=>{setPlaying(false);setAngle(v);}}>{v}°</button>)}<button className={btn} aria-pressed={swapped} onClick={()=>setSwapped(s=>!s)}>{l?"交換乘法順序":"Swap product order"}</button></div>
 </figure>;
}
function OrientationWalk({l}:{l:number}){
 const [swapped,setSwapped]=useState(false),[step,setStep]=useState(2);const o=[110,140],a=[210,140],b=[160,140-50*Math.sqrt(3)],end=[260,140-50*Math.sqrt(3)],first=swapped?b:a;
 return <figure data-interactive="orientation-walk" className="space-y-3">
  <svg viewBox="0 0 380 190" className="mx-auto w-full max-w-md" role="img" aria-label={l?"同一平行四邊形，依序走兩條邊；交換次序反轉定向":"Walk two edges of the same parallelogram; swapping their order reverses orientation"}>
   <path d={`M${o}L${a}L${end}L${b}Z`} fill={purple} fillOpacity={step===2?.2:.05} stroke="#c4b5fd"/>
   {step>=1&&<Arrow a={o} b={first} color={teal}/>} {step>=2&&<Arrow a={first} b={end}/>}
   <text x="215" y="160" fontSize="13" fill={teal}>a</text><text x="140" y="50" fontSize="13" fill={purple}>b</text>
   <text x="190" y="110" textAnchor="middle" fontSize="22" fill={purple}>{step===2?(swapped?"−":"+"):"?"}</text>
   <text x="190" y="183" textAnchor="middle" fontSize="12" fill="#64748b">{l?"同一塊面積，同一個終點，不同的定向。":"Same patch and endpoint; opposite orientation."}</text>
  </svg>
  <div className="text-center" aria-live="polite"><Tex tex={`${swapped?"b\\wedge a":"a\\wedge b"}=\\textcolor{#7c3aed}{${swapped?"-":""}\\frac{\\sqrt{3}}{2}e_{12}}`}/></div>
  <div className="flex flex-wrap justify-center gap-2"><button className={btn} onClick={()=>setStep(0)}>{l?"回到起點":"Start again"}</button><button className={btn} disabled={step===2} onClick={()=>setStep(s=>Math.min(2,s+1))}>{l?"走下一條邊":"Walk next edge"}</button><button className={btn} aria-pressed={swapped} onClick={()=>{setSwapped(s=>!s);setStep(2);}}>{l?"交換先後次序":"Reverse the order"}</button></div>
 </figure>;
}
function GradeMixer({l}:{l:number}){
 const [m,setM]=useState([2,1,-1,.5,0,0,0,1]),[selected,setSelected]=useState<number|null>(null);
 const names=l?["純量","向量","雙向量","三向量"]:["Scalar","Vector","Bivector","Trivector"];
 return <div data-interactive="grade-mixer" className="space-y-3">
  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" data-diagram="grades">{names.map((name,k)=><div key={k} className="rounded-lg border bg-white p-2 text-center transition-opacity" style={{borderColor:gradeColors[k]+"55",opacity:selected===null||selected===k?1:.3}}>
   <p className="text-xs font-medium" style={{color:gradeColors[k]}}>{name}</p>
   <svg viewBox="0 0 100 100" className="mx-auto h-20 w-full max-w-24" role="img" aria-label={name}><g transform="translate(50 50)">
    {k===0?<circle r="7" fill={gradeColors[k]}/>:k===1?<Arrow a={[-18.5,25]} b={[18.5,-25]} color={gradeColors[k]}/>:k===2?<path d="M-28.5 15L-11.5-35L28.5-15L11.5 35Z" fill={gradeColors[k]} fillOpacity=".35" stroke={gradeColors[k]}/>:<path d="M-34-23l35-18l33 20v45l-35 17l-33-19Z M-34-23l33 18l35-16 M-1-5v46" fill="#fef3c7" stroke={gradeColors[k]}/>}
   </g></svg><p className="text-xs text-gray-600">{[1,3,3,1][k]} {l?"分量":"slots"}</p>
  </div>)}</div>
  <div className="flex flex-wrap gap-2"><button className={btn} aria-pressed={selected===null} onClick={()=>setSelected(null)}>{l?"完整紀錄":"Whole record"}</button>{names.map((name,k)=><button key={k} className={btn} aria-pressed={selected===k} style={{color:gradeColors[k],background:selected===k?"#f5f3ff":"white"}} onClick={()=>setSelected(k)}>{k} · {name}</button>)}</div>
  <div className="grid gap-3 sm:grid-cols-2">{names.map((name,k)=><div key={k} className="min-w-0 rounded-lg border bg-white p-3 transition-opacity" style={{borderColor:gradeColors[k]+"55",opacity:selected===null||selected===k?1:.4}}>
   <p className="mb-2 text-xs font-semibold" style={{color:gradeColors[k]}}>{name} · {l?"階數":"grade"} {k}</p>
   <div className="flex flex-wrap gap-3">{bladeSlots.filter(s=>s.grade===k).map(slot=><label key={slot.mask} className="flex items-center gap-2 text-xs"><Tex tex={slot.tex}/><input type="number" min="-9" max="9" step=".5" value={m[slot.mask]} aria-label={`${names[k]} ${slot.tex}`} className="w-14 rounded border border-gray-200 bg-white px-1 py-1 text-center" onChange={e=>{const value=e.target.valueAsNumber;setM(old=>old.map((v,mask)=>mask===slot.mask?(Number.isFinite(value)?Math.max(-9,Math.min(9,value)):0):v));}}/></label>)}</div>
   <div className="mt-3 overflow-x-auto text-sm" style={{color:gradeColors[k]}}><Tex tex={gradeTex(m,k)}/></div>
  </div>)}</div>
  <div className="rounded-lg border border-violet-100 bg-violet-50/50 p-3 text-center" aria-live="polite">{selected===null?<div className="flex flex-wrap justify-center gap-x-2 gap-y-1"><Tex tex={"M="}/>{names.map((_,k)=><span key={k} style={{color:gradeColors[k]}}>{k>0&&<span className="mr-2 text-gray-500">+</span>}<Tex tex={`\\langle M\\rangle_${k}`}/></span>)}</div>:<Tex tex={`\\langle M\\rangle_${selected}=\\textcolor{${gradeColors[selected]}}{${gradeTex(projectGrade(m,selected),selected)}}`}/>}</div>
  <button className={btn} onClick={()=>{setM([2,1,-1,.5,0,0,0,1]);setSelected(null);}}>{l?"重設八個分量":"Reset eight components"}</button>
 </div>;
}
function RelationsExplorer({l}:{l:number}){
 const [mode,setMode]=useState(0),[plane,setPlane]=useState("12"),[input,setInput]=useState(0);
 const choices=[[1,0],[0,1],[1,1]],v=choices[input],w=[2*v[0]+v[1],v[1]];
 return <div data-interactive="foundations-relations" className="space-y-4">
  <div className="flex flex-wrap gap-2">{(l?["複數：一個平面","四元數：三個平面","張量：記錄映射"]:["Complex: one plane","Quaternions: three planes","Tensors: record a map"]).map((t,k)=><button key={k} className={btn} aria-pressed={mode===k} onClick={()=>setMode(k)}>{t}</button>)}</div>
  {mode===0&&<div className="space-y-3"><p>{l?"挑一個單位平面 B，純量加上這個平面，就能照複數的規則相乘。i 的幾何角色是定向平面，不是另外加進來的一根空間軸。":"Choose a unit plane B. Scalars plus multiples of this plane multiply like complex numbers. The geometric role of i is an oriented plane, not an extra spatial axis."}</p>
   <div className="flex flex-wrap items-center justify-center gap-3">{["12","13","23"].map(p=><button className={btn} key={p} aria-pressed={plane===p} onClick={()=>setPlane(p)}><Tex tex={`B=e_{${p}}`}/></button>)}</div>
   <svg viewBox="0 0 360 120" className="mx-auto w-full max-w-sm" role="img" aria-label={l?"選擇的定向平面與純量組成複數平面":"A scalar and the selected oriented plane form a complex subalgebra"}><path d="M125 86L155 25L230 25L200 86Z" fill={purple} fillOpacity=".22" stroke={purple}/><text x="178" y="65" textAnchor="middle" fill={purple} fontSize="16">B = e{plane}</text></svg>
   <div className="text-center" aria-live="polite"><Tex tex={`B^2=e_{${plane}}^2=-1`}/></div>
   <p className="text-xs text-gray-600">{l?"選哪一個歐氏單位平面，平方都是 −1；這是不同的嵌入選擇，不表示三個平面是同一個幾何物件。":"Each Euclidean unit plane squares to −1. These are different embeddings, not the same geometric plane."}</p>
  </div>}
  {mode===1&&<div className="space-y-3"><p>{l?"三維空間有三個獨立的雙向量方向。加上純量，這四個位置對乘法封閉，能重現四元數。沿用橋上那一節的符號約定：":"Three-dimensional space has three independent bivector directions. With the scalar, these four slots are closed under multiplication and reproduce quaternions. Using the convention from the bridge lesson:"}</p>
   <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">{["i=-e_{23}","j=e_{13}","k=-e_{12}"].map(tex=><Tex key={tex} tex={tex}/>)}</div><HamiltonTool l={l}/>
   <p className="text-xs text-gray-600">{l?"這裡對應的是三維幾何代數的偶子代數：0 階加 2 階，共 4 個分量；不是全部 8 個分量。":"This is the even subalgebra in three dimensions: grade 0 plus grade 2, four coefficients. It is not the full eight-component algebra."}</p>
  </div>}
  {mode===2&&<div className="space-y-3"><p>{l?"一個線性映射可以記錄「讀入一支箭頭，送出另一支箭頭」的規則。下面這個例子把第一個方向放大兩倍，並把第二個方向送到對角線。選一支輸入，看看輸出。":"A linear map records how an input arrow becomes an output arrow. This example doubles the first basis direction and sends the second onto the diagonal. Choose an input and inspect the output."}</p>
   <div className="flex flex-wrap justify-center gap-2">{choices.map((v,k)=><button key={k} className={btn} aria-pressed={input===k} onClick={()=>setInput(k)}><Tex tex={`v=(${v})`}/></button>)}</div>
   <svg viewBox="0 0 360 155" className="mx-auto w-full max-w-sm" role="img" aria-label={l?"線性映射的輸入和輸出箭頭":"Input and output arrows of a linear map"}><path d="M30 125H330M70 140V15" stroke="#e2e8f0"/><Arrow a={[70,125]} b={[70+50*v[0],125-50*v[1]]} color="#94a3b8"/><Arrow a={[70,125]} b={[70+50*w[0],125-50*w[1]]} color={teal}/><text x="270" y="40" textAnchor="middle" fontSize="13" fill={teal}>A(v) = ({w.join(", ")})</text></svg>
   <div className="flex flex-wrap justify-center gap-4"><Tex tex={"A=\\begin{pmatrix}2&1\\\\0&1\\end{pmatrix}"}/><Tex tex={`A(${v})=(${w})`}/></div>
   <p>{l?"幾何積把兩個向量相乘，這個張量則定義一個線性映射，兩者的工作不同。幾何代數能表示許多映射與旋轉，但不會讓張量積、多重線性映射或它們的變換法則消失。":"The geometric product multiplies vectors; this tensor specifies a linear map. Geometric algebra can represent many maps and rotations, while tensor products, multilinear maps and their transformation laws remain useful."}</p>
  </div>}
 </div>;
}
export default function FoundationsSections({l}:{l:number}){
 return <>
  <Card id="product" n={1} title={l?"兩支箭頭相乘，究竟留下什麼？":"What survives when two arrows multiply?"}>
   <p>{l?"在入門頁，我們只轉動兩支長度為 1 的箭頭。現在把長度也放開：兩支箭頭愈長，平行的部分與圍成的面積都會一起放大。幾何積一次保存這兩份資訊。":"The opening page turned two unit arrows. Now let their lengths change too. Longer arrows scale both the aligned part and the area they span. The geometric product keeps both records."}</p>
   <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 rounded-lg bg-violet-50 p-3"><Tex tex={"ab="}/><Tex tex={l?"\\textcolor{#0f766e}{\\underbrace{a\\cdot b}_{\\text{同向程度}}}":"\\textcolor{#0f766e}{\\underbrace{a\\cdot b}_{\\text{alignment}}}"}/><Tex tex={"+"}/><Tex tex={l?"\\textcolor{#7c3aed}{\\underbrace{a\\wedge b}_{\\text{定向面積}}}":"\\textcolor{#7c3aed}{\\underbrace{a\\wedge b}_{\\text{oriented area}}}"}/></div>
   <Example><p className="mb-3">{l?"先猜：把 a 的長度加倍，完整乘積會怎樣？再把兩支箭頭轉成垂直，哪一部分會消失？":"Predict: if a doubles in length, what happens to the product? Then make the arrows perpendicular: which part vanishes?"}</p><ProductExplorer l={l}/></Example>
   <p>{l?"角度負責分配，長度負責縮放。以下的 B 是這個平面的定向單位面積，θ 是從 a 朝 b 量到的有向角。":"The angle divides the two parts; the lengths scale them. Here B is the oriented unit plane, and θ is the directed angle from a to b."}</p>
   <div className="flex flex-wrap justify-center gap-x-4 gap-y-2"><Tex tex={"a\\cdot b=|a||b|\\cos\\theta"}/><Tex tex={"a\\wedge b=|a||b|\\sin\\theta\\,B"}/></div>
   <CodeBlock code={"# Two arrows in the e1-e2 plane\nscalar = ax * bx + ay * by\narea   = ax * by - ay * bx\n# Their geometric product is scalar + area * e12"} title="geometric_product_2d.py"/>
   <Sources l={l}/>
  </Card>
  <Card id="orientation" n={2} title={l?"面積一樣，為什麼還要記住先後？":"Same area: why remember the order?"}>
   <p>{l?"想像沿著一塊地的兩條邊走到對角：先向右再向上，或先向上再向右。終點相同，圍出的地也相同；但繞著這塊地的轉向相反。正負號記的是這個定向，不是「負的土地」。":"Walk to the opposite corner of a patch: right then up, or up then right. Same destination, same patch, opposite orientation. The sign records that orientation, not ‘negative land’."}</p>
   <Example><OrientationWalk l={l}/></Example>
   <p>{l?"交換次序，同向程度不變，面積項變號。所以把兩種次序相加，面積消掉；相減，同向的部分消掉。這能從完整乘積取回熟悉的兩個工具。":"Swapping order preserves alignment and reverses the area term. Add the two products and area cancels; subtract them and alignment cancels. This recovers the two familiar operations from the full product."}</p>
   <div className="grid gap-3 text-center sm:grid-cols-2"><div className="rounded-lg border border-teal-100 bg-teal-50/40 p-3"><Tex tex={"\\textcolor{#0f766e}{a\\cdot b=\\frac{ab+ba}{2}}"}/></div><div className="rounded-lg border border-violet-100 bg-violet-50/40 p-3"><Tex tex={"\\textcolor{#7c3aed}{a\\wedge b=\\frac{ab-ba}{2}}"}/></div></div>
   <p>{l?"若兩支箭頭平行，就圍不出面積；特別是向量乘自己時，只剩下長度平方。這也把幾何積接回最初的公設。":"Parallel arrows enclose no area. In particular, a vector multiplied by itself leaves only its squared length, returning us to the starting rule."}</p><Tex tex={"a\\wedge a=0,\\quad a^2=a\\cdot a=|a|^2"} display/>
  </Card>
  <Card id="grades" n={3} title={l?"一份紀錄，裝下點數、箭頭、面與體":"One record for numbers, arrows, planes and volumes"}>
   <p>{l?"裝箱清單可以同時記住件數、邊長、紙板面積和箱子體積，卻不會把平方公尺變成公尺。多重向量也保留不同種類的幾何資訊，各放在自己的位置。這裡的「階數」是幾何元素的維度，與張量的指標數不同。":"A packing list can keep counts, edge lengths, sheet areas and box volumes without turning square metres into metres. A multivector likewise keeps different geometric kinds in their own slots. Here grade counts geometric dimension; it is different from tensor rank."}</p>
   <Example><p className="mb-3">{l?"改一個分量，再選「雙向量」。看看哪些位置留下、哪些被隱去；回到「完整紀錄」，其他資訊還在。":"Edit a coefficient, then select ‘Bivector’. Which slots remain? Return to ‘Whole record’: the other information is still there."}</p><GradeMixer l={l}/></Example>
   <p>{l?"三個獨立方向有三種箭頭、三種平面，卻只有一種三維體積方向。再加上一個純量位置，共八個分量。選某一階，是取出那一類資訊，不是把它旋轉或改造成另一種。":"Three independent directions give three vector slots, three plane slots, one volume slot and one scalar slot: eight coefficients. Selecting a grade extracts one kind of information; it does not rotate it into another kind."}</p>
   <Tex tex={"1+3+3+1=2^3=8"} display/>
   <CodeBlock code={"# An explicit layout for a 3D multivector\nM = {\"1\": 2, \"e1\": 1, \"e2\": -1, \"e3\": 0,\n     \"e12\": 0.5, \"e13\": 0, \"e23\": 0, \"e123\": 1}\nbivector = {key: M[key] for key in (\"e12\", \"e13\", \"e23\")}"} title="multivector_slots.py"/>
  </Card>
  <Card id="relations" n={4} title={l?"複數、四元數、張量，各自在記什麼？":"What do complex numbers, quaternions and tensors record?"}>
   <p>{l?"現在回頭看 i 與橋上的公式：它們不必孤立地背誦。選一種紀錄方式，檢查它保留哪些位置、怎樣相乘，以及它要解決什麼問題。":"Return to i and the bridge formula: they no longer need to be memorized in isolation. Choose a record and inspect which slots it keeps, how it multiplies and what problem it addresses."}</p>
   <Example><RelationsExplorer l={l}/></Example>
   <p>{l?"帶走三個判斷：一個平面加純量可以像複數；三個平面加純量可以像四元數；而張量的多重線性規則仍能描述幾何與物理。下一步先整理工具，再用它們構造旋轉。":"Keep three distinctions: scalar plus one plane behaves like complex numbers; scalar plus three planes behaves like quaternions; multilinear tensor rules still describe geometry and physics. Next organize the tools, then construct rotations."}</p>
   <div className="flex flex-wrap gap-3"><a className={btn} href="#/concept/algebra">{l?"下一站：代數工具箱":"Next: algebra toolbox"} →</a><a className={btn} href="#/concept/rotations">{l?"接著：轉子與旋量":"Then: rotors and spinors"} →</a></div>
   <Sources l={l}/>
  </Card>
 </>;
}
