# 排队｜为什么你换到哪条队，哪条队就变慢？

第三版1080p审片制作中，150秒、30镜、1920×1080、30fps，无旁白。字幕全部一行，理论作者用中文。
视觉：偏冷灰青背景、浅米色卡片、深蓝、朱橙主角、墨绿完成状态；SVG角色与物件均可编辑，不使用大型生成模型。

## 入口

- [本片分镜与验收标准](docs/storyboard-A.md)
- [当前阶段与未完成项](docs/status.md)
- [第二版审片修改](docs/revisions-v02.md)
- [第三版审片修改与规格](docs/revisions-v03.md)
- [第二版音乐编辑与动作声记录](docs/audio-edit-v02.json)
- [第二版审片与校验记录](docs/delivery-v02.json)
- 时间轴：`src/Root.tsx`，镜头数据：`src/shots.json`，字幕：`src/captions.json`。
- 源码保存在 `water-video` 的独立分支 `video/queue-150s` 下 `projects/queue-video/`；不修改《一滴水》主工程。

## 恢复运行

需要 Node.js 22+、npm。`npm ci` 安装已锁定依赖，`npm run studio` 打开编辑器。
先从本片 GitHub **草稿发布**下载 `soundtrack-v02.m4a` 放到 `public/audio/`；音频未进入 Git 历史。第一版旧音轨soundtrack.m4a仍保留供对照。
`npm run check` 检查源码与字幕时间轴，`npm run render:review` 导出960×540轻量审片，`npm run render:final` 导出第三版1080p。
脚本中的 `/usr/bin/chromium` 是云端浏览器路径；Windows本地执行时移除这个参数，使用 Remotion 自带浏览器。

原曲需要重新编辑时，将用户提供的MP3交给 `scripts/build-audio.py <MP3路径>`（Python + NumPy + SciPy + FFmpeg）。它生成150秒草稿音轨和编辑记录；接点仍需主观试听。

## 本地最少保存什么

用户 Windows 目标：`D:\1\AI视频\做的视频\排队`。云端未直接写入该目录。
只看片：下载 `queue-A-v03-1080p.mp4` 即可。需要保留工程：再保存本项目源码及 `soundtrack-v02.m4a`；无需下载其他作品、`node_modules`、临时帧、原始PCM或模型。
依赖与渲染留在云端；GitHub保存轻量源码，Draft Release保存审片和音轨。没有公开发布视频。
