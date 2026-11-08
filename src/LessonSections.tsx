import lessons from "./content.json";
import {sources} from "./sources";
import GeometryFigure from "./components/GeometryFigure";
import Tex from "./components/Tex";
import CodeBlock from "./components/CodeBlock";
import TeachingBlock, {TEACHING_STEPS} from "./components/TeachingBlock";
export default function LessonSections({group,l}:{group:string;l:number}){
 const visible=lessons.filter(c=>c.group===group);
 return <>{visible.map((c,i)=><section key={c.id} id={c.id} className="scroll-mt-6 rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
      <h2 className="flex items-baseline gap-3 text-lg font-semibold"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-600 text-sm text-white">{i+1}</span>{c.title[l]}</h2>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-gray-700">
       {TEACHING_STEPS.map(step=><div key={step} className="space-y-4">
        <TeachingBlock kind={step} text={c[step][l]} l={l}/>
        {step==="analogy"&&c.diagram&&<GeometryFigure key={c.id} kind={c.diagram} l={l}/>}
        {step==="example"&&c.equation&&<figure className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
         <figcaption className="px-4 pt-3 text-sm text-gray-600">{c.legend[l]}</figcaption>
         <div className="px-3 py-2"><Tex tex={c.equation} display/></div>
        </figure>}
        {step==="example"&&c.code&&<CodeBlock code={c.code} title={`${c.id.replaceAll("-","_")}.py`}/>}
       </div>)}
       {c.sources.length>0&&<details className="rounded-lg border border-gray-100 bg-gray-50/50 p-3"><summary className="cursor-pointer text-xs font-medium text-violet-800">{l?"來源與延伸閱讀":"Sources and further reading"} ({c.sources.length})</summary><ul className="mt-3 space-y-3">{c.sources.map(id=><li key={id}><a href={sources[id].url} target="_blank" rel="noreferrer" className="text-violet-700 underline underline-offset-2">{sources[id].title} ↗</a><p className="mt-1 text-xs text-gray-500">{sources[id].note}</p></li>)}</ul></details>}
      </div>
     </section>)}</>;
}
