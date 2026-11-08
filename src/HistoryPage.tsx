import {useEffect,useLayoutEffect,useRef,useState,type RefObject} from "react";
import {historyEvents,historyEras,historyIntro} from "./history";
import HistoryDrawing from "./components/HistoryDrawing";
import Tex from "./components/Tex";
const LG="(min-width:1024px)",GAP=24,BADGE=24;
const theme=[
 {dot:"bg-amber-500",text:"text-amber-800",band:"border-amber-200 bg-amber-50 text-amber-900"},
 {dot:"bg-teal-600",text:"text-teal-800",band:"border-teal-200 bg-teal-50 text-teal-900"},
 {dot:"bg-violet-600",text:"text-violet-800",band:"border-violet-200 bg-violet-50 text-violet-900"},
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
 const ids=historyEvents.map(c=>c.id);
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
   for(const c of historyEvents)if((document.getElementById(c.id)?.getBoundingClientRect().top??Infinity)<=line)id=c.id;
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
  document.getElementById(id)?.scrollIntoView({block:"start",behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});
  history.replaceState(null,"",`#/concept/history/${id}`);
 };
 const toggle=(id:string)=>setNotes(s=>{const next=new Set(s);if(!next.delete(id))next.add(id);return next;});
 const navigation=<>{historyEras.map(era=><div key={era.id} className="mb-4">
  <p className={`px-3 text-sm font-bold ${theme[era.id-1].text}`}>{era.title[l]}</p><p className="px-3 pt-1 pb-2 text-xs text-gray-500">{era.subtitle[l]}</p>
  <ol className="space-y-1 border-l border-gray-200">{historyEvents.filter(c=>c.part===era.id).map(c=><li key={c.id}>
   <button onClick={()=>jump(c.id)} aria-current={active===c.id?"location":undefined} className={`-ml-px flex w-full gap-2 border-l-2 px-3 py-1 text-left text-sm ${active===c.id?"border-violet-600 font-medium text-violet-800":"border-transparent text-gray-600 hover:border-gray-300"}`}><span className="w-16 shrink-0 text-[11px] text-gray-400">{c.year}</span><span>{c.title[l]}</span></button>
  </li>)}</ol>
 </div>)}
 <button role="switch" aria-checked={allOpen} onClick={()=>setNotes(allOpen?new Set():new Set(noteIds))} className="w-full rounded-lg border border-dashed border-amber-300 bg-amber-50 px-3 py-2 text-left text-xs text-amber-900">💡 {l?"顯示所有小故事":"Show all side notes"}<span className="float-right">{allOpen?"●":"○"}</span></button>
 </>;
 return <div className="mx-auto flex max-w-6xl gap-8 px-5 pt-6 pb-12" data-testid="history">
  <nav aria-label={l?"歷史時間軸":"History timeline"} className="sticky top-20 hidden max-h-[calc(100dvh-11rem)] w-60 shrink-0 self-start overflow-y-auto lg:block">{navigation}</nav>
  <article id="main-content" tabIndex={-1} className="min-w-0 flex-1">
   <header><p className="text-sm font-medium text-violet-700">{l?"概念 · 回到思想的起點":"Concepts · where the ideas began"}</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">{l?"克利福德代數史":"A history of Clifford algebra"}</h1><p className="mt-3 text-sm leading-relaxed text-gray-600">{historyIntro[l]}</p></header>
   <div className="sticky top-12 z-20 -mx-5 mt-5 border-y border-gray-200 bg-white/95 px-5 py-2 backdrop-blur lg:hidden">
    <button aria-expanded={menu} className="flex w-full items-center gap-2 text-left text-sm" onClick={()=>setMenu(v=>!v)}><span className="h-2 w-2 rounded-full bg-violet-600"/><span className="min-w-0 flex-1 truncate">{historyEvents.find(c=>c.id===active)?.title[l]||(l?"歷史時間軸":"History timeline")}</span><span>{menu?"▴":"▾"}</span></button>
    {menu&&<div className="max-h-[60dvh] overflow-y-auto pt-4">{navigation}</div>}
   </div>
   <div className="relative mt-8">
    <div aria-hidden className="absolute top-0 bottom-0 left-4 w-0.5 -translate-x-1/2 bg-gray-200 lg:left-1/2"/>
    <ol ref={list} className={`relative space-y-8 ${layout?"lg:space-y-0":""}`} style={layout?{height:layout.height}:undefined}>
     {historyEvents.map((c,i)=>{
      const st=theme[c.part-1],left=i%2===0,first=starts.has(c.id),era=historyEras.find(e=>e.id===c.part)!;
      return <li key={c.id} data-history-card={c.id} className={`pt-8 pl-10 lg:pt-0 ${layout?"absolute lg:w-[calc(50%-3rem)] lg:pl-0":"relative"}`} style={layout?{top:layout.tops[c.id],...(left?{left:0}:{right:0})}:undefined}>
       <span aria-hidden className={`absolute top-[64px] left-4 h-0.5 w-6 lg:top-[34px] ${st.dot} ${left?"lg:left-auto lg:right-[-3rem] lg:w-12":"lg:left-[-3rem] lg:w-12"}`}/>
       <span aria-hidden className={`absolute top-[58px] left-4 z-10 h-3.5 w-3.5 -translate-x-1/2 rounded-full ring-4 ring-gray-50 lg:top-7 ${st.dot} ${left?"lg:left-auto lg:right-[-3rem] lg:translate-x-1/2":"lg:left-[-3rem]"}`}/>
       <span className={`absolute top-0 left-10 whitespace-nowrap text-sm font-bold tabular-nums lg:-top-1 lg:rounded lg:bg-gray-50 lg:px-1 ${st.text} ${left?"lg:left-auto lg:right-[-3rem] lg:translate-x-1/2":"lg:left-[-3rem] lg:-translate-x-1/2"}`}>{c.year}</span>
       <section id={c.id} className={`scroll-mt-24 overflow-hidden rounded-xl border bg-white shadow-sm ${active===c.id?"border-violet-300 ring-1 ring-violet-100":"border-gray-200"}`}>
        {first&&<div className={`border-b px-4 py-3 ${st.band}`}><p className="text-sm font-semibold">{era.title[l]}</p><p className="mt-1 text-xs opacity-80">{era.subtitle[l]}</p></div>}
        <figure className="border-b border-gray-100 bg-gray-50">
         <div className="flex h-52 items-center justify-center p-3">{c.photo?<img src={`${import.meta.env.BASE_URL}history/${c.photo.file}`} alt={c.caption[l]} loading="lazy" decoding="async" className="max-h-full max-w-full rounded object-contain"/>:<HistoryDrawing kind={c.drawing} label={c.caption[l]} l={l}/>}</div>
         <figcaption className="px-4 pb-3 text-[11px] leading-relaxed text-gray-500">{c.caption[l]}{c.photo&&<span className="mt-1 block">{c.photo.author} · <a href={c.photo.licenseUrl} target="_blank" rel="noopener noreferrer" className="underline">{c.photo.license}</a> · <a href={c.photo.source} target="_blank" rel="noopener noreferrer" className="underline">{l?"圖片來源":"Image source"}</a></span>}</figcaption>
        </figure>
        <div className="space-y-3 p-4 sm:p-5">
         <h2 className="text-lg font-semibold leading-snug">{c.title[l]}</h2>
         {c.paragraphs.map((p,i)=><p key={i} className="text-sm leading-relaxed text-gray-600">{p[l]}</p>)}
         {c.equation&&<div className="rounded-lg bg-violet-50/70 px-2 py-1 text-sm"><Tex tex={c.equation} display/></div>}
         {c.note&&<><button aria-expanded={notes.has(c.id)} aria-controls={`note-${c.id}`} onClick={()=>toggle(c.id)} className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-900">💡 {l?"小故事":"Side note"} {notes.has(c.id)?"−":"+"}</button>{notes.has(c.id)&&<p id={`note-${c.id}`} className="rounded-lg border border-amber-100 bg-amber-50/60 p-3 text-xs leading-relaxed text-amber-950">{c.note[l]}</p>}</>}
         <a href={`#/${c.related}`} className="inline-block text-xs font-medium text-violet-700 hover:underline">{l?"到相關概念或例子 →":"Explore the related lesson →"}</a>
         <ul className="space-y-1 border-t border-gray-100 pt-3 text-[11px] text-gray-500">{c.sources.map(s=><li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-violet-700 hover:underline">{s.label} ↗</a></li>)}</ul>
        </div>
       </section>
      </li>;
     })}
    </ol>
   </div>
  </article>
 </div>;
}
