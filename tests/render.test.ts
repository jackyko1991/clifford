import {test} from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createServer} from "vite";
import {createElement} from "react";
import {renderToStaticMarkup} from "react-dom/server";
const structure=JSON.parse(readFileSync(new URL("../src/structure.json",import.meta.url),"utf8"));
test("all placeholder tabs and the reading catalog render with one global footer",async()=>{
 assert.deepEqual(structure.concept.map(t=>t.id),["laws","feynman","maths","dataflow","limitations","history"]);
 assert.deepEqual(structure.skills.map(t=>t.id),["techniques","loops","blas","nvlink","cpuml"]);
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
   assert.ok(!html.includes('data-diagram='),"draft animations must not render");
   assert.ok(!html.includes('data-feynman='),"draft teaching content must not render");
   if(hash==="#/reading"){
    assert.ok(html.includes('md:grid-cols-2'));
    assert.equal([...html.matchAll(/data-testid="book-/g)].length,14);
    assert.ok(html.includes('sponsored noopener noreferrer'));
    assert.ok(html.includes('reading-disclosure'));
    assert.ok(!html.includes('data-placeholder='));
   }else assert.ok(html.includes('data-placeholder="true"'),hash);
   assert.ok(!html.includes("undefined"),hash);
  }
 }finally{await server.close();delete (globalThis as any).location;}
});
