"""Reproducible draft edit: sample-aligned phrase repeat and original synthetic foley.
The join is measured, not claimed to have passed human listening.
"""
import argparse, json, subprocess, pathlib
import numpy as np
from scipy.io import wavfile
from scipy.signal import find_peaks

parser=argparse.ArgumentParser();parser.add_argument('source');args=parser.parse_args()
sr=24000
raw=subprocess.check_output(['ffmpeg','-v','error','-i',args.source,'-f','f32le','-ac','2','-ar',str(sr),'-'])
x=np.frombuffer(raw,dtype=np.float32).reshape(-1,2).copy()
out=pathlib.Path('public/audio');out.mkdir(parents=True,exist_ok=True)
start=1.60;end=107.71
# Search a 5 x 8.503-second phrase return for a low-discontinuity internal splice.
best=None
for shift in np.arange(42.46,42.57,.002):
 for cut in np.arange(66,91,.025):
  i,j=int(cut*sr),int((cut-shift)*sr); n=int(.06*sr)
  a,b=x[i-n:i+n],x[j-n:j+n]
  score=float(np.mean((a-b)**2)/(np.mean(a*a)+np.mean(b*b)+1e-6))
  if best is None or score<best[0]:best=(score,float(shift),float(cut))
score,shift,cut=best
music=np.concatenate([x[int(start*sr):int(cut*sr)],x[int((cut-shift)*sr):int(end*sr)]])
# Five milliseconds only: remove a waveform click, not conceal wrong musical phrasing.
join=int((cut-start)*sr);w=int(.005*sr)
music[join-w:join+w]*=np.concatenate([np.linspace(1,0,w),np.linspace(0,1,w)])[:,None]
total=150*sr;track=np.zeros((total,2),dtype=np.float32);track[:len(music)]=music*.42
track[:int(.35*sr)]*=np.linspace(0,1,int(.35*sr))[:,None]
fade=int(2.4*sr);track[len(music)-fade:len(music)]*=np.linspace(1,0,fade)[:,None]
for a,b in [(45,49),(85,90),(95,96.2)]:
 i,j=int(a*sr),int(b*sr);g=np.ones(j-i)*.68;r=int(.2*sr)
 g[:r]=np.linspace(1,.68,r);g[-r:]=np.linspace(.68,1,r);track[i:j]*=g[:,None]
rng=np.random.default_rng(18)
def effect(at,kind,gain=.13):
 dur={'step':.11,'paper':.22,'scan':.16,'click':.055,'rise':.65,'thump':.32,'write':.75}.get(kind,.12)
 t=np.arange(int(dur*sr))/sr;noise=rng.normal(0,1,len(t))
 if kind=='scan':v=np.sin(2*np.pi*980*t)*np.exp(-t*24)
 elif kind=='click':v=(noise*.32+np.sin(2*np.pi*1500*t)*.3)*np.exp(-t*100)
 elif kind=='step':v=(np.sin(2*np.pi*120*t)+noise*.1)*np.exp(-t*36)
 elif kind=='thump':v=np.sin(2*np.pi*(84*t-62*t*t))*np.exp(-t*13)
 elif kind=='rise':v=noise*.16*np.sin(np.pi*t/dur)**2
 elif kind=='write':v=noise*.09*(.5+.5*np.sin(2*np.pi*15*t))*np.sin(np.pi*t/dur)
 else:v=noise*.16*np.sin(np.pi*t/dur)**2
 v=(v*gain).astype(np.float32);i=int(at*sr);j=min(i+len(v),total)
 track[i:j]+=v[:j-i,None]
events=[(.8,'step'),(1.7,'step'),(6.6,'step'),(6.9,'scan'),(8.8,'click'),(18.8,'paper'),(19.4,'paper')]
events +=[(24.5+k,'scan') for k in [1,2,3,4,5]]+[(31,'scan'),(36,'paper'),(40.55,'thump'),(45.5,'paper'),(50.8,'step'),(52,'step'),(56.8,'paper'),(58.2,'click'),(62,'click'),(66.5,'click'),(68,'click'),(71,'scan'),(72,'scan'),(73,'scan'),(81.55,'thump'),(82.1,'paper'),(82.65,'paper'),(86.2,'paper'),(91,'step'),(92.7,'step'),(95.5,'paper'),(101,'paper'),(106.8,'paper'),(107.5,'click'),(108.2,'click'),(111.5,'thump'),(116.4,'write'),(118.7,'click'),(121,'paper'),(125.5,'rise'),(131.55,'thump'),(136,'paper'),(138,'step'),(141.8,'scan'),(143,'step'),(148.8,'step')]
for at,kind in events:effect(at,kind,.1 if kind!='thump' else .17)
peak=float(np.max(np.abs(track)));track*=min(1,.93/max(peak,1e-6))
wavfile.write(out/'soundtrack.wav',sr,(track*32767).astype(np.int16))
subprocess.run(['ffmpeg','-y','-v','error','-i',str(out/'soundtrack.wav'),'-c:a','aac','-b:a','160k',str(out/'soundtrack.m4a')],check=True)
# Keep PCM in the cloud for debugging; delivery uses compressed audio.
mono=np.mean(np.abs(music),axis=1);hop=240;env=np.array([np.mean(mono[i:i+hop]) for i in range(0,len(mono),hop)])
onset=np.maximum(np.diff(env,prepend=0),0);peaks,_=find_peaks(onset,distance=25,prominence=.002)
report={'source_seconds':len(x)/sr,'trim':[start,end],'repeat_seconds':shift,'source_splice_seconds':cut,'edited_join_seconds':cut-start,'normalized_window_error':score,'music_end_seconds':len(music)/sr,'duration_seconds':150,'peak':float(np.max(np.abs(track))),'foley':'original seeded synthetic effects','listening_status':'Automatic continuity check only; subjective listening and musical phrasing approval pending','onset_candidates_seconds':(peaks*.01).round(3).tolist(),'events':[{'time':at,'kind':kind} for at,kind in events]}
pathlib.Path('docs/audio-edit.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k not in ['events','onset_candidates_seconds']},ensure_ascii=False))
