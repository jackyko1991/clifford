import {structure} from "./curriculum";
export {structure};
export type Page = "concept" | "skills" | "reading";
export interface Route { page: Page; tab: string; section: string | null; }
export function parseRoute(hash: string): Route {
  const [p, requested, section] = hash.replace(/^#\/?/, "").split("/");
  if (p === "reading") {
    // The former reading-guide lessons now live in their relevant topic pages.
    if(section)for(const page of ["concept","skills"] as const){
      const moved=structure[page].find(t=>t.sections.some(s=>s.id===section));
      if(moved)return {page,tab:moved.id,section};
    }
    // Further reading has three tabs; #/reading and the older #/reading/<group> links open Books & papers.
    if(requested==="labs"||requested==="explorables")return {page:"reading",tab:requested,section:null};
    return {page:"reading",tab:"books",section:(requested==="books"?section:requested)||null};
  }
  const page = p === "skills" ? "skills" : "concept";
  // Retain bookmarks from both earlier Clifford layouts.
  const aliases:Record<string,string> = {laws:"physics",feynman:"learning",maths:"foundations",dataflow:"implementation",techniques:"implementation",loops:"implementation",blas:"performance",nvlink:"performance",cpuml:"applications"};
  const candidate = aliases[requested] || requested;
  const historyAliases:Record<string,string>={people:"grassmann","hamilton-grassmann":"hamilton","clifford-dirac":"clifford-product","modern-ga":"physics-textbook"};
  const target=candidate==="history"&&section?(historyAliases[section]||section):section;
  const moved = target && structure[page].find(t=>t.sections.some(s=>s.id===target));
  const tab = moved ? moved.id : structure[page].some(t=>t.id===candidate) ? candidate : structure[page][0].id;
  return {page,tab,section:target || null};
}
