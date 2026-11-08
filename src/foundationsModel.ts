import {gp,grade,type MV} from "./algebra";
export const gradeColors=["#2563eb","#0f766e","#7c3aed","#d97706"];
export const bladeSlots=[
 {mask:0,tex:"1",grade:0},{mask:1,tex:"e_1",grade:1},{mask:2,tex:"e_2",grade:1},{mask:4,tex:"e_3",grade:1},
 {mask:3,tex:"e_{12}",grade:2},{mask:5,tex:"e_{13}",grade:2},{mask:6,tex:"e_{23}",grade:2},{mask:7,tex:"e_{123}",grade:3}
];
export function vectorProduct2D(a:readonly number[],b:readonly number[]){
 const result=gp([0,a[0],a[1],0],[0,b[0],b[1],0],[1,1]);
 return {scalar:result[0],area:result[3]};
}
export function projectGrade(m:MV,k:number):MV{return m.map((v,mask)=>grade(mask)===k?v:0);}
export function numberText(v:number,digits=2){return (Math.abs(v)<.0005?0:v).toFixed(digits).replace(/\.?0+$/,"")||"0";}
export function productTex(scalar:number,area:number){
 return ["\\textcolor{#0f766e}{",numberText(scalar),"}",area<-.0005?"-":"+","\\textcolor{#7c3aed}{",numberText(Math.abs(area)),"\\,e_{12}}"].join("");
}
export function gradeTex(m:MV,k:number){
 const terms=bladeSlots.filter(s=>s.grade===k&&Math.abs(m[s.mask])>.0005).map(s=>{
  const v=m[s.mask];return `${v<0?"-":"+"}${numberText(Math.abs(v))}${s.mask?"\\,"+s.tex:""}`;
 });
 return terms.join("").replace(/^\+/,"")||"0";
}

export function dimensionCounts(n:number):number[]{
 if(!Number.isInteger(n)||n<0||n>20)throw new Error("Dimension must be an integer from 0 to 20");
 const counts=[1];for(let k=0;k<n;k++)counts.push(Math.round(counts[k]*(n-k)/(k+1)));return counts;
}

export function crossProductAsDual(a:readonly number[],b:readonly number[]){
 const vector=(v:readonly number[])=>{const m=Array(8).fill(0);for(let i=0;i<3;i++)m[1<<i]=v[i];return m;};
 const ab=gp(vector(a),vector(b)),ba=gp(vector(b),vector(a));
 const bivector=ab.map((v,i)=>(v-ba[i])/2),negativeI=Array(8).fill(0);negativeI[7]=-1;
 const dual=gp(negativeI,bivector);
 return {bivector,normal:[dual[1],dual[2],dual[4]]};
}
