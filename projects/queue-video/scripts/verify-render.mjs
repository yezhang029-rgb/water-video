import {execFileSync} from 'node:child_process';
import {readFileSync,statSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const file=process.argv[2]||'out/queue-A-v03-1080p.mp4';
const probe=JSON.parse(execFileSync('ffprobe',['-v','error','-show_streams','-show_format','-of','json',file],{encoding:'utf8'}));
const video=probe.streams.find(s=>s.codec_type==='video');const audio=probe.streams.find(s=>s.codec_type==='audio');
assert(video&&audio,'Video and audio streams are both required');
assert.equal(Number(video.nb_frames),4500);assert.equal(video.r_frame_rate,'30/1');assert(Math.abs(Number(probe.format.duration)-150)<.05);
if(file.includes('v03')){assert.equal(video.width,1920);assert.equal(video.height,1080);}
execFileSync('ffmpeg',['-v','error','-i',file,'-f','null','-'],{stdio:['ignore','ignore','pipe']});
const report={file:file.split('/').at(-1),bytes:statSync(file).size,sha256:createHash('sha256').update(readFileSync(file)).digest('hex'),seconds:Number(probe.format.duration),frames:Number(video.nb_frames),width:video.width,height:video.height,fps:video.r_frame_rate,videoCodec:video.codec_name,videoProfile:video.profile,videoBitRate:Number(video.bit_rate),audioCodec:audio.codec_name,audioSampleRate:Number(audio.sample_rate),audioChannels:audio.channels,audioBitRate:Number(audio.bit_rate),fullDecode:'passed',stage:'review revision; not final approval',github:{status:'pending upload verification'}};
writeFileSync(process.argv[3]||'docs/delivery-v03.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
