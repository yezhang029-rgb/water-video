import React from 'react';
import {C,ease} from './art';
import {workCurve} from './motion';
export function WorkScene({t}:{t:number}){
 const draw=ease((t-.4)/1.55),travel=ease((t-2.05)/2.25);
 const ball=workCurve(.2+.73*travel),tip={x:760+260*draw,y:420};
 return <g><rect x={330} y={270} width={1210} height={500} rx={22} fill={C.white} stroke={C.line} strokeWidth={3}/>
 <path d="M 430 630 C 570 630 570 420 760 420" fill="none" stroke={C.orange} strokeWidth={9} strokeLinecap="round"/>
 <path d="M 1020 420 C 1220 420 1220 630 1430 630" fill="none" stroke={C.orange} strokeWidth={9} strokeLinecap="round"/>
 <path d="M 760 420 H 1020" fill="none" stroke={C.line} strokeWidth={3} strokeDasharray="9 14"/>
 <path d={`M 760 420 H ${tip.x}`} fill="none" stroke={C.orange} strokeWidth={9} strokeLinecap="round"/>
 {t<2.05&&<g transform={`translate(${tip.x} ${tip.y}) rotate(32)`}><path d="M 0 0 L -16 -28 L -16 -165 L 16 -165 L 16 -28 Z" fill={C.ink}/><path d="M 0 0 L -9 -18 H 9 Z" fill={C.orange}/></g>}
 <circle cx={ball.x} cy={ball.y} r={29} fill={C.green} stroke={C.white} strokeWidth={4}/></g>;
}
