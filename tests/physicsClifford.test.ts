import {test} from "node:test";
import assert from "node:assert/strict";
import {createServer} from "vite";
test("physics pictures are encoded consistently by Clifford products",async()=>{
 const server=await createServer({server:{middlewareMode:true},appType:"custom"});
 try{
  const m=await server.ssrLoadModule('/src/physicsCliffordModel.ts'),p=await server.ssrLoadModule('/src/physicsModel.ts'),a=await server.ssrLoadModule('/src/algebra.ts');
  const near=(x:number,y:number)=>assert.ok(Math.abs(x-y)<1e-9,`${x} != ${y}`);
  for(const beta of [0,.2,.6,.8]){
   const r=m.clockClifford(beta),clock=p.lightClock(beta,1);near(r.X[1],clock.t);near(r.X[2],clock.x);near(r.interval,4);near(r.planeSquare,1);near(a.gp(r.R,a.reverse(r.R),m.spacetimeMetric)[0],1);
  }
  for(const degrees of [0,30,60,90,180,270,360,540,720]){
   const s=m.spinClifford(degrees),prob=p.spinProbabilities(degrees),theta=degrees*Math.PI/180;
   near(s.up,prob.up);near(s.down,prob.down);near(s.direction[0],Math.sin(theta));near(s.direction[1],0);near(s.direction[2],Math.cos(theta));near(a.gp(s.R,a.reverse(s.R))[0],1);
  }
  near(m.spinClifford(360).R[0],-1);near(m.spinClifford(720).R[0],1);
  for(const mode of [0,1,2])for(const q of [-1,1])for(const v of [-1,-.3,0,.4,1]){
   const physical=p.chargeForce(mode,q,v),r=m.fieldPlaneActions(physical.electric,physical.magnetic,q,v);near(r.force[0],physical.fx);near(r.force[1],physical.fy);
  }
  for(const circular of [false,true])for(const degrees of [0,30,60,90,180,270,360]){
   const wave=p.waveSample(degrees,circular),r=m.electromagneticClifford(wave.E,wave.cB);
   near(r.scalar,wave.difference);near(r.pseudoscalar,2*wave.dot);r.square.forEach((x:number)=>near(x,0));r.F.forEach((x:number,i:number)=>near(x,r.flag[i]));near(a.gp(r.k,r.k,m.spacetimeMetric)[0],0);
  }
  const purpose=await server.ssrLoadModule('/src/fermionPurposeModel.ts');
  for(const degrees of [0,90,180,360,540,720]){
   const a=purpose.spinorInterference(degrees),b=purpose.spinorInterference(degrees+720);near(a.plus+a.minus,1);near(a.real*a.real+a.imag*a.imag,1);near(a.plus,b.plus);
  }
  near(purpose.spinorInterference(0).plus,1);near(purpose.spinorInterference(360).plus,0);near(purpose.spinorInterference(720).plus,1);
  for(const momentum of [-2,0,.3,1,3])for(const mass of [.5,1,2]){
   const d=purpose.diracEnergy(momentum,mass);near(d.square[0][0],d.target);near(d.square[1][1],d.target);near(d.square[0][1],0);near(d.square[1][0],0);near(d.energy*d.energy,d.target);near(d.commutingSquare-d.target,d.crossTerm);
  }
  const E=[1,2,3],B=[-.2,.4,.7],general=m.electromagneticClifford(E,B);near(general.scalar,E.reduce((s,x)=>s+x*x,0)-B.reduce((s,x)=>s+x*x,0));near(general.pseudoscalar,2*E.reduce((s,x,i)=>s+x*B[i],0));assert.ok(Math.abs(general.scalar)>1);
 }finally{await server.close();}
});
