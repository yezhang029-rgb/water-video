import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
const source=readFileSync(process.argv[2], 'utf8');
const common=source.slice(0, source.indexOf('## 五片索引'));
const a=source.slice(source.indexOf('# A｜'),source.indexOf('# B｜'));
mkdirSync('docs',{recursive:true});mkdirSync('src',{recursive:true});
writeFileSync('docs/storyboard-A.md',common+'\n'+a+'\n'+source.slice(source.indexOf('## 制作顺序与交付验收')));
const scenes=[...a.matchAll(/#### (A\d{2})｜([^\n]+)\n([\s\S]*?)(?=\n#### |$)/g)].map(m=>{
 const [start,end]=m[2].match(/帧\[(\d+),(\d+)\)/).slice(1).map(Number);
 const get=k=>m[3].match(new RegExp('\\*\\*'+k+'：\\*\\* ([^\\n]+)'))?.[1]||'';
 return {id:m[1],start,end,caption:get('字幕原文'),action:get('画面与动作'),camera:get('机位与转场'),sound:get('声音与节奏')};
});
if(scenes.length!==30||scenes[0].start!==0||scenes.at(-1).end!==4500||scenes.some((s,i)=>i&&s.start!==scenes[i-1].end))throw Error('Shot coverage mismatch');
writeFileSync('src/shots.json',JSON.stringify(scenes,null,2)+'\n');
writeFileSync('src/captions.json',JSON.stringify(scenes.filter(s=>s.caption!=='无主字幕').map(s=>({text:s.caption.replaceAll('／','\n'),startMs:s.start/30*1000+(s.id==='A16'?3000:250),endMs:s.end/30*1000-(s.id==='A30'?1200:350),timestampMs:null,confidence:null})),null,2)+'\n');
console.log('30 scenes / 4500 frames / 150 seconds verified');
