import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
const shots=JSON.parse(readFileSync('src/shots.json','utf8'));
const edits=JSON.parse(readFileSync('src/caption-edits.json','utf8'));
const references=readFileSync('src/references.json','utf8');
const captions=shots.filter(s=>s.caption!=='无主字幕').map(s=>({
 text:(edits[s.id]||s.caption).replaceAll('／','').replaceAll('\n',''),
 startMs:s.start/30*1000+(s.id==='A16'?3000:s.id==='A30'?5200:250),
 endMs:s.end/30*1000-(s.id==='A30'?1000:350),timestampMs:null,confidence:null
}));
writeFileSync('src/captions.json',JSON.stringify(captions,null,2)+'\n');
mkdirSync('out',{recursive:true});
writeFileSync('out/font-text-v03.txt',readFileSync('docs/storyboard-A.md','utf8')+'\n'+captions.map(c=>c.text).join('\n')+'\n'+references);
console.log(`Prepared ${captions.length} single-line captions and font corpus`);
