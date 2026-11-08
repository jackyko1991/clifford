import {test} from "node:test";
import assert from "node:assert/strict";
import {createServer} from "vite";
test("periodic Hodge example reconstructs orthogonal parts and retains the mean flow",async()=>{
 const server=await createServer({server:{middlewareMode:true},appType:"custom"});
 try{
  const {periodicHodge:f}=await server.ssrLoadModule("/src/hodgeModel.ts"),a=.6,b=.8,c=.35,h=1e-5;
  const dx=(x:number,y:number,key:string,j:number)=>(f(x+h,y,a,b,c)[key][j]-f(x-h,y,a,b,c)[key][j])/(2*h);
  const dy=(x:number,y:number,key:string,j:number)=>(f(x,y+h,a,b,c)[key][j]-f(x,y-h,a,b,c)[key][j])/(2*h);
  for(const [x,y] of [[.4,.7],[2,4],[5,1]]){
   const r=f(x,y,a,b,c);r.total.forEach((v:number,i:number)=>assert.ok(Math.abs(v-r.gradient[i]-r.solenoidal[i]-r.harmonic[i])<1e-12));
   assert.ok(Math.abs(dx(x,y,"gradient",1)-dy(x,y,"gradient",0))<1e-8);
   assert.ok(Math.abs(dx(x,y,"solenoidal",0)+dy(x,y,"solenoidal",1))<1e-8);
   assert.ok(Math.abs(dx(x,y,"total",0)+dy(x,y,"total",1)-r.divergence)<1e-8);
   assert.ok(Math.abs(dx(x,y,"total",1)-dy(x,y,"total",0)-r.curl)<1e-8);
   const shifted=f(x,y,a,b,-.7);assert.equal(shifted.divergence,r.divergence);assert.equal(shifted.curl,r.curl);assert.notDeepEqual(shifted.total,r.total);
  }
  const mean=[0,0],inner=[0,0,0],n=32;
  for(let i=0;i<n;i++)for(let j=0;j<n;j++){
   const r=f((i+.5)*2*Math.PI/n,(j+.5)*2*Math.PI/n,a,b,c);
   mean[0]+=r.total[0]/(n*n);mean[1]+=r.total[1]/(n*n);
   inner[0]+=r.gradient[0]*r.solenoidal[0]+r.gradient[1]*r.solenoidal[1];
   inner[1]+=r.gradient[0]*r.harmonic[0]+r.gradient[1]*r.harmonic[1];
   inner[2]+=r.solenoidal[0]*r.harmonic[0]+r.solenoidal[1]*r.harmonic[1];
  }
  assert.ok(Math.abs(mean[0]-c)<1e-12);assert.ok(Math.abs(mean[1])<1e-12);inner.forEach(v=>assert.ok(Math.abs(v)<1e-9));
 }finally{await server.close();}
});
