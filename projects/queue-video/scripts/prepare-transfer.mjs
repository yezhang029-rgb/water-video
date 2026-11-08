import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {basename} from 'node:path';
import {createHash} from 'node:crypto';
const file=process.argv[2],version=process.argv[3];
if(!file||!/^v\d+$/.test(version))throw Error('Usage: node scripts/prepare-transfer.mjs <MP4> <vNN>');
const content=readFileSync(file),dir=`out/transfer-${version}`;
const digest=data=>createHash('sha256').update(data).digest('hex');
mkdirSync(dir,{recursive:true});const parts=[];
for(let offset=0,index=1;offset<content.length;offset+=6291456,index++){
 const part=content.subarray(offset,Math.min(offset+6291456,content.length));
 const name=`__transfer-queue-${version}-${String(index).padStart(2,'0')}.part`;
 writeFileSync(`${dir}/${name}`,part);parts.push({name,size:part.length,sha256:digest(part)});
}
const manifest={name:basename(file),size:content.length,sha256:digest(content),parts};
writeFileSync(`${dir}/__transfer-queue-${version}-manifest.json`,JSON.stringify(manifest,null,2)+'\n');console.log(manifest);
