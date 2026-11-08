import outline from "./structure.json";
import lessons from "./content.json";
import {historyEvents} from "./history";
export interface CurriculumSection {id:string;title:string[];summary?:string[];visual?:string[];}
export interface CurriculumPage {id:string;title:string[];intro:string[];sections:CurriculumSection[];}
export const structure:Record<"concept"|"skills",CurriculumPage[]>=outline;
export const lessonById=new Map(lessons.map(c=>[c.id,c]));
export const learningSections=new Set(outline.concept.find(p=>p.id==="learning")!.sections.map(s=>s.id));
export const foundationSections=new Set(outline.concept.find(p=>p.id==="foundations")!.sections.map(s=>s.id));
export const algebraSections=new Set(outline.concept.find(p=>p.id==="algebra")!.sections.map(s=>s.id));
export const extendedSections=new Set(outline.concept.filter(p=>["rotations","models","calculus","limitations"].includes(p.id)).flatMap(p=>p.sections.map(s=>s.id)));
export function existingCount(sections:CurriculumSection[]){return sections.filter(s=>extendedSections.has(s.id)||algebraSections.has(s.id)||foundationSections.has(s.id)||learningSections.has(s.id)||lessonById.has(s.id)||historyEvents.some(c=>c.id===s.id)).length;}
