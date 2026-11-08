import {test} from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import katex from "katex";
const cards=JSON.parse(readFileSync(new URL("../src/content.json",import.meta.url),"utf8"));
test("published equations parse with KaTeX",()=>{
 for(const card of cards)if(card.equation)assert.doesNotThrow(()=>katex.renderToString(card.equation,{throwOnError:true}),card.id);
});
