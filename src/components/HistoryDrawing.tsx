import {useId} from "react";
const violet="#7c3aed",teal="#0f766e",ink="#475569";
/** Original explanatory drawings, not reconstructions of historical figures. */
export default function HistoryDrawing({kind,label,l}:{kind:string;label:string;l:number}){
 const id=useId().replaceAll(":", "");
 const line=(x1:number,y1:number,x2:number,y2:number,c=violet)=><path d={`M${x1} ${y1}L${x2} ${y2}`} stroke={c} strokeWidth="3" fill="none" markerEnd={`url(#h${id})`}/>;
 const text=(x:number,y:number,s:string,c=ink,size=14)=><text x={x} y={y} textAnchor="middle" fill={c} fontSize={size}>{s}</text>;
 return <svg viewBox="0 0 360 180" className="h-full w-full" role="img" aria-label={label}>
 <defs><marker id={`h${id}`} viewBox="0 0 10 10" markerWidth="3.5" markerHeight="3.5" refX="9" refY="5" orient="auto"><path d="M0 0L10 5L0 10Z" fill="context-stroke"/></marker></defs>
 {kind==="quaternion"&&<>
  <path d="M35 140H325M45 140V108H315V140M45 108Q180 45 315 108" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2"/>
  <path d="M115 140V129Q180 70 245 129V140" fill="#f8fafc" stroke="#94a3b8"/>
  {line(113,55,157,28)}{line(180,55,219,28,teal)}{line(248,55,278,18)}
  {text(180,168,"i² = j² = k² = ijk = −1",violet,17)}
 </>}
 {kind==="wedge"&&<>
  {[0,170].map((dx,i)=><g key={dx} transform={`translate(${dx} 0)`}><path d="M25 125H110L150 55H65Z" fill={i?"#99f6e4":"#ddd6fe"} stroke={i?teal:violet}/>{line(25,125,110,125,i?teal:violet)}{line(25,125,65,55,i?teal:violet)}{text(90,158,i?"b ∧ a":"a ∧ b",i?teal:violet)}<path d={i?"M80 88q-25 0-22 22l-5-7m5 7 7-6":"M58 110q-3-22 22-22l-6-4m6 4-5 6"} stroke={i?teal:violet} fill="none" strokeWidth="2"/></g>)}
  {text(180,30,"+  /  −",violet,18)}
 </>}
 {kind==="curvature"&&<>
  {Array.from({length:7},(_,i)=><path key={i} d={`M30 ${65+i*13}Q110 ${-5+i*17} 180 ${65+i*13}T330 ${65+i*13}`} stroke={i===3?violet:"#c4b5fd"} fill="none" strokeWidth={i===3?2.5:1}/>)}
  {text(180,169,(l?"幾何 → 物理提案":"geometry → a physical proposal"),violet,13)}
 </>}
 {kind==="product"&&<>
  <path d="M43 129H133L179 50H89Z" fill="#ddd6fe"/>{line(43,129,133,129,teal)}{line(43,129,89,50)}
  <path d="M89 50V129" stroke="#94a3b8" strokeDasharray="4 4"/>
  {text(255,72,(l?"平行程度":"alignment"),teal,14)}{text(255,111,(l?"定向面積":"oriented area"),violet,14)}{text(180,166,"ab = a·b + a∧b",ink,17)}
 </>}
 {kind==="dirac"&&<>
  <rect x="24" y="38" width="93" height="99" rx="8" fill="white" stroke="#c4b5fd"/>
  {[0,1,2,3].map(r=>[0,1,2,3].map(c=><rect key={`${r}${c}`} x={38+c*17} y={51+r*17} width="11" height="11" fill={r===c?violet:r+c===3?teal:"#ede9fe"}/>))}
  {line(130,87,196,87)}<rect x="216" y="37" width="92" height="100" rx="8" fill="#f0fdfa" stroke="#5eead4"/>
  {text(262,99,"ψ",teal,40)}{text(70,161,(l?"γ 矩陣":"γ matrices"))}{text(262,161,(l?"旋量":"spinor"))}
 </>}
 {kind==="sta"&&<>
  <path d="M105 140V22M33 140H182M105 140L43 36M105 140L167 36" stroke="#cbd5e1" fill="none"/>
  <path d="M105 140L43 36H167Z" fill="#ddd6fe" opacity=".5"/>{line(105,140,136,65)}{text(104,18,"t")}
  <circle cx="269" cy="87" r="47" stroke="#99f6e4" fill="white"/>{line(269,87,305,57,teal)}{text(105,165,(l?"雙曲旋轉":"boost"))}{text(269,165,(l?"旋轉":"rotation"))}
 </>}
 {kind==="book"&&<>
  <path d="M74 40Q128 26 180 45Q232 26 286 40V139Q230 125 180 144Q127 125 74 139Z" fill="white" stroke="#c4b5fd" strokeWidth="2"/>
  <path d="M180 45V144M88 59Q125 48 164 61M88 76Q125 65 164 78M88 93Q125 82 164 95" stroke="#c4b5fd" fill="none"/>
  {line(207,108,250,108,teal)}{line(207,108,230,68)}{text(180,169,(l?"乘積 → 旋轉 → 場":"products → rotations → fields"),violet,14)}
 </>}
 {kind==="graphics"&&<>
  <path d="M30 119L87 37L111 133Z" fill="#ddd6fe" stroke={violet} strokeWidth="2"/>
  {line(129,89,168,89,teal)}<rect x="188" y="34" width="141" height="110" rx="8" fill="#1e293b"/>
  {[0,1,2,3].map((i)=><g key={i}><rect x="202" y={49+i*22} width={i%2?71:102} height="5" rx="2" fill={i%2?"#5eead4":"#c4b5fd"}/></g>)}
  {text(180,167,(l?"幾何 ↔ 分量 ↔ 程式":"geometry ↔ coefficients ↔ code"),ink,14)}
 </>}
 {kind==="pga"&&<>
  <path d="M37 132L80 57L118 132Z" fill="#ccfbf1" stroke={teal} strokeWidth="2"/>
  {line(134,95,188,95)}<g transform="translate(248 105) rotate(-27)"><path d="M-35 24L8-51L46 24Z" fill="#ddd6fe" stroke={violet} strokeWidth="2"/><path d="M-60 24H65" stroke={violet} strokeDasharray="4 4"/><circle cx="8" cy="-51" r="4" fill={violet}/></g>
  {text(180,167,(l?"點 · 線 · 剛體運動":"point · line · rigid motion"),ink,14)}
 </>}
 {kind==="network"&&<>
  <path d="M40 44H281V131H40Z" fill="none" stroke="#ddd6fe" strokeDasharray="4 4"/>
  <circle cx="40" cy="44" r="20" fill="white" stroke={violet}/><circle cx="40" cy="131" r="20" fill="white" stroke={teal}/>
  <rect x="255" y="23" width="54" height="42" rx="6" fill="#ede9fe" stroke={violet}/><rect x="255" y="110" width="54" height="42" rx="6" fill="#f0fdfa" stroke={teal}/>
  {line(70,44,240,44)}{line(70,131,240,131,teal)}{line(40,72,40,102,teal)}{line(282,72,282,102,teal)}
  {text(154,34,"f")}{text(154,121,"f")}{text(24,92,"R")}{text(302,92,"R")}{text(180,171,"f(Rx) = Rf(x)",violet,17)}
 </>}
 </svg>;
}
