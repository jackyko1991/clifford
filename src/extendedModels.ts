import {basis,gp,reverse,type MV} from "./algebra";
export type V3=number[];
export const dot3=(a:V3,b:V3)=>a.reduce((s,v,i)=>s+v*b[i],0);
export const cross3=(a:V3,b:V3)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
export function reflect(v:number[],mirror:number){const n=[0,-Math.sin(mirror),Math.cos(mirror),0];return gp(gp(n,[0,...v,0],[1,1]),n,[1,1]).map(x=>-x).slice(1,3);}
export function mirrorPair(beta:number){const v=[Math.cos(Math.PI/6),.5],once=reflect(v,0),twice=reflect(once,beta);return {v,once,twice};}
export function planeRotor(mask:number,theta:number):MV {const r=basis(0);r[0]=Math.cos(theta/2);r[mask]=-Math.sin(theta/2);return r;}
export function composedRotations(theta:number){const a=planeRotor(3,theta),b=planeRotor(6,theta),ab=gp(b,a),ba=gp(a,b),v=basis(1);const apply=(r:MV)=>{const m=gp(gp(r,v),reverse(r));return [m[1],m[2],m[4]];};return {first12:apply(a),first23:apply(b),ab:apply(ab),ba:apply(ba)};}
export function lineIntersection(degrees:number,offset=1){const t=degrees*Math.PI/180,l=[0,1,0],m=[-Math.sin(t),Math.cos(t),-offset],P=cross3(l,m),w=P[2];const kind=Math.hypot(...P)<1e-10?"coincident":Math.abs(w)<1e-10?"ideal":"finite";return {l,m,P,kind,point:kind==="finite"?[P[0]/w,P[1]/w]:null};}
export function conformalPoint(x:number[],dimension=2){const metric=[...Array(dimension+1).fill(1),-1],out=Array(2**metric.length).fill(0);x.forEach((v,i)=>{out[1<<i]=v;});const squared=dot3(x,x);out[1<<dimension]=-.5+.5*squared;out[1<<(dimension+1)]=.5+.5*squared;return {out,metric};}
export function conformalRound(point:number[],center:number[],radius:number,dimension=2){const X=conformalPoint(point,dimension),C=conformalPoint(center,dimension),S=[...C.out];S[1<<dimension]-=radius*radius/2;S[1<<(dimension+1)]-=radius*radius/2;return {nullSquare:gp(X.out,X.out,X.metric)[0],inner:gp(X.out,S,X.metric)[0],distance2:point.reduce((s,v,i)=>s+(v-center[i])**2,0),slots:X.out.length};}
export function fieldAt(x:number,y:number,a:number,b:number){return [a*x-b*y,b*x+a*y];}
export function fieldIntegrals(a:number,b:number,length:number){return {divergence:2*a,curl:2*b,area:length*length,flux:2*a*length*length,circulation:2*b*length*length};}
function axisRotate(v:V3,axis:V3,angle:number){const c=Math.cos(angle),s=Math.sin(angle),cross=cross3(axis,v),d=dot3(axis,v);return v.map((x,i)=>c*x+s*cross[i]+(1-c)*d*axis[i]);}
export function sphereTransport(progress:number,reversed=false){const x=[1,0,0],y=[0,1,0],z=[0,0,1],vertices=reversed?[x,z,y,x]:[x,y,z,x];let vector=[0,1,0],point=x;const p=Math.max(0,Math.min(3,progress));for(let i=0;i<3;i++){const fraction=Math.max(0,Math.min(1,p-i));if(!fraction)break;const axis=cross3(vertices[i],vertices[i+1]);vector=axisRotate(vector,axis,fraction*Math.PI/2);point=axisRotate(vertices[i],axis,fraction*Math.PI/2);}return {point,vector,vertices,closed:p===3,holonomy:reversed?-90:90};}
export const geometricModels=[
 {id:"ega",name:"Euclidean GA",signature:"(3,0)",n:3,slots:8,task:["Directions and rotations","方向與旋轉"]},
 {id:"pga",name:"3D PGA",signature:"(3,0,1)",n:4,slots:16,task:["Rigid poses and incidence","剛體姿態與相接"]},
 {id:"cga",name:"3D CGA",signature:"(4,1)",n:5,slots:32,task:["Circles and spheres","圓與球"]},
 {id:"sta",name:"Spacetime algebra",signature:"(1,3)",n:4,slots:16,task:["Relativistic spacetime","相對論時空"]},
];
export function storageCost(n:number){return {slots:2**n,products:4**n,vector:n,float32Bytes:4*2**n};}

// Scalar-first Hamilton quaternions; active, right-handed rotations.
export function quaternionComposition(theta:number){
 const c=Math.cos(theta/2),s=Math.sin(theta/2);
 return {zThenX:[c*c,c*s,-s*s,c*s],xThenZ:[c*c,c*s,s*s,c*s]};
}
export function quaternionApply(q:number[],v:number[]){
 const w=q[0],u=q.slice(1),uv=cross3(u,v),uuv=cross3(u,uv);
 return v.map((x,i)=>x+2*w*uv[i]+2*uuv[i]);
}
export function eulerControlAxes(pitch:number){return {yaw:[0,0,1],roll:[Math.cos(pitch),0,-Math.sin(pitch)]};}
