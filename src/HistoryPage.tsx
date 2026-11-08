import {useEffect,useLayoutEffect,useRef,useState,type RefObject} from "react";
import {historyEvents,historyEras,historyIntro,type HistoryEvent} from "./history";
import HistoryDrawing from "./components/HistoryDrawing";
import Tex from "./components/Tex";
const LG="(min-width:1024px)",GAP=24,BADGE=24;
const track={hamilton:"#f59e0b",grassmann:"#0d9488",joined:"#7c3aed"};
const theme=[
 {dot:"bg-amber-500",text:"text-amber-800",badge:"bg-amber-50 text-amber-800 ring-amber-200",band:"border-amber-200 bg-amber-50 text-amber-900"},
 {dot:"bg-teal-600",text:"text-teal-800",badge:"bg-teal-50 text-teal-800 ring-teal-200",band:"border-teal-200 bg-teal-50 text-teal-900"},
 {dot:"bg-violet-600",text:"text-violet-800",badge:"bg-violet-50 text-violet-800 ring-violet-200",band:"border-violet-200 bg-violet-50 text-violet-900"},
];
function useInterlock(listRef: RefObject<HTMLOListElement | null>, ids: string[], partStarts: Set<string>) {
  const [layout, setLayout] = useState<{ tops: Record<string, number>; height: number } | null>(null);
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const mq = window.matchMedia(LG);
    let frame = 0;
    const compute = () => {
      frame = 0;
      if (!mq.matches) return setLayout(null);
      const tops: Record<string, number> = {};
      const bottoms: number[] = [];
      let prevTop = 0;
      let prevH = 0;
      ids.forEach((id, k) => {
        const h = list.querySelector<HTMLElement>(`[data-history-card="${id}"]`)?.offsetHeight ?? 0;
        let top = k === 0 ? BADGE : prevTop + prevH / 2;
        if (k >= 2) top = Math.max(top, bottoms[k - 2] + GAP);
        // room for the part badge between the previous card's marker (top + 50 px) and this card's year label
        if (k > 0 && partStarts.has(id)) top = Math.max(top, prevTop + 50 + BADGE);
        tops[id] = top;
        bottoms[k] = top + h;
        prevTop = top;
        prevH = h;
      });
      setLayout({ tops, height: Math.max(0, ...bottoms) });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(compute);
    };
    const ro = new ResizeObserver(schedule);
    ro.observe(list);
    list.querySelectorAll("[data-history-card]").forEach((el) => ro.observe(el));
    mq.addEventListener("change", schedule);
    compute();
    return () => {
      ro.disconnect();
      mq.removeEventListener("change", schedule);
      cancelAnimationFrame(frame);
    };
  }, [ids.join()]);
  return layout;
}

