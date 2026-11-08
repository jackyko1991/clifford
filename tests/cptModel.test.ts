import {test} from "node:test";
import assert from "node:assert/strict";
import {createServer} from "vite";
test("the CPT film distinguishes mirror positions, reversed velocity and antiparticle labels",async()=>{
 const server=await createServer({server:{middlewareMode:true},appType:"custom"});
 try{
  const {collisionFilm}=await server.ssrLoadModule("/src/cptModel.ts"),off={mirror:false,reverse:false,conjugate:false};
  for(const t of [0,.1,.3,.5,.7,.9,1]){
   const original=collisionFilm(t,off),mirror=collisionFilm(t,{...off,mirror:true}),reverse=collisionFilm(t,{...off,reverse:true}),conjugate=collisionFilm(t,{...off,conjugate:true}),later=collisionFilm(1-t,off);
   assert.ok(Math.abs(original.particles.reduce((s:number,p:{x:number})=>s+p.x,0)-(-.6+.4*t))<1e-12);
   assert.ok(Math.abs(original.particles.reduce((s:number,p:{velocity:number})=>s+p.velocity*p.velocity,0)-1.36)<1e-12);
   for(let i=0;i<2;i++){
    assert.equal(mirror.particles[i].x,-original.particles[i].x);assert.equal(mirror.particles[i].velocity,-original.particles[i].velocity);
    assert.equal(reverse.particles[i].x,later.particles[i].x);assert.equal(reverse.particles[i].velocity,-later.particles[i].velocity);
    assert.equal(conjugate.particles[i].x,original.particles[i].x);assert.equal(conjugate.particles[i].velocity,original.particles[i].velocity);assert.equal(conjugate.particles[i].antiparticle,true);
   }
  }
  for(const mirror of [false,true])for(const reverse of [false,true])for(const conjugate of [false,true])for(const t of [.1,.3,.7,.9]){
   const flags={mirror,reverse,conjugate},h=1e-6,a=collisionFilm(t-h,flags),b=collisionFilm(t+h,flags),r=collisionFilm(t,flags);
   r.particles.forEach((p:{velocity:number},i:number)=>assert.ok(Math.abs((b.particles[i].x-a.particles[i].x)/(2*h)-p.velocity)<1e-8));
  }
 }finally{await server.close();}
});
