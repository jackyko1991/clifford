export function spinorInterference(turnDegrees:number){
 const phase=turnDegrees*Math.PI/360,real=Math.cos(phase),imag=-Math.sin(phase);
 return {real,imag,plus:(1+real)/2,minus:(1-real)/2};
}
export function diracEnergy(momentum:number,mass=1){
 const H=[[mass,momentum],[momentum,-mass]],square=H.map(row=>[0,1].map(j=>row.reduce((sum,x,k)=>sum+x*H[k][j],0))),target=momentum*momentum+mass*mass;
 return {H,square,target,energy:Math.sqrt(target),commutingSquare:(momentum+mass)**2,crossTerm:2*momentum*mass};
}
