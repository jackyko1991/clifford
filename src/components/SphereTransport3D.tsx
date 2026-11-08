import {useState} from "react";
import SphereTransportFallback from "./SphereTransportFallback";
import ThreeSphereTransport from "./ThreeSphereTransport";
export default function SphereTransport3D(props:{progress:number;reversed:boolean;l:number}){
 const [ready,setReady]=useState(false);
 return <div className="relative" data-testid="sphere-transport-3d" data-renderer={ready?'three':'projection'}>
  {!ready&&<SphereTransportFallback {...props}/>}
  <div className={ready?'':'invisible absolute inset-x-0 top-0'} aria-hidden={!ready}><ThreeSphereTransport {...props} onReady={setReady}/></div>
 </div>;
}
