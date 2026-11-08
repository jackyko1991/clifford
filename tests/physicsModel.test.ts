import {test} from "node:test";
import assert from "node:assert/strict";
import {createServer} from "vite";
test("beginner physics pictures use consistent clocks, probabilities, forces and wave samples",async()=>{
 const server=await createServer({server:{middlewareMode:true},appType:"custom"});
 try{
  const m=await server.ssrLoadModule("/src/physicsModel.ts");
  for(const beta of [0,.2,.6,.8]){
   const full=m.lightClock(beta,1);assert.ok(Math.abs(full.t**2-full.x**2-4)<1e-10);assert.equal(full.height,0);assert.equal(full.trainTime,2);
   assert.ok(Math.abs(full.t-2/Math.sqrt(1-beta*beta))<1e-10);
   for(const p of [.1,.25,.5,.75,.9]){const v=m.lightClock(beta,p);assert.ok(Math.abs(v.interval-(v.trainTime**2-v.height**2))<1e-10);}
   for(const p of [.2,.7]){const h=1e-6,a=m.lightClock(beta,p-h),b=m.lightClock(beta,p+h),speed=Math.hypot(b.x-a.x,b.height-a.height)/(b.t-a.t);assert.ok(Math.abs(speed-1)<1e-8);}
  }
  for(let theta=0;theta<=720;theta+=5){const p=m.spinProbabilities(theta);assert.ok(Math.abs(p.up+p.down-1)<1e-12);assert.ok(p.up>=0&&p.up<=1);}
  assert.equal(m.detectorBatch(0,123).up,100);assert.equal(m.detectorBatch(180,123).down,100);assert.equal(m.detectorBatch(360,123).up,100);
  const sample=m.detectorBatch(90,123,10000);assert.ok(Math.abs(sample.up/10000-.5)<.02);assert.deepEqual(m.detectorBatch(60,100),m.detectorBatch(60,100));
  for(const q of [-1,1])for(const speed of [-1,0,1]){
   const e=m.chargeForce(0,q,speed),b=m.chargeForce(1,q,speed),both=m.chargeForce(2,q,speed);
   assert.equal(e.fx,q);assert.equal(Math.abs(e.fy),0);assert.equal(Math.abs(b.fx),0);assert.equal(b.fy,q*speed);assert.equal(both.fx,e.fx+b.fx);assert.equal(both.fy,e.fy+b.fy);
  }
  for(const circular of [false,true])for(let angle=0;angle<=720;angle+=7){const w=m.waveSample(angle,circular);assert.ok(Math.abs(w.dot)<1e-12);assert.ok(Math.abs(w.difference)<1e-12);assert.ok(w.flow>=0);assert.ok(Math.abs(w.flow-(w.E[0]*w.cB[1]-w.E[1]*w.cB[0]))<1e-12);if(circular)assert.ok(Math.abs(w.flow-1)<1e-12);}
 }finally{await server.close();}
});
