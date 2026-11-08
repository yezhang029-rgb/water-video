import React from 'react';
import {C,Person,Card,tween,ease} from './art';
export function exitPose(clock:number){
 const initialFoot=510+82*1.28;
 const foot=clock<10?initialFoot:clock<11?tween(clock,10,11,initialFoot,575):clock<13?tween(clock,11,13,575,355):tween(clock,13,14,355,330);
 const scale=clock<10?1.28:clock<11?tween(clock,10,11,1.28,1.24):clock<13?tween(clock,11,13,1.24,.9):tween(clock,13,14,.9,.8);
 return{foot,scale,y:foot-82*scale,back:ease((clock-10.15)/.65),moving:clock>=10&&clock<14};
}
function Gate({x,active,clock}:{x:number;active:boolean;clock:number}){
 return <g opacity={active?1:tween(clock,10,12,.7,.28)}>
 <path d={`M ${x-110} 815 V 500 M ${x+110} 815 V 500`} stroke={active?C.orange:C.line} strokeWidth={3} opacity={.55}/>
 <path d={`M ${x-110} 500 V 210 Q ${x-110} 180 ${x-80} 180 H ${x+80} Q ${x+110} 180 ${x+110} 210 V 500`} fill="none" stroke={active?C.ink:C.muted} strokeWidth={5} strokeLinecap="round"/>
 <path d={`M ${x-110} 500 H ${x+110}`} stroke={active?C.orange:C.line} strokeWidth={4}/>
 </g>;
}
export function EndingScenes({n,t}:{n:number;t:number}){
 const clock=(n===28?0:5)+t;
 const pose=exitPose(clock);
 const heroY=clock<10?tween(clock,4.4,7.2,660,510):pose.y;
 const inspect=ease((clock-1.1)/.4)*(1-ease((clock-4.1)/.3));
 const heroX=1320;
 const light=ease((clock-9.7)/1.1)*.24;
 return <g transform={`translate(1320 500) scale(${tween(clock,10,13,1,1.045)}) translate(-1320 -500) translate(0 ${tween(clock,10,13,0,45)})`}>
 <defs><linearGradient id="passage-light" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#FFE6A6"/><stop offset="1" stopColor="#FFE6A6" stopOpacity="0"/></linearGradient></defs>
 <path d="M 1210 500 L 1120 820 H 1520 L 1430 500 Z" fill="url(#passage-light)" opacity={light}/>
 <rect x={1213} y={183} width={214} height={317} rx={25} fill="#FFE6A6" opacity={light*.55}/>
 <Gate x={690} active={false} clock={clock}/><Gate x={1320} active clock={clock}/>
 <Person x={tween(clock,0,1.2,690,480)} y={440} walk={clock<1.2?clock*14:0} opacity={1-ease((clock-.8)/.4)}/>
 <Person x={tween(clock,2.2,4.1,1320,1570)} y={420} walk={clock>2.2&&clock<4.1?clock*13:0} opacity={1-ease((clock-3.7)/.5)}/>
 {clock>=10&&<ellipse cx={heroX+10} cy={pose.foot+9} rx={52*pose.scale} ry={11*pose.scale} fill={C.ink} opacity={.07} transform={`rotate(12 ${heroX} ${pose.foot})`}/>}
 <Person x={heroX} y={heroY} hero scale={clock<10?1.28:pose.scale} back={pose.back} look={clock<1.1?-1:clock<4.3?1:0} arm={inspect*.8} walk={clock>4.4&&clock<7.2||pose.moving?clock*13:0}/>
 <g opacity={inspect} transform={`translate(${heroX+100} ${heroY-60})`}><Card x={0} y={0} w={255} h={175}>
 <rect x={27} y={39} width={29} height={29} rx={5} fill="none" stroke={C.ink} strokeWidth={3}/><path d="M 80 53 H 219" stroke={C.ink} strokeWidth={7} strokeLinecap="round"/>
 <rect x={27} y={100} width={29} height={29} rx={5} fill="none" stroke={C.ink} strokeWidth={3}/><path d="M 80 115 H 185" stroke={C.ink} strokeWidth={7} strokeLinecap="round"/>
 </Card></g>
 {clock>=5&&<g opacity={ease((clock-5)/.5)*(1-ease((clock-10)/.75))}><Card x={380} y={443} w={455} h={230} title="改一处">
 <path d="M 80 158 H 277" stroke={C.orange} strokeWidth={7} strokeLinecap="round"/>
 <path d="M 323 147 l 17 19 l 37 -47" pathLength={1} strokeDasharray={1} strokeDashoffset={1-ease((clock-7.2)/.6)} fill="none" stroke={C.green} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round"/>
 </Card><path d="M 852 557 H 1080" stroke={C.orange} strokeWidth={3} strokeDasharray="8 10"/><circle cx={1095} cy={557} r={7} fill={C.orange}/></g>}</g>;
}
