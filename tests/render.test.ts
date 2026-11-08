import {test} from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createServer} from "vite";
import {createElement} from "react";
import {renderToStaticMarkup} from "react-dom/server";
const structure=JSON.parse(readFileSync(new URL("../src/structure.json",import.meta.url),"utf8"));
test("restored Clifford lessons and the reading catalog render with one global footer",async()=>{
 assert.deepEqual(structure.concept.map(t=>t.id),["learning","foundations","algebra","rotations","models","physics","calculus","limitations","history"]);
 assert.deepEqual(structure.skills.map(t=>t.id),["implementation","transformations","geometry-code","validation","applications","performance"]);
 const routes=[...structure.concept.map(t=>`#/concept/${t.id}`),...structure.skills.map(t=>`#/skills/${t.id}`),"#/reading"];
 const server=await createServer({server:{middlewareMode:true},appType:"custom"});
 try{
  const {default:App}=await server.ssrLoadModule("/src/App.tsx");
  const {parseRoute}=await server.ssrLoadModule("/src/routes.ts");
  assert.deepEqual(parseRoute("#/reading/reading/frontiers"),{page:"concept",tab:"limitations",section:"frontiers"});
  assert.deepEqual(parseRoute("#/concept/foundations/welcome"),{page:"concept",tab:"learning",section:"welcome"});
  assert.deepEqual(parseRoute("#/concept/rotations/motors"),{page:"concept",tab:"models",section:"motors"});
  assert.deepEqual(parseRoute("#/skills/implementation/rotor-code"),{page:"skills",tab:"transformations",section:"rotor-code"});
  for(const lang of ["en","zh-Hant"])for(const hash of routes){
   Object.defineProperty(globalThis,"location",{value:{hash,search:`?lang=${lang}`},configurable:true});
   const html=renderToStaticMarkup(createElement(App));
   assert.equal([...html.matchAll(/<footer\b/g)].length,1,hash);
   assert.ok(html.indexOf('</main>')<html.indexOf('data-testid="site-footer"'),hash);
   assert.ok(html.includes('https://buymeacoffee.com/jackyko1991'),hash);
   assert.ok(html.includes('https://github.com/jackyko1991/clifford/blob/main/LICENSE'),hash);
   if(hash==="#/reading"){
    assert.ok(html.includes('md:grid-cols-2'));
    assert.equal([...html.matchAll(/data-testid="book-/g)].length,14);
    assert.ok(html.includes('sponsored noopener noreferrer'));
    assert.ok(html.includes('reading-disclosure'));
    assert.ok(!html.includes('data-placeholder='));
   }
   if(hash!=="#/reading"){
    const [,page,tab]=hash.split("/");
    const outline=structure[page].find(t=>t.id===tab);
    const cards=JSON.parse(readFileSync(new URL("../src/content.json",import.meta.url),"utf8"));
    for(const section of outline.sections){
     assert.ok(html.includes(`id="${section.id}"`),`missing section ${section.id}`);
     const c=cards.find(c=>c.id===section.id);
     if(c){
      assert.ok(html.includes(`data-lesson="${c.id}"`),`missing existing lesson ${c.id}`);
      assert.ok(html.includes('data-feynman='));
      if(c.diagram)assert.ok(html.includes(`data-diagram="${c.diagram}"`),`missing diagram ${c.id}`);
     }else{
      assert.ok(html.includes('data-placeholder="true"'));
      assert.ok(html.includes(section.summary[lang==="en"?0:1]));
     }
    }
   }
   assert.ok(html.replace(/<[^>]+>/g, "").includes("Clifford Algebra"));
   assert.ok(!html.includes("undefined"),hash);
  }
 }finally{await server.close();delete (globalThis as any).location;}
});
