import React from 'react';
import {C,Person,Card,txt} from './art';
import {choiceCurve,choicePose} from './motion';
export function ChoiceScene({t}:{t:number}){
 const pose=choicePose(t),scale=.96;
 return <g>{['学习','求职','创作'].map((label,i)=>{
 const target=choiceCurve(i,1);const traversed=i===0?(t<1.7?pose.route===0?Math.max(pose.p,t>1.1?.32:0):0:.32):i===1?(t<1.7?0:t<3.3?Math.max(pose.p,t>2.7?.32:0):.32):t>3.3?pose.p:0;
 return <g key={label}>
 <path d={`M 420 735 Q ${750+i*90} ${260+i*200} 1470 ${260+i*220}`} fill="none" stroke={C.line} strokeWidth={23} strokeLinecap="round"/>
 <path d={`M 420 735 Q ${750+i*90} ${260+i*200} 1470 ${260+i*220}`} fill="none" stroke={i===pose.route?C.orange:C.ink} strokeOpacity={i===pose.route?.6:.15} strokeWidth={6} strokeLinecap="round"/>
 {Array.from({length:6},(_,j)=>{const u=.04+j*.05,p=choiceCurve(i,u),next=choiceCurve(i,u+.001);return <g key={j} opacity={u<traversed?.4:0} transform={`translate(${p.x} ${p.y}) rotate(${Math.atan2(next.y-p.y,next.x-p.x)*180/Math.PI})`}><ellipse cx={-5} cy={-8} rx={7} ry={3.5} fill={C.ink}/><ellipse cx={7} cy={8} rx={7} ry={3.5} fill={C.ink}/></g>})}
 <Card x={1410} y={target.y-70} w={270} h={110} title={label} stroke={i===pose.route?C.orange:C.line}/>
 </g>})}
 <Person x={pose.x} y={pose.y-82*scale} hero scale={scale} walk={pose.moving?t*16:0} look={pose.direction} arm={pose.moving?0:.35}/>
 {!pose.moving&&t<3.3&&txt(pose.x+72,pose.y-135,'?',45,C.orange)}</g>;
}
