import {test} from "node:test";
import assert from "node:assert/strict";
import {createServer} from "vite";
test("extended lessons compute reflections, projective incidence, conformal geometry and transport",async()=>{
 const server=await createServer({server:{middlewareMode:true},appType:"custom"});
 try{
  const m=await server.ssrLoadModule("/src/extendedModels.ts"),algebra=await server.ssrLoadModule("/src/algebra.ts");
  const close=(a:number[],b:number[],eps=1e-9)=>{assert.equal(a.length,b.length);a.forEach((v,i)=>assert.ok(Math.abs(v-b[i])<eps,`${a} != ${b}`));};
  for(const beta of [0,.2,Math.PI/4,Math.PI/2]){
   const r=m.mirrorPair(beta);close(r.twice,[Math.cos(Math.PI/6+2*beta),Math.sin(Math.PI/6+2*beta)]);
   close(m.reflect(m.reflect(r.v,beta),beta),r.v);assert.ok(Math.abs(m.dot3(r.twice,r.twice)-1)<1e-10);
  }
  const order=m.composedRotations(Math.PI/2);close(order.ab,[0,0,1]);close(order.ba,[0,1,0]);
  for(const angle of [0,20,90,135,180]){const r=m.composedRotations(angle*Math.PI/180);assert.ok(Math.abs(m.dot3(r.ab,r.ab)-1)<1e-10);assert.ok(Math.abs(m.dot3(r.ba,r.ba)-1)<1e-10);}
  for(const angle of [-60,-.01,0,.01,30,60])for(const offset of [0,.4,1]){
   const r=m.lineIntersection(angle,offset);assert.ok(Math.abs(m.dot3(r.l,r.P))<1e-10);assert.ok(Math.abs(m.dot3(r.m,r.P))<1e-10);
   const lineMV=(line:number[])=>[line[2],line[0],line[1]];
   const a=Array(8).fill(0),b=Array(8).fill(0);lineMV(r.l).forEach((v,i)=>a[1<<i]=v);lineMV(r.m).forEach((v,i)=>b[1<<i]=v);
   const wedge=algebra.gp(a,b,[0,1,1]).map((v:number,i:number)=>algebra.grade(i)===2?v:0);
   close([wedge[3],wedge[5],wedge[6]],[r.P[1],-r.P[0],r.P[2]]);
   if(r.point)assert.ok(Math.abs(r.m[0]*r.point[0]+r.m[1]*r.point[1]+r.m[2])<1e-9);
  }
  assert.equal(m.lineIntersection(0,1).kind,"ideal");assert.equal(m.lineIntersection(0,0).kind,"coincident");
  for(const dimension of [2,3])for(const x of [[0,0,0],[1,2,-1],[-.7,.4,1.2]]){
   const p=x.slice(0,dimension),c=[.3,-.4,.2].slice(0,dimension),embed=m.conformalPoint(p,dimension),r=m.conformalRound(p,c,1.3,dimension);
   close(algebra.gp(embed.out,embed.out,embed.metric),Array(embed.out.length).fill(0));
   assert.ok(Math.abs(r.inner-(1.3**2-r.distance2)/2)<1e-10);assert.equal(r.slots,2**(dimension+2));
  }
  for(const reversed of [false,true]){
   for(const progress of [0,.3,1,1.4,2,2.6,3]){const r=m.sphereTransport(progress,reversed);assert.ok(Math.abs(m.dot3(r.point,r.vector))<1e-10);assert.ok(Math.abs(m.dot3(r.point,r.point)-1)<1e-10);assert.ok(Math.abs(m.dot3(r.vector,r.vector)-1)<1e-10);}
   for(const progress of [.3,1.4,2.6]){const h=1e-5,a=m.sphereTransport(progress-h,reversed),b=m.sphereTransport(progress+h,reversed),r=m.sphereTransport(progress,reversed),dv=a.vector.map((v:number,i:number)=>(b.vector[i]-v)/(2*h)),radial=m.dot3(dv,r.point);close(dv.map((v:number,i:number)=>v-radial*r.point[i]),[0,0,0],1e-7);}
   const end=m.sphereTransport(3,reversed);close(end.point,[1,0,0]);close(end.vector,[0,0,reversed?-1:1]);assert.equal(end.holonomy,reversed?-90:90);
  }
  for(const a of [-1,.3,1])for(const b of [-1,.5,1])for(const L of [.5,1,2]){
   const r=m.fieldIntegrals(a,b,L),h=1e-6,x=.2,y=-.3,dx=m.fieldAt(x+h,y,a,b).map((v:number,i:number)=>(v-m.fieldAt(x-h,y,a,b)[i])/(2*h)),dy=m.fieldAt(x,y+h,a,b).map((v:number,i:number)=>(v-m.fieldAt(x,y-h,a,b)[i])/(2*h));
   assert.ok(Math.abs(dx[0]+dy[1]-r.divergence)<1e-9);assert.ok(Math.abs(dx[1]-dy[0]-r.curl)<1e-9);
   const sides=[{p:[0,-L/2],n:[0,-1],t:[1,0]},{p:[L/2,0],n:[1,0],t:[0,1]},{p:[0,L/2],n:[0,1],t:[-1,0]},{p:[-L/2,0],n:[-1,0],t:[0,-1]}];
   const flux=sides.reduce((s,e)=>s+m.dot3(m.fieldAt(...e.p,a,b),e.n)*L,0),circ=sides.reduce((s,e)=>s+m.dot3(m.fieldAt(...e.p,a,b),e.t)*L,0);
   assert.ok(Math.abs(flux-r.flux)<1e-10);assert.ok(Math.abs(circ-r.circulation)<1e-10);
  }
  for(const model of m.geometricModels)assert.equal(model.slots,2**model.n);
  for(let n=2;n<=10;n++){const r=m.storageCost(n);assert.equal(r.products,r.slots*r.slots);assert.equal(r.float32Bytes,4*r.slots);}
 }finally{await server.close();}
});
