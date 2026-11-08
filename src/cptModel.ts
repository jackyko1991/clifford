export interface FilmTransforms {mirror:boolean;reverse:boolean;conjugate:boolean;}
export function collisionFilm(progress:number,transforms:FilmTransforms){
 const t=Math.max(0,Math.min(1,progress)),time=transforms.reverse?1-t:t,after=time>=.5;
 const positions=after?[-.3-.6*(time-.5),-.1+(time-.5)]:[-.8+time,.2-.6*time];
 const velocities=after?[-.6,1]:[1,-.6],parity=transforms.mirror?-1:1,direction=transforms.reverse?-1:1;
 return {time,handedness:parity,particles:positions.map((x,i)=>({x:x*parity,velocity:velocities[i]*parity*direction,antiparticle:transforms.conjugate,name:i===0?"a":"b"}))};
}
