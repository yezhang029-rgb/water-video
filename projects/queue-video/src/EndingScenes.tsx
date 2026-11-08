import React from 'react';
import {C,Person,Counter,Card,tween,ease} from './art';
export function EndingScenes({n,t}:{n:number;t:number}){
 const clock=(n===28?0:5)+t;
 const heroY=tween(clock,4.4,7.2,660,510);
 const inspect=ease((clock-1.1)/.4)*(1-ease((clock-4.1)/.3));
 const heroX=1320;
 return <g><path d="M 250 310 H 1680" stroke={C.line} strokeWidth={3}/>
 {[690,1320].map(x=><g key={x}><Counter x={x} y={246} label={x===690?'02':'03'}/><path d={`M ${x-110} 330 V 815 M ${x+110} 330 V 815`} fill="none" stroke={x===1320?C.orange:C.line} strokeWidth={4}/></g>)}
 <Person x={tween(clock,0,1.2,690,480)} y={440} walk={clock<1.2?clock*14:0} opacity={1-ease((clock-.8)/.4)}/>
 <Person x={tween(clock,2.2,4.1,1320,1570)} y={420} walk={clock>2.2&&clock<4.1?clock*13:0} opacity={1-ease((clock-3.7)/.5)}/>
 <Person x={heroX} y={heroY} hero scale={1.28} look={clock<1.1?-1:clock<4.3?1:0} arm={inspect*.8} walk={clock>4.4&&clock<7.2?clock*13:0}/>
 <g opacity={inspect} transform={`translate(${heroX+100} ${heroY-60})`}><Card x={0} y={0} w={255} h={175}>
 <rect x={27} y={39} width={29} height={29} rx={5} fill="none" stroke={C.ink} strokeWidth={3}/><path d="M 80 53 H 219" stroke={C.ink} strokeWidth={7} strokeLinecap="round"/>
 <rect x={27} y={100} width={29} height={29} rx={5} fill="none" stroke={C.ink} strokeWidth={3}/><path d="M 80 115 H 185" stroke={C.ink} strokeWidth={7} strokeLinecap="round"/>
 </Card></g>
 {clock>=5&&<g opacity={ease((clock-5)/.5)}><Card x={380} y={443} w={455} h={230} title="改一处">
 <path d="M 80 158 H 277" stroke={C.orange} strokeWidth={7} strokeLinecap="round"/>
 <path d="M 323 147 l 17 19 l 37 -47" pathLength={1} strokeDasharray={1} strokeDashoffset={1-ease((clock-7.2)/.6)} fill="none" stroke={C.green} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round"/>
 </Card><path d="M 852 557 H 1080" stroke={C.orange} strokeWidth={3} strokeDasharray="8 10"/><circle cx={1095} cy={557} r={7} fill={C.orange}/></g>}</g>;
}
