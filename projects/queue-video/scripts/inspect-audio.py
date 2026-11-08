import subprocess
import numpy as np
sr=12000
def read(path):
 return np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',path,'-ar',str(sr),'-ac','1','-f','f32le','-']),np.float32)
for path in ['/workspace/ai-studio/01-ai-video/assets/local/audio/bgm-001-kaizhi.mp3','public/audio/soundtrack.wav']:
 x=read(path);print(path)
 for s in range(0,min(len(x)//sr,110),2):
  seg=x[s*sr:(s+2)*sr];rms=np.sqrt(np.mean(seg**2)+1e-10)
  print(f'{s:3} {20*np.log10(rms):6.1f}',end=' | ')
  if s%10==8:print()
 print()
