import katex from "katex";
export default function Tex({tex,display=false}:{tex:string;display?:boolean}) {
 return <span className={display ? "math-block" : ""} dangerouslySetInnerHTML={{__html:katex.renderToString(tex,{displayMode:display,throwOnError:false,strict:"ignore"})}}/>;
}
