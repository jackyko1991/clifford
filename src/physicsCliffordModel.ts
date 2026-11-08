import {basis,gp,reverse,type MV} from "./algebra";
export const spacetimeMetric=[1,-1,-1,-1] as const;
export function clockClifford(beta:number){
 const eta=Math.atanh(beta),R=basis(0,4);R[0]=Math.cosh(eta/2);R[3]=-Math.sinh(eta/2);
 const U=gp(gp(R,basis(1,4),spacetimeMetric),reverse(R),spacetimeMetric),X=U.map(x=>2*x);
 const B=basis(3,4).map(x=>-x);
 return {eta,R,U,X,interval:gp(X,X,spacetimeMetric)[0],planeSquare:gp(B,B,spacetimeMetric)[0]};
}
export function spinClifford(degrees:number){
 const theta=degrees*Math.PI/180,c=Math.cos(theta/2),s=Math.sin(theta/2),R=basis(0);R[0]=c;R[5]=s;
 const direction=gp(gp(R,basis(4)),reverse(R));
 return {R,amplitudes:[c,s],direction:[direction[1],direction[2],direction[4]],up:c*c,down:s*s};
}
export function fieldPlaneActions(electric:number,magneticIn:number,charge:number,velocity:number){
 const electricPlane=basis(3,4).map(x=>-electric*x),magneticPlane=basis(6,4).map(x=>magneticIn*x);
 const F=electricPlane.map((x,i)=>x+magneticPlane[i]);
 const electricAction=gp(electricPlane,basis(1,4),spacetimeMetric),magneticAction=gp(magneticPlane,basis(2,4).map(x=>x*velocity),spacetimeMetric);
 return {F,electricAction,magneticAction,force:[charge*(electricAction[2]+magneticAction[2]),charge*(electricAction[4]+magneticAction[4])]};
}
export function electromagneticClifford(E:number[],cB:number[]){
 const F:MV=Array(16).fill(0);
 E.forEach((value,i)=>{F[1|(1<<(i+1))]=-value;});
 F[12]=-cB[0];F[10]=cB[1];F[6]=-cB[2];
 const square=gp(F,F,spacetimeMetric),k=basis(1,4);k[8]=1;
 const epsilon:MV=Array(16).fill(0);E.forEach((value,i)=>{epsilon[1<<(i+1)]=-value;});
 const ke=gp(k,epsilon,spacetimeMetric),ek=gp(epsilon,k,spacetimeMetric),flag=ke.map((x,i)=>(x-ek[i])/2);
 return {F,square,k,epsilon,flag,scalar:square[0],pseudoscalar:square[15],norm:Math.hypot(...F)};
}
