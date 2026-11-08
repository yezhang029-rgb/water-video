import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
const data=readFileSync('out/queue-A-v03-1080p.mp4');
mkdirSync('out/transfer-v03',{recursive:true});
const result=[];
for(let i=0;i<2;i++){
 const bytes=data.subarray(i*6291456,Math.min((i+1)*6291456,data.length));
 const name=`__transfer-queue-v03-${String(i+1).padStart(2,'0')}.part`;
 writeFileSync(`out/transfer-v03/${name}`,bytes);
 result.push({name,size:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});
}
writeFileSync('out/transfer-v03/manifest.json',JSON.stringify(result,null,2)+'\n');console.log(result);
