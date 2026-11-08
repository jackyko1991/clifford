import {test} from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const books=JSON.parse(readFileSync(new URL("../src/reading.json",import.meta.url),"utf8"));
test("reading metadata has valid external links and book ISBNs",()=>{
 for(const b of books){
  assert.equal(new URL(b.href).protocol,"https:");
  if(b.free)assert.equal(new URL(b.free).protocol,"https:");
  assert.ok(b.authors&&b.publication&&b.why[0]&&b.why[1],b.id);
  if(b.isbn10){const sum=[...b.isbn10].reduce((s,c,i)=>s+(10-i)*(c==="X"?10:Number(c)),0);assert.equal(sum%11,0,b.id);}
 }
});

const cards=JSON.parse(readFileSync(new URL("../src/content.json",import.meta.url),"utf8"));
test("all 23 existing lessons retain bilingual explanations and valid equations",async()=>{
 const {default:katex}=await import("katex");
 assert.equal(cards.length,23);
 assert.equal(new Set(cards.map(c=>c.id)).size,23);
 for(const c of cards){
  for(const step of ["plain","analogy","precise","example"])assert.ok(c[step][0]&&c[step][1],`${c.id}: ${step}`);
  if(c.equation)assert.doesNotThrow(()=>katex.renderToString(c.equation,{throwOnError:true}),c.id);
 }
});

test("the curriculum places every existing lesson exactly once and describes every gap",()=>{
 const outline=JSON.parse(readFileSync(new URL("../src/structure.json",import.meta.url),"utf8"));
 const pages=[...outline.concept,...outline.skills];
 const sections=pages.flatMap(p=>p.sections);
 assert.equal(new Set(sections.map(s=>s.id)).size,sections.length,"section anchors must be unique");
 for(const c of cards)assert.equal(sections.filter(s=>s.id===c.id).length,1,`missing or duplicate ${c.id}`);
 for(const p of pages){
  assert.ok(p.intro[0]&&p.intro[1],p.id);
  for(const s of p.sections)if(!cards.some(c=>c.id===s.id)){
   assert.ok(s.summary[0]&&s.summary[1],`${s.id}: learning question`);
   assert.ok(s.visual[0]&&s.visual[1],`${s.id}: visual plan`);
  }
 }
 for(const b of books){
  const [page,tab]=b.related.split("/");
  assert.ok(outline[page].some(p=>p.id===tab),`broken reading link ${b.id}`);
 }
});
