import {test} from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createServer} from "vite";
import {createElement} from "react";
import {renderToStaticMarkup} from "react-dom/server";
const structure=JSON.parse(readFileSync(new URL("../src/structure.json",import.meta.url),"utf8"));
test("restored Clifford lessons and the reading catalog render with one global footer",async()=>{
 assert.deepEqual(structure.concept.map(t=>t.id),["foundations","rotations","physics"]);
 assert.deepEqual(structure.skills.map(t=>t.id),["implementation","applications"]);
 const routes=[...structure.concept.map(t=>`#/concept/${t.id}`),...structure.skills.map(t=>`#/skills/${t.id}`),"#/reading"];
 const server=await createServer({server:{middlewareMode:true},appType:"custom"});
 try{
  const {default:App}=await server.ssrLoadModule("/src/App.tsx");
  for(const lang of ["en","zh-Hant"])for(const hash of routes){
   Object.defineProperty(globalThis,"location",{value:{hash,search:`?lang=${lang}`},configurable:true});
   const html=renderToStaticMarkup(createElement(App));
   assert.equal([...html.matchAll(/<footer\b/g)].length,1,hash);
   assert.ok(html.indexOf('</main>')<html.indexOf('data-testid="site-footer"'),hash);
   assert.ok(html.includes('https://buymeacoffee.com/jackyko1991'),hash);
   assert.ok(html.includes('https://github.com/jackyko1991/clifford/blob/main/LICENSE'),hash);
   assert.ok(html.includes('data-diagram='),"existing diagrams must remain visible");
   assert.ok(html.includes('data-feynman='),"existing explanations must remain visible");
   if(hash==="#/reading"){
    assert.ok(html.includes('md:grid-cols-2'));
    assert.equal([...html.matchAll(/data-testid="book-/g)].length,14);
    assert.ok(html.includes('sponsored noopener noreferrer'));
    assert.ok(html.includes('reading-disclosure'));
    assert.ok(!html.includes('data-placeholder='));
   }
   assert.ok(!html.includes('data-placeholder="true"'),hash);
   const group=hash==="#/reading"?"reading":hash.split("/")[2];
   const cards=JSON.parse(readFileSync(new URL("../src/content.json",import.meta.url),"utf8"));
   for(const c of cards.filter(c=>c.group===group))assert.ok(html.includes(`id="${c.id}"`),`missing lesson ${c.id}`);
   assert.ok(html.replace(/<[^>]+>/g, "").includes("Clifford Algebra"));
   assert.ok(!html.includes("undefined"),hash);
  }
 }finally{await server.close();delete (globalThis as any).location;}
});
