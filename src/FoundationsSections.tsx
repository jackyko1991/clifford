import {useEffect,useId,useState,type ReactNode} from "react";
import Tex from "./components/Tex";
import CrossProductPatch from "./CrossProductPatch";
import ComplexPlaneBridge from "./components/ComplexPlaneBridge";
import Arrow from "./components/GeometryArrow";
import {GeometryRecordBuilder,DimensionQuestion,ThreeDRecordTable} from "./GeometryRecords";
import CodeBlock from "./components/CodeBlock";
import {HamiltonTool} from "./LearningSections";
import {bladeSlots,gradeColors,gradeTex,numberText,productTex,projectGrade,vectorProduct2D} from "./foundationsModel";
const btn="rounded-md border border-violet-200 bg-white px-3 py-1.5 text-xs text-violet-800 hover:bg-violet-50";
const teal="#0f766e",purple="#7c3aed";
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
 const angleHeadId=useId().replaceAll(":","")+"-angle-head";
 const [swapped,setSwapped]=useState(false),[step,setStep]=useState(2);const o=[110,140],a=[210,140],b=[160,140-50*Math.sqrt(3)],end=[260,140-50*Math.sqrt(3)],first=swapped?b:a;
 const heading=swapped?[.5,-Math.sqrt(3)/2]:[1,0],nextHeading=swapped?[1,0]:[.5,-Math.sqrt(3)/2];
 const turnStart=first.map((x,i)=>x+30*heading[i]),turnEnd=first.map((x,i)=>x+30*nextHeading[i]),forward=first.map((x,i)=>x+37*heading[i]);
 return <figure data-interactive="orientation-walk" className="space-y-3">
  <svg viewBox="75 15 240 155" className="mx-auto w-full max-w-md" role="img" aria-label={l?"同一平行四邊形，依序走兩條邊；交換次序反轉定向":"Walk two edges of the same parallelogram; swapping their order reverses orientation"}>
   <path d="M95 140H285M110 155V35" stroke="#cbd5e1" fill="none"/>
   <Arrow a={[277,140]} b={[285,140]} color="#94a3b8"/><Arrow a={[110,43]} b={[110,35]} color="#94a3b8"/>
   <text x="289" y="145" fontSize="12" fill="#64748b">+x</text><text x="110" y="27" textAnchor="middle" fontSize="12" fill="#64748b">+y</text>
   <path d={`M${o}L${a}L${end}L${b}Z`} fill={purple} fillOpacity={step===2?.2:.05} stroke="#c4b5fd"/>
   <path d={`M${o}L${b}`} stroke="#a78bfa" strokeDasharray="3 4" fill="none"/>
   <defs><marker id={angleHeadId} viewBox="0 -3 6 6" refX="6" refY="0" markerWidth="6" markerHeight="6" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 -3L6 0L0 3Z" fill={purple}/></marker></defs>
   {step===2&&<><path data-turn-forward="true" d={`M${first}L${forward}`} stroke={teal} strokeWidth="1.4" strokeDasharray="3 3" fill="none"/><path data-angle-direction={swapped?"clockwise":"anticlockwise"} data-turn-center={first.join(',')} d={`M${turnStart}A30 30 0 0 ${swapped?1:0} ${turnEnd}`} stroke={purple} strokeWidth="2" fill="none" markerEnd={`url(#${angleHeadId})`}/></>}

   {step>=1&&<Arrow a={o} b={first} color={teal}/>} {step>=2&&<Arrow a={first} b={end}/>}
   <text x={swapped?118:160} y={swapped?97:158} textAnchor="middle" fontSize="13" fill={teal}>{swapped?"b":"a"}</text><text x={swapped?210:250} y={swapped?41:100} textAnchor="middle" fontSize="13" fill={purple}>{swapped?"a":"b"}</text>
   <text x="190" y="110" textAnchor="middle" fontSize="22" fill={purple}>{step===2?(swapped?"−":"+"):"?"}</text>
  </svg>
  <figcaption className="space-y-1 text-center text-xs">
   {step===2&&<p style={{color:purple}} aria-live="polite"><Tex tex={`${swapped?"b\\to a":"a\\to b"}:\\quad ${swapped?"-":"+"}60^\\circ`}/></p>}
   <p className="text-gray-500">{l?"先走完綠色第一段，再從它的前進方向（綠色虛線）轉向紫色第二段。交換先後後，轉向角變負，座標軸與向量分量保持相同。":"Finish the green first segment, then turn from its forward direction (green dashes) toward the purple second segment. Swapping the order reverses the turn sign while axes and vector components stay the same."}</p>
  </figcaption>
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
 const [mode,setMode]=useState(0),[input,setInput]=useState(0);
 const choices=[[1,0],[0,1],[1,1]],v=choices[input],w=[2*v[0]+v[1],v[1]];
 return <div data-interactive="foundations-relations" className="space-y-4">
  <div className="flex flex-wrap gap-2">{(l?["複數：一個平面","四元數：三個平面","張量：記錄映射"]:["Complex: one plane","Quaternions: three planes","Tensors: record a map"]).map((t,k)=><button key={k} className={btn} aria-pressed={mode===k} onClick={()=>setMode(k)}>{t}</button>)}</div>
  {mode===0&&<ComplexPlaneBridge l={l}/>}
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
   <CrossProductPatch l={l}/>
  </Card>
  <Card id="grades" n={3} title={l?"從擺放收納箱，認識多重向量":"Arrange storage boxes, then discover multivectors"}>
   <p>{l?"想把幾個收納箱放進儲物櫃。你會先數有幾箱，再決定往哪裡排、底面占多大，最後看看能往上堆多高。同樣是在擺箱子，這四個問題需要記住的資訊卻不同。先動手擺一擺，再替這些紀錄取名字。":"Imagine fitting storage boxes into a cupboard. First count them, choose which way to line them up, check the floor area they cover, then see how high they can stack. One everyday task asks for four different kinds of information. Arrange the boxes first; name the records afterwards."}</p>
   <Example><GeometryRecordBuilder l={l}/></Example>
   <p>{l?"把箱子的細節先放旁邊，只留下數量、排列方向、底面與體積，就得到純量、向量、雙向量與三向量。多重向量把它們放在同一份紀錄中，各自保留種類與單位。「階數」分別是 0、1、2、3，數的是幾何維度，不是箱子有幾個，也不是張量的指標數。":"Set aside the box details and keep the count, row direction, footprint and volume: scalar, vector, bivector and trivector. A multivector holds these records together while preserving their kinds and units. Their grades are 0, 1, 2 and 3: geometric dimension, not the number of boxes or tensor indices."}</p>
   <h3 className="font-semibold">{l?"現在只看三維：每一種幾何，各需要幾格？":"Now restrict to 3D: how many slots does each kind need?"}</h3>
   <p>{l?"在三維，選定三個基底方向。箭頭可以沿其中任一個方向；面可以選任意一對方向。別把「一片面有兩個方向」和「三維裡有三種獨立平面基底」混在一起。":"Fix three basis directions. An arrow can use any one; a plane can use any pair. Distinguish ‘two directions span a plane’ from ‘three independent plane basis elements exist in 3D’."}</p>
   <ThreeDRecordTable l={l}/>
   <details className="rounded-lg border border-violet-100 bg-white p-3"><summary className="cursor-pointer font-medium text-violet-800">{l?"打開一份 3D 紀錄，試著改分量":"Open a 3D record and edit its coefficients"}</summary><div className="mt-4 space-y-3"><p>{l?"每個數字都放在一個基底位置前面。選「雙向量」，只讀出三個面積位置；其他資訊仍保留著。":"Each number belongs to a basis slot. Select ‘Bivector’ to read only the three plane slots; the other information stays stored."}</p><GradeMixer l={l}/><CodeBlock code={"# The eight slots below belong specifically to 3D\nM = {\"1\": 2, \"e1\": 1, \"e2\": -1, \"e3\": 0,\n     \"e12\": 0.5, \"e13\": 0, \"e23\": 0, \"e123\": 1}"} title="a_3d_record.py"/></div></details>
   <Tex tex={"1+3+3+1=2^3=8"} display/>
   <DimensionQuestion l={l}/>
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
