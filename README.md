# 张紫晴 · 个人作品集

React + Vite 个人作品集。当前保留项目文案与页面结构，所有项目图片、设计过程图和视频均使用灰色占位。

## 本地运行

安装依赖：npm install
启动开发预览：npm run dev
构建：npm run build
检查构建结果：npm run preview

## 后续填充素材

将素材放入 public/assets/，在 src/content.js 的 media 中填写以 /assets/ 开头的路径。保留 null 即显示灰底占位；加载失败也会自动回到占位。

- media.xiaohuasheng.cover：小花生封面，首页卡片与案例顶部共用。
- media.xiaohuasheng.chapters：按章节序号填入设计过程图，如 { 0: '/assets/xiaohuasheng/chapter-01.webp' }。序号从 0 开始，对应项目 sections 的顺序。
- media.flarewild.cover：FlareWild 封面。
- media.flarewild.video：互动视频，建议 MP4。
- media.flarewild.poster：视频封面图。
- media.flarewild.chapters：设计过程图，规则同上。类型为 demo 的章节使用 video，首页视频区共用该视频。
- explorations 中的 image：更多探索的封面。

手机中的三张卡片采用 React Bits 的 ProfileCard-JS-CSS，源码在 src/components/ProfileCard.jsx 与 ProfileCard.css。照片暂留空，收到后填写 src/content.js 中的 profile.portrait。外侧条带与屏幕内条带分开：外侧固定，内侧和卡片围绕屏幕上缘一起摆动。

项目文字、标签、联系方式也在 src/content.js；首页关于我的展开内容位于 src/main.jsx 的 About 组件。样式统一在 src/style.css。现有简历在 public/assets/resume.pdf，后续同名替换即可。

## 页面与交互

- 首页：八张悬浮吊牌围绕英文标题，接居中手机（三张灰色占位卡片，可切换、横滑和轻摇）；继续向下为项目切换和翻面、视频区、更多探索、关于我、联系。
- 案例：/projects/xiaohuasheng 与 /projects/flarewild，含章节锚点和下一个案例。
- 支持手机导航、画廊左右键和横向滑动、简介弹窗、复制联系信息和简历下载。
- 首屏八张吊牌有错峰轻晃、鼠标与滚动视差；手机段按滚动进度旋转、切换黑底、收起两侧卡片并落下条带，继续滚动进入口袋阶段，向上滚动可反向还原。系统减少动态效果设置会禁用持续晃动与弹簧缓动。

## 部署

构建目录为 dist。已提供 Netlify 的 public/_redirects 和 Vercel 的 vercel.json。其他静态服务器需要将页面路由回退至 index.html，以支持案例页直接打开和刷新；素材路径应正常返回文件。GitHub Pages 通过 .github/workflows/deploy.yml 自动部署 main 分支。线上地址：https://616219zzq-lgtm.github.io/ziqing-portfolio/ 。使用 npm run build:pages 构建部署版本，包含子路径资源和案例页刷新回退。


### 动效展示视频
首页 FlareWild 手机模型的视频列表位于 src/content.js 的 motionClips。
把视频放到 public/assets/，再填写各条目的 src 和可选 poster；可增加或删除条目，左右按钮、计数和键盘切换会自动同步。
未提供素材时显示灰色占位；切换时卸载上一段视频，离开可视区域后暂停播放。
联系区现按 Badgey 参考使用 src/components/ClosingBadge.jsx：照片吊牌、半透明姓名区域与整体摆动，点击可轻推。profile.portrait 用于后续替换照片。ReflectiveCard 组件仍保留在源码中。
