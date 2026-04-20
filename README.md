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

1. 在 GitHub 创建仓库，**仓库名建议 `<你的用户名>.github.io`**（这样就是用户站，URL 最短；当前仓库为 `fsdffs12138.github.io`）
2. 本地初始化并推送：
   ```powershell
   cd h:\工作内容\Web
   git init
   git branch -M main
   git add .
   git commit -m "init: hexo + butterfly blog"
   git remote add origin https://github.com/fsdffs12138/fsdffs12138.github.io.git
   git push -u origin main
   ```
3. 打开 GitHub 仓库 → Settings → Pages → Source 选 **"GitHub Actions"**
4. 等 Actions 跑完（约 1-2 分钟），访问 `https://fsdffs12138.github.io`

### 以后更新
只要 `git push`，Actions 会自动重新构建并部署。

### 备选：本地命令部署
```powershell
npm run deploy    # 用 hexo-deployer-git 推到仓库
```

## ✅ 发布审核流程（push 前自检清单）

每次提交前按下面的顺序过一遍，能挡掉 90% 的线上事故。触发词：**发文 / 发布 / 部署 / 上线 / 推博客 / 提交审核**。

### 1. 内容核对
- [ ] front-matter 必填齐：`title` / `date` / `categories` / `tags` / `description`
- [ ] 封面图路径存在（`cover: /img/...`），图片 < 1 MB（超过用 sharp 压一下）
- [ ] 正文内部链接、图片链接全部有效（无 404）
- [ ] 署名相关文案保持 `arthurs`（侧边栏、公告、about 页不要回退成 porcojiang）

### 2. 配置核对（动过才查）
- [ ] `_config.yml` 的 `timezone` **必须是 IANA 合法值**（中国统一 `Asia/Shanghai`，**不能写 Asia/Shenzhen**）
- [ ] `url` = `https://fsdffs12138.github.io`，`deploy.repo` = 用户站仓库
- [ ] `_config.butterfly.yml` 里的 `index_img` / `social` / `menu` 路径都存在

### 3. 本地构建验证（必跑）
```powershell
npx.cmd hexo clean
npx.cmd hexo generate     # 必须 0 error，有 WARN 看情况
npx.cmd hexo server       # http://localhost:4000 肉眼确认首页 / 新文章 / 分类 / 标签
```
- [ ] 终端无报错（特别注意 `Moment Timezone has no data for ...`）
- [ ] 浏览器首页、新发文章、分类页、标签页都能打开
- [ ] 新文章封面、正文图片都正常加载（打开浏览器 DevTools 看 Network 有没有 404）

### 4. Git 提交
```powershell
git status                           # 看看有没有误入的产物
git add .
git commit -m "<type>: <一句话说明>"   # type: post / style / fix / chore
git push origin main
```
Commit message 约定：
- `post: add XXX`（新文章）
- `style: ...`（主题 / 样式）
- `fix: ...`（bug / 配置错误）
- `chore: ...`（杂项）

### 5. 线上验证（push 之后 1–2 分钟）
- [ ] GitHub Actions 跑绿（https://github.com/fsdffs12138/fsdffs12138.github.io/actions）
- [ ] 打开 https://fsdffs12138.github.io/ 确认新内容已更新
- [ ] 随机点一篇新文章，看封面、正文图片、分类标签都正常
- [ ] 如果 404：**先本地 `hexo generate`** 复现，99% 是构建失败导致 Pages 无产物

### 常见坑（过去踩过的）
| 症状 | 根因 | 处理 |
|---|---|---|
| 线上 404 | `timezone` 填了非 IANA 值 | 改回 `Asia/Shanghai` 重推 |
| 页面仍显示旧署名 | 浏览器缓存 + server 未重启 | `hexo clean && generate`，Ctrl+F5 硬刷 |
| PowerShell 跑不了 `npm` | 执行策略拦 `npm.ps1` | 用 `npm.cmd` / `npx.cmd` |
| banner 加载慢 | 图片过大 | 用 sharp 压成 JPEG Q82 w1920 |

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
