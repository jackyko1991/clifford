import {test} from "node:test";
import assert from "node:assert/strict";
import {createServer} from "vite";
import {createElement} from "react";
import {renderToStaticMarkup} from "react-dom/server";

test("all pages render in both languages with valid diagrams, formulas and sources",async()=>{
 const server=await createServer({server:{middlewareMode:true},appType:"custom"});
 try{
  const {default:App}=await server.ssrLoadModule("/src/App.tsx");
  for(const lang of ["en","zh-Hant"]) for(const hash of ["#/concept/foundations","#/concept/rotations","#/concept/physics","#/skills/implementation","#/skills/applications","#/reading/reading"]){
   Object.defineProperty(globalThis,"location",{value:{hash,search:`?lang=${lang}`},configurable:true});
   const html=renderToStaticMarkup(createElement(App));
   assert.ok(html.includes("main-content"),hash);
   assert.ok(html.includes('data-diagram='),hash);
   assert.ok(!html.includes("katex-error"),hash);
   assert.ok(!html.includes("undefined"),hash);
  }
 }finally{await server.close();delete (globalThis as any).location;}
});
