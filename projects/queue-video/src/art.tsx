import React from 'react';
import {deskCurve} from './motion';
export const C={bg:'#D7E0DC',ink:'#203A4A',orange:'#DE612D',green:'#227962',muted:'#576B69',light:'#BCC9C4',white:'#F4EBDD',line:'#939F96'};
export const clamp=(n:number)=>Math.max(0,Math.min(1,n));
export const ease=(n:number)=>{const x=clamp(n);return x*x*(3-2*x)};
export const tween=(t:number,a:number,b:number,x:number,y:number)=>x+(y-x)*ease((t-a)/(b-a));
export const txt=(x:number,y:number,s:string,size=32,color=C.ink,anchor:'start'|'middle'|'end'='middle')=><text x={x} y={y} fontSize={size} fill={color} textAnchor={anchor} dominantBaseline="middle" fontWeight={600}>{s}</text>;
export function Person({x,y,scale=1,hero=false,walk=0,look=0,arm=0,opacity=1}:{x:number;y:number;scale?:number;hero?:boolean;walk?:number;look?:number;arm?:number;opacity?:number}){
 const col=hero?C.orange:C.ink;const step=Math.sin(walk)*12;
 return <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>
 <ellipse cy={87} rx={43} ry={10} fill={C.ink} opacity={.09}/>
 <path d={`M -17 52 L ${-20+step} 82 M 16 52 L ${21-step} 82`} stroke={C.ink} strokeWidth={13} strokeLinecap="round"/>
 <rect x={-31} y={-15} width={62} height={79} rx={29} fill={col}/>
 <path d={`M -28 6 Q -49 24 -41 ${42-step*.6} M 28 6 Q 45 ${25-arm*30} ${42+arm*14} ${42-arm*60}`} fill="none" stroke={col} strokeWidth={13} strokeLinecap="round"/>
 <circle cy={-49} r={30} fill={col}/>
 <circle cx={look*9-8} cy={-50} r={2.8} fill={hero?C.ink:C.bg}/><circle cx={look*9+6} cy={-50} r={2.8} fill={hero?C.ink:C.bg}/>
 {hero&&<><path d="M -23 -6 L 23 49" stroke={C.ink} strokeWidth={5}/><rect x={5} y={34} width={31} height={27} rx={7} fill={C.ink}/><path d="M 10 42 H 29" stroke={C.bg} strokeWidth={2}/></>}
 </g>;
}
export function Card({x,y,w=280,h=150,title='',sub='',color=C.white,stroke=C.line,rotate=0,children}:{x:number;y:number;w?:number;h?:number;title?:string;sub?:string;color?:string;stroke?:string;rotate?:number;children?:React.ReactNode}){
 return <g transform={`translate(${x} ${y}) rotate(${rotate})`}><rect x={7} y={12} width={w} height={h} rx={18} fill={C.ink} opacity={.11}/><rect width={w} height={h} rx={18} fill={color} stroke={stroke} strokeWidth={2.5}/>{title&&txt(w/2,sub?h*.4:h/2,title,34)}{sub&&txt(w/2,h*.72,sub,25,C.muted)}{children}</g>;
}
export const Arrow=({d,color=C.orange,width=7,opacity=1}:{d:string;color?:string;width?:number;opacity?:number})=><path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" markerEnd={width>4?'url(#arrow)':undefined} opacity={opacity}/>;
export function Counter({x,y,label,alert=false}:{x:number;y:number;label:string;alert?:boolean}){return <g transform={`translate(${x} ${y})`}><rect x={-130} y={-65} width={260} height={130} rx={20} fill={C.white} stroke={C.ink} strokeWidth={4}/><rect x={-148} y={46} width={296} height={27} rx={8} fill={C.ink}/><rect x={-68} y={-37} width={136} height={60} rx={7} fill={alert?C.orange:C.light}/>{txt(0,-8,label,34,alert?C.white:C.ink)}</g>}
export function Dots({x,y,t}:{x:number;y:number;t:number}){return <g>{[0,1,2].map(i=><circle key={i} cx={x+i*25} cy={y} r={5} fill={C.muted} opacity={.35+.65*(.5+.5*Math.sin(t*4-i))}/>)}</g>}
export function Calendar({x,y,scale=1}:{x:number;y:number;scale?:number}){return <g transform={`translate(${x} ${y}) scale(${scale})`}><Card x={0} y={0} w={230} h={210}><rect width={230} height={53} rx={16} fill={C.orange}/>{txt(115,28,'本周五',29,C.white)}{txt(115,115,'提交',45)}<path d="M 62 -9 V 15 M 166 -9 V 15" stroke={C.ink} strokeWidth={8} strokeLinecap="round"/></Card></g>}
export function Desk({t,mode=0}:{t:number;mode?:number}){const ball=deskCurve(ease((t-.35)/3.9));return <g><path d="M 340 681 H 1430 M 430 685 V 812 M 1335 685 V 812" stroke={C.ink} strokeWidth={13} strokeLinecap="round"/><rect x={710} y={335} width={590} height={332} rx={24} fill={C.white} stroke={C.ink} strokeWidth={5}/><path d="M 1005 666 V 682" stroke={C.ink} strokeWidth={12}/><path d="M 770 609 H 1235" stroke={C.line} strokeWidth={3}/>{mode===0?<><rect x={765} y={390} width={478} height={152} rx={17} fill={C.bg}/>{txt(1005,441,'申请已提交',40)}<Dots x={981} y={493} t={t}/></>:<><path d="M 770 532 C 860 415 940 520 1000 425" stroke={C.orange} strokeWidth={7} fill="none"/><circle cx={ball.x} cy={ball.y} r={22} fill={C.green} stroke={C.white} strokeWidth={3}/>{[0,1,2,3].map(i=><rect key={i} x={780+i*113} y={577} width={96} height={18} rx={4} fill={i<2?C.orange:C.light}/>)}</>}<Person x={555} y={606} hero scale={1.5} arm={.45}/><path d="M 506 717 H 625 M 553 717 V 801" stroke={C.ink} strokeWidth={10} strokeLinecap="round"/></g>}
