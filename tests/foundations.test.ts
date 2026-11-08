import {test} from "node:test";
import assert from "node:assert/strict";
import {createServer} from "vite";
test("foundation products preserve lengths, signs and grade components",async()=>{
 const server=await createServer({server:{middlewareMode:true},appType:"custom"});
 try{
  const {vectorProduct2D,projectGrade,productTex,gradeTex,numberText,dimensionCounts,crossProductAsDual,crossProductView}=await server.ssrLoadModule("/src/foundationsModel.ts");
  const {default:katex}=await import("katex");
  for(const [a,b] of [[[1,0],[0,1]],[[2,0],[0,3]],[[1,2],[-3,4]],[[0,0],[1,1]],[[1,0],[-1,0]]]){
   const ab=vectorProduct2D(a,b),ba=vectorProduct2D(b,a);
   assert.equal(ab.scalar,ba.scalar);assert.equal(ab.area,-ba.area||0);
   assert.ok(Math.abs(ab.scalar**2+ab.area**2-(a[0]**2+a[1]**2)*(b[0]**2+b[1]**2))<1e-9);
   assert.doesNotThrow(()=>katex.renderToString(productTex(ab.scalar,ab.area),{throwOnError:true}));
  }
  assert.deepEqual(crossProductAsDual([1,0,0],[0,1,0]).normal,[0,0,1]);
  assert.deepEqual(crossProductAsDual([0,1,0],[1,0,0]).normal,[0,0,-1]);
  assert.deepEqual(crossProductAsDual([1,2,3],[4,-1,2]).normal,[7,10,-9]);
  assert.deepEqual(crossProductAsDual([1,0,0],[2,0,0]).normal,[0,0,0]);
  // The 2D picture must preserve the orientation of its actual 3D camera.
  for(let plane=0;plane<3;plane++){
   const {right,up,toward,axes}=crossProductView(plane),cameraNormal=crossProductAsDual(right,up).normal;
   cameraNormal.forEach((x:number,n:number)=>assert.ok(Math.abs(x-toward[n])<1e-12));
   const [i,j,k]=[[0,1,2],[1,2,0],[2,0,1]][plane];
   for(const [a,b,sign] of [[i,j,1],[j,i,-1]]){
    const unit=(n:number)=>[0,1,2].map(axis=>axis===n?1:0),normal=crossProductAsDual(unit(a),unit(b)).normal;
    assert.equal(normal[k],sign);
    // SVG y points downward, so negate it to recover the visible oriented area.
    const visibleArea=(-axes[a][0]*axes[b][1]+axes[a][1]*axes[b][0])/10000;
    const facing=normal.reduce((sum:number,x:number,n:number)=>sum+x*toward[n],0);
    assert.ok(Math.abs(visibleArea-facing)<1e-12);
    assert.equal(Math.sign(visibleArea),sign);
   }
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
