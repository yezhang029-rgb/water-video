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
export function Shot({n}:{n:number}){
 const f=useCurrentFrame();const {fps}=useVideoConfig();const t=f/fps;const shot=shots[n];const dur=(shot.end-shot.start)/fps;
 const cap=captions.find(c=>c.startMs>=(shot.start/30)*1000&&c.startMs<(shot.end/30)*1000)?.text||'';
 const capStart=n===15?3:.25;const capEnd=n===29?3.8:dur-.35;
 const opacity=ease((t-capStart)/.15)*(1-ease((t-capEnd)/.15));
 const data=n<=2||n>=28?<QueueScenes n={n} t={t} global={(shot.start+f)/fps}/>:n<=9?<ExperimentScenes n={n} t={t}/>:n<=18?<LifeScenes n={n} t={t}/>:n<=23?<ActionScenes n={n} t={t}/>:<ResolutionScenes n={n} t={t}/>;
 return <AbsoluteFill style={{background:C.bg,fontFamily:'"QueueNoto", "Noto Sans CJK SC", sans-serif',color:C.ink}}>
 <style>{`@font-face{font-family:QueueNoto;src:url('${staticFile('fonts/queue-noto.otf')}') format('opentype');font-weight:100 900;}`}</style>
 <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}>
 <defs><marker id="arrow" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 1 1 L 10 6 L 1 11" fill="none" stroke={C.orange} strokeWidth="2"/></marker><pattern id="paper" width="34" height="34" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".7" fill={C.ink} opacity=".055"/></pattern></defs>
 <rect width="1920" height="1080" fill="url(#paper)"/>{data}</svg>
 {cap&&<div style={{position:'absolute',left:120,right:120,top:870,textAlign:'center',fontSize:60,lineHeight:1.38,fontWeight:800,whiteSpace:'pre-line',opacity,translate:`0px ${12*(1-opacity)}px`}}>{cap}</div>}
 </AbsoluteFill>;
}
