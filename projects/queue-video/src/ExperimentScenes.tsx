import React from 'react';
import {C,Person,Counter,Card,txt,tween,ease,clamp} from './art';
function Units({x,y,count,t,color}:{x:number;y:number;count:number;t:number;color:string}){return <g>{Array.from({length:count},(_,i)=><rect key={i} x={x+i*88} y={y} width={78} height={88} rx={12} fill={color} opacity={ease((t-i*.08)/.4)}/>)}{txt(x+count*44-5,y+132,`${count} 秒`,55,color)}</g>}
export function ExperimentScenes({n,t}:{n:number;t:number}){
 if(n===7||n===8){const u=n===7?t:n===8?5+t:0;const reveal=n===8?ease(t/.6):0;return <g>
 {[440,1110].map((x,i)=><g key={x}>{txt(x+170,230,i===0?'4 人':'2 人',45)}<g transform={`translate(${x+170} 380)`}>{Array.from({length:i===0?4:2},(_,j)=><Person key={j} x={(j-(i===0?1.5:.5))*85} y={0} scale={.56}/>)}</g></g>)}
 <Units x={430} y={530} count={4} color={C.green} t={u}/><defs><clipPath id="taskReveal"><rect x={1080} y={520} width={n===7?370:tween(t,0,.6,370,560)} height={260}/></clipPath></defs><g clipPath="url(#taskReveal)"><Units x={1090} y={530} count={6} color={C.orange} t={u-.2}/></g>
 {n===8&&<g opacity={reveal}><path d="M 1110 485 H 1350 M 1110 475 V 495 M 1350 475 V 495" stroke={C.ink} strokeWidth={4}/>{txt(1225,452,'只量了人数',30,C.muted)}<Person x={950} y={654} hero scale={.7} look={1}/></g>}</g>}
 if(n===9){return <g><g transform={`translate(${tween(t,0,1,0,-70)} ${tween(t,0,1,0,-25)}) scale(${tween(t,0,1,1,.65)})`}><Card x={270} y={300} w={650} h={430} title="示意算例"><Units x={55} y={230} count={4} t={5} color={C.green}/></Card></g>{['处理速度','临时情况','到达时机'].map((s,i)=><g key={s} opacity={ease((t-.7-i*.45)/.5)}><Card x={910+i*52} y={260+i*175} w={460} h={130} title={s}/></g>)}</g>}
 const elapsed=n===5?Math.min(5,Math.max(0,t-.5)):n===6?5+Math.min(1,t):0;
 return <g>{txt(960,150,'同速窗口  /  同时开始',32,C.muted)}{n>=4&&txt(960,205,'示意算例 · 清空现有任务的时间',29,C.muted)}
 {[520,1210].map((x,col)=><g key={x}><Counter x={x} y={306} label={col===0?'左':'右'}/>
 {(col===0?[1,1,1,1]:[5,1]).map((d,i)=>{const begin=col===0?i:i===0?0:5;const done=elapsed>=begin+d;const fade=(n===5||n===6)&&done?.2:1;
 return <g key={i} opacity={fade}><Person x={x-90+((n===5||n===6)&&done?tween(elapsed,begin+d,begin+d+.4,-115,0):0)} y={450+i*86} scale={.47}/>
 {n>=4&&<g opacity={n===4?ease((t-.6-col*.5-i*.2)/.5):1}><Card x={x-12} y={410+i*86} w={218} h={70} title={`${d}秒`} stroke={done?C.green:C.line}/>{n>=5&&<rect x={x-9} y={469+i*86} width={210*clamp((elapsed-begin)/d)} height={7} rx={3} fill={C.green}/>}</g>}</g>;
 })}{n===3&&txt(x,807,col===0?'4 人':'2 人',66,col===0?C.ink:C.orange)}</g>)}
 {n>=5&&<g><circle cx={960} cy={485} r={94} fill={C.white} stroke={C.line} strokeWidth={3}/>{txt(960,470,`${elapsed.toFixed(1)}`,60)}{txt(960,530,'共同计时 / 秒',24,C.muted)}</g>}
 {n===6&&t>=1&&<g opacity={ease((t-1)/.4)}>{txt(520,792,'4 秒',68,C.green)}{txt(1210,792,'6 秒',68,C.orange)}</g>}
 <Person x={210} y={748} hero scale={.65} look={1}/></g>;
}
