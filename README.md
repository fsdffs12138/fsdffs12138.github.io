# Arthur's Wiki / Blog

基于 **Hexo 8** + **Butterfly 5** 主题的个人博客，部署在 **GitHub Pages**。

## 🚀 快速开始

```powershell
# 1. 安装依赖（首次）
npm install

# 2. 本地预览，打开 http://localhost:4000
npm run server

# 3. 生成静态文件到 public/
npm run build

# 4. 清理缓存（排版异常时执行）
npm run clean
```

## ✍️ 如何写新文章

### 方式 A：命令生成
```powershell
npx hexo new post "我的新文章"
# 会在 source/_posts/ 下创建 我的新文章.md 以及同名资源文件夹
```

### 方式 B：手动创建
直接在 `source/_posts/` 下新建 `your-title.md`，头部加 front-matter：

```yaml
---
title: 文章标题
date: 2026-04-20 10:00:00
categories:
  - 图形技术       # 可多层，第二个是子分类
  - 渲染
tags:
  - PBR
  - Shader
description: 一句话摘要，会显示在首页和列表。
cover: /img/xxx.jpg    # 可选，封面图
sticky: 1              # 可选，置顶优先级（数字越大越靠前）
mathjax: true          # 可选，需要数学公式时开启
---

正文内容...
```

### 插图怎么放

已开启 `post_asset_folder: true`，每次 `hexo new post` 都会生成一个与文章同名的资源目录。把图片放进去，正文里写：

```markdown
![说明](./图片文件名.png)
```

或者放 `source/images/` 统一管理，然后用 `/images/xxx.png`。

## 📁 目录速查

```
.
├── _config.yml              站点配置（标题、URL、部署 等）
├── _config.butterfly.yml    Butterfly 主题配置（菜单、侧边栏、颜色 等）
├── source/
│   ├── _posts/              文章（核心内容区）
│   ├── about/index.md       关于页
│   ├── categories/index.md  分类页入口
│   └── tags/index.md        标签页入口
├── themes/                  主题源码（当前用 npm 方式装在 node_modules）
└── .github/workflows/       GitHub Actions 自动部署
```

## 🌐 部署到 GitHub Pages

**推荐方式：GitHub Actions 自动部署**（已配置好，见 `.github/workflows/deploy.yml`）

### 首次部署步骤

1. 在 GitHub 创建仓库，**仓库名建议 `arthursfeng.github.io`**（这样就是用户站，URL 最短）
2. 本地初始化并推送：
   ```powershell
   cd h:\工作内容\Web
   git init
   git branch -M main
   git add .
   git commit -m "init: hexo + butterfly blog"
   git remote add origin https://github.com/arthursfeng/arthursfeng.github.io.git
   git push -u origin main
   ```
3. 打开 GitHub 仓库 → Settings → Pages → Source 选 **"GitHub Actions"**
4. 等 Actions 跑完（约 1-2 分钟），访问 `https://arthursfeng.github.io`

### 以后更新
只要 `git push`，Actions 会自动重新构建并部署。

### 备选：本地命令部署
```powershell
npm run deploy    # 用 hexo-deployer-git 推到仓库
```

## 🧩 常用写作技巧

- **置顶**：front-matter 加 `sticky: 100`
- **隐藏文章**：改文件名加前缀 `_`，或在 front-matter 写 `hidden: true`
- **自定义封面**：`cover: /images/xxx.jpg`
- **数学公式**：`mathjax: true`，然后用 `$...$` 或 `$$...$$`
- **Butterfly Tag 插件**：支持 note / tabs / timeline 等高级排版，详见 [Butterfly 文档](https://butterfly.js.org/posts/4aa8abbe/)

## 🔧 主题调优入口

- 菜单、Logo、头图 → `_config.butterfly.yml` 的 `menu` / `nav` / `index_img`
- 侧边栏卡片 → `aside.*`
- 颜色/暗色 → `theme_color` / `darkmode`
- 本地搜索 → `local_search.enable: true`

## 📝 License

文章采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)，转载请注明出处。
