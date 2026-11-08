import {basis,gp,grade,reverse,rotor,type MV} from "./algebra";
import {numberText} from "./foundationsModel";
export const toolkitMetrics=[[1,1],[1,-1],[1,0]] as const;
export function bladeLabel(mask:number){return mask===0?"1":"e_{"+Array.from({length:Math.max(1,Math.ceil(Math.log2(mask+1)))},(_,i)=>i+1).filter(i=>mask&(1<<(i-1))).join("")+"}";}
export function multivectorTex(m:MV){
 const terms=m.flatMap((v,mask)=>Math.abs(v)<1e-9?[]:[`${v<0?"-":"+"}${mask===0||Math.abs(Math.abs(v)-1)>1e-9?numberText(Math.abs(v)):""}${mask?bladeLabel(mask):""}`]);
 return terms.join("").replace(/^\+/,"")||"0";
}
export function gradePart(m:MV,k:number){return m.map((v,i)=>grade(i)===k?v:0);}
export function productExample(kind:number,theta:number){
 const a=basis(1),b=Array(8).fill(0);
 if(kind===0){b[1]=Math.cos(theta);b[2]=Math.sin(theta);}else{a[4]=1;b[3]=1;}
 const product=gp(a,b),inner=gradePart(product,kind===0?0:1),outer=gradePart(product,kind===0?2:3);
 return {a,b,product,inner,outer};
}
export function inverseExample(scale:number,theta:number){
 const q=rotor(theta).map(x=>x*scale),reversed=reverse(q),norm=gp(q,reversed)[0];
 const inverse=norm>1e-12?reversed.map(x=>x/norm):null;
 return {q,reversed,norm,inverse,check:inverse?gp(q,inverse):null};
}
export function dualExample(plane:number,sign:number,degenerate=false){
 const [i,j]=[[0,1],[1,2],[2,0]][plane],a=basis(1<<i),b=basis(1<<j),B=gp(a,b).map(x=>x*sign),I=basis(7),metric=degenerate?[1,1,0]:[1,1,1],square=gp(I,I,metric)[0];
 const dual=square===0?null:gp(B,I.map(x=>x/square),metric);
 return {B,square,dual,normal:dual?[dual[1],dual[2],dual[4]]:null};
}
export function rotationExample(theta:number){
 const v=basis(1),R=rotor(theta),sandwich=gp(gp(R,v),reverse(R));
 return {R,sandwich,matrix:[Math.cos(theta),Math.sin(theta)]};
}
