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

const timeline=JSON.parse(readFileSync(new URL("../src/history.json",import.meta.url),"utf8"));
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
 for(const c of cards)assert.equal(sections.filter(s=>s.id===c.id).length,c.id==="people"?0:1,`missing or duplicate ${c.id}`);
 for(const p of pages){
  assert.ok(p.intro[0]&&p.intro[1],p.id);
  for(const s of p.sections)if(!cards.some(c=>c.id===s.id)&&!timeline.events.some(c=>c.id===s.id)){
   assert.ok(s.summary[0]&&s.summary[1],`${s.id}: learning question`);
   assert.ok(s.visual[0]&&s.visual[1],`${s.id}: visual plan`);
  }
 }
 for(const b of books){
  const [page,tab]=b.related.split("/");
  assert.ok(outline[page].some(p=>p.id===tab),`broken reading link ${b.id}`);
 }
});

test("history milestones have bilingual text, valid mathematics and source links",async()=>{
 const {default:katex}=await import("katex");
 const outline=JSON.parse(readFileSync(new URL("../src/structure.json",import.meta.url),"utf8"));
 const history=outline.concept.find(p=>p.id==="history");
 assert.equal(timeline.events.length,10);
 assert.deepEqual(timeline.eras.map(e=>e.id),[1,2,3]);
 for(const c of timeline.events){
  assert.ok(c.title[0]&&c.title[1]&&c.caption[0]&&c.caption[1],c.id);
  for(const p of c.paragraphs)assert.ok(p[0]&&p[1],c.id);
  assert.ok(c.sources.length>0,c.id);
  for(const s of c.sources)assert.equal(new URL(s.url).protocol,"https:",c.id);
  if(c.equation)assert.doesNotThrow(()=>katex.renderToString(c.equation,{throwOnError:true}),c.id);
  assert.equal(history.sections.filter(s=>s.id===c.id).length,1,c.id);
  const [page,tab,section]=c.related.split("/");
  const target=outline[page].find(p=>p.id===tab);
  assert.ok(target?.sections.some(s=>s.id===section),`broken history link ${c.id}`);
 }
});

test("history photos are local, credited and use the recorded reuse terms",()=>{
 const credits=readFileSync(new URL("../public/history/CREDITS.md",import.meta.url),"utf8");
 assert.equal(timeline.events.filter(c=>c.photo).length,7);
 assert.equal(new Set(timeline.events.filter(c=>c.photo).map(c=>c.photo.file)).size,7,"do not repeat the same history image");
 for(const c of timeline.events)if(c.photo){
  const p=c.photo;
  assert.ok(readFileSync(new URL(`../public/history/${p.file}`,import.meta.url)).length>1000,p.file);
  assert.ok(p.author&&p.source&&p.license&&p.licenseUrl,c.id);
  assert.ok(credits.includes(p.file),p.file);
  assert.ok(["Public domain","CC0 1.0","CC BY-SA 4.0"].includes(p.license),p.file);
 }
});

test("the textbook card has two identified portraits in one split image",()=>{
 const card=timeline.events.find(c=>c.id==="physics-textbook");
 assert.equal(card.portraits.sources.length,2);
 assert.deepEqual(card.portraits.sources.map(s=>s.name),["Chris Doran","Anthony Lasenby"]);
 const svg=readFileSync(new URL(`../public/history/${card.portraits.file}`,import.meta.url),"utf8");
 assert.equal([...svg.matchAll(/<image /g)].length,2);
 for(const source of card.portraits.sources){
  assert.equal(new URL(source.url).protocol,"https:");
  assert.ok(readFileSync(new URL(`../public/history/${source.file}`,import.meta.url)).length>1000);
 }
});

test("the graphics book card shows its three correctly named authors",()=>{
 const card=timeline.events.find(c=>c.id==="graphics");
 assert.deepEqual(card.portraits.sources.map(s=>s.name),["Leo Dorst","Daniel Fontijne","Stephen Mann"]);
 const svg=readFileSync(new URL(`../public/history/${card.portraits.file}`,import.meta.url),"utf8");
 assert.equal([...svg.matchAll(/<image /g)].length,3);
 for(const source of card.portraits.sources){
  assert.equal(source.url,"https://geometricalgebra.org/authors.html");
  assert.ok(readFileSync(new URL(`../public/history/${source.file}`,import.meta.url)).length>1000);
 }
});
