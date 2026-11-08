import {useId,useState} from "react";
import Tex from "./Tex";
import Arrow from "./GeometryArrow";
import Gimbal3D from "./Gimbal3D";
import CodeBlock from "./CodeBlock";
import {quaternionComposition,eulerControlAxes} from "../extendedModels";
import {numberText} from "../foundationsModel";

const button="rounded border border-violet-200 bg-white px-3 py-1.5 text-xs text-violet-800 aria-selected:bg-violet-100 hover:bg-violet-50";
const code=`import numpy as np
from scipy.spatial.transform import Rotation as R

theta = 90
# Lowercase axes: active rotations about fixed world axes.
z = R.from_euler("z", theta, degrees=True)
x = R.from_euler("x", theta, degrees=True)
left, right = x * z, z * x  # Rightmost rotation acts first.
assert np.allclose(left.apply([1, 0, 0]), [0, 0, 1])
assert np.allclose(right.apply([1, 0, 0]), [0, 1, 0])
# The same poses, stored as scalar-first unit quaternions.
q_left = left.as_quat(scalar_first=True)
q_right = right.as_quat(scalar_first=True)
assert np.allclose(R.from_quat(q_left, scalar_first=True).apply([1, 0, 0]),
                   left.apply([1, 0, 0]))`;

