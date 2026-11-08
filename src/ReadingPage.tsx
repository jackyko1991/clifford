import resources from "./reading.json";
import {structure} from "./routes";
import PageToc from "./components/PageToc";
export const READING_GROUPS = [
  {id:"foundations",title:["Geometric algebra foundations","幾何代數基礎"]},
  {id:"spacetime",title:["Spinors, spacetime and fields","旋量、時空與場"]},
  {id:"computing",title:["Code and geometric learning","程式與幾何學習"]},
  {id:"history",title:["History and original sources","歷史與原始文獻"]},
];
export const AMAZON_TAG = "tensorizer-21";
export const amazonUrl = (isbn:string) => `https://www.amazon.co.uk/dp/${isbn}?tag=${AMAZON_TAG}`;
interface Resource {
  id:string;group:string;title:string;authors:string;publication:string;why:string[];href:string;related:string;
  top?:boolean;isbn10?:string;free?:string;freeLabel?:string[];
}
export default function ReadingPage({l}:{l:number}) {
  return <div className="mx-auto flex max-w-6xl gap-8 px-5 pt-6 pb-10">
    <PageToc scrollRoot="reading-scroll" l={l} items={READING_GROUPS.map((g,i)=>({id:`reading-${g.id}`,mark:i+1,label:g.title[l]}))}/>
    <article id="main-content" tabIndex={-1} className="min-w-0 max-w-4xl flex-1 space-y-10" data-testid="reading-concept">
      <header><p className="text-sm font-medium text-violet-700">{l?"延伸閱讀":"Extended Reading"}</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">{l?"書籍、講義與原始論文":"Books, notes and original papers"}</h1>
        <p className="mt-3 text-gray-600">{l?"依主題整理的幾何代數資料：先看教材與導讀，再按需要閱讀物理、程式與原始文獻。":"Geometric algebra resources grouped by topic: begin with a textbook or introduction, then follow physics, coding and original sources as needed."}</p>
      </header>
      {READING_GROUPS.map((g,i)=><section key={g.id} id={`reading-${g.id}`} className="scroll-mt-6">
        <h2 className="flex flex-wrap items-baseline gap-3 text-lg font-semibold"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-600 text-sm text-white">{i+1}</span>{g.title[l]}</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">{(resources as Resource[]).filter(b=>b.group===g.id).map(b=><ResourceCard key={b.id} book={b} l={l}/>)}</div>
      </section>)}
      <p className="border-t border-gray-200 pt-3 text-center text-xs text-gray-400" data-testid="reading-disclosure">{l?"書籍連結指向 Amazon 英國。作為 Amazon 合作夥伴，我會從符合資格的購買中賺取收益。":"Book links point to Amazon UK. As an Amazon Associate I earn from qualifying purchases."}</p>
    </article>
  </div>;
}
function ResourceCard({book:b,l}:{book:Resource;l:number}) {
  const [page,tab]=b.related.split("/");
  const related=structure[page as "concept"|"skills"].find(t=>t.id===tab);
  return <div className={`flex flex-col rounded-xl border bg-white p-4 sm:p-5 ${b.top?"border-amber-300":"border-gray-200"}`} data-testid={`book-${b.id}`}>
    {b.top&&<span className="mb-2 self-start rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800 ring-1 ring-amber-200">★ {l?"優先閱讀":"Start here"}</span>}
    <h3 className="font-semibold leading-snug text-gray-900" lang="en">{b.title}</h3>
    <p className="mt-1 text-sm text-gray-600" lang="en">{b.authors}</p>
    <p className="text-xs text-gray-500" lang="en">{b.publication}</p>
    <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-700">{b.why[l]}</p>
    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
      <a href={b.free||b.href} target="_blank" rel="noopener noreferrer" className="font-medium text-violet-700 hover:underline">{b.freeLabel?.[l]||(l?"免費閱讀":"Read free")} ↗</a>
      {b.isbn10&&<a href={amazonUrl(b.isbn10)} target="_blank" rel="sponsored noopener noreferrer" className="text-gray-500 hover:text-violet-700 hover:underline">Amazon UK ↗</a>}
    </div>
    <p className="mt-3 border-t border-gray-100 pt-2 text-xs text-gray-500">{l?"本網站對應：":"On this site: "}<a href={`#/${b.related}`} className="font-medium text-violet-700 hover:underline">{related?.title[l]}</a></p>
  </div>;
}
