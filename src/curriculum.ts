import outline from "./structure.json";
import lessons from "./content.json";
import {historyEvents} from "./history";
export interface CurriculumSection {id:string;title:string[];summary?:string[];visual?:string[];}
export interface CurriculumPage {id:string;title:string[];intro:string[];sections:CurriculumSection[];}
export const structure:Record<"concept"|"skills",CurriculumPage[]>=outline;
export const lessonById=new Map(lessons.map(c=>[c.id,c]));
export const learningSections=new Set(outline.concept.find(p=>p.id==="learning")!.sections.map(s=>s.id));
export function existingCount(sections:CurriculumSection[]){return sections.filter(s=>learningSections.has(s.id)||lessonById.has(s.id)||historyEvents.some(c=>c.id===s.id)).length;}
