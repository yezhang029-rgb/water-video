import React from 'react';
import {AbsoluteFill,Easing,Freeze,interpolate,useCurrentFrame,useVideoConfig} from 'remotion';
import {GalaxyEntry} from './GalaxyEntry';
import {gradientText,mutedGradientText} from './Typography';

const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const ease=Easing.bezier(.3,.7,.2,1);
const font='Noto Sans CJK SC, sans-serif',gold='#dfb879',cyan='#b5e4ec';
const rnd=(n:number)=>{const v=Math.sin(n*127.1+44.5)*43758.5453;return v-Math.floor(v);};
const fields=Array.from({length:45},(_,i)=>({x:160+rnd(i)*1600,y:215+rnd(i+70)*590,size:8+rnd(i+120)*22,angle:rnd(i+330)*180,alpha:.25+rnd(i+490)*.45}));
const sky=Array.from({length:100},(_,i)=>({x:1060+rnd(i+800)*520,y:220+rnd(i+900)*440,r:.8+rnd(i+1000)*1.3}));

export const PerspectiveTurn:React.FC=()=>{
  const t=useCurrentFrame()/useVideoConfig().fps;
  const handoff=interpolate(t,[.1,.75],[0,1],clamp);
  const away=interpolate(t,[.6,4],[0,1],{...clamp,easing:ease});
  const galaxyScale=Math.exp(Math.log(.045)*away);
  const mapFade=interpolate(t,[4.6,6.5],[1,0],clamp);
  const others=interpolate(t,[1.1,3.5],[0,1],clamp)*mapFade;
  const window=interpolate(t,[4.7,7.0],[0,1],{...clamp,easing:ease});
  const wx=interpolate(window,[0,1],[170,1060]);
  const wy=interpolate(window,[0,1],[210,220]);
  const ww=interpolate(window,[0,1],[1580,520]);
  const wh=interpolate(window,[0,1],[610,440]);
  const person=interpolate(t,[6.25,8.3],[0,1],{...clamp,easing:ease});
  const head=interpolate(t,[6,6.8],[0,1],clamp);
  const zhuang=interpolate(t,[1.25,1.7,4.65,5.1],[0,1,1,0],clamp);
  const pascal=interpolate(t,[7.1,7.8],[0,1],clamp);
  const face='M1298 477L1295 491M1298 477C1285 470 1281 455 1284 438C1285 423 1292 413 1304 412C1321 409 1334 420 1336 433L1347 444Q1349 449 1340 450L1339 463Q1335 476 1322 476L1321 493';
  const torso='M1295 491C1267 499 1259 531 1254 571L1245 651Q1242 674 1257 684L1254 701Q1288 711 1324 699L1330 628L1335 558Q1356 527 1337 506L1321 493';
  const arm='M1338 517Q1351 524 1356 544L1373 600L1437 642Q1451 649 1444 660Q1441 668 1427 663L1357 628Q1340 619 1332 594L1321 550';
  const leftLeg='M1254 701L1246 830L1240 841Q1237 849 1246 851H1282Q1290 848 1287 841L1280 824L1284 750L1293 714';
  const rightLeg='M1293 714L1291 751L1302 829L1297 842Q1297 850 1306 850H1343Q1350 847 1344 840L1335 827L1324 699';
  return <AbsoluteFill style={{background:'#15110f',overflow:'hidden'}}>
    <AbsoluteFill style={{opacity:1-handoff}}><Freeze frame={284}><GalaxyEntry/></Freeze></AbsoluteFill>
    <AbsoluteFill style={{opacity:handoff}}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{position:'absolute'}}>
        <defs>
          <radialGradient id="turnBg"><stop stopColor="#1c3036"/><stop offset=".6" stopColor="#151c1e"/><stop offset="1" stopColor="#15110f"/></radialGradient>
          <linearGradient id="turnType"><stop stopColor="#e6b878"/><stop offset=".48" stopColor="#fff0d1"/><stop offset="1" stopColor="#afe6ef"/></linearGradient>
          <radialGradient id="windowGlow"><stop stopColor="#79bcc9" stopOpacity=".12"/><stop offset="1" stopColor="#79bcc9" stopOpacity="0"/></radialGradient>
          <clipPath id="thoughtWindow"><rect x={wx} y={wy} width={ww} height={wh}/></clipPath>
        </defs>
        <rect width="1920" height="1080" fill="url(#turnBg)"/>
        <g opacity={others}>
          {fields.map((g,i)=><g key={i} transform={`translate(${g.x} ${g.y}) rotate(${g.angle}) scale(${g.size/20})`} opacity={g.alpha}>
            <path d="M-22 0C-18-10-2-10 3-3C9 7-9 8-10 0C-12-4-1-5 2-2M22 0C18 10 2 10-3 3C-9-7 9-8 10 0C12 4 1 5-2 2" fill="none" stroke={i%3?cyan:gold} strokeWidth="1.1"/>
            <circle r="2" fill={gold}/>
          </g>)}
          <circle cx="960" cy="540" r="34" fill="none" stroke={gold} strokeWidth="1.5" strokeDasharray="5 9"/>
          <path d="M994 540H1140" stroke={gold} strokeWidth="1.5"/>
          <text x="1158" y="550" fill="url(#turnType)" fontFamily={font} fontSize="28" letterSpacing="3">银河系</text>
        </g>
      </svg>
      <AbsoluteFill style={{opacity:mapFade,transform:`scale(${galaxyScale})`,transformOrigin:'50% 50%'}}>
        <Freeze frame={284}><GalaxyEntry artworkOnly/></Freeze>
      </AbsoluteFill>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{position:'absolute'}}>
        <g opacity={interpolate(t,[2.7,3.4],[0,1],clamp)}>
          <rect x={wx} y={wy} width={ww} height={wh} fill="none" stroke={gold} strokeWidth="2" strokeOpacity={.25+window*.25}/>
          <g opacity={window}>
            <rect x="1060" y="220" width="520" height="440" fill="#081a20" fillOpacity=".25"/>
            <g clipPath="url(#thoughtWindow)">
              <ellipse cx="1320" cy="440" rx="400" ry="340" fill="url(#windowGlow)"/>
              {sky.map((s,i)=><circle key={i} cx={s.x} cy={s.y} r={s.r} fill={i%4?cyan:gold} opacity={.3+.16*Math.sin(t*.7+i)}/>)}
            </g>
            <path d="M1320 220V660M1060 680H1580M1060 660V895M1580 660V895M1030 895H1710" fill="none" stroke={gold} strokeOpacity=".25" strokeWidth="2"/>
            <path d="M1060 445H1580" fill="none" stroke={gold} strokeOpacity=".18" strokeWidth="1.5"/>
          </g>
        </g>
        <g transform={`translate(1270 850) scale(${1+Math.sin(t*1.3)*.002}) translate(-1270 -850)`}>
          <ellipse cx="1270" cy="857" rx="120" ry="9" fill={cyan} opacity={person*.06}/>
          <path d="M1298 477C1285 470 1281 455 1284 438C1285 423 1292 413 1304 412C1321 409 1334 420 1336 433L1347 444Q1349 449 1340 450L1339 463Q1335 476 1322 476Z" fill="#151a1b" opacity={head}/>
          <path d={face} fill="none" stroke={gold} strokeWidth="2.6" strokeLinecap="round" opacity={head}/>
          <path d="M1286 446Q1290 414 1311 417Q1324 417 1333 430M1320 438H1325" fill="none" stroke={gold} strokeWidth="2" opacity={head*.7}/>
          {[leftLeg,rightLeg,torso,arm].map((d,i)=><g key={i} opacity={person}>
            <path d={`${d}Z`} fill="#151a1b"/>
            <path d={d} fill="none" stroke={gold} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1-person}/>
          </g>)}
          <path d="M1295 491Q1304 505 1321 493M1262 547L1256 642Q1253 661 1265 668M1256 685Q1285 694 1325 684M1431 650L1441 655" fill="none" stroke={gold} strokeOpacity={person*.45} strokeWidth="1.7"/>
        </g>
      </svg>
      <div style={{position:'absolute',left:145,top:132,fontFamily:font,fontSize:49,letterSpacing:5,opacity:zhuang,...gradientText}}>视野之外，还有世界。</div>
      <div style={{position:'absolute',left:145,bottom:82,fontFamily:font,fontSize:27,letterSpacing:2,opacity:zhuang*.85,...mutedGradientText}}>庄子《秋水》· 井蛙与海 · 观点意译</div>
      <div style={{position:'absolute',left:145,top:275,fontFamily:font,fontSize:53,letterSpacing:4,lineHeight:1.6,opacity:pascal,...gradientText}}>人很小，<br/>却能意识到自己的渺小。</div>
      <div style={{position:'absolute',left:145,bottom:170,fontFamily:font,fontSize:27,letterSpacing:2,opacity:pascal*.85,...mutedGradientText}}>帕斯卡《思想录》· 会思想的芦苇<br/>观点意译</div>
    </AbsoluteFill>
  </AbsoluteFill>;
};
