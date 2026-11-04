# Water Video

当前作品是《一滴水》55 秒二维知识动画。2026-11-04 用户确认样片制作完成，后续重点转向其他视频的工具选择与项目管理。

## 从这里开始

- [55 秒作品的镜头、源码和复现方法](docs/2d-film.md)：当前组合是 `WaterFilm2D`。
- [未来视频的工具选择与仓库管理](docs/video-toolbox.md)：工具用途、候选清单、安装位置及管理规则。
- [GitHub 审片下载区](https://github.com/yezhang029-rgb/water-video/releases)：登录仓库所有者账号后查看草稿 `review-latest`，下载 `step-06-55s-v1-full-review.mp4`。

最新二维作品源码目前在 `review/water-2d-55s` 分支。默认 `main` 仍是早期样片，`work` 是早期制作分支；本次文档整理未合并或删除这些分支。

运行 `node scripts/project-inventory.mjs` 可只读盘点本地项目的依赖、分支和已跟踪媒体；不会安装、移动或删除文件。

## 早期样片记录

以下命令和文件名属于早期制作路线，其中 `FinalFilm` 与当前 `WaterFilm2D` 是不同的组合。保留这些记录供追溯；制作当前二维作品请使用上方链接中的方法。

An 8-second, 1920×1080, 30fps Remotion sample built from the supplied cafe image.

```bash
npm install
npm run typecheck
npm run build
npm run render
npm run render:pour
npm run render:preview
npm run render:final
```

Outputs:

- `out/water-sample.mp4` — original eight-second sample
- `out/cafe-pour-shot.mp4` — seven-second café pour shot
- `out/water-final-55s-preview.mp4` — half-resolution review render
- `out/water-final-55s.mp4` — 1920×1080 final film

The 55-second film uses `public/assets/shot01.mp4` for its complete opening seven seconds.
