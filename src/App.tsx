import {useEffect,useState} from "react";
import {parseRoute,structure,type Page} from "./routes";
import ReadingPage,{READING_GROUPS} from "./ReadingPage";
import PageToc from "./components/PageToc";
import SiteFooter from "./components/SiteFooter";
import LessonSections from "./LessonSections";
import {existingCount} from "./curriculum";
const PAGE_TITLES:Record<Page,string[]>={concept:["Concepts","概念"],skills:["Coding Skills","程式技巧"],reading:["Extended Reading","延伸閱讀"]};
export default function App(){
  const [route,setRoute]=useState(()=>parseRoute(location.hash));
  const [lang,setLang]=useState(()=>new URLSearchParams(location.search).get("lang")==="en"?"en":"zh-Hant");
  const l=lang==="en"?0:1;
  const tabs=route.page==="reading"?[]:structure[route.page];
  const selected=tabs.find(t=>t.id===route.tab)||tabs[0];
  useEffect(()=>{const onHash=()=>setRoute(parseRoute(location.hash));window.addEventListener("hashchange",onHash);return()=>window.removeEventListener("hashchange",onHash);},[]);
  useEffect(()=>{
    document.documentElement.lang=lang;document.title="Clifford Algebra";
    const url=new URL(location.href);url.searchParams.set("lang",lang);history.replaceState(null,"",url);
  },[lang,l]);
  useEffect(()=>{
    const target=route.page==="reading"?(READING_GROUPS.some(g=>g.id===route.tab)?`reading-${route.tab}`:null):(route.section?route.section:null);
    if(target&&document.getElementById(target))document.getElementById(target)?.scrollIntoView({block:"start"});
    else document.getElementById(route.page==="reading"?"reading-scroll":"concept-scroll")?.scrollTo({top:0});
    const bar=document.querySelector<HTMLElement>("[data-testid=page-tabs]");
    const active=bar?.querySelector<HTMLElement>("[aria-current=page]");
    if(bar&&active)bar.scrollLeft=Math.max(0,active.offsetLeft-bar.offsetLeft-(bar.clientWidth-active.offsetWidth)/2);
  },[route.page,route.tab,route.section]);
  return <div className="flex h-dvh flex-col overflow-hidden bg-white">
    <a className="skip" href="#main-content" onClick={e=>{e.preventDefault();document.getElementById("main-content")?.focus();}}>{l?"跳到內容":"Skip to content"}</a>
    <header className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2 bg-violet-800 px-4 py-2 text-white shadow-sm sm:px-6 lg:h-[52px] lg:flex-nowrap lg:py-0">
      <a href="#/concept/learning" className="flex items-center gap-3"><img className="h-8 w-8" src={`${import.meta.env.BASE_URL}icon.svg?v=basis`} alt=""/><span className="text-lg font-semibold tracking-tight">Cliff<span className="text-violet-200">ord Algebra</span></span></a>
      <span className="hidden text-sm text-violet-100 xl:inline">{l?"幾何代數學習筆記":"Geometric algebra learning notes"}</span>
      <nav aria-label={l?"主導覽":"Main navigation"} className="order-last flex w-full gap-1 overflow-x-auto lg:order-none lg:ml-auto lg:w-auto">
        {(Object.keys(PAGE_TITLES) as Page[]).map(page=><a key={page} href={page==="reading"?"#/reading":`#/${page}/${structure[page][0].id}`} aria-current={route.page===page?"page":undefined} className={`flex h-8 shrink-0 items-center rounded-md px-3 text-sm font-medium ${route.page===page?"bg-white text-violet-800 shadow-sm":"text-violet-100 hover:bg-violet-700"}`}>{PAGE_TITLES[page][l]}</a>)}
      </nav>
      <select aria-label={l?"語言":"Language"} value={lang} onChange={e=>setLang(e.target.value)} className="ml-auto rounded-md border border-violet-400 bg-violet-800 px-2 py-1 text-xs lg:ml-0"><option value="zh-Hant">繁體中文</option><option value="en">English</option></select>
    </header>
    <main id={route.page==="reading"?"reading-scroll":"concept-scroll"} className="min-h-0 flex-1 overflow-y-auto bg-gray-50/60">
      {route.page==="reading"?<ReadingPage l={l}/>:<>
        <div className="sticky top-0 z-20 bg-gray-50/95 backdrop-blur"><div className="mx-auto max-w-6xl px-5 pt-3"><nav aria-label={l?"主題":"Topics"} data-testid="page-tabs" className="flex gap-1 overflow-x-auto border-b border-gray-200">
          {tabs.map(tab=><a key={tab.id} href={`#/${route.page}/${tab.id}`} aria-current={route.tab===tab.id?"page":undefined} className={`shrink-0 whitespace-nowrap border-b-2 px-4 py-2 text-sm font-medium ${route.tab===tab.id?"border-violet-600 text-violet-800":"border-transparent text-gray-500 hover:text-gray-800"}`}>{tab.title[l]}</a>)}
        </nav></div></div>
        <div className="mx-auto flex max-w-6xl gap-8 px-5 pt-6 pb-10">
          <PageToc scrollRoot="concept-scroll" l={l} items={selected.sections.map((s,i)=>({id:s.id,mark:i+1,label:s.title[l]}))}/>
          <article id="main-content" tabIndex={-1} className="min-w-0 max-w-4xl flex-1 space-y-10" data-testid="lesson-page">
            <header><p className="text-sm font-medium text-violet-700">{PAGE_TITLES[route.page][l]}</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">{selected.title[l]}</h1><p className="mt-3 text-gray-500">{selected.intro[l]}</p><p className="mt-3 text-xs text-gray-500">{l?`已有 ${existingCount(selected.sections)} 節內容 · ${selected.sections.length-existingCount(selected.sections)} 節待補`:`${existingCount(selected.sections)} existing lessons · ${selected.sections.length-existingCount(selected.sections)} planned`}</p></header>
            <LessonSections sections={selected.sections} l={l}/>
          </article>
        </div>
      </>}
    </main>
    <SiteFooter l={l}/>
  </div>;
}
