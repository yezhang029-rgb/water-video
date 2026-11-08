export type Point={x:number;y:number};
export const bounded=(p:number)=>Math.max(0,Math.min(1,p));
export const smooth=(p:number)=>{const u=bounded(p);return u*u*(3-2*u)};
export function quadratic(a:Point,b:Point,c:Point,p:number):Point{const u=bounded(p),v=1-u;return{x:v*v*a.x+2*v*u*b.x+u*u*c.x,y:v*v*a.y+2*v*u*b.y+u*u*c.y};}
export function cubic(a:Point,b:Point,c:Point,d:Point,p:number):Point{const u=bounded(p),v=1-u;return{x:v*v*v*a.x+3*v*v*u*b.x+3*v*u*u*c.x+u*u*u*d.x,y:v*v*v*a.y+3*v*v*u*b.y+3*v*u*u*c.y+u*u*u*d.y};}
export const deskCurve=(p:number)=>cubic({x:770,y:532},{x:860,y:415},{x:940,y:520},{x:1000,y:425},p);
export const choiceCurve=(i:number,p:number)=>quadratic({x:420,y:735},{x:750+i*90,y:260+i*200},{x:1470,y:260+i*220},p);
export function choicePose(t:number){
 const legs=[{from:0,to:.8,route:0,a:0,b:.32},{from:.8,to:1.1,route:0,a:.32,b:.32},{from:1.1,to:1.7,route:0,a:.32,b:0},{from:1.7,to:2.45,route:1,a:0,b:.32},{from:2.45,to:2.7,route:1,a:.32,b:.32},{from:2.7,to:3.3,route:1,a:.32,b:0},{from:3.3,to:4.65,route:2,a:0,b:.55},{from:4.65,to:5,route:2,a:.55,b:.55}];
 const leg=legs.find(s=>t>=s.from&&t<s.to)||legs.at(-1)!;
 const p=leg.a+(leg.b-leg.a)*smooth((t-leg.from)/(leg.to-leg.from));
 return{...choiceCurve(leg.route,p),route:leg.route,p,moving:leg.a!==leg.b,direction:leg.b<leg.a?-1:1};
}
export function workCurve(p:number):Point{
 const u=bounded(p);
 if(u<.32)return cubic({x:430,y:630},{x:570,y:630},{x:570,y:420},{x:760,y:420},u/.32);
 if(u<.68)return{x:760+(u-.32)/.36*260,y:420};
 return cubic({x:1020,y:420},{x:1220,y:420},{x:1220,y:630},{x:1430,y:630},(u-.68)/.32);
}
export const routeY=(i:number)=>330+i*130;
export function finalRoute(i:number,depth:number,p:number):Point{
 const y=routeY(i),x0=270+i*60,x1=760-i*40,x2=1120+i*50,x3=1610-i*50;
 const u=bounded(p);let point:Point;
 if(u<.36)point={x:x0+(x1-x0)*u/.36,y:y+120};
 else if(u<.72)point=quadratic({x:x1,y:y+120},{x:940-i*60,y:y+120-180*depth},{x:x2,y:y+70*depth},(u-.36)/.36);
 else point={x:x2+(x3-x2)*(u-.72)/.28,y:y+70*depth};
 return{x:point.x,y:point.y+(i-1)*60*depth};
}
