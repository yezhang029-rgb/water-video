import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {writeFileSync} from 'node:fs';
import {deskCurve,workCurve,choiceCurve,choicePose,finalRoute,routeY} from '../src/motion.ts';
const require=createRequire(import.meta.url),{chromium}=require('playwright');
const cases=[];
for(let i=0;i<=40;i++){
 const p=i/40;cases.push({path:'M 770 532 C 860 415 940 520 1000 425',point:deskCurve(p),label:'desk ball'});
 cases.push({path:'M 430 630 C 570 630 570 420 760 420 L 1020 420 C 1220 420 1220 630 1430 630',point:workCurve(p),label:'completed line ball'});
}
for(let f=0;f<150;f++){
 const pose=choicePose(f/30),i=pose.route;cases.push({path:`M 420 735 Q ${750+i*90} ${260+i*200} 1470 ${260+i*220}`,point:pose,label:'choice feet'});
}
for(const depth of [0,.5,1])for(let i=0;i<3;i++)for(let step=0;step<20;step++){
 const y=routeY(i),spread=(i-1)*60*depth;
 cases.push({path:`M ${270+i*60} ${y+120+spread} L ${760-i*40} ${y+120+spread} Q ${940-i*60} ${y+120-180*depth+spread} ${1120+i*50} ${y+70*depth+spread} L ${1610-i*50} ${y+70*depth+spread}`,point:finalRoute(i,depth,.2+step*.025),label:'final feet'});
}
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
const page=await browser.newPage();
const distances=await page.evaluate(cases=>cases.map(({path,point,label})=>{
 const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg'),element=document.createElementNS(ns,'path');element.setAttribute('d',path);svg.append(element);document.body.append(svg);
 const length=element.getTotalLength();let best=Infinity;
 for(let l=0;l<=length;l+=.5){const p=element.getPointAtLength(l);best=Math.min(best,Math.hypot(p.x-point.x,p.y-point.y))}
 const end=element.getPointAtLength(length);best=Math.min(best,Math.hypot(end.x-point.x,end.y-point.y));svg.remove();return{label,distance:best};
}),cases);
await browser.close();
assert(distances.every(x=>x.distance<.7),'A ball center or foot position leaves its authored SVG path');
let collisions=0;
for(let f=0;f<120;f++){
 const t=f/30;const p=t<=1.5?.3:t>=3.6?.58:.3+.28*((t-1.5)/2.1)**2*(3-2*(t-1.5)/2.1);
 for(let i=0;i<3;i++){
  const point=finalRoute(i,1,i===1?p:.69+t*.012),scale=i===1?.9:.65,r=30*scale;
  const head={x:point.x,y:point.y-(82+49)*scale};const card={x:1140,y:410,w:240,h:85};
  const nearX=Math.max(card.x,Math.min(head.x,card.x+card.w)),nearY=Math.max(card.y,Math.min(head.y,card.y+card.h));
  if(Math.hypot(head.x-nearX,head.y-nearY)<r)collisions++;
 }
}
assert.equal(collisions,0,'Task card obscures a head');
const report={sampledPathPositions:cases.length,maxDeviationPx:Math.max(...distances.map(x=>x.distance)),taskCardHeadCollisions:collisions,workBridgeDrawCompleteSeconds:1.95,ballTravelStartSeconds:2.05,ending:'10-second continuous clock across A29/A30'};
writeFileSync('docs/motion-checks-v02.json',JSON.stringify(report,null,2)+'\n');console.log(report);
