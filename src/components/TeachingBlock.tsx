export const TEACHING_STEPS = ["plain", "analogy", "precise", "example"] as const;
export type TeachingStep = typeof TEACHING_STEPS[number];
const labels = {
  plain: ["In plain words", "白話說明"],
  analogy: ["Picture it", "想像一下"],
  precise: ["Precisely", "精確地說"],
  example: ["Tiny example", "小例子"],
};
const styles = {
  plain: "",
  analogy: "rounded-lg border-l-4 border-amber-300 bg-amber-50 px-4 py-2.5 text-amber-950",
  precise: "",
  example: "rounded-lg border-l-4 border-emerald-300 bg-emerald-50/70 px-4 py-2.5 text-emerald-950",
};
export default function TeachingBlock({kind,text,l}:{kind:TeachingStep;text:string;l:number}) {
  return <div className={styles[kind]} data-feynman={kind}>
    <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">{labels[kind][l]}</p>
    <p>{text}</p>
  </div>;
}
