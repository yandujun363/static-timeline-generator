# 星光Kirarin 活动时间轴

一个粉丝向的静态时间轴，记录 [星光Kirarin](https://space.bilibili.com/3546653883632229)（妖精管理局 · 三光五色）从 2024 年出道到 2026 年的活动、作品与里程碑。

![星光Kirarin 活动时间轴](src/img/og-image.png)

## 特性

- **完整时间轴**：出道、百舰 / 千舰、生日回、二周年、3D 新衣装、联动与作品，共 28 条记录
- **现代 UI**：品牌色设计系统、双栏交替时间轴、卡片化布局、响应式排版
- **明暗主题**：跟随系统，也可手动切换并记忆偏好
- **筛选与搜索**：按分类筛选、按关键词搜索，结果数量实时更新
- **可分享状态**：筛选条件写入 URL（`?cat=3D&q=生日`），刷新或分享后保持
- **渐进增强**：无 JavaScript 时仍可阅读完整时间轴
- **无外部资源**：不依赖 Google Fonts、Font Awesome 或 CDN，图标全部内联
- **无障碍**：跳过链接、语义化标题、`aria-live` 结果提示、`:focus-visible`、尊重 `prefers-reduced-motion`

## 界面预览

![时间轴界面](docs/browser.png)

## 快速开始

要求 Node.js 20 及以上。

```bash
npm install
npm run dev     # 本地开发，默认 http://localhost:8080
npm run build   # 生成静态站点到 _site/
npm run lint    # ESLint（flat config）
npm run format  # Prettier
npm test        # lint + build
```

## 内容结构

站点内容集中在 [`src/_data/timeline.js`](src/_data/timeline.js)，页面通过 `timeline.*` 访问。

### 条目字段

```js
{
  id: 'debut',                 // 唯一锚点 ID
  date: '2024-06-07',          // YYYY-MM-DD（按 Asia/Shanghai 解析）
  time: '20:00',               // 可选，24 小时制
  categories: ['里程碑', '直播'], // 分类，可多选
  title: '出道回：星光妖精正式降临',
  body: '支持 <strong>HTML</strong> 的正文；默认会自动包一层 <p>。',
  icon: 'star',                // 内联 SVG 图标名，见 sprite.ejs
  color: 'gold',               // 可选，覆盖分类默认色
  status: 'upcoming',          // 可选，upcoming 会显示「即将到来」样式
  image: {                     // 可选
    src: 'img/example.png',
    link: 'https://example.com',
    alt: '图片描述',
    caption: '图片说明'
  },
  links: [
    { label: '萌娘百科', href: 'https://example.com' }
  ]
}
```

### 其他数据

- `site`：页面标题、描述、作者
- `profile`：主页文案、关键数据、外部链接
- `sources`：资料来源卡片
- `lastUpdated`：资料截止日期
- `filters` / `years`：由工具函数自动生成

### 分类与图标

分类的默认颜色与图标定义在 [`src/_data/utilities.js`](src/_data/utilities.js) 的 `CATEGORY_META` 中；新增分类时同时补充：

1. `CATEGORY_META` 中的 `color` / `icon`
2. `src/css/main.css` 中的 `--c-*` 颜色与 `.color-*` 映射
3. 如需新图标，在 [`src/_includes/sprite.ejs`](src/_includes/sprite.ejs) 中添加 `<symbol>`

## 视觉与代码

- **Eleventy 3**（ESM 配置）+ 官方 EJS 插件
- 原生 CSS 设计令牌（CSS Custom Properties），不再使用 Sass
- 原生 ES Module 交互脚本，无运行时依赖
- 日期格式化使用原生 `Intl.DateTimeFormat`，不再需要 moment.js
- 已移除 normalize.css、classList polyfill、Font Awesome 与外部字体

主要文件：

```text
eleventy.config.js         # Eleventy 3 配置
eslint.config.js           # ESLint flat config
src/_data/timeline.js      # 时间轴内容
src/_data/utilities.js     # 日期、分类、分组工具
src/_includes/head.ejs     # meta / 主题初始化 / 资源
src/_includes/sprite.ejs   # 内联 SVG 图标
src/index.ejs              # 页面模板
src/css/main.css           # 设计系统与布局
src/js/site-js.js          # 主题、筛选、搜索、锚点
src/img/                   # favicon / OG 图及其 SVG 源文件
```

## 部署

```bash
npm run build
```

`_site/` 目录包含构建后的静态文件，可部署到任意静态托管。

### GitHub Pages

```bash
git subtree push --prefix _site origin gh-pages
```

然后在仓库 **Settings → Pages** 中选择 **Deploy from a branch**，分支选 `gh-pages`，目录选 `/ (root)`。

![GitHub Pages 配置](docs/gh-pages-config.png)

### Netlify / Vercel / Render

- 构建命令：`npm run build`
- 发布目录：`_site`

## 数据来源与声明

- [萌娘百科 · 星光Kirarin](https://mzh.moegirl.org.cn/%E6%98%9F%E5%85%89Kirarin)：出道、历程、形象与逸闻
- [bilibili 个人空间](https://space.bilibili.com/3546653883632229)：粉丝数、投稿、动态
- [bilibili 直播间 32378653](https://live.bilibili.com/32378653)：直播活动与舰长记录

本站为粉丝整理的非官方时间轴，资料截至 **2026-11-07**，仅供交流与存档；如有错漏欢迎指正。角色形象、名称及相关作品版权归原作者与权利方所有。

## 致谢

本项目基于 Molly White 的 [static-timeline-generator](https://github.com/molly/static-timeline-generator) 重构，原项目以 [MIT License](LICENSE) 发布。

时间轴内容整理、视觉与代码现代化由 AI（DeepSeek）协助完成。
