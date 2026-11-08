import Arrow from "./GeometryArrow";
import Tex from "./Tex";
const blue="#2563eb",purple="#7c3aed",orange="#d97706";
const o=[108,119],x=[57,16],y=[-43,29],z=[0,-65];
const point=(a=0,b=0,c=0)=>[o[0]+a*x[0]+b*y[0]+c*z[0],o[1]+a*x[1]+b*y[1]+c*z[1]];
const polygon=(points:number[][])=>points.map(p=>p.join(",")).join(" ");
function Label({at,index,color}:{at:number[];index:string;color:string}){return <text x={at[0]} y={at[1]} fill={color} fontSize="14">e<tspan baselineShift="sub" fontSize="10">{index}</tspan></text>;}
export default function VectorPlaneProduct({l,view}:{l:number;view:number}){
 const low=view!==2,high=view!==1;
 return <div className="space-y-3" data-testid="vector-plane-product" data-grade-view={view}>
  <div className="flex flex-wrap items-center justify-center gap-1 rounded-lg border border-violet-100 bg-violet-50/40 p-3 text-center"><Tex tex="("/><span style={{color:blue}}><Tex tex="e_1"/></span><Tex tex="+"/><span style={{color:orange}}><Tex tex="e_3"/></span><Tex tex=")"/><span style={{color:purple}}><Tex tex="e_{12}"/></span><Tex tex="="/><span style={{color:blue}}><Tex tex="e_2"/></span><Tex tex="+"/><span style={{color:orange}}><Tex tex="e_{123}"/></span></div>
  <div className="grid gap-3 sm:grid-cols-2">
   <div className="min-w-0 rounded-lg border border-violet-100 bg-white p-2">
    <p className="text-center text-xs font-medium">{l?"左邊：箭頭 × 平面":"Left: vector × plane"}</p>
    <svg viewBox="0 0 230 190" className="mx-auto w-full max-w-64" role="img" aria-label={l?"共用原點的 e1、e3 與合成箭頭，乘上紫色 e12 平面":"e1 and e3 from a common origin form the input vector, multiplied by the purple e12 plane"}>
     <polygon points={polygon([point(),point(1),point(1,1),point(0,1)])} fill={purple} fillOpacity=".18" stroke={purple}/>
     <Arrow a={o} b={point(0,1)} color="#cbd5e1"/>
     <path d={`M${point(1)}L${point(1,0,1)}L${point(0,0,1)}`} fill="none" stroke="#94a3b8" strokeDasharray="3 4"/>
     <g opacity={low?1:.18} data-product-part="input-inner"><Arrow a={o} b={point(1)} color={blue}/><Label at={[174,147]} index="1" color={blue}/></g>
     <g opacity={high?1:.18} data-product-part="input-outer"><Arrow a={o} b={point(0,0,1)} color={orange}/><Label at={[88,45]} index="3" color={orange}/></g>
     <Arrow a={o} b={point(1,0,1)} color="#475569"/>
     <text x="171" y="71" fill="#475569" fontSize="12">e<tspan baselineShift="sub" fontSize="9">1</tspan> + e<tspan baselineShift="sub" fontSize="9">3</tspan></text>
     <Label at={[100,155]} index="12" color={purple}/>
    </svg>
    <p className="text-center text-xs text-gray-600">{l?"虛線把兩支分量箭頭接成總箭頭。":"Dashed edges assemble the two components into one vector."}</p>
   </div>
   <div className="min-w-0 rounded-lg border border-violet-100 bg-white p-2">
    <p className="text-center text-xs font-medium">{l?"右邊：箭頭 ＋ 定向體積":"Right: vector + oriented volume"}</p>
    <svg viewBox="0 0 230 190" className="mx-auto w-full max-w-64" role="img" aria-label={l?"藍色 e2 箭頭加上橙色 e123 定向體積":"Blue e2 vector plus orange e123 oriented volume"}>
     <g opacity={high?1:.15} data-product-part="output-outer" stroke={orange} strokeWidth="1.2" strokeLinejoin="round">
      <polygon points={polygon([point(0,1),point(1,1),point(1,1,1),point(0,1,1)])} fill={orange} fillOpacity=".12"/>
      <polygon points={polygon([point(1),point(1,1),point(1,1,1),point(1,0,1)])} fill={orange} fillOpacity=".22"/>
      <polygon points={polygon([point(0,0,1),point(1,0,1),point(1,1,1),point(0,1,1)])} fill={orange} fillOpacity=".08"/>
      <path d={`M${point()}L${point(1)}M${point()}L${point(0,1)}M${point()}L${point(0,0,1)}`} fill="none" strokeDasharray="3 4"/>
      <text x="124" y="85" fill={orange} stroke="none" fontSize="14">e<tspan baselineShift="sub" fontSize="10">123</tspan></text>
     </g>
     <g opacity={low?1:.15} data-product-part="output-inner"><Arrow a={o} b={point(0,1)} color={blue}/><Label at={[43,161]} index="2" color={blue}/></g>
    </svg>
    <p className="text-center text-xs text-gray-600">{l?"兩種幾何分開保留；不是把箭頭塞進體積裡。":"Keep both kinds of geometry; the vector is not inside the volume."}</p>
   </div>
  </div>
  <div className="grid gap-2 text-center text-sm sm:grid-cols-2">
   <div className="rounded-lg border border-blue-100 bg-white p-2" style={{opacity:low?1:.35}}><Tex tex="\textcolor{#2563eb}{e_1}\,\textcolor{#7c3aed}{e_{12}}=e_1^2e_2=\textcolor{#2563eb}{e_2}"/><p className="mt-1 text-xs text-gray-600">{l?"重複的 e₁ 相乘變成 1，留下箭頭（1 階）。":"The repeated e₁ pair reduces to 1, leaving a vector (grade 1)."}</p></div>
   <div className="rounded-lg border border-amber-100 bg-white p-2" style={{opacity:high?1:.35}}><Tex tex="\textcolor{#d97706}{e_3}\,\textcolor{#7c3aed}{e_{12}}=e_3e_1e_2=\textcolor{#d97706}{e_{123}}"/><p className="mt-1 text-xs text-gray-600">{l?"三個不同方向合起來，留下體積（3 階）。":"Three distinct directions leave an oriented volume (grade 3)."}</p></div>
  </div>
 </div>;
}
