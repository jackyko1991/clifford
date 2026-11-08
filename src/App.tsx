import {useEffect,useState} from "react";
import lessons from "./content.json";
import {sources} from "./sources";
import GeometryFigure from "./components/GeometryFigure";
import Tex from "./components/Tex";
import CodeBlock from "./components/CodeBlock";
const groups={concept:["foundations","rotations","physics"],skills:["implementation","applications"],reading:["reading"]} as const;
type Page=keyof typeof groups;
const titles:Record<string,string[]>={concept:["Concepts","概念"],skills:["Coding Skills","程式技巧"],reading:["Extended Reading","延伸閱讀"],foundations:["Foundations","基礎"],rotations:["Rotations & spinors","旋轉與旋量"],physics:["Spacetime & fields","時空與場"],implementation:["Algebra in code","代數實作"],applications:["Geometric learning","幾何學習"]};
function route(){const [p,g,id]=location.hash.replace(/^#\/?/,"").split("/");const page:Page=p in groups?p as Page:"concept";return {page,group:(groups[page] as readonly string[]).includes(g)?g:groups[page][0],id};}
export default function App(){
 const [r,setRoute]=useState(route),[lang,setLang]=useState(()=>new URLSearchParams(location.search).get("lang")==="en"?"en":"zh-Hant"),[active,setActive]=useState("");
 const l=lang==="en"?0:1,visible=lessons.filter(c=>c.group===r.group);
 useEffect(()=>{const h=()=>setRoute(route());window.addEventListener("hashchange",h);return()=>window.removeEventListener("hashchange",h);},[]);
 useEffect(()=>{document.documentElement.lang=lang;document.title=l?"Clifford · 幾何代數":"Clifford · Geometric Algebra";const u=new URL(location.href);u.searchParams.set("lang",lang);history.replaceState(null,"",u);},[lang,l]);
 useEffect(()=>{setActive(r.id||visible[0]?.id);const target=r.id&&document.getElementById(r.id);if(target)target.scrollIntoView({block:"start"});else document.getElementById("concept-scroll")?.scrollTo({top:0});},[r.page,r.group,r.id]);
 useEffect(()=>{const root=document.getElementById("concept-scroll"),seen=new Set<string>();const ob=new IntersectionObserver(es=>{for(const e of es)e.isIntersecting?seen.add(e.target.id):seen.delete(e.target.id);const first=visible.find(c=>seen.has(c.id));if(first)setActive(first.id);},{root,rootMargin:"0px 0px -55% 0px"});visible.forEach(c=>{const el=document.getElementById(c.id);if(el)ob.observe(el);});return()=>ob.disconnect();},[r.group]);
 return <div className="flex h-dvh flex-col bg-white">
  <a className="skip" href="#main-content" onClick={e=>{e.preventDefault();document.getElementById("main-content")?.focus();}}>{l?"跳到內容":"Skip to content"}</a>
  <header className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2 bg-violet-800 px-4 py-2 text-white shadow-sm sm:px-6 lg:h-[52px] lg:flex-nowrap lg:py-0">
   <a href="#/concept/foundations" className="flex items-center gap-3"><img className="h-8 w-8" src={`${import.meta.env.BASE_URL}icon.svg`} alt=""/><span className="text-lg font-semibold tracking-tight">Cliff<span className="text-violet-200">ord</span></span></a>
   <span className="hidden text-sm text-violet-100 xl:inline">{l?"從幾何直覺，走向旋量與時空":"From geometric intuition to spinors and spacetime"}</span>
   <nav aria-label={l?"主導覽":"Main navigation"} className="order-last flex w-full gap-1 overflow-x-auto lg:order-none lg:ml-auto lg:w-auto">
    {(Object.keys(groups) as Page[]).map(p=><a key={p} href={`#/${p}/${groups[p][0]}`} aria-current={r.page===p?"page":undefined} className={`flex h-8 shrink-0 items-center rounded-md px-3 text-sm font-medium ${r.page===p?"bg-white text-violet-800 shadow-sm":"text-violet-100 hover:bg-violet-700"}`}>{titles[p][l]}</a>)}
   </nav>
   <select aria-label={l?"語言":"Language"} value={lang} onChange={e=>setLang(e.target.value)} className="ml-auto rounded-md border border-violet-400 bg-violet-800 px-2 py-1 text-xs lg:ml-0"><option value="zh-Hant">繁體中文</option><option value="en">English</option></select>
  </header>
  <main id="concept-scroll" className="min-h-0 flex-1 overflow-y-auto bg-gray-50/60">
   <div className="mx-auto max-w-6xl px-5 pt-6"><nav aria-label={l?"主題":"Topics"} className="flex gap-1 overflow-x-auto border-b border-gray-200">
    {groups[r.page].map(g=><a key={g} href={`#/${r.page}/${g}`} aria-current={r.group===g?"page":undefined} className={`shrink-0 border-b-2 px-4 py-2 text-sm font-medium ${r.group===g?"border-violet-600 text-violet-800":"border-transparent text-gray-500 hover:text-gray-800"}`}>{titles[g]?.[l]||titles.reading[l]}</a>)}
   </nav></div>
   <div className="mx-auto flex max-w-6xl gap-8 px-5 pt-6 pb-10">
    <aside className="sticky top-6 hidden w-56 shrink-0 self-start lg:block"><p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-gray-500">{l?"本頁內容":"On this page"}</p><nav aria-label={l?"本頁內容":"On this page"}><ol className="space-y-1 border-l border-gray-200 text-sm">{visible.map((c,i)=><li key={c.id}><a href={`#/${r.page}/${r.group}/${c.id}`} aria-current={active===c.id?"location":undefined} className={`-ml-px flex items-baseline gap-2 border-l-2 px-3 py-1 ${active===c.id?"border-violet-600 font-medium text-violet-800":"border-transparent text-gray-600 hover:text-gray-900"}`}><span className="w-4 shrink-0 text-xs text-gray-400">{i+1}</span>{c.title[l]}</a></li>)}</ol></nav>
     <a className="mt-6 block px-3 text-xs text-violet-700 hover:underline" href="https://jackyko1991.github.io/tensorizer/?lang=zh-Hant#/concept/limitations" target="_blank" rel="noreferrer">← Tensorizer</a>
     <a className="mt-2 block px-3 text-xs text-violet-700 hover:underline" href="https://github.com/jackyko1991/clifford" target="_blank" rel="noreferrer">GitHub ↗</a>
    </aside>
    <article id="main-content" className="min-w-0 max-w-4xl flex-1 space-y-10" tabIndex={-1}>
     <header><p className="text-sm font-medium text-violet-700">{titles[r.page][l]} · {l?"圖解 → 方程 → 程式":"Picture → equation → code"}</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">{titles[r.group]?.[l]||titles.reading[l]}</h1>
      <p className="mt-3 leading-relaxed text-gray-600">{l?"把分散的工具連起來：以定向幾何理解乘法、旋轉與物理。":"Connect familiar tools through oriented geometry: multiplication, rotations and physics."}</p>
      <p className="mt-4 rounded-lg border border-violet-100 bg-violet-50/60 px-4 py-3 text-sm leading-relaxed text-violet-950">{l?"不必一次學完。先操作圖解，說出你看見的關係，再讓公式與程式把直覺變精確。":"Take one relationship at a time. Explore the diagram, explain what you see, then use the equation and code to make it precise."}</p>
     </header>
     {visible.map((c,i)=><section key={c.id} id={c.id} className="scroll-mt-6 rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
      <h2 className="flex items-baseline gap-3 text-lg font-semibold"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-600 text-sm text-white">{i+1}</span>{c.title[l]}</h2>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-gray-700">
       <p>{c.paragraphs[l][0]}</p>
       {c.diagram&&<GeometryFigure key={c.id} kind={c.diagram} l={l}/>}
       {c.equation&&<div className="rounded-lg bg-gray-50 px-2 py-2"><Tex tex={c.equation} display/></div>}
       {c.paragraphs[l].slice(1).map((p,j)=><p key={j}>{p}</p>)}
       {c.code&&<CodeBlock code={c.code} title={`${c.id.replaceAll("-","_")}.py`}/>}
       {c.sources.length>0&&<details className="rounded-lg border border-gray-100 bg-gray-50/50 p-3"><summary className="cursor-pointer text-xs font-medium text-violet-800">{l?"來源與延伸閱讀":"Sources and further reading"} ({c.sources.length})</summary><ul className="mt-3 space-y-3">{c.sources.map(id=><li key={id}><a href={sources[id].url} target="_blank" rel="noreferrer" className="text-violet-700 underline underline-offset-2">{sources[id].title} ↗</a><p className="mt-1 text-xs text-gray-500">{sources[id].note}</p></li>)}</ul></details>}
      </div>
     </section>)}
     <footer className="flex flex-wrap justify-between gap-3 border-t border-gray-200 pt-6 text-xs text-gray-500"><span>Clifford · Apache-2.0</span><span>{l?"幾何直覺，配上可檢驗的代數。":"Geometric intuition, backed by checkable algebra."}</span></footer>
    </article>
   </div>
  </main>
 </div>;
}
