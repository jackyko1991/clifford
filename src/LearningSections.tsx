import {useEffect,useId,useState,type ReactNode} from "react";
import Tex from "./components/Tex";
import GeometryFigure from "./components/GeometryFigure";
import CodeBlock from "./components/CodeBlock";
import {geometricProductTex,quarterTurn,quaternionProduct,quaternionUnits,type QuaternionUnit} from "./learningModel";
const button="rounded-md border border-violet-200 bg-white px-3 py-1.5 text-sm text-violet-800 hover:bg-violet-50 disabled:opacity-40";
function Card({id,n,title,children}:{id:string;n:number;title:string;children:ReactNode}){
 return <section id={id} data-learning-section={id} data-lesson={id} className="scroll-mt-20 rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
  <h2 className="flex items-baseline gap-3 text-lg font-semibold"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-600 text-sm text-white">{n}</span>{title}</h2>
  <div className="mt-4 space-y-4 text-sm leading-relaxed text-gray-700">{children}</div>
 </section>;
}
function QuarterTurns({l}:{l:number}){
 const [turns,setTurns]=useState(0),[playing,setPlaying]=useState(false);
 const id=useId().replaceAll(":","");const v=quarterTurn(turns);
 useEffect(()=>{if(!playing)return;const timer=setInterval(()=>setTurns(n=>{if(n>=3)setPlaying(false);return Math.min(4,n+1);}),700);return()=>clearInterval(timer);},[playing]);
 return <figure className="rounded-lg border border-emerald-100 bg-emerald-50/60 p-4" data-interactive="quarter-turns">
  <svg viewBox="0 0 360 230" className="mx-auto w-full max-w-md" role="img" aria-label={l?"在數線的平面上，每乘一次 i 就逆時針轉九十度":"Each multiplication by i turns the arrow anticlockwise by ninety degrees"}>
   <defs><marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#7c3aed"/></marker></defs>
   <path d="M35 115H325M180 20V210" stroke="#cbd5e1"/><circle cx="180" cy="115" r="75" fill="white" stroke="#ddd6fe"/>
   <path d="M255 115A75 75 0 0 0 180 40" fill="none" stroke="#0f766e" strokeDasharray="4 4"/>
   <g style={{transform:`rotate(${-turns*90}deg)`,transformOrigin:"180px 115px",transition:"transform 400ms ease"}}><path d="M180 115H253" stroke="#7c3aed" strokeWidth="3" markerEnd={`url(#${id})`}/></g>
   {[[270,120,"1"],[180,29,"i"],[89,120,"−1"],[180,213,"−i"]].map(([x,y,t])=><text key={t} x={x} y={y} textAnchor="middle" fontSize="14" fill="#475569">{t}</text>)}
   <circle cx={180+75*v.x} cy={115-75*v.y} r="4" fill="#0f766e"/>
  </svg>
  <div className="text-center text-lg" aria-live="polite"><Tex tex={String.raw`i^{${turns}}=${quarterTurn(turns).tex}`}/></div>
  <div className="mt-3 flex flex-wrap justify-center gap-2"><button className={button} disabled={turns===4||playing} onClick={()=>setTurns(n=>n+1)}>{l?"再乘一次 i":"Multiply by i"}</button><button className={button} disabled={playing} onClick={()=>{setTurns(0);setPlaying(true);}}>{l?"▶ 播放四次轉向":"▶ Play four turns"}</button><button className={button} onClick={()=>{setPlaying(false);setTurns(0);}}>{l?"重設":"Reset"}</button></div>
  <figcaption className="mt-3 text-center text-xs text-emerald-900">{l?"先看轉向，再看平方：兩個四分之一圈，就是半圈。":"Watch the turn before the square: two quarter turns make a half turn."}</figcaption>
 </figure>;
}
function BridgePhotos({l}:{l:number}){
 const photos=[
  {file:"broom-bridge.jpg",title:l?"都柏林皇家運河上的 Broom Bridge":"Broom Bridge over Dublin’s Royal Canal",author:"Johnflan",source:"https://commons.wikimedia.org/wiki/File:Broom_Bridge.jpg",license:"CC BY-SA 4.0",licenseUrl:"https://creativecommons.org/licenses/by-sa/4.0/"},
  {file:"broom-bridge-plaque.jpg",title:l?"橋上的紀念牌：記載 1843 年的四元數發現":"The commemorative plaque recalling the 1843 discovery",author:"Brendan Ward",source:"https://commons.wikimedia.org/wiki/File:Broombridge_Hamilton_Plaque.jpg",license:"CC0 1.0",licenseUrl:"https://creativecommons.org/publicdomain/zero/1.0/"}
 ];
 return <div className="grid gap-4 sm:grid-cols-2" data-testid="hamilton-bridge-photos">{photos.map(photo=><figure key={photo.file} className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
  <a href={photo.source} target="_blank" rel="noreferrer" aria-label={`${photo.title} · ${l?"開啟圖片來源與大圖":"Open source and larger image"}`}><img src={`${import.meta.env.BASE_URL}history/${photo.file}`} alt={photo.title} width="960" height={photo.file==="broom-bridge.jpg"?640:720} loading="lazy" className="aspect-[4/3] w-full object-contain"/></a>
  <figcaption className="space-y-1 border-t border-gray-200 p-3 text-xs leading-relaxed text-gray-500"><p className="text-gray-700">{photo.title}</p><p>{photo.author} · <a className="text-violet-700 underline" href={photo.licenseUrl} target="_blank" rel="noreferrer">{photo.license}</a> · <a className="text-violet-700 underline" href={photo.source} target="_blank" rel="noreferrer">{l?"圖片來源／大圖":"Source / larger image"} ↗</a></p></figcaption>
 </figure>)}</div>;
}
export function HamiltonTool({l}:{l:number}){
 const [a,setA]=useState<QuaternionUnit>("i"),[b,setB]=useState<QuaternionUnit>("j");
 const result=quaternionProduct(a,b);
 return <figure className="space-y-3 py-2" data-interactive="quaternion-order">

  <div className="flex flex-wrap items-center justify-center gap-3">
   {[a,b].map((value,index)=><span className="flex items-center gap-3" key={index}>{index===1&&<Tex tex={String.raw`\times`}/>}<select aria-label={l?(index?"右邊的四元數單位":"左邊的四元數單位"):(index?"Right quaternion unit":"Left quaternion unit")} value={value} onChange={e=>(index?setB:setA)(e.target.value as QuaternionUnit)} className="rounded border border-violet-200 bg-white px-3 py-2">{quaternionUnits.map(q=><option key={q}>{q}</option>)}</select></span>)}
   <span aria-live="polite"><Tex tex={`=${result}`}/></span><button className={button} onClick={()=>{setA(b);setB(a);}}>{l?"交換順序":"Swap order"}</button>
  </div>
  <p className="mt-3 text-center" aria-live="polite"><Tex tex={`${a}${b}=${result},\\qquad ${b}${a}=${quaternionProduct(b,a)}`}/></p>
  <figcaption className="mt-3 text-center text-xs text-gray-600">{l?"試試 i × j，再交換。方向的順序，也要被乘法記住。":"Try i × j, then swap. Multiplication must remember the order of directions."}</figcaption>
 </figure>;
}
function Prediction({l}:{l:number}){
 const [angle,setAngle]=useState(90),[revealed,setRevealed]=useState(false);const theta=angle*Math.PI/180;
 const uid=useId().replaceAll(":","");
 return <figure className="rounded-lg border border-emerald-100 bg-emerald-50/60 p-4" data-interactive="predict-product">
  <div className="flex flex-wrap justify-center gap-2">{[0,90,180].map(a=><button className={button} aria-pressed={angle===a} key={a} onClick={()=>{setAngle(a);setRevealed(false);}}>{a}°</button>)}</div>
  <svg viewBox="0 0 360 175" className="mx-auto w-full max-w-sm" role="img" aria-label={l?"先看兩支箭頭，預測它們的平行程度和定向面積":"Predict alignment and oriented area from two arrows"}>
   <defs><marker id={uid} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0L10 5L0 10Z" fill="context-stroke"/></marker></defs>
   <path d={`M160 130h75l${75*Math.cos(theta)} ${-75*Math.sin(theta)}h-75Z`} fill="#ddd6fe"/>
   <path d="M160 130h75" stroke="#0f766e" strokeWidth="3" markerEnd={`url(#${uid})`}/><path d={`M160 130l${75*Math.cos(theta)} ${-75*Math.sin(theta)}`} stroke="#7c3aed" strokeWidth="3" markerEnd={`url(#${uid})`}/>
  </svg>
  <div className="text-center"><button className={button} onClick={()=>setRevealed(v=>!v)}>{revealed?(l?"再猜一次":"Hide answer"):(l?"我想好了，揭曉":"Reveal my check")}</button></div>
  <div className="mt-3 min-h-10 text-center" aria-live="polite">{revealed?<Tex tex={geometricProductTex(angle,0)}/>:<p>{l?"同向留下多少？還圍得出面積嗎？":"How much alignment remains? Is there any area?"}</p>}</div>
 </figure>;
}
export default function LearningSections({l}:{l:number}){
 const [check,setCheck]=useState(false);
 return <>
  <Card id="imaginary-turn" n={1} title={l?"i 的故事：找不到的數，還是看得見的轉向？":"The story of i: a missing number, or a visible turn?"}>
   <p>{l?"在實數線上，不論正數還是負數，平方都不會是負數。那麼，什麼東西乘自己會得到 −1？先別背「虛數」這個名字，把乘法想成一個動作。":"On the real number line, neither positive nor negative numbers square to a negative number. What could square to −1? Before learning the name ‘imaginary’, think of multiplication as an action."}</p>
   <QuarterTurns l={l}/>
   <p>{l?"從 1 出發，轉九十度到 i，再轉九十度到 −1。所以 i² = −1 可以讀成：同一個四分之一圈，做兩次，就把箭頭反過來。複數讓這個平面上的轉向可以計算。":"Start at 1, turn ninety degrees to i, then another ninety to −1. Read i² = −1 as: repeat a quarter turn and the arrow points backward. Complex numbers make this planar action calculable."}</p>
  </Card>
  <Card id="hamilton-bridge" n={2} title={l?"漢密爾頓在橋上刻下的乘法":"The multiplication Hamilton carved on a bridge"}>
   <p>{l?"平面上的轉向有了語言，三維呢？1843 年 10 月 16 日，漢密爾頓與妻子沿都柏林的運河散步。他在 Broom Bridge 想通了四元數，並把這組關係刻在橋石上。":"What about three dimensions? On 16 October 1843, while walking beside Dublin’s canal with his wife, Hamilton found the quaternion relations and carved them into a stone of Broom Bridge."}</p>
   <BridgePhotos l={l}/>
   <div className="rounded-lg bg-violet-50 p-3"><Tex tex={String.raw`i^2=j^2=k^2=ijk=-1`} display/></div>
   <HamiltonTool l={l}/>
   <p>{l?"三個符號不只是三根箭頭。在幾何代數裡，我們可以把它們對應到三個定向平面。交換兩個不同的單位，結果會變號；三維的轉向順序從此留在算式裡。":"These three symbols can be identified with three oriented planes in geometric algebra. Swap two distinct units and the sign changes: the order of spatial turns stays in the calculation."}</p>
   <p className="text-xs text-gray-500"><a className="text-violet-700 underline" href="https://www.maths.tcd.ie/pub/HistMath/People/Hamilton/Quaternions.html" target="_blank" rel="noreferrer">{l?"史料：Trinity College Dublin · 漢密爾頓的四元數研究":"Source: Trinity College Dublin · Hamilton’s quaternion research"} ↗</a></p>
  </Card>
  <Card id="welcome" n={3} title={l?"虛數？張量？先不用。從幾何積開始":"Imaginary numbers? Tensors? Start with the geometric product"}>
   <p>{l?"這一課先不用複數或張量的形式。只拿兩支箭頭，約定它們可以相乘。核心幾何公設很短：向量乘自己，得到它的長度平方；乘法同時遵守分配律與結合律。以下先在歐氏空間操作。":"This lesson needs no prior complex-number or tensor formalism. Begin with arrows that can multiply. The core geometric rule is short: a vector squared equals its squared length. Multiplication is also distributive and associative. We start in Euclidean space."}</p>
   <div className="rounded-lg bg-violet-50 p-3"><Tex tex={String.raw`a^2=a\cdot a=\lVert a\rVert^2`} display/></div>
   <p>{l?"兩支不同的箭頭相乘時，一次保留兩件事：它們有多同向，以及它們圍出多少有方向的面積。這就叫幾何積。":"For two different arrows, one product keeps two things: how much they align, and how much oriented area they span. This is the geometric product."}</p>
   <div className="rounded-lg border border-violet-100 bg-violet-50/50 p-3"><Tex tex={String.raw`ab=\textcolor{#0f766e}{\underbrace{a\cdot b}_{\text{${l?"同向程度":"alignment"}}}}+\textcolor{#7c3aed}{\underbrace{a\wedge b}_{\text{${l?"定向面積":"oriented area"}}}}`} display/></div>
   <div data-feynman="example" className="rounded-lg border-l-4 border-emerald-300 bg-emerald-50/60 p-4"><p className="mb-3">{l?"拖動第二支箭頭：從同向到垂直，數量如何流向面積？再試試反向。":"Move the second arrow: from parallel to perpendicular, how does alignment give way to area? Then try the opposite direction."}</p><GeometryFigure kind="product" l={l}/></div>
   <p>{l?"取兩個垂直單位方向，把它們的平面寫成 B。垂直方向交換次序會變號；把 B 乘自己，竟然又出現 −1。剛才 i 的故事，現在有了幾何來源。":"Take two perpendicular unit directions and call their plane B. Swapping perpendicular directions changes the sign. Square B and −1 appears again. The story of i now has a geometric home."}</p>
   <div className="flex flex-wrap justify-center gap-x-6"><Tex tex={String.raw`B=e_1e_2`} display/><Tex tex={String.raw`B^2=e_1e_2e_1e_2=-e_1^2e_2^2=-1`} display/></div>
   <p className="text-xs text-gray-500">{l?"複數、四元數與張量仍各有用途。這裡先用一個乘法建立幾何直覺；時空的正負號與其他結構，會在後面的工具箱補上。":"Complex numbers, quaternions and tensors retain their uses. Here one product builds the intuition first; spacetime signatures and other structures come later in the toolbox."}</p>
  </Card>
  <Card id="learning" n={4} title={l?"有了第一個例子，才開始學會如何學習":"With one example in hand, learn how to learn"}>
   <p>{l?"先把頁面往上捲，遮住公式：你能用自己的話說清楚，為什麼兩次四分之一圈會得到 −1？能說出來，再解釋平行的箭頭為什麼圍不出面積。卡住的地方，就是下一次該操作圖的位置。":"Cover the formulas above. Can you explain in your own words why two quarter turns give −1? Then explain why parallel arrows enclose no area. Wherever you get stuck is the next place to move the diagram."}</p>
   <GeometryFigure kind="path" l={l}/>
   <p>{l?"每遇到新符號，都問三件事：它記住什麼幾何？改一個條件會怎樣？能否找一個最小算例把自己的說法推翻？先有預測，動畫才有檢查的對象。":"For each new symbol, ask: what geometry does it keep? What changes if I change one condition? Can a tiny example disprove my explanation? Make a prediction so the animation has something to check."}</p>
  </Card>
  <Card id="predict-before-symbols" n={5} title={l?"輪到你：先猜，再揭曉":"Your turn: predict before revealing"}>
   <p>{l?"兩支箭頭都長 1。先選角度，說出平行程度與定向面積，再揭曉結果。別急著套三角函數：看圖能不能先說服自己？":"Both arrows have length 1. Choose an angle and predict their alignment and oriented area before revealing the result. Can the picture convince you before trigonometry does?"}</p>
   <Prediction l={l}/>
  </Card>
  <Card id="explain-and-check" n={6} title={l?"把幾何說清楚，再走進工具箱":"Explain the geometry, then open the toolbox"}>
   <label className="block">{l?"用一句話說明：為什麼一個平面的平方可以是 −1？":"In one sentence: why can a plane square to −1?"}<textarea rows={3} className="mt-2 w-full rounded-lg border border-violet-200 bg-white p-3" placeholder={l?"試著不用「因為公式這樣寫」來回答……":"Try answering without ‘because the formula says so’…"}/></label>
   <button className={button} aria-expanded={check} onClick={()=>setCheck(v=>!v)}>{l?"打開自我檢查":"Open the self-check"}</button>
   {check&&<div className="rounded-lg border-l-4 border-amber-300 bg-amber-50 p-4"><p>{l?"有沒有提到兩個垂直方向？有沒有說明交換順序會變號？最後能否把四個方向重新配成兩對，留下 −1？這是自我檢查，文字不會被自動評分。":"Did you mention two perpendicular directions? Explain the sign change when their order swaps? Then pair the four vectors to leave −1? This is a self-check; your writing is not automatically graded."}</p></div>}
   <CodeBlock code={"# Perpendicular Euclidean unit directions\ne1 * e1 == 1\ne2 * e2 == 1\ne2 * e1 == -(e1 * e2)\n# Therefore (e1 * e2) * (e1 * e2) == -1"} title={l?"把幾何規則寫成可檢查的敘述（偽程式碼）":"Geometry as checkable statements (pseudocode)"}/>
   <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-4"><a className={button} href="#/concept/foundations">{l?"補齊基礎：幾何積及多重向量":"Complete the foundations: geometric products and multivectors"} →</a><a className={button} href="#/concept/algebra">{l?"下一站：代數工具箱":"Next: the algebra toolbox"} →</a><a className={button} href="#/concept/rotations">{l?"接著：轉子與旋量":"Then: rotors and spinors"} →</a></div>
  </Card>
 </>;
}
