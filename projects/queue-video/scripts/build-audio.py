"""Reproducible draft edit: sample-aligned phrase repeat and original synthetic foley.
The join is measured, not claimed to have passed human listening.
"""
import argparse, json, subprocess, pathlib
import numpy as np
from scipy.io import wavfile
from scipy.signal import find_peaks,butter,sosfilt

parser=argparse.ArgumentParser();parser.add_argument('source');parser.add_argument('--ending-v04',action='store_true');args=parser.parse_args()
version='v04' if args.ending_v04 else 'v02'
duration=154.5 if args.ending_v04 else 150
sr=24000
raw=subprocess.check_output(['ffmpeg','-v','error','-i',args.source,'-f','f32le','-ac','2','-ar',str(sr),'-'])
x=np.frombuffer(raw,dtype=np.float32).reshape(-1,2).copy()
out=pathlib.Path('public/audio');out.mkdir(parents=True,exist_ok=True)
start=1.60;end=107.71
# V02: bypass the source's short breakdown, which the V01 repeat exposed twice.
# Match a return two phrases earlier; preserve time/tempo, and blend only 15 ms.
original=x.copy()
def boundary_score(at,shift):
 i=int(at*sr);offset=int(shift*sr);w=int(.07*sr);a=original[i-w:i+w];b=original[i-offset-w:i-offset+w]
 return float(np.mean((a-b)**2)/(np.mean(a*a)+np.mean(b*b)+1e-6))
options=[]
for base in [8.503,17.006,-8.503,-17.006,-25.509]:
 for shift_candidate in np.arange(base-.025,base+.026,.002):
  a=min(np.arange(53.0,54.8,.025),key=lambda t:boundary_score(t,shift_candidate))
  b=min(np.arange(60.0,61.2,.025),key=lambda t:boundary_score(t,shift_candidate))
  options.append((boundary_score(a,shift_candidate)+boundary_score(b,shift_candidate),float(shift_candidate),float(a),float(b)))
_,phrase_shift,bridge_in,bridge_out=min(options)
offset=int(phrase_shift*sr)
bi,bj=int(bridge_in*sr),int(bridge_out*sr);blend=int(.015*sr)
x[bi:bj]=original[bi-offset:bj-offset]
weight=np.linspace(0,1,blend)[:,None]
x[bi:bi+blend]=original[bi:bi+blend]*(1-weight)+x[bi:bi+blend]*weight
x[bj-blend:bj]=x[bj-blend:bj]*(1-weight)+original[bj-blend:bj]*weight
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
total=int(duration*sr);track=np.zeros((total,2),dtype=np.float32);track[:len(music)]=music*.42
track[:int(.35*sr)]*=np.linspace(0,1,int(.35*sr))[:,None]
fade=int(2.4*sr);track[len(music)-fade:len(music)]*=np.linspace(1,0,fade)[:,None]
for a,b,low,ramp in [(44.5,50.5,.90,1.8),(84.5,90.5,.85,1.5)]:
 i,j=int(a*sr),int(b*sr);g=np.ones(j-i)*low;r=int(ramp*sr)
 smoothstep=lambda z:z*z*(3-2*z)
 phase=smoothstep(np.linspace(0,1,r))
 g[:r]=1-(1-low)*phase;g[-r:]=low+(1-low)*phase;track[i:j]*=g[:,None]
if args.ending_v04:
 # Keep the earlier music byte-equivalent, and let its existing ending leave a soft room tail.
 room=np.zeros_like(track);filtered=sosfilt(butter(2,1800,fs=sr,output='sos'),track,axis=0)
 for delay,weight in [(.17,.08),(.31,.055),(.53,.035),(.89,.022),(1.27,.013),(1.81,.007)]:
  offset=int(delay*sr);room[offset:]+=filtered[:-offset]*weight
 gate=np.clip((np.arange(total)/sr-146.0)/.65,0,1)
 track+=room*gate[:,None]
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
events +=[(24.5+k,'scan') for k in [1,2,3,4,5]]+[(31,'scan'),(36,'paper'),(40.55,'thump'),(45.5,'paper'),(50.8,'step'),(52,'step'),(56.8,'paper'),(58.2,'click'),(62,'click'),(66.5,'click'),(68,'click'),(71,'scan'),(72,'scan'),(73,'scan'),(81.55,'thump'),(82.1,'paper'),(82.65,'paper'),(86.2,'paper'),(90.3,'step'),(91.2,'step'),(91.85,'step'),(92.8,'step'),(93.45,'step'),(94.2,'step'),(95.5,'paper'),(101,'paper'),(106.8,'paper'),(107.5,'click'),(108.2,'click'),(111.5,'thump'),(115.4,'write'),(117.05,'click'),(121,'paper'),(125.5,'rise'),(131.55,'thump'),(135.2,'paper'),(136.7,'step'),(138,'step'),(141.4,'paper'),(142.4,'scan'),(144.7,'step'),(145.9,'step'),(147.2,'click'),(148.8,'step')]
if args.ending_v04:
 events=[(at,kind) for at,kind in events if at<148.8]
 events += [(150.3,'step'),(150.75,'step'),(151.2,'step'),(151.6,'step'),(152.0,'step'),(152.4,'step'),(152.8,'step'),(153.2,'step'),(153.65,'step')]
for at,kind in events:effect(at,kind,.1 if kind!='thump' else .17)
peak=float(np.max(np.abs(track)));track*=min(1,.93/max(peak,1e-6))
wavfile.write(out/f'soundtrack-{version}.wav',sr,(track*32767).astype(np.int16))
subprocess.run(['ffmpeg','-y','-v','error','-i',str(out/f'soundtrack-{version}.wav'),'-c:a','aac','-b:a','160k',str(out/f'soundtrack-{version}.m4a')],check=True)
# Keep PCM in the cloud for debugging; delivery uses compressed audio.
mono=np.mean(np.abs(music),axis=1);hop=240;env=np.array([np.mean(mono[i:i+hop]) for i in range(0,len(mono),hop)])
onset=np.maximum(np.diff(env,prepend=0),0);peaks,_=find_peaks(onset,distance=25,prominence=.002)
report={'version':version,'source_seconds':len(x)/sr,'trim':[start,end],'repeat_seconds':shift,'source_splice_seconds':cut,'edited_join_seconds':cut-start,'normalized_window_error':score,'music_end_seconds':len(music)/sr,'duration_seconds':duration,'source_bridge_patch':{'range':[float(bridge_in),float(bridge_out)],'donor_shift_seconds':phrase_shift,'boundary_errors':[boundary_score(bridge_in,phrase_shift),boundary_score(bridge_out,phrase_shift)],'blend_ms':15},'gain_changes':{'44.5-50.5':'-0.92 dB, 1.8-second eased ramps','84.5-90.5':'-1.41 dB, 1.5-second eased ramps','95':'No artificial duck'},'peak':float(np.max(np.abs(track))),'foley':'original seeded synthetic effects; revised to match the current ending','ending':'soft room decay from the existing music ending, then synchronized passage footsteps' if args.ending_v04 else 'original v02 ending','listening_status':'Waveform/tempo continuity checked; subjective listening approval still needed','onset_candidates_seconds':(peaks*.01).round(3).tolist(),'events':[{'time':at,'kind':kind} for at,kind in events]}
pathlib.Path(f'docs/audio-edit-{version}.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k not in ['events','onset_candidates_seconds']},ensure_ascii=False))
