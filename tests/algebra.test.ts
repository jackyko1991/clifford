import {test} from "node:test";
import assert from "node:assert/strict";
import {basis,gp,reverse,rotor,rotate} from "../src/algebra.ts";
const near=(a:number[],b:number[])=>a.forEach((v,i)=>assert.ok(Math.abs(v-b[i])<1e-10,`${i}: ${v} != ${b[i]}`));
test("Euclidean basis, anticommutation, pseudoscalar and rotor normalization",()=>{
 for(let i=0;i<3;i++) near(gp(basis(1<<i),basis(1<<i)),basis(0));
 near(gp(basis(1),basis(2)),basis(3));near(gp(basis(2),basis(1)),basis(3).map(x=>-x));
 near(gp(basis(7),basis(7)),basis(0).map(x=>-x));
 for(const t of [0,.7,Math.PI,6.2])near(gp(rotor(t),reverse(rotor(t))),basis(0));
});
test("90 degree sandwich and double cover",()=>{
 near(rotate(basis(1),Math.PI/2),basis(2));near(rotor(2*Math.PI),basis(0).map(x=>-x));
 near(rotor(4*Math.PI),basis(0));near(rotate(basis(1),2*Math.PI),basis(1));
});
test("associativity for dense multivectors across signatures, including degenerate PGA",()=>{
 for(const m of [[1,1,1],[1,-1,-1,-1],[0,1,1,1]]){
 const n=2**m.length,a=Array.from({length:n},(_,i)=>Math.sin(i)),b=a.map((x,i)=>x+i/7),c=a.map(x=>x*x);
 near(gp(gp(a,b,m),c,m),gp(a,gp(b,c,m),m));
 }
});
test("null electromagnetic bivector in signature (+---)",()=>{
 const m=[1,-1,-1,-1],k=basis(1,4).map((x,i)=>x+basis(8,4)[i]),e=basis(2,4);
 const F=gp(k,e,m);near(gp(F,F,m),Array(16).fill(0));
 near(gp(k,k,m),Array(16).fill(0));
});
