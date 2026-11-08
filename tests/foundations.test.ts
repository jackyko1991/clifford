import {test} from "node:test";
import assert from "node:assert/strict";
import {createServer} from "vite";
test("foundation products preserve lengths, signs and grade components",async()=>{
 const server=await createServer({server:{middlewareMode:true},appType:"custom"});
 try{
  const {vectorProduct2D,projectGrade,productTex,gradeTex,numberText,dimensionCounts}=await server.ssrLoadModule("/src/foundationsModel.ts");
  const {default:katex}=await import("katex");
  for(const [a,b] of [[[1,0],[0,1]],[[2,0],[0,3]],[[1,2],[-3,4]],[[0,0],[1,1]],[[1,0],[-1,0]]]){
   const ab=vectorProduct2D(a,b),ba=vectorProduct2D(b,a);
   assert.equal(ab.scalar,ba.scalar);assert.equal(ab.area,-ba.area||0);
   assert.ok(Math.abs(ab.scalar**2+ab.area**2-(a[0]**2+a[1]**2)*(b[0]**2+b[1]**2))<1e-9);
   assert.doesNotThrow(()=>katex.renderToString(productTex(ab.scalar,ab.area),{throwOnError:true}));
  }
  assert.deepEqual(dimensionCounts(3),[1,3,3,1]);
  assert.deepEqual(dimensionCounts(4),[1,4,6,4,1]);
  for(let n=1;n<=6;n++){
   const counts=dimensionCounts(n),enumerated=Array(n+1).fill(0);
   for(let mask=0;mask<2**n;mask++)enumerated[mask.toString(2).split("1").length-1]++;
   assert.deepEqual(counts,enumerated);assert.equal(counts.reduce((a:number,b:number)=>a+b,0),2**n);
  }
  const m=[2,1,-1,.5,0,0,0,1],parts=[0,1,2,3].map(k=>projectGrade(m,k));
  assert.deepEqual(m,m.map((_:number,i:number)=>parts.reduce((sum:number,p:number[])=>sum+p[i],0)));
  assert.deepEqual(parts[2],[0,0,0,.5,0,0,0,0]);
  for(let k=0;k<4;k++)assert.doesNotThrow(()=>katex.renderToString(gradeTex(m,k),{throwOnError:true}));
  assert.equal(numberText(10),"10");assert.equal(numberText(0),"0");
 }finally{await server.close();}
});
