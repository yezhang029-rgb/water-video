import React from 'react';
import {AbsoluteFill, Easing, Freeze, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {ScaleAnalogy} from './ScaleAnalogy';
import {gradientText, mutedGradientText, numberGradientText} from './Typography';

const clamp = {extrapolateLeft:'clamp', extrapolateRight:'clamp'} as const;
const ease = Easing.bezier(.24,.74,.2,1);
const cyan='#b5e4ec';
const gold='#dfb879';
const font='Noto Sans CJK SC, sans-serif';

export const OrbitEntry: React.FC = () => {
  const {fps}=useVideoConfig();
  const t=useCurrentFrame()/fps;
  const enter=interpolate(t,[.08,.7],[0,1],clamp);
  const zoom=Math.exp(interpolate(t,[.8,3.4],[Math.log(330/4.07),0],clamp));
  const moonX=interpolate(t,[.8,3.4],[1265,1420],{...clamp,easing:ease});
  const solar=interpolate(t,[5,6.4],[0,1],{...clamp,easing:ease});
  const earthX=interpolate(solar,[0,1],[moonX-900*zoom,1360],clamp);
  const earthR=interpolate(solar,[0,1],[14.92*zoom,10],clamp);
  const earthY=540-Math.sin(solar*Math.PI)*230;
  const distance=interpolate(t,[3.1,3.5,4.75,5.35],[0,1,1,0],clamp);
  const reset=interpolate(t,[.35,.7,1.65,2.05],[0,1,1,0],clamp);
  const outward=interpolate(t,[2.0,2.4,4.6,5],[0,1,1,0],clamp);
  const solarTitle=interpolate(t,[5.05,5.35,6.4,6.7],[0,1,1,0],clamp);
  const finalTitle=interpolate(t,[6.9,7.25],[0,1],clamp);
  const solarData=interpolate(t,[6.4,6.9],[0,1],clamp);
  const stars=Array.from({length:90},(_,i)=>({x:130+(i*227.71)%1660,y:150+(i*137.43)%690}));
  return (
    <AbsoluteFill style={{background:'#15110f',overflow:'hidden'}}>
      <AbsoluteFill style={{opacity:1-enter}}><Freeze frame={278}><ScaleAnalogy/></Freeze></AbsoluteFill>
      <AbsoluteFill style={{opacity:enter}}>
        <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{position:'absolute'}}>
          <defs>
            <radialGradient id="orbitBg"><stop stopColor="#203940"/><stop offset=".6" stopColor="#172125"/><stop offset="1" stopColor="#15110f"/></radialGradient>
            <linearGradient id="orbitType"><stop stopColor="#e6b878"/><stop offset=".48" stopColor="#fff0d1"/><stop offset="1" stopColor="#afe6ef"/></linearGradient>
            <radialGradient id="earthFill"><stop stopColor="#2b6067"/><stop offset="1" stopColor="#143039"/></radialGradient>
            <radialGradient id="sunGlow"><stop stopColor="#edc77f" stopOpacity=".2"/><stop offset="1" stopColor="#edc77f" stopOpacity="0"/></radialGradient>
          </defs>
          <rect width="1920" height="1080" fill="url(#orbitBg)"/>
          <g fill={cyan} opacity={solar*.36}>{stars.map((s,i)=><circle key={i} cx={s.x} cy={s.y} r={1+i%3*.5}/>)}</g>
          <path d="M150 98H505M150 900H520M1400 900H1775" fill="none" stroke={gold} strokeWidth="2" opacity=".28"/>
          <text x="150" y="86" fill="url(#orbitType)" fontSize="20" letterSpacing="5" fontFamily={font}>OUTWARD</text>

          <g opacity={1-solar}>
            <circle cx={moonX} cy="540" r={4.07*zoom} fill="#282823" fillOpacity=".22" stroke={gold} strokeWidth={2+zoom/81} strokeOpacity=".7"/>
            {[[ -.294,-.336,.145],[.376,.218,.2],[-.106,.497,.106]].map(([x,y,r],i)=><circle key={i} cx={moonX+x*4.07*zoom} cy={540+y*4.07*zoom} r={r*4.07*zoom} fill="none" stroke={gold} strokeWidth="1.5" opacity=".16"/>)}
            <g opacity={distance} stroke={gold} strokeWidth="2" fill="none">
              <path d={`M${earthX} 698H${moonX}M${earthX} 680V716M${moonX} 680V716`}/>
            </g>
            <g opacity={distance} fill="url(#orbitType)" fontFamily={font} fontSize="30" letterSpacing="3">
              <text x={earthX} y="615" textAnchor="middle">地球</text><text x={moonX} y="615" textAnchor="middle">月球</text>
              <text x="970" y="758" textAnchor="middle">平均距离 ≈ 38.44 万公里</text>
            </g>
          </g>

          <g opacity={solar}>
            <circle cx="960" cy="540" r="130" fill="url(#sunGlow)"/>
            <circle cx="960" cy="540" r="38" fill="#ddad5e" fillOpacity=".18" stroke={gold} strokeWidth="3"/>
            <circle cx="960" cy="540" r="47" fill="none" stroke={gold} strokeOpacity=".22" strokeWidth="2"/>
            {[.387,.723,1,1.524].map((au,i)=>{
              const rx=400*au;
              const a=[-1.4,-2.3,0,.8][i]+Math.max(0,t-6.1)*[.21,.14,0,.06][i];
              return <g key={au}>
                <ellipse cx="960" cy="540" rx={rx} ry={rx*.55} fill="none" stroke={i===2?cyan:gold} strokeOpacity={i===2?.62:.22} strokeWidth="2" pathLength="1" strokeDasharray="1" strokeDashoffset={1-solar}/>
                {i!==2&&<circle cx={960+rx*Math.cos(a)} cy={540+rx*.55*Math.sin(a)} r={i===3?7:5} fill={gold} opacity=".8"/>}
              </g>;
            })}
            <g opacity={solarData}>
              <path d="M960 540H1360" fill="none" stroke={cyan} strokeOpacity=".45" strokeWidth="2" strokeDasharray="6 10"/>
              <text x="960" y="625" fill="url(#orbitType)" fontSize="29" textAnchor="middle" fontFamily={font}>太阳</text>
              <path d="M1360 520L1430 432H1665" fill="none" stroke={gold} strokeWidth="2"/>
              <text x="1450" y="408" fill="url(#orbitType)" fontSize="32" letterSpacing="3" fontFamily={font}>地球 · 1 AU</text>
            </g>
          </g>
          <circle cx={earthX} cy={earthY} r={earthR} fill="url(#earthFill)" stroke={cyan} strokeWidth="2.5"/>
          <path d={`M${earthX-earthR*.45} ${earthY-earthR*.42}q${earthR*.7} ${-earthR*.25} ${earthR*.9} ${earthR*.3}t${-earthR*.2} ${earthR*.7}`} fill="none" stroke={cyan} strokeOpacity=".55" strokeWidth="1.7"/>
          <circle cx={earthX} cy={earthY} r={earthR+8} fill="none" stroke={cyan} strokeOpacity={solar*.3} strokeWidth="1.5"/>
        </svg>
        <div style={{position:'absolute',right:145,top:146,fontFamily:font,fontSize:47,letterSpacing:4,opacity:reset,...gradientText}}>让月球，回到真实尺度。</div>
        <div style={{position:'absolute',right:145,top:146,fontFamily:font,fontSize:48,letterSpacing:4,opacity:outward,...gradientText}}>向外看，我们又有多大？</div>
        <div style={{position:'absolute',right:145,top:146,fontFamily:font,fontSize:47,letterSpacing:4,opacity:solarTitle,...gradientText}}>再换到太阳的视角。</div>
        <div style={{position:'absolute',left:145,bottom:105,fontFamily:font,fontSize:45,letterSpacing:3,opacity:finalTitle,...gradientText}}>地日平均距离，约 <span style={{fontSize:64,...numberGradientText}}>1.50 亿公里</span></div>
        <div style={{position:'absolute',left:145,bottom:48,fontFamily:font,fontSize:26,letterSpacing:1,opacity:distance*.8,...mutedGradientText}}>此处地球、月球直径与间距使用同一比例；位置为示意</div>
        <div style={{position:'absolute',right:145,top:88,fontFamily:font,fontSize:24,letterSpacing:3,opacity:solarData*.65,...mutedGradientText}}>轨道示意</div>
        <div style={{position:'absolute',left:145,bottom:48,fontFamily:font,fontSize:26,letterSpacing:1,opacity:solarData*.8,...mutedGradientText}}>1 AU 为地日平均距离</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
