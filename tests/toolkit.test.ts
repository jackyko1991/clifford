import {test} from "node:test";
import assert from "node:assert/strict";
import {createServer} from "vite";
test("toolkit models preserve metric, grade, inverse and duality conventions",async()=>{
 const server=await createServer({server:{middlewareMode:true},appType:"custom"});
 try{
  const m=await server.ssrLoadModule("/src/toolkitModel.ts"),a=await server.ssrLoadModule("/src/algebra.ts");
  const close=(x:number[],y:number[])=>{assert.equal(x.length,y.length);x.forEach((v,i)=>assert.ok(Math.abs(v-y[i])<1e-10,`${i}: ${v} != ${y[i]}`));};
  for(const metric of m.toolkitMetrics){
   for(let i=0;i<4;i++)for(let j=0;j<4;j++)for(let k=0;k<4;k++){
    const x=a.basis(i,2),y=a.basis(j,2),z=a.basis(k,2);
    close(a.gp(a.gp(x,y,metric),z,metric),a.gp(x,a.gp(y,z,metric),metric));
   }
   assert.equal(a.gp(a.basis(2,2),a.basis(2,2),metric)[0],metric[1]);
   assert.equal(a.gp(a.basis(3,2),a.basis(3,2),metric)[0],-metric[0]*metric[1]||0);
  }
  for(const kind of [0,1])for(const theta of [0,.4,Math.PI/2,Math.PI]){
   const r=m.productExample(kind,theta);close(r.product,r.inner.map((x:number,i:number)=>x+r.outer[i]));
   r.inner.forEach((v:number,i:number)=>{if(v)assert.equal(a.grade(i),kind===0?0:1);});
   r.outer.forEach((v:number,i:number)=>{if(v)assert.equal(a.grade(i),kind===0?2:3);});
  }
  const vp=m.productExample(1,0);assert.equal(vp.inner[2],1);assert.equal(vp.outer[7],1);
  for(const scale of [0,.1,.7,1,2]){
   const r=m.inverseExample(scale,.7);assert.ok(Math.abs(r.norm-scale*scale)<1e-12);
   if(scale===0)assert.equal(r.inverse,null);else{close(a.gp(r.q,r.inverse),a.basis(0));close(a.gp(r.inverse,r.q),a.basis(0));}
  }
  for(let plane=0;plane<3;plane++)for(const sign of [-1,1]){
   const d=m.dualExample(plane,sign);assert.equal(d.square,-1);assert.equal(d.normal[(plane+2)%3],sign);
   const nullDual=m.dualExample(plane,sign,true);assert.equal(nullDual.square,0);assert.equal(nullDual.dual,null);
  }
  for(let degree=-360;degree<=720;degree+=7){
   const r=m.rotationExample(degree*Math.PI/180);close([r.sandwich[1],r.sandwich[2]],r.matrix);assert.ok(Math.abs(r.matrix[0]**2+r.matrix[1]**2-1)<1e-12);
  }
  const katex=await import("katex");for(const tex of [m.multivectorTex(vp.product),m.bladeLabel(7),m.multivectorTex(m.inverseExample(2,1).inverse)])assert.doesNotThrow(()=>katex.default.renderToString(tex,{throwOnError:true}));
 }finally{await server.close();}
});
