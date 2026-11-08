import React from 'react';
import {C,Counter,Person,Card,txt,tween,ease,Arrow} from './art';
export function QueueScenes({n,t,global}:{n:number;t:number;global:number}){
 const entering=n===1;const ending=n>=28;
 const hx=n===0?960:entering?tween(t,.3,2.6,960,1440):1440;
 const hy=entering?765+Math.sin(ease((t-.3)/2.3)*Math.PI)*70:ending?tween(t,1.5,3.3,765,655):765;
 const moving=entering&&t>.3&&t<2.6||ending&&t>1.5&&t<3.3;
 return <g><path d="M 172 304 H 1748" stroke={C.line} strokeWidth={3}/>
 {[480,960,1440].map((x,i)=><g key={x}>
 <path d={`M ${x-98} 330 V 823 M ${x+98} 330 V 823`} stroke={i===2?C.orange:C.line} strokeWidth={3} opacity={.65}/>
 <Counter x={x} y={239} label={['01','02','03'][i]} alert={(n===1||n===2)&&i===2&&t>2.7}/>
 {((n===1||n===2)&&i===2)&&<g opacity={ease((t-2.7)/.25)}><Card x={x-99} y={108} w={198} h={52} title="需核对" color={C.bg} stroke={C.orange}/></g>}
 {[0,1,2].filter(k=>i!==2||k<1).map(k=><Person key={k} x={x} y={400+k*135-(i===1&&n>=1?tween(t,2.65,3.2,0,55):ending?tween(t,1,2.2,0,45):0)} scale={.8} walk={global*1.4} opacity={ending&&i===1&&k===0?1-ease(t/1.5):1}/>)}</g>)}
 <Person x={hx} y={hy} hero scale={1} walk={moving?global*13:0} look={n===0?Math.sin(global*2):n===2?-1:ending&&t<1.5?-1:0}/>
 {n===2&&<><Arrow d={`M 1335 720 Q 1140 ${680-30*Math.sin(t)} 1037 720`} width={4} opacity={Math.sin(t*Math.PI/5)*.7}/>{txt(1190,650,'?',65,C.orange)}</>}
 {n===0&&<circle cx={1440} cy={239} r={96+t*7} stroke={C.orange} strokeWidth={3} fill="none" opacity={.35-t*.04}/>}
 {ending&&<path d="M 1345 823 H 1537" stroke={C.orange} strokeWidth={7} strokeLinecap="round"/>}</g>;
}
