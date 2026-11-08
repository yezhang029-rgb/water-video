import React from 'react';
import {C,Person,Card,Calendar,tween,ease} from './art';
import {Ruler} from './LifeScenes';
export function ResolutionScenes({n,t}:{n:number;t:number}){
 if(n===24){return <g><Ruler t={t} labels={['任务不同','起点不同','可用时间不同']}/><Person x={450} y={560} hero scale={1.1}/><path d="M 300 790 C 460 790 450 735 600 735" fill="none" stroke={C.orange} strokeWidth={5}/></g>}
 const p=n===25?ease(t/4):1;const heroStep=n===27?tween(t,1.8,3.4,0,130):0;
 return <g><g transform={`translate(960 520) scale(${n===26?tween(t,0,.6,1.08,1):1}) translate(-960 -520)`}>
 {[0,1,2].map((i)=>{const y=330+i*130;const spread=(i-1)*60*p;return <g key={i} transform={`translate(0 ${spread})`}>
 <path d={`M ${270+i*60} ${y+120} L ${760-i*40} ${y+120} Q ${940-i*60} ${y+120-180*p} ${1120+i*50} ${y+70*p} L ${1610-i*50} ${y+70*p}`} fill="none" stroke={i===1?C.orange:C.line} strokeWidth={18} strokeLinecap="round"/>
 <path d={`M ${270+i*60} ${y+142} L ${760-i*40} ${y+142} Q ${940-i*60} ${y+142-180*p} ${1120+i*50} ${y+22+70*p} L ${1610-i*50} ${y+22+70*p}`} fill="none" stroke={C.ink} strokeWidth={2} opacity={.1}/>
 <Person x={i===1?670+heroStep:1080+Math.sin(t*.5+i)*18} y={y+30} hero={i===1} scale={i===1?.9:.65} walk={n===27?t*5:0}/></g>})}
 <g opacity={1-(n===26?ease(t/.6):p*.6)}><path d="M 900 220 V 780" stroke={C.muted} strokeWidth={10}/>{Array.from({length:12},(_,i)=><path key={i} d={`M 890 ${240+i*45} H 930`} stroke={C.muted} strokeWidth={3}/>)}</g>
 <g opacity={p}><Calendar x={1330} y={365} scale={.65}/>{n!==27&&<Card x={1020} y={554} w={200} h={97} title="改一处" stroke={C.orange}/>}</g>
 {n===27&&<g transform={`translate(${tween(t,.1,1.2,1020,735)} ${tween(t,.1,1.2,554,555)})`}><Card x={0} y={0} w={200} h={95} title="改一处" stroke={C.orange}/></g>}
 </g></g>;
}
