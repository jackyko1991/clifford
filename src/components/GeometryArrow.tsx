export default function Arrow({a,b,color="#7c3aed"}:{a:number[];b:number[];color?:string}){
 const dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy);
 if(len<.5)return <circle cx={a[0]} cy={a[1]} r="2" fill={color}/>;
 const h=Math.min(9,len*.4),ux=dx/len,uy=dy/len,x=b[0]-ux*h,y=b[1]-uy*h;
 return <g fill={color}><path d={`M${a}L${x} ${y}`} stroke={color} strokeWidth="3" fill="none"/><polygon points={`${b} ${x-uy*h/2},${y+ux*h/2} ${x+uy*h/2},${y-ux*h/2}`}/></g>;
}
