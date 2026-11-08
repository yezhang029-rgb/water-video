import React from 'react';
import {C,Person,Card,Calendar,tween,ease} from './art';
import {finalRoute,routeY} from './motion';
export function FinalPaths({n,t}:{n:number;t:number}){
 const depth=n===25?ease(t/4):1;
 const heroProgress=n===27?tween(t,1.5,3.6,.3,.58):.3;
 return <g>{[0,1,2].map(i=>{const y=routeY(i),spread=(i-1)*60*depth;const scale=i===1?.9:.65;
 const person=finalRoute(i,depth,i===1?heroProgress:.69+(n===27?t*.012:0));
 return <g key={i}>
 <path d={`M ${270+i*60} ${y+120+spread} L ${760-i*40} ${y+120+spread} Q ${940-i*60} ${y+120-180*depth+spread} ${1120+i*50} ${y+70*depth+spread} L ${1610-i*50} ${y+70*depth+spread}`} fill="none" stroke={C.ink} strokeWidth={26} opacity={.09} strokeLinecap="round" transform="translate(0 10)"/>
 <path d={`M ${270+i*60} ${y+120+spread} L ${760-i*40} ${y+120+spread} Q ${940-i*60} ${y+120-180*depth+spread} ${1120+i*50} ${y+70*depth+spread} L ${1610-i*50} ${y+70*depth+spread}`} fill="none" stroke={i===1?C.orange:C.line} strokeWidth={18} strokeLinecap="round"/>
 <Person x={person.x} y={person.y-82*scale} hero={i===1} scale={scale} walk={n===27?t*12:0}/></g>})}
 <g opacity={n===25?1-depth*.6:n===26?.4*(1-ease(t/.6)):0}><path d="M 900 220 V 780" stroke={C.muted} strokeWidth={9}/>{Array.from({length:12},(_,i)=><path key={i} d={`M 890 ${240+i*45} H 930`} stroke={C.muted} strokeWidth={3}/>)}</g>
 <g opacity={depth}><Calendar x={1450} y={445} scale={.6}/></g>
 <g opacity={depth} transform={`translate(${n===27?tween(t,.2,1.1,1170,1140):1170} 410)`}>
 <path d="M 100 120 V 85" stroke={C.orange} strokeWidth={3}/><Card x={0} y={0} w={210} h={85} title="改一处" stroke={C.orange}/>
 {n===27&&t>3.6&&<path d="M 160 60 l 9 9 l 18 -22" fill="none" stroke={C.green} strokeWidth={4} opacity={ease((t-3.6)/.3)}/>}
 </g></g>;
}
