// Basis blades use bit masks: [1,e1,e2,e12,e3,e13,e23,e123].
export type MV = number[];
export function bladeProduct(a:number,b:number,metric:readonly number[]):[number,number] {
 let sign=1;
 for(let i=0;i<metric.length;i++) if(a & (1<<i)) {
   for(let j=0;j<i;j++) if(b & (1<<j)) sign=-sign;
   if(b & (1<<i)) sign*=metric[i];
 }
 return [a^b,sign];
}
export function gp(a:MV,b:MV,metric:readonly number[]=[1,1,1]):MV {
 const size=2**metric.length;
 if(a.length!==size || b.length!==size) throw new Error("Multivector size must match metric");
 const out=Array<number>(size).fill(0);
 for(let i=0;i<size;i++) for(let j=0;j<size;j++) {
   const [k,s]=bladeProduct(i,j,metric); out[k]+=s*a[i]*b[j];
 }
 return out;
}
export const grade=(mask:number)=>mask.toString(2).replaceAll("0", "").length;
export const reverse=(a:MV):MV=>a.map((v,i)=>v*((grade(i)*(grade(i)-1)/2)%2 ? -1 : 1));
export function basis(mask:number,n=3):MV { const a=Array<number>(2**n).fill(0);a[mask]=1;return a; }
export function rotor(theta:number):MV { const r=basis(0);r[0]=Math.cos(theta/2);r[3]=-Math.sin(theta/2);return r; }
export const rotate=(v:MV,theta:number)=>gp(gp(rotor(theta),v),reverse(rotor(theta)));
export function dot(a:readonly number[],b:readonly number[]) {return a.reduce((s,v,i)=>s+v*b[i],0);}
