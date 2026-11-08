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
