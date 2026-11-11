import {useEffect,useLayoutEffect,useRef,useState} from "react";
import {parseRoute,structure,type Page} from "./routes";
import ReadingPage,{READING_GROUPS} from "./ReadingPage";
import PageToc from "./components/PageToc";
import SeriesPage from "./components/SeriesPage";
import {READING_TABS,seriesText} from "./series";
import SiteFooter from "./components/SiteFooter";
import LessonSections from "./LessonSections";
import HistoryPage from "./HistoryPage";
import LearningSections from "./LearningSections";
import FoundationsSections from "./FoundationsSections";
import AlgebraSections from "./AlgebraSections";
import PhysicsSections from "./PhysicsSections";
import ExtendedSections,{extendedPages} from "./ExtendedSections";
import {existingCount} from "./curriculum";
const READING_TAB_IDS=["books","labs","explorables"] as const;
// Every header page lists its sub-pages in one menu under its tab; topics with no content yet keep " (coming)".
export function subPages(page:Page,lang:string){const l=lang==="en"?0:1;return page==="reading"?READING_TAB_IDS.map(id=>({id,label:seriesText(READING_TABS[id],lang)})):structure[page].map(t=>({id:t.id,label:t.title[l]+(existingCount(t.sections)===0?" (coming)":"")}));}
const PAGE_TITLES:Record<Page,string[]>={concept:["Concepts","概念"],skills:["Coding Skills","程式技巧"],reading:["Extended Reading","延伸閱讀"]};
export default function App(){
  const [route,setRoute]=useState(()=>parseRoute(location.hash));
  const [lang,setLang]=useState(()=>new URLSearchParams(location.search).get("lang")==="en"?"en":"zh-Hant");
  const l=lang==="en"?0:1;
  const tabs=route.page==="reading"?[]:structure[route.page];
  const selected=tabs.find(t=>t.id===route.tab)||tabs[0];
  // The sub-page menu opens under its header tab, placed from the tab itself (fixed, so the sideways-scrolling nav on phones does not clip it).
  const headerTabs=useRef<Partial<Record<Page,HTMLAnchorElement|null>>>({});
  const [menu,setMenu]=useState<Page|null>(null);
  const [menuAt,setMenuAt]=useState<{left:number;top:number}|null>(null);
  useEffect(()=>{
    if(!menu)return;
    const place=()=>{const r=headerTabs.current[menu]?.getBoundingClientRect();if(r)setMenuAt({left:r.left,top:r.bottom});};
    place();window.addEventListener("resize",place);return()=>window.removeEventListener("resize",place);
  },[menu]);
  // A wide menu near the right edge (or a tab scrolled off on a phone) is pulled back inside the window.
  const menuBox=useRef<HTMLElement>(null);
  useLayoutEffect(()=>{const el=menuBox.current;if(!el||!menuAt)return;const left=Math.max(8,Math.min(menuAt.left,innerWidth-8-el.offsetWidth));if(left!==menuAt.left)setMenuAt({...menuAt,left});},[menuAt]);
  useEffect(()=>{const onHash=()=>setRoute(parseRoute(location.hash));window.addEventListener("hashchange",onHash);return()=>window.removeEventListener("hashchange",onHash);},[]);
  useEffect(()=>{
    document.documentElement.lang=lang;document.title="Clifford Algebra";
    const url=new URL(location.href);url.searchParams.set("lang",lang);history.replaceState(null,"",url);
  },[lang,l]);
  useEffect(()=>{
    const target=route.page==="reading"?(READING_GROUPS.some(g=>g.id===route.section)?`reading-${route.section}`:null):(route.section?route.section:null);
    if(target&&document.getElementById(target))document.getElementById(target)?.scrollIntoView({block:"start"});
    else document.getElementById(route.page==="reading"?"reading-scroll":"concept-scroll")?.scrollTo({top:0});
  },[route.page,route.tab,route.section]);
  return <div className="flex h-dvh flex-col overflow-hidden bg-white">
    <a className="skip" href="#main-content" onClick={e=>{e.preventDefault();document.getElementById("main-content")?.focus();}}>{l?"跳到內容":"Skip to content"}</a>
    <header onMouseLeave={()=>setMenu(null)} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))setMenu(null);}} onKeyDown={e=>{if(e.key==="Escape")setMenu(null);}} className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2 bg-violet-800 px-4 py-2 text-white shadow-sm sm:px-6 lg:h-[52px] lg:flex-nowrap lg:py-0">
      <a href="#/concept/learning" className="flex items-center gap-3"><img className="h-8 w-8" src={`${import.meta.env.BASE_URL}icon.svg?v=basis`} alt=""/><span className="text-lg font-semibold tracking-tight">Clifford <span className="text-violet-200">Algebra</span></span></a>
      <span className="hidden text-sm text-violet-100 xl:inline">{l?"幾何代數學習筆記":"Geometric algebra learning notes"}</span>
      <nav aria-label={l?"主導覽":"Main navigation"} className="order-last flex w-full gap-1 overflow-x-auto lg:order-none lg:ml-auto lg:w-auto">
        {(Object.keys(PAGE_TITLES) as Page[]).map(page=><a key={page} ref={el=>{headerTabs.current[page]=el;}} href={`#/${page}/${subPages(page,lang)[0].id}`} onClick={()=>setMenu(page)} onMouseEnter={()=>setMenu(page)} onFocus={()=>setMenu(page)} aria-expanded={menu===page} aria-controls={`${page}-subpages`} aria-current={route.page===page?"page":undefined} className={`flex h-8 shrink-0 items-center rounded-md px-3 text-sm font-medium ${route.page===page?"bg-white text-violet-800 shadow-sm":"text-violet-100 hover:bg-violet-700"}`}>{PAGE_TITLES[page][l]}</a>)}
      </nav>
      {menu&&menuAt&&<nav ref={menuBox} id={`${menu}-subpages`} aria-label={PAGE_TITLES[menu][l]} style={{left:menuAt.left,top:menuAt.top}} className="fixed z-50 flex min-w-[10rem] max-w-[calc(100vw-1rem)] flex-col pt-1 text-gray-700" data-testid={`${menu}-subpages`}>
        {/* pt-1 keeps the gap under the tab inside the menu, so moving the mouse down does not close it */}
        <div className="flex max-h-[calc(100dvh-4rem)] flex-col overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg">
          {subPages(menu,lang).map(({id,label})=><a key={id} href={`#/${menu}/${id}`} onClick={()=>setMenu(null)} aria-current={route.page===menu&&route.tab===id?"page":undefined} className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ${route.page===menu&&route.tab===id?"bg-violet-50 text-violet-700":"hover:bg-gray-100"}`}>{label}</a>)}
        </div>
      </nav>}
      <select aria-label={l?"語言":"Language"} value={lang} onChange={e=>setLang(e.target.value)} className="ml-auto rounded-md border border-violet-400 bg-violet-800 px-2 py-1 text-xs lg:ml-0"><option value="zh-Hant">繁體中文</option><option value="en">English</option></select>
    </header>
    <main id={route.page==="reading"?"reading-scroll":"concept-scroll"} className="min-h-0 flex-1 overflow-y-auto bg-gray-50/60">
      {route.page==="reading"?(route.tab==="books"?<ReadingPage l={l}/>:<div id="main-content" tabIndex={-1}><SeriesPage kind={route.tab==="labs"?"lab":"explorable"} current="clifford" lang={lang} onOther={()=>{location.hash=route.tab==="labs"?"#/reading/explorables":"#/reading/labs";}}/></div>):<>
        {selected.id==="history"?<HistoryPage l={l} section={route.section}/>:<div className="mx-auto flex max-w-6xl gap-8 px-5 pt-6 pb-10">
          <PageToc scrollRoot="concept-scroll" l={l} items={selected.sections.map((s,i)=>({id:s.id,mark:i+1,label:s.title[l]}))}/>
          <article id="main-content" tabIndex={-1} className="min-w-0 max-w-4xl flex-1 space-y-10" data-testid="lesson-page">
            <header><h1 className="text-3xl font-semibold tracking-tight">{selected.title[l]}</h1><p className="mt-3 text-gray-500">{selected.intro[l]}</p></header>
            {selected.id==="learning"?<LearningSections l={l}/>:selected.id==="foundations"?<FoundationsSections l={l}/>:selected.id==="algebra"?<AlgebraSections l={l}/>:selected.id==="physics"?<PhysicsSections l={l}/>:extendedPages.includes(selected.id)?<ExtendedSections page={selected.id} l={l}/>:<LessonSections sections={selected.sections} l={l}/>}
          </article>
        </div>}
      </>}
    </main>
    <SiteFooter l={l}/>
  </div>;
}
