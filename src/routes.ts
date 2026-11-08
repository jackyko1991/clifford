import structure from "./structure.json";
export {structure};
export type Page = "concept" | "skills" | "reading";
export interface Route { page: Page; tab: string; section: string | null; }
export function parseRoute(hash: string): Route {
  const [p, requested, section] = hash.replace(/^#\/?/, "").split("/");
  if (p === "reading") return {page:"reading",tab:requested || "",section:null};
  const page = p === "skills" ? "skills" : "concept";
  const aliases:Record<string,string> = {laws:"physics",feynman:"foundations",maths:"foundations",dataflow:"foundations",limitations:"physics",history:"foundations",techniques:"implementation",loops:"implementation",blas:"implementation",nvlink:"applications",cpuml:"applications"};
  const candidate = aliases[requested] || requested;
  const tab = structure[page].some(t=>t.id===candidate) ? candidate : structure[page][0].id;
  return {page,tab,section:section || null};
}
