# 《一滴水》二维知识动画：55 秒完整审片

主组合为 `WaterFilm2D`，1920×1080、30 fps、1650 帧。它使用 React/SVG 动画，不依赖工作区生成的 MP4 来回放内容。旧版 `FinalFilm` 和旧素材保留。

## 内容

| 时间 | 源文件 | 内容 |
| --- | --- | --- |
| 0–3.4 s | src/Opening2D.tsx | 倒水、落地、提取水滴 |
| 3.4–7.2 s | src/MicroEntry.tsx | 进入微观，分子数量 |
| 7.2–16.5 s | src/ScaleAnalogy.tsx | 乒乓球尺度类比、约600公里、月球参照 |
| 16.5–25.5 s | src/OrbitEntry.tsx | 地月距离、内太阳系、1 AU |
| 25.5–35 s | src/GalaxyEntry.tsx | 太阳系定位点、银河恒星盘 |
| 35–47 s | src/PerspectiveTurn.tsx | 视野边界、窗前观察者、两处思想意译 |
| 47–55 s | src/Ending.tsx | 递水、托杯、涟漪、结句和回到开场 |

字幕使用 `src/Typography.ts` 的暖金—浅青渐变。章节编号已移除，保留“地球 · 1 AU”和左下角短解释。不恢复已经删除的银河结构说明。

## 重现当前审片

在项目根目录安装锁定依赖后，导出纯画面，再混入用户提供的临时 BGM：

```bash
npm ci
npx remotion render src/index.ts WaterFilm2D out/water-film-2d-clean.mp4 --codec=h264 --crf=18 --browser-executable=/usr/bin/chromium --concurrency=2
python scripts/mix-step06-full.py --music /path/to/the-provided-bgm.mp3 --video out/water-film-2d-clean.mp4 --output out/release-assets/step-06-55s-v1-full-review.mp4
```

浏览器路径是当前 Linux 云端环境中的 Chromium；其他平台需选择其实际浏览器。混音脚本只复制视频流，音乐和音效单独编码为 AAC。BGM 不存入 Git；使用者需提供原音频路径。临时配乐不是本项目原创音乐。

主要音乐落点约13.026秒和31.091秒；35秒后逐渐收音，49.5秒落杯。片尾使用独立音频输入跨接至开场音乐位置，避免当前 FFmpeg 中同一 asplit 输入做长短跨淡化产生空音轨的问题。脚本检查视频和音轨均存在、时长完整，不能只凭 FFmpeg 返回码判断成功。

## 内容依据

- 按约0.05 mL的一滴水估算，水分子约1.7×10²¹个；字幕使用10²¹量级，并保留滴量条件。
- 水分子有效尺度取约0.3 nm，放大到4 cm的乒乓球尺度后，同体积球形水滴直径约609 km，画面取约600 km；约为月球直径的六分之一。
- 地月平均距离约38.44万公里；1 AU约1.50亿公里；银河恒星盘直径粗略取约10万光年；1光年约9.46万亿公里。图形和天体大小有示意性。
- 哲学短句为观点意译。核对文本：GITenberg公版镜像 [庄子《秋水》英译](https://github.com/GITenberg/Chuang-Tzu-Mystic-Moralist-and-Social-Reformer_59709/blob/master/59709-0.txt) 的井蛙段、[帕斯卡《思想录》英译](https://github.com/GITenberg/Pascal-s-Pens-es_18269/blob/master/18269-0.txt) 第347–348节。不是某个未确认中文译本的逐字引用。

## 审片交付

视频保存在 GitHub `review-latest` Draft Release 的 Assets，不加入 Git 历史。需登录有仓库写权限的账号访问草稿。最终正式版本须在用户完整审片后另行发布。

当前完整审片附件：`step-06-55s-v1-full-review.mp4`。此前版本全部保留。