export default function HistoryPage({l,section}:{l:number;section:string|null}){
 const [active,setActive]=useState(section||historyEvents[0].id),[menu,setMenu]=useState(false),[notes,setNotes]=useState<Set<string>>(()=>new Set());
 const list=useRef<HTMLOListElement>(null);
 const continuation=historyEvents.filter(c=>c.part>1);
 const ids=continuation.map(c=>c.id);
 const starts=new Set(historyEras.map(e=>historyEvents.find(c=>c.part===e.id)!.id));
 const layout=useInterlock(list,ids,starts);
 const noteIds=historyEvents.filter(c=>c.note).map(c=>c.id);
 const allOpen=noteIds.every(id=>notes.has(id));
 const linkedAt=useRef(0),clickedAt=useRef(0);
 useEffect(()=>{linkedAt.current=Date.now();},[section]);
 useEffect(()=>{
  if(layout&&section&&Date.now()-linkedAt.current<2500)document.getElementById(section)?.scrollIntoView({block:"start"});
 },[layout,section]);
 useEffect(()=>{
  const root=document.getElementById("concept-scroll");if(!root)return;
  let frame=0;
  const update=()=>{frame=0;if(Date.now()-clickedAt.current<1200)return;let id=historyEvents[0].id;const line=root.getBoundingClientRect().top+130;
   for(const c of historyEvents){const el=document.getElementById(c.id);if(el&&el.getClientRects().length&&el.getBoundingClientRect().top<=line)id=c.id;}
   if(root.scrollTop+root.clientHeight>=root.scrollHeight-4)id=historyEvents.at(-1)!.id;
   setActive(id);
  };
  const scroll=()=>{if(!frame)frame=requestAnimationFrame(update);};
  root.addEventListener("scroll",scroll,{passive:true});update();
  return()=>{root.removeEventListener("scroll",scroll);cancelAnimationFrame(frame);};
 },[]);
 const jump=(id:string)=>{
  clickedAt.current=Date.now();
  setActive(id);setMenu(false);
  requestAnimationFrame(()=>document.getElementById(id)?.scrollIntoView({block:"start",behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"}));
  history.replaceState(null,"",`#/concept/history/${id}`);
 };
 const toggle=(id:string)=>setNotes(s=>{const next=new Set(s);if(!next.delete(id))next.add(id);return next;});
 const navigation=<>{historyEras.map(era=><div key={era.id} className="mb-4">
  <p className={`px-3 text-sm font-bold ${theme[era.id-1].text}`}>{era.title[l]}</p><p className="px-3 pt-1 pb-2 text-xs text-gray-500">{era.subtitle[l]}</p>
  <ol className="space-y-1 border-l border-gray-200">{historyEvents.filter(c=>c.part===era.id).map(c=><li key={c.id}>
   <button onClick={()=>jump(c.id)} aria-current={active===c.id?"location":undefined} className={`-ml-px flex w-full gap-2 border-l-2 px-3 py-1 text-left text-sm ${active===c.id?"border-violet-600 font-medium text-violet-800":"border-transparent text-gray-600 hover:border-gray-300"}`}><span className="w-16 shrink-0 text-[11px] text-gray-400">{c.year}</span><span>{c.title[l]}</span></button>
  </li>)}</ol>
 </div>)}
 <button type="button" role="switch" aria-checked={allOpen} onClick={()=>setNotes(allOpen?new Set():new Set(noteIds))} data-history-fun-all className="mt-3 flex w-full items-center gap-2 rounded-lg border border-dashed border-amber-300 bg-amber-50/60 px-3 py-2 text-left text-sm text-amber-900 hover:bg-amber-50"><span className="min-w-0 flex-1">{l?"顯示所有趣聞":"Show all fun facts"}</span><span aria-hidden className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${allOpen?"bg-amber-500":"bg-gray-300"}`}><span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${allOpen?"translate-x-4":""}`}/></span></button>
 </>;
 const cardContent=(c:HistoryEvent,first=false)=>{
  const st=theme[c.part-1],era=historyEras.find(e=>e.id===c.part)!,picture=c.pair??c.photo;
  return <section id={c.id} className={`scroll-mt-24 overflow-hidden rounded-xl border bg-white shadow-sm ${active===c.id?"border-violet-300 ring-1 ring-violet-100":"border-gray-200"}`}>
        {first&&<div className={`border-b px-4 py-3 ${st.band}`}><p className="text-sm font-semibold">{era.title[l]}</p><p className="mt-1 text-xs opacity-80">{era.subtitle[l]}</p></div>}
        <figure className="border-b border-gray-100 bg-gray-50">
         <div className="flex h-52 items-center justify-center p-3">{picture?<img src={`${import.meta.env.BASE_URL}history/${picture.file}`} alt={c.caption[l]} loading="lazy" decoding="async" className="max-h-full max-w-full rounded object-contain"/>:<HistoryDrawing kind={c.drawing} label={c.caption[l]} l={l}/>}</div>
         <figcaption className="px-4 pb-3 text-[11px] leading-relaxed text-gray-500">{c.caption[l]}{c.pair&&<span className="mt-1 flex flex-wrap gap-x-3 gap-y-1">{c.pair.sources.map(source=><a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer" className="underline">{source.name} · {source.author} ↗</a>)}</span>}{c.photo&&<span className="mt-1 block">{c.photo.author} · <a href={c.photo.licenseUrl} target="_blank" rel="noopener noreferrer" className="underline">{c.photo.license}</a> · <a href={c.photo.source} target="_blank" rel="noopener noreferrer" className="underline">{l?"圖片來源":"Image source"}</a></span>}</figcaption>
        </figure>
        <div className="space-y-3 p-4 sm:p-5">
         <p className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums ring-1 ${st.badge}`}>{c.year}</span>
          {c.note&&<button type="button" aria-expanded={notes.has(c.id)} aria-controls={`history-fun-${c.id}`} aria-label={l?"你知道嗎？":"Did you know?"} title={l?"你知道嗎？":"Did you know?"} data-history-fun-badge={c.id} onClick={()=>toggle(c.id)} className={`rounded-full border border-dashed px-1.5 py-0.5 text-xs leading-none transition-colors ${notes.has(c.id)?"border-amber-500 bg-amber-100":"border-amber-300 bg-amber-50 hover:bg-amber-100"}`}><span aria-hidden>💡</span></button>}
         </p>
         {c.note&&notes.has(c.id)&&<aside id={`history-fun-${c.id}`} data-history-fun={c.id} className="mt-3 rounded-lg border-2 border-dashed border-amber-300 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-gray-800">
          <p className="text-xs font-semibold text-amber-900">💡 {l?"你知道嗎？":"Did you know?"}</p>
          <div className="mt-1.5 break-words"><p>{c.note[l]}</p><p className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs">{c.sources.map(source=><a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">{source.label} ↗</a>)}</p></div>
         </aside>}
         <h2 className="text-lg font-semibold leading-snug">{c.title[l]}</h2>
         {c.paragraphs.map((p,i)=><p key={i} className="text-sm leading-relaxed text-gray-600">{p[l]}</p>)}
         {c.equation&&<div className="rounded-lg bg-violet-50/70 px-2 py-1 text-sm"><Tex tex={c.equation} display/></div>}
         <a href={`#/${c.related}`} className="inline-block text-xs font-medium text-violet-700 hover:underline">{l?"到相關概念或例子 →":"Explore the related lesson →"}</a>
         <ul className="space-y-1 border-t border-gray-100 pt-3 text-[11px] text-gray-500">{c.sources.map(s=><li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-violet-700 hover:underline">{s.label} ↗</a></li>)}</ul>
        </div>
       </section>;
 };
 return <div className="mx-auto flex max-w-6xl gap-8 px-5 pt-6 pb-12" data-testid="history">
  <nav aria-label={l?"歷史時間軸":"History timeline"} className="sticky top-20 hidden max-h-[calc(100dvh-11rem)] w-60 shrink-0 self-start overflow-y-auto lg:block">{navigation}</nav>
  <article id="main-content" tabIndex={-1} className="min-w-0 flex-1">
   <header><h1 className="text-3xl font-semibold tracking-tight">{l?"克利福德代數史":"A history of Clifford algebra"}</h1><p className="mt-3 text-sm leading-relaxed text-gray-600">{historyIntro[l]}</p></header>
   <div className="sticky top-12 z-20 -mx-5 mt-5 border-y border-gray-200 bg-white/95 px-5 py-2 backdrop-blur lg:hidden">
    <button aria-expanded={menu} className="flex w-full items-center gap-2 text-left text-sm" onClick={()=>setMenu(v=>!v)}><span className="h-2 w-2 rounded-full bg-violet-600"/><span className="min-w-0 flex-1 truncate">{historyEvents.find(c=>c.id===active)?.title[l]||(l?"歷史時間軸":"History timeline")}</span><span>{menu?"▴":"▾"}</span></button>
    {menu&&<div className="max-h-[60dvh] overflow-y-auto pt-4">{navigation}</div>}
   </div>
   <section className="mt-8" aria-labelledby="origins-title" data-history-branches="true">
    <header className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3"><h2 id="origins-title" className="font-semibold text-amber-900">{historyEras[0].title[l]}</h2><p className="mt-1 text-xs text-amber-800">{l?"兩條獨立發展的代數脈絡，在 1878 年的幾何積中匯合。":"Two independently developed algebraic strands meet in the geometric product in 1878."}</p></header>
    <div className="relative" data-history-parallel="true">
     <div aria-hidden data-track="hamilton" style={{backgroundColor:track.hamilton}} className="absolute inset-y-0 left-3 w-0.5 -translate-x-1/2 lg:left-1/4"/>
     <div aria-hidden data-track="grassmann" style={{backgroundColor:track.grassmann}} className="absolute inset-y-0 left-8 w-0.5 -translate-x-1/2 lg:left-3/4"/>
     <div className="grid gap-y-8 pl-14 lg:grid-cols-2 lg:pl-0">
      {historyEvents.slice(0,2).map((c,i)=><div key={c.id} data-history-branch={c.id} data-history-card={c.id} className="relative min-w-0 pb-5 lg:px-3">
       <span aria-hidden className={`absolute top-3 h-2.5 w-2.5 -translate-x-1/2 rounded-full ring-4 ring-gray-50 lg:left-1/2 ${i===0?"-left-11 bg-amber-500":"-left-6 bg-teal-600"}`}/>
       <p className={`relative mb-3 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-xs font-semibold ${i===0?"text-amber-800":"text-teal-800"}`}><span className="tabular-nums">{c.year}</span><span>{i===0?(l?"旋轉 · 四元數":"Rotations · quaternions"):(l?"延伸 · 定向面積":"Extension · oriented area")}</span></p>
       {cardContent(c)}
      </div>)}
     </div>
     <aside data-history-card="clifford-space" className="relative mt-4 pb-6 pl-14 lg:mx-auto lg:w-[calc(50%-3rem)] lg:pl-0" aria-label={l?"同時期的另一個問題":"A separate question of the period"}>
      <p className="mb-3 text-xs font-medium leading-relaxed text-gray-500">{l?"同時期的另一個問題：空間與物質":"A separate question of the period: space and matter"} · 1870 / 1876</p>
      {cardContent(historyEvents.find(c=>c.id==="clifford-space")!)}
     </aside>
    </div>
    <div aria-hidden data-history-merge="true">
     <svg viewBox="0 0 1000 64" preserveAspectRatio="none" className="hidden h-16 w-full overflow-visible lg:block"><path d="M250-1V12Q250 40 500 40" stroke={track.hamilton} strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke"/><path d="M750-1V12Q750 40 500 40" stroke={track.grassmann} strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke"/><circle cx="500" cy="40" r="3" fill={track.joined}/><path d="M500 40V65" stroke={track.joined} strokeWidth="2" vectorEffect="non-scaling-stroke"/></svg>
     <svg viewBox="0 0 48 64" className="h-16 w-12 overflow-visible lg:hidden"><path d="M12-1V12Q12 38 16 38" stroke={track.hamilton} strokeWidth="2" fill="none"/><path d="M32-1V12Q32 38 16 38" stroke={track.grassmann} strokeWidth="2" fill="none"/><path d="M16 38V65" stroke={track.joined} strokeWidth="2"/><circle cx="16" cy="38" r="3" fill={track.joined}/></svg>
    </div>
    <div className="relative pb-8 pl-10 lg:pl-0" data-history-joined="true" data-history-card="clifford-product">
     <div aria-hidden data-track="joined" style={{backgroundColor:track.joined}} className="absolute inset-y-0 left-4 w-0.5 -translate-x-1/2 lg:left-1/2"/>
     <div className="relative mx-auto min-w-0 lg:w-[calc(50%-3rem)]">
      <p className="mb-3 w-fit bg-gray-50 pr-2 text-sm font-semibold text-violet-800">1878 · {l?"兩條脈絡，在幾何積匯合":"The two strands meet in one product"}</p>
      {cardContent(historyEvents.find(c=>c.id==="clifford-product")!)}
     </div>
    </div>
   </section>
   <div className="relative">
    <div aria-hidden data-track="continuation" style={{backgroundColor:track.joined}} className="absolute top-0 bottom-0 left-4 w-0.5 -translate-x-1/2 lg:left-1/2"/>
    <ol ref={list} className={`relative space-y-8 ${layout?"lg:space-y-0":""}`} style={layout?{height:layout.height}:undefined}>
     {continuation.map((c,i)=>{
      const st=theme[c.part-1],left=i%2===0,first=starts.has(c.id);
      return <li key={c.id} data-history-card={c.id} className={`pt-8 pl-10 lg:pt-0 ${layout?"absolute lg:w-[calc(50%-3rem)] lg:pl-0":"relative"}`} style={layout?{top:layout.tops[c.id],...(left?{left:0}:{right:0})}:undefined}>
       <span aria-hidden className={`absolute top-[64px] left-4 h-0.5 w-6 lg:top-[34px] ${st.dot} ${left?"lg:left-auto lg:right-[-3rem] lg:w-12":"lg:left-[-3rem] lg:w-12"}`}/>
       <span aria-hidden className={`absolute top-[58px] left-4 z-10 h-3.5 w-3.5 -translate-x-1/2 rounded-full ring-4 ring-gray-50 lg:top-7 ${st.dot} ${left?"lg:left-auto lg:right-[-3rem] lg:translate-x-1/2":"lg:left-[-3rem]"}`}/>
       <span className={`absolute top-0 left-10 whitespace-nowrap text-sm font-bold tabular-nums lg:-top-1 lg:rounded lg:bg-gray-50 lg:px-1 ${st.text} ${left?"lg:left-auto lg:right-[-3rem] lg:translate-x-1/2":"lg:left-[-3rem] lg:-translate-x-1/2"}`}>{c.year}</span>
       {cardContent(c,first)}
      </li>;
     })}
    </ol>
   </div>
  </article>
 </div>;
}
