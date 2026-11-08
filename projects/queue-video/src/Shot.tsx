import React from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig,staticFile} from 'remotion';
import shots from './shots.json';
import captions from './captions.json';
import {C,ease} from './art';
import {QueueScenes} from './QueueScenes';
import {ExperimentScenes} from './ExperimentScenes';
import {LifeScenes} from './LifeScenes';
import {ActionScenes} from './ActionScenes';
import {ResolutionScenes} from './ResolutionScenes';
import {FinalPaths} from './FinalPaths';
import {ChoiceScene} from './ChoiceScene';
import {WorkScene} from './WorkScene';
import {EndingScenes} from './EndingScenes';
export function Shot({n}:{n:number}){
 const f=useCurrentFrame();const {fps}=useVideoConfig();const t=f/fps;const shot=shots[n];const dur=(shot.end-shot.start)/fps;
 const cap=captions.find(c=>c.startMs>=(shot.start/30)*1000&&c.startMs<(shot.end/30)*1000)?.text||'';
 const capStart=n===15?3:.25;const capEnd=n===29?3.8:dur-.35;
 const opacity=ease((t-capStart)/.15)*(1-ease((t-capEnd)/.15));
 const data=n>=28?<EndingScenes n={n} t={t}/>:n>=25?<FinalPaths n={n} t={t}/>:n===23?<WorkScene t={t}/>:n===18?<ChoiceScene t={t}/>:n<=2?<QueueScenes n={n} t={t} global={(shot.start+f)/fps}/>:n<=9?<ExperimentScenes n={n} t={t}/>:n<=18?<LifeScenes n={n} t={t}/>:n<=23?<ActionScenes n={n} t={t}/>:<ResolutionScenes n={n} t={t}/>;
 return <AbsoluteFill style={{background:C.bg,fontFamily:'"QueueNoto", "Noto Sans CJK SC", sans-serif',color:C.ink}}>
 <style>{`@font-face{font-family:QueueNoto;src:url('${staticFile('fonts/queue-noto.otf')}') format('opentype');font-weight:100 900;}`}</style>
 <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}>
 <defs><marker id="arrow" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 1 1 L 10 6 L 1 11" fill="none" stroke={C.orange} strokeWidth="2"/></marker><pattern id="paper" width="34" height="34" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".7" fill={C.ink} opacity=".09"/></pattern><linearGradient id="warmth" x1="0" y1="0" x2="0.9" y2="1"><stop stopColor="#F0D5AC"/><stop offset="1" stopColor="#CFA079"/></linearGradient><radialGradient id="daylight" cx=".12" cy=".06" r=".95"><stop stopColor="#FFE8B0" stopOpacity=".65"/><stop offset="1" stopColor="#FFE8B0" stopOpacity="0"/></radialGradient></defs>
 <rect width="1920" height="1080" fill="url(#warmth)"/><rect width="1920" height="1080" fill="url(#daylight)"/>
 <path d={n<=9||n>=28?'M 0 305 L 1920 305 L 1920 850 Q 960 805 0 850 Z':n>=19?'M 0 786 Q 960 615 1920 786 L 1920 843 Q 960 734 0 843 Z':'M 180 770 Q 960 845 1740 770 Q 960 600 180 770 Z'} fill={n<=9||n>=28?'#BD835C':'#A76D4A'} opacity={n<=9||n>=28?.09:.1}/>
 <rect width="1920" height="1080" fill="url(#paper)"/>{data}</svg>
 {cap&&<div style={{position:'absolute',left:120,right:120,top:870,textAlign:'center',fontSize:60,lineHeight:1.38,fontWeight:800,whiteSpace:'pre-line',opacity,translate:`0px ${12*(1-opacity)}px`}}>{cap}</div>}
 </AbsoluteFill>;
}
