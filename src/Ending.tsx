import React from 'react';
import {AbsoluteFill,Easing,Freeze,interpolate,useCurrentFrame,useVideoConfig} from 'remotion';
import {PerspectiveTurn} from './PerspectiveTurn';
import {Opening2D} from './Opening2D';
import {gradientText} from './Typography';

const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const ease=Easing.bezier(.28,.7,.2,1);
const gold='#dfb879',cyan='#b5e4ec',font='Noto Sans CJK SC, sans-serif';

export const Ending:React.FC=()=>{
  const t=useCurrentFrame()/useVideoConfig().fps;
  const handoff=interpolate(t,[.2,.95],[0,1],clamp);
  const openingZoom=interpolate(t,[.15,.95],[0,1],{...clamp,easing:ease});
  const s=1+openingZoom*1.4;
  const fx=960+openingZoom*475,fy=540+openingZoom*40;
  const arrive=interpolate(t,[.25,2.5],[0,1],{...clamp,easing:ease});
  const cupX=1460-arrive*350,cupBase=684+arrive*52.5;
  const receive=interpolate(t,[1.3,2.7],[0,1],{...clamp,easing:ease});
  const withdraw=interpolate(t,[3.1,4.2],[0,1],{...clamp,easing:ease});
  const waveEnvelope=interpolate(t,[.25,1.8,2.5,5],[1,1,.75,0],clamp);
  const wave=Math.sin(t*16)*4*waveEnvelope;
  const surface=`M-95 ${-180+wave}C-34 ${-180-wave*1.4} 34 ${-180+wave*1.4} 95 ${-180-wave}`;
  const closer=interpolate(t,[4.2,6.7],[0,1],{...clamp,easing:ease});
  const cs=1+closer*.5;
  const cfx=960+closer*150,cfy=540+closer*20;
  const finalText=interpolate(t,[3.5,4,6.8,7.35],[0,1,1,0],clamp);
  const loop=interpolate(t,[6.75,7.8],[0,1],{...clamp,easing:ease});
  const receivingHand='M0 834C330 812 685 785 911 740Q943 721 973 720L1015 711Q1034 708 1047 721Q1052 729 1041 733L1019 738Q1058 742 1103 741L1153 738Q1169 736 1177 724Q1182 717 1190 723Q1195 730 1187 742Q1177 760 1157 766L1023 790Q983 795 944 789C700 835 350 882 0 908Z';
  const givingHand='M1920 650L1330 650Q1285 650 1250 648L1205 622Q1194 615 1188 624Q1183 634 1194 642L1213 660L1215 680Q1180 683 1168 694Q1158 702 1169 709L1205 704Q1181 720 1172 728Q1168 739 1182 744L1219 742Q1250 740 1273 718L1320 720L1920 755Z';
  return <AbsoluteFill style={{background:'#15110f',overflow:'hidden'}}>
    <AbsoluteFill style={{opacity:1-handoff,transform:`matrix(${s},0,0,${s},${960-s*fx},${540-s*fy})`}}>
      <Freeze frame={359}><PerspectiveTurn/></Freeze>
    </AbsoluteFill>
    <AbsoluteFill style={{opacity:handoff*(1-loop)}}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{position:'absolute'}}>
        <defs>
          <radialGradient id="endingBg"><stop stopColor="#24383c"/><stop offset=".65" stopColor="#182123"/><stop offset="1" stopColor="#15110f"/></radialGradient>
          <linearGradient id="endingGlass"><stop stopColor="#e8c18b"/><stop offset=".48" stopColor="#d5edf0"/><stop offset="1" stopColor="#e0b77a"/></linearGradient>
          <clipPath id="endingCupInside"><path d="M-70-292L-51-13Q0-5 51-13L70-292Z"/></clipPath>
        </defs>
        <g transform={`translate(960 540) scale(${cs}) translate(${-cfx} ${-cfy})`}>
          <rect width="1920" height="1080" fill="url(#endingBg)"/>
          <g stroke={gold} fill="none" strokeWidth="2" opacity=".18">
            <path d="M685 0V740M1308 0V740M0 740H1920M0 778H1920"/>
            <path d="M0 218H1308" opacity=".5"/>
          </g>
          <g fill={cyan} opacity=".18">
            {Array.from({length:40},(_,i)=><circle key={i} cx={60+(i*217.3)%1220} cy={80+(i*113.7)%510} r={.8+i%3*.4}/>)}
          </g>
          <path d="M0 740H1920V810H0Z" fill="#191a18" fillOpacity=".4"/>
          <path d="M0 740H1920" stroke={gold} strokeWidth="2" strokeOpacity=".42"/>
          <ellipse cx="1110" cy="745" rx="100" ry="8" fill={cyan} opacity={arrive*.07}/>

          <g transform={`translate(${cupX} ${cupBase})`}>
            <g clipPath="url(#endingCupInside)">
              <path d={`${surface}L95 5H-95Z`} fill={cyan} fillOpacity=".15"/>
              <path d={surface} fill="none" stroke={cyan} strokeWidth="2.5" strokeOpacity=".8"/>
            </g>
            <path d="M-76-300L-55-12Q-54 0-39 0H39Q54 0 55-12L76-300" fill="none" stroke="url(#endingGlass)" strokeWidth="3" strokeLinejoin="round"/>
            <ellipse cx="0" cy="-300" rx="76" ry="12" fill="none" stroke="url(#endingGlass)" strokeWidth="3"/>
            <path d="M-44-17Q0-10 44-17M-39 0Q0 7 39 0" fill="none" stroke={gold} strokeWidth="1.7" strokeOpacity=".5"/>
            <path d="M-58-264L-48-119" stroke="#dceff0" strokeWidth="2" strokeOpacity=".18"/>
          </g>

          <g transform={`translate(${cupX-1110+withdraw*420} ${cupBase-740})`} opacity={1-withdraw}>
            <path d={givingHand} fill="#172024" stroke={gold} strokeWidth="2.8" strokeLinejoin="round" strokeLinecap="round"/>
            <path d="M1174 698L1210 691M1182 730Q1200 733 1217 720M1320 650L1320 720" fill="none" stroke={gold} strokeWidth="1.5" strokeOpacity=".4"/>
          </g>
          <g transform={`translate(${-120*(1-receive)} 0)`} opacity={interpolate(t,[.4,.95],[0,1],clamp)}>
            <path d={receivingHand} fill="#172024" stroke={gold} strokeWidth="2.8" strokeLinejoin="round" strokeLinecap="round"/>
            <path d="M975 745Q1005 755 1018 738M1033 767Q1097 768 1156 752M916 739L943 789" fill="none" stroke={gold} strokeWidth="1.6" strokeOpacity=".4"/>
          </g>
          <g opacity={interpolate(t,[2.5,2.8,4.5,5.2],[0,.6,.3,0],clamp)} fill="none" stroke={cyan} strokeWidth="1.5">
            <path d={`M1056 ${560+wave}Q1110 ${550-wave} 1164 ${560-wave}`}/>
          </g>
        </g>
      </svg>
      <div style={{position:'absolute',left:145,top:155,fontFamily:font,fontSize:50,letterSpacing:5,opacity:finalText,...gradientText}}>有些重要，只有靠近才看得见。</div>
    </AbsoluteFill>
    <AbsoluteFill style={{opacity:loop}}><Freeze frame={0}><Opening2D shortHook/></Freeze></AbsoluteFill>
  </AbsoluteFill>;
};