export default function RotationRepresentations({degrees,l}:{degrees:number;l:number}){
 const [tab,setTab]=useState(0),[pitch,setPitch]=useState(0),id=useId(),q=quaternionComposition(degrees*Math.PI/180),axes=eulerControlAxes(pitch*Math.PI/180);
 const project=(v:number[])=>[150+65*(v[0]-.5*v[1]),115+25*(v[0]+v[1])-65*v[2]];
 const labels=l?["歐拉角：旋轉的步驟","四元數：整體姿態","轉子：定向平面的語言"]:["Euler angles: the steps","Quaternion: the pose","Rotor: oriented planes"];
 const formula=(...terms:string[])=><div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded border border-violet-100 bg-violet-50/40 p-3 text-center text-xs sm:text-sm">{terms.map((tex,i)=><Tex key={i} tex={tex}/>)}</div>;
 return <div data-testid="rotation-representations" className="space-y-3">
  <h3 className="font-semibold">{l?"同一個姿態，三種記法":"One pose, three ways to record it"}</h3>
  <p>{l?"像替相機寫轉向指令：角度清單告訴你怎麼轉；四元數與轉子把轉完後的姿態打包起來。換一種記法，不會改變上圖的兩個答案。":"Think of pointing a camera: an angle list tells you the steps; a quaternion or rotor packages the resulting pose. Changing the notation leaves the two answers above unchanged."}</p>
  <div role="tablist" aria-label={l?"旋轉的三種記法":"Rotation representations"} className="flex flex-wrap gap-2">{labels.map((label,i)=><button key={i} type="button" role="tab" id={`${id}-tab-${i}`} aria-selected={tab===i} aria-controls={`${id}-panel-${i}`} className={button} onClick={()=>setTab(i)}>{label}</button>)}</div>
  <div role="tabpanel" id={`${id}-panel-${tab}`} aria-labelledby={`${id}-tab-${tab}`} className="space-y-3 rounded-lg border border-violet-100 p-3">
   {tab===0?<>
    <p>{l?"歐拉角用三次依序旋轉描述姿態，除了三個角，還要交代軸的順序，以及軸固定在房間裡，還是跟著相機移動。偏航、俯仰、滾轉是常見的三軸版本（Tait–Bryan 角）。":"Euler angles describe a pose with three successive rotations. Specify the axis order and whether the axes stay in the room or move with the camera. Yaw, pitch and roll form a common three-axis variant, the Tait–Bryan angles."}</p>
    <p className="text-sm">{l?"上圖採右手系、主動旋轉與固定軸：e₁₂ 平面內旋轉，就是繞 z 軸；e₂₃ 平面內旋轉，就是繞 x 軸。這個例子只用了其中兩步，第三個角取零。矩陣右邊的動作先做。":"Above we use right-handed active rotations about fixed axes: the e₁₂ plane rotates about z; the e₂₃ plane rotates about x. This example uses two steps with the third angle zero. In a matrix product, the rightmost action happens first."}</p>
    <div className="grid gap-2 sm:grid-cols-2">{formula(`M_{z\\to x}=M_x(${degrees}^\\circ)M_z(${degrees}^\\circ)`)}{formula(`M_{x\\to z}=M_z(${degrees}^\\circ)M_x(${degrees}^\\circ)`)}</div>
   </>:tab===1?<>
    <p>{l?"四元數不再保存三張轉向指令，而用一份四個數的紀錄表示整體姿態。它們受單位長度約束，所以不是四個獨立旋轉角；下方係數會跟著上圖角度一起更新。":"A quaternion stores the complete pose in four numbers instead of three turning instructions. Unit length constrains them, so they are not four independent angles. These coefficients follow the angle slider above."}</p>
    {formula("q=w+x\\mathbf i+y\\mathbf j+z\\mathbf k","w^2+x^2+y^2+z^2=1")}
    <div className="grid gap-2 sm:grid-cols-2">{[[l?"先 z，再 x":"z first, then x",q.zThenX],[l?"先 x，再 z":"x first, then z",q.xThenZ]].map(([label,values])=><div key={String(label)} className="rounded border border-violet-100 bg-white p-3 text-center text-sm"><div className="mb-2 text-xs text-slate-500">{String(label)}</div><div className="flex flex-wrap justify-center gap-x-2 gap-y-1">{(values as number[]).map((v,i)=><Tex key={i} tex={`\\textcolor{${i===2?"#7c3aed":"#0f766e"}}{${["w","x","y","z"][i]}=${numberText(v)}}`}/>)}</div></div>)}</div>
    {formula("q_{z\\to x}=q_xq_z","v'=qvq^{-1}")}
    <p className="text-sm">{l?"順序對調，紫色的 j 係數變號。四元數避開歐拉角的萬向節鎖，但乘法仍不交換。這裡採 (w,x,y,z)；有些函式庫把 w 放最後。q 與 −q 表示同一個三維姿態，運算後也要維持單位長度。":"Swapping the order changes the purple j coefficient’s sign. Quaternions avoid Euler gimbal lock, but their products still do not commute. We use (w,x,y,z); some libraries put w last. q and −q represent the same 3D pose. Keep the quaternion normalized."}</p>
   </>:<>
    <p>{l?"三維歐氏空間裡，單位四元數與單位偶轉子是同一套旋轉代數的兩種讀法。四元數的 i、j、k，在這裡對應三片有方向的平面；它們不是三根普通空間箭頭。":"In Euclidean 3D, unit quaternions and unit even rotors are two readings of the same rotation algebra. The quaternion units i, j and k correspond here to oriented planes, rather than ordinary spatial arrows."}</p>
    {formula("\\mathbf i\\leftrightarrow-e_{23}","\\mathbf j\\leftrightarrow-e_{31}","\\mathbf k\\leftrightarrow-e_{12}")}
    {formula("R=\\cos(\\theta/2)-B\\sin(\\theta/2)")}
    {formula("R_{\\mathrm{total}}=R_2R_1","v'=Rv\\widetilde R")}
    <p className="text-sm">{l?"B 是平方為 −1 的單位定向平面。這份對照採本頁的右手旋轉約定；換了正負號或主動／被動約定，對照表也要一起換。轉子的平面寫法能延伸到更高維，四元數則對應這個三維歐氏特例。":"B is a unit oriented plane with square −1. This dictionary uses this page’s right-handed active convention; changing conventions changes the signs. Rotor notation extends to higher dimensions, while quaternions correspond to this Euclidean 3D case."}</p>
   </>}
  </div>
  <details className="rounded-lg border border-violet-100 p-3" data-testid="gimbal-lock-extension"><summary className="cursor-pointer text-sm text-violet-800">{l?"為什麼不一直用三個角？試試萬向節鎖":"Why not always use three angles? Try gimbal lock"}</summary><div className="mt-3 space-y-3">
   <p>{l?"想像把相機的俯仰角轉到 90°：原本兩種不同的轉動控制，可能變成繞同一條軸。不是相機不能動了，而是這組三角度記法，在這個姿態無法分開辨認兩個控制。":"Tilt a camera to a pitch of 90°. Two different turning controls can end up acting about the same line. The camera can still move; this three-angle description cannot distinguish those two controls at that pose."}</p>
   <div className="rounded-lg border-l-4 border-emerald-300 bg-emerald-50/60 p-3"><Gimbal3D pitch={pitch} l={l}><svg viewBox="35 15 230 200" role="img" aria-label={l?"俯仰增加時，偏航與滾轉控制軸逐漸共線":"Yaw and roll control axes become collinear as pitch increases"} className="mx-auto max-h-52 w-full max-w-sm"><ellipse cx="150" cy="115" rx="75" ry="25" fill="white" stroke="#cbd5e1" strokeDasharray="3 3"/><Arrow a={[150,115]} b={project(axes.yaw)} color="#2563eb"/><Arrow a={[150,115]} b={project(axes.roll)} color="#7c3aed"/><circle cx="150" cy="115" r="3" fill="#334155"/><text x="158" y="42" fontSize="12" fill="#2563eb">{l?"偏航":"Yaw"}</text><text x={project(axes.roll)[0]+8} y={project(axes.roll)[1]+16} fontSize="12" fill="#7c3aed">{l?"滾轉":"Roll"}</text></svg></Gimbal3D>
    <label className="flex items-center gap-3 text-xs"><span>{l?"俯仰":"Pitch"}: {pitch}°</span><input className="min-w-0 flex-1 accent-violet-600" aria-label={l?"萬向節鎖俯仰角":"Gimbal lock pitch"} type="range" min="0" max="90" value={pitch} onChange={e=>setPitch(Number(e.target.value))}/></label>
    <div className="mt-3 flex justify-center gap-2">{[0,45,90].map(v=><button key={v} className={button} onClick={()=>setPitch(v)}>{v}°</button>)}</div>
    <p className="mt-2 text-center text-sm" aria-live="polite">{pitch===90?(l?"兩支箭頭反向共線：兩個控制只剩同一條旋轉軸。":"The arrows are oppositely collinear: both controls act about one rotation axis."):(l?"調到 90°，比較藍色與紫色的控制軸。":"Set pitch to 90° and compare the blue and purple control axes.")}</p>
   </div>
   <p className="text-xs text-slate-500">{l?"此圖採內在 Z–Y′–X″（偏航／俯仰／滾轉），固定偏航為零；俯仰 90° 時，第一與第三個控制軸共線。這與上圖固定軸的兩步旋轉是不同的示例。把四元數再轉回歐拉角，仍會遇到這個角度表示的奇點。":"This example uses intrinsic Z–Y′–X″ yaw/pitch/roll with yaw fixed at zero. At pitch 90°, the first and third control axes are collinear. It is separate from the fixed-axis two-step example above. Converting a quaternion back to Euler angles still encounters the Euler representation’s singularity."}</p>
  </div></details>
  <details className="rounded-lg border border-violet-100 p-3"><summary className="cursor-pointer text-xs text-violet-800">{l?"用程式核對：角度與四元數得到同一個方向":"Check in code: angles and quaternions give the same direction"}</summary><div className="mt-3"><CodeBlock code={code} title="Python · SciPy"/></div></details>
  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-violet-700"><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.spatial.transform.Rotation.from_euler.html" target="_blank" rel="noreferrer">SciPy · {l?"軸順序與固定／隨動軸":"Axis order and intrinsic/extrinsic axes"} ↗</a><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.spatial.transform.Rotation.from_quat.html" target="_blank" rel="noreferrer">SciPy · {l?"四元數約定":"Quaternion conventions"} ↗</a><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.spatial.transform.Rotation.as_euler.html" target="_blank" rel="noreferrer">SciPy · {l?"萬向節鎖":"Gimbal lock"} ↗</a></div>
 </div>;
}
