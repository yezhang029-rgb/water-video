import React from 'react';
import {AbsoluteFill,Easing,Freeze,interpolate,useCurrentFrame,useVideoConfig} from 'remotion';
import {OrbitEntry} from './OrbitEntry';
import {gradientText,mutedGradientText,numberGradientText} from './Typography';

const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const ease=Easing.bezier(.3,.65,.2,1);
const gold='#dfb879',cyan='#b5e4ec',font='Noto Sans CJK SC, sans-serif';
const sun={x:1287,y:630};
const random=(n:number)=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v);};
const point=(arm:number,r:number,jitter=0)=>{
  const a=arm*Math.PI/2+4.5*(1-r)+jitter;
  return {x:960+Math.cos(a)*r*690,y:540+Math.sin(a)*r*330};
};
const arms=Array.from({length:4},(_,a)=>Array.from({length:100},(_,i)=>{
  const p=point(a,.065+i/99*.935);
  return `${i?'L':'M'}${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
}).join(' '));
const stars=Array.from({length:1400},(_,i)=>{
  const r=.045+Math.sqrt(random(i+9))*.955;
  const arm=i%4;
  const p=point(arm,r,(random(i+440)-.5)*(.13+.25*r));
  return {...p,r,sz:.7+random(i+870)*2.2,alpha:.25+random(i+1900)*.65,warm:random(i+17)>.55};
});
const diskStars=Array.from({length:300},(_,i)=>{
  const a=random(i+8000)*Math.PI*2,r=Math.sqrt(random(i+9000));
  return {x:960+Math.cos(a)*r*670,y:540+Math.sin(a)*r*330,r:.7+random(i+11000),alpha:.1+random(i+12000)*.15};
});

export const GalaxyEntry:React.FC<{artworkOnly?:boolean}>=({artworkOnly=false})=>{
  const {fps}=useVideoConfig();
  const t=useCurrentFrame()/fps;
  const handoff=interpolate(t,[.12,.8],[0,1],clamp);
  const pull=interpolate(t,[.8,5.1],[0,1],{...clamp,easing:ease});
  const camera=Math.exp(Math.log(8)*(1-pull));
  const focusX=sun.x+(960-sun.x)*pull;
  const focusY=sun.y+(540-sun.y)*pull;
  const localSolar=interpolate(t,[.8,3.6],[.125,.0007],{...clamp,easing:ease});
  const solarFade=interpolate(t,[2.8,4],[1,0],clamp);
  const galaxy=interpolate(t,[.8,4.9],[0,1],clamp);
  const marker=interpolate(t,[3,4.2],[0,1],clamp);
  const firstCaption=interpolate(t,[.85,1.2,3.7,4.1],[0,1,1,0],clamp);
  const title=interpolate(t,[5.1,5.59],[0,1],clamp);
  const revealPulse=interpolate(t,[5.43,5.59,5.96],[0,1,0],clamp);
  const measure=interpolate(t,[6,6.6],[0,1],clamp);
  const sunScreenX=960+(sun.x-focusX)*camera;
  const sunScreenY=540+(sun.y-focusY)*camera;
  return <AbsoluteFill style={{background:artworkOnly?'transparent':'#15110f',overflow:'hidden'}}>
    <AbsoluteFill style={{opacity:1-handoff}}><Freeze frame={269}><OrbitEntry/></Freeze></AbsoluteFill>
    <AbsoluteFill style={{opacity:handoff}}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{position:'absolute'}}>
        <defs>
          <radialGradient id="galaxyBg"><stop stopColor="#20343a"/><stop offset=".6" stopColor="#151b1e"/><stop offset="1" stopColor="#15110f"/></radialGradient>
          <radialGradient id="galaxyCore"><stop stopColor="#f7dfae" stopOpacity=".54"/><stop offset=".28" stopColor="#d8b97b" stopOpacity=".22"/><stop offset="1" stopColor="#d8b97b" stopOpacity="0"/></radialGradient>
          <radialGradient id="galaxyDisk"><stop stopColor="#c8c4a2" stopOpacity=".06"/><stop offset=".65" stopColor="#7dbbc6" stopOpacity=".09"/><stop offset="1" stopColor="#7dbbc6" stopOpacity="0"/></radialGradient>
          <linearGradient id="galaxyType"><stop stopColor="#e6b878"/><stop offset=".48" stopColor="#fff0d1"/><stop offset="1" stopColor="#afe6ef"/></linearGradient>
          <filter id="galaxySoft"><feGaussianBlur stdDeviation="9"/></filter>
        </defs>
        {!artworkOnly&&<rect width="1920" height="1080" fill="url(#galaxyBg)"/>}
        <g transform={`translate(960 540) scale(${camera}) translate(${-focusX} ${-focusY})`}>
          <g opacity={galaxy}>
            <ellipse cx="960" cy="540" rx="760" ry="400" fill="url(#galaxyDisk)"/>
            {diskStars.map((s,i)=><circle key={i} cx={s.x} cy={s.y} r={s.r} fill={cyan} opacity={s.alpha}/>)}
            <g fill="none" stroke={cyan} strokeOpacity=".12" strokeWidth="22" filter="url(#galaxySoft)">{arms.map((d,i)=><path key={i} d={d}/>)}</g>
            <g fill="none" stroke={gold} strokeOpacity=".23" strokeWidth="1.7">{arms.map((d,i)=><path key={i} d={d}/>)}</g>
            {stars.map((s,i)=><circle key={i} cx={s.x} cy={s.y} r={s.sz} fill={s.warm?gold:cyan} opacity={s.alpha*interpolate(t,[.9+s.r*.3,4.4+s.r*.3],[0,1],clamp)*(.94+.06*Math.sin(t*1.1+i))}/>)}
            <ellipse cx="960" cy="540" rx="155" ry="92" fill="url(#galaxyCore)"/>
            <ellipse cx="960" cy="540" rx="210" ry="115" fill="url(#galaxyCore)" opacity={revealPulse*.45}/>
            <path d="M899 556Q960 530 1021 524" fill="none" stroke={gold} strokeWidth="16" strokeOpacity=".22" filter="url(#galaxySoft)"/>
            <path d="M917 552L1003 528" stroke="#f8e9c7" strokeOpacity=".6" strokeWidth="2.5" strokeLinecap="round"/>
          </g>
          <g transform={`translate(${sun.x} ${sun.y}) scale(${localSolar})`} opacity={solarFade}>
            <circle r="130" fill="url(#galaxyCore)" opacity=".45"/>
            <circle r="38" fill={gold} fillOpacity=".18" stroke={gold} strokeWidth="3"/>
            {[.387,.723,1,1.524].map((au,i)=>{
              const rx=400*au,a=[-.798,-1.899,0,.972][i];
              return <g key={i}>
                <ellipse rx={rx} ry={rx*.55} fill="none" stroke={i===2?cyan:gold} strokeWidth="2" strokeOpacity={i===2?.62:.22}/>
                <circle cx={rx*Math.cos(a)} cy={rx*.55*Math.sin(a)} r={i===2?10:i===3?7:5} fill={i===2?'#214b55':gold} stroke={i===2?cyan:gold} strokeWidth="2"/>
              </g>;
            })}
          </g>
        </g>

        {!artworkOnly&&<g opacity={marker}>
          <circle cx={sunScreenX} cy={sunScreenY} r="7" fill={cyan}/>
          <circle cx={sunScreenX} cy={sunScreenY} r={25+Math.sin(t*2)*2} fill="none" stroke={cyan} strokeWidth="1.8" strokeOpacity=".65"/>
          <path d={`M${sunScreenX+20} ${sunScreenY-12}L${sunScreenX+145} ${sunScreenY-98}H${sunScreenX+340}`} fill="none" stroke={gold} strokeWidth="2"/>
          <text x={sunScreenX+164} y={sunScreenY-117} fill="url(#galaxyType)" fontSize="35" letterSpacing="4" fontFamily={font}>太阳系</text>
        </g>}
        {!artworkOnly&&<g opacity={measure} fill="none" stroke={gold} strokeWidth="2" strokeOpacity=".6">
          <path d="M270 874H1650M270 855V893M1650 855V893"/>
        </g>}
        {!artworkOnly&&<><path d="M150 98H505" stroke={gold} strokeWidth="2" strokeOpacity=".4"/>
        <text x="150" y="86" fill="url(#galaxyType)" fontSize="20" letterSpacing="5" fontFamily={font}>PERSPECTIVE</text></>}
      </svg>
      {!artworkOnly&&<>
      <div style={{position:'absolute',right:145,top:145,fontFamily:font,fontSize:46,letterSpacing:4,opacity:firstCaption,...gradientText}}>太阳系，也只是银河中的一个位置。</div>
      <div style={{position:'absolute',left:145,top:145,fontFamily:font,fontSize:64,letterSpacing:8,opacity:title,...gradientText}}>银河系</div>
      <div style={{position:'absolute',left:145,bottom:104,fontFamily:font,fontSize:44,letterSpacing:3,opacity:measure,...gradientText}}>恒星盘直径，约 <span style={{fontSize:65,...numberGradientText}}>10 万光年</span></div>
      <div style={{position:'absolute',left:145,bottom:48,fontFamily:font,fontSize:26,letterSpacing:1,opacity:measure*.8,...mutedGradientText}}>1 光年约为 9.46 万亿公里</div>
      </>}
    </AbsoluteFill>
  </AbsoluteFill>;
};
