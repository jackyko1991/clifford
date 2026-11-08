import {basis,gp} from "./algebra";
export const quaternionUnits = ["i","j","k"] as const;
export type QuaternionUnit = typeof quaternionUnits[number];
// i=-e23, j=-e31=e13, k=-e12 in the Euclidean even subalgebra.
const units = {i:basis(6).map(x=>-x),j:basis(5),k:basis(3).map(x=>-x)};
export function quaternionProduct(a:QuaternionUnit,b:QuaternionUnit):string {
 const out=gp(units[a],units[b]);
 if(out[0])return String(out[0]);
 for(const name of quaternionUnits){
  const blade=units[name].findIndex(x=>x!==0);
  if(out[blade])return (out[blade]/units[name][blade]<0?"-":"")+name;
 }
 throw new Error("Product must be a quaternion basis unit");
}
export function quarterTurn(turns:number){const n=((turns%4)+4)%4;return {x:[1,0,-1,0][n],y:[0,1,0,-1][n],tex:["1","i","-1","-i"][n]};}

export function geometricProductTex(degrees:number,precision=3):string {
 const theta=degrees*Math.PI/180,c=Math.cos(theta),s=Math.sin(theta);
 const format=(value:number)=>(Math.abs(value)<.0005?0:value).toFixed(precision);
 return ["ab=", "\\textcolor{#0f766e}{",format(c),"}",s<-.0005?"-":"+",
  "\\textcolor{#7c3aed}{",format(Math.abs(s)),"\\,e_{12}}"].join("");
}
