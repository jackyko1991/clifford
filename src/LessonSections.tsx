import {lessonById,type CurriculumSection} from "./curriculum";
import {sources} from "./sources";
import GeometryFigure from "./components/GeometryFigure";
import CptMirror from "./components/CptMirror";
import MotorMotion from "./components/MotorMotion";
import Tex from "./components/Tex";
import CodeBlock from "./components/CodeBlock";
export default function LessonSections({sections,l,startNumber=0}:{sections:CurriculumSection[];l:number;startNumber?:number}){
 return <>{sections.map((section,i)=>{
 const c=lessonById.get(section.id);
 if(!c)return <section key={section.id} id={section.id} data-placeholder="true" className="scroll-mt-6 rounded-xl border border-dashed border-violet-200 bg-white p-4 sm:p-6">
  <div className="flex flex-wrap items-center gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-800">{i+1+startNumber}</span><h2 className="text-lg font-semibold">{section.title[l]}</h2><span className="rounded-full bg-violet-50 px-2 py-1 text-xs text-violet-700">{l?"待補內容":"Planned lesson"}</span></div>
  <p className="mt-4 text-sm leading-relaxed text-gray-700">{section.summary?.[l]}</p>
  <p className="mt-3 text-sm leading-relaxed text-gray-500"><span className="font-medium text-gray-600">{l?"預計圖解：":"Planned visual: "}</span>{section.visual?.[l]}</p>
 </section>;
 return <section key={c.id} id={c.id} data-lesson={c.id} className="scroll-mt-20 rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
      <h2 className="flex items-baseline gap-3 text-lg font-semibold"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-600 text-sm text-white">{i+1+startNumber}</span>{c.title[l]}</h2>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-gray-700">
       <p data-feynman="plain">{c.plain[l]}</p>
       <div className="space-y-3 rounded-lg border-l-4 border-emerald-300 bg-emerald-50/60 p-3 sm:p-4" data-testid="lesson-example">
        {c.id==="cpt"?<CptMirror l={l}/>:c.id==="motors"?<MotorMotion l={l}/>:c.diagram&&<GeometryFigure key={c.id} kind={c.diagram} l={l}/>}
        <p data-feynman="analogy">{c.analogy[l]}</p>
        <p data-feynman="example">{c.example[l]}</p>
       </div>
       <p data-feynman="precise">{c.precise[l]}</p>
       {c.equation&&<figure className="overflow-hidden rounded-lg border border-violet-100 bg-violet-50/40">
        <div className="px-3 py-2"><Tex tex={c.equation} display/></div>
        <figcaption className="px-4 pb-3 text-xs text-gray-600">{c.legend[l]}</figcaption>
       </figure>}
       {c.code&&<details className="rounded-lg border border-gray-200 p-3"><summary className="cursor-pointer text-xs text-violet-800">{l?"展開程式核對":"Check it in code"}</summary><div className="mt-3"><CodeBlock code={c.code} title={`${c.id.replaceAll("-","_")}.py`}/></div></details>}
       {c.sources.length>0&&<details className="rounded-lg border border-gray-100 bg-gray-50/50 p-3"><summary className="cursor-pointer text-xs font-medium text-violet-800">{l?"來源與延伸閱讀":"Sources and further reading"} ({c.sources.length})</summary><ul className="mt-3 space-y-3">{c.sources.map(id=><li key={id}><a href={sources[id].url} target="_blank" rel="noreferrer" className="text-violet-700 underline underline-offset-2">{sources[id].title} ↗</a><p className="mt-1 text-xs text-gray-500">{sources[id].note}</p></li>)}</ul></details>}
      </div>
     </section>;})}</>;
}
