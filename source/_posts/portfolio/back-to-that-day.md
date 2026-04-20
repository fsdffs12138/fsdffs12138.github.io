---
title: "《回那天》｜第一人称微恐解密 · 策划 + 程序"
date: 2024-06-15 18:00:00
categories:
  - 作品集
  - 项目经历
tags:
  - Unity
  - 微恐
  - 解密
  - 第一人称
  - 对话系统
  - 机核 BOOOM
cover: /img/portfolio/BV152EuzmEpj.jpg
description: 第一人称微恐解密游戏。玩家扮演回家探亲的孙子，在老宅中逐步解开奶奶出事当年的秘密。入选机核 BOOOM 2025。
sticky: 80
---

## 游戏实况

<div style="position: relative; padding-top: 56.25%; height: 0; overflow: hidden; border-radius: 8px;">
  <iframe
    src="//player.bilibili.com/player.html?bvid=BV152EuzmEpj&page=1&high_quality=1&danmaku=0&autoplay=0"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"
    scrolling="no"
    frameborder="no"
    allowfullscreen="true"
    referrerpolicy="no-referrer">
  </iframe>
</div>

> 🎬 [在 B 站观看完整实况](https://www.bilibili.com/video/BV152EuzmEpj/) · UP 主：藻类祝福 · 时长 28 分钟
>
> 📖 [机核 GCORES 游戏档案](https://www.gcores.com/games/148007)

## 项目简介

《回那天》是一款**第一人称视角的微恐解密游戏**，**入选机核 BOOOM 2025**。

> 玩家扮演这个家庭里年纪最小的孩子 —— **家泽**。一年前，他的奶奶坠楼身亡，因生前精神错乱而被判定为意外；家泽则在奶奶坠楼那天摔下楼梯，失去了那段记忆。
>
> **回南天**的时候，亲人们返乡烧平安符，家泽踏进熟悉而又陌生的老宅，在**探索与互动**中逐步拼回那一天的真相。

氛围定位：
- **中式民俗恐怖**：不是 Jump Scare，而是潮湿、雾气、民俗符号营造的不安感
- **解密推动叙事**：每个解谜环节对应一段记忆碎片
- **家庭题材**：情感内核是对亲人的缅怀与家族秘密的重量

## 我的职责

### 🎯 策划
- 设计了**解密关卡**（物品交互逻辑、线索埋设顺序）
- 调节难度曲线：避免过难导致氛围感断裂
- 参与叙事与谜题的耦合设计

### 💻 程序
- 搭建了**主要的程序框架**：
  - **3D 场景的物品交互**（拾取、组合、解锁）
  - **2D 场景切换与数值存储**（回忆片段的过场）
  - 贯穿全局的**对话系统**

## 技术亮点 / 学到的

- **3D ↔ 2D 场景混用**：现实层用 3D 探索，回忆层用 2D 蒙太奇，叙事节奏更强
- **对话系统的解耦**：用 ScriptableObject 配置对话树，策划可直接编辑、无需改代码
- **物品交互的状态机**：每件物品有"未发现 / 已拾取 / 已组合 / 已使用"等状态，避免分支爆炸
- **氛围优先的解密设计**：谜题难度 < 氛围代入感，这是恐怖 / 解密题材的设计哲学
- **中式民俗符号的融入**：回南天、平安符、老宅 —— 通过真实的文化触点承接恐怖氛围

## 相关链接

- 🎥 **游戏实况**：[B 站 · 藻类祝福《回那天》实况](https://www.bilibili.com/video/BV152EuzmEpj/)
- 📖 **游戏档案**：[机核 GCORES · 回那天](https://www.gcores.com/games/148007)
- 💾 **试玩下载**：[百度网盘](https://pan.baidu.com/s/1qg62ONGxAa1fKrC282PQVQ) · 提取码：`02hq`

## 时间 & 产出

- 时间：2024.04 – 2024.06
- 角色：策划 + 程序
- 团队：学生小组项目
- 成果：可玩 Demo + 入选机核 BOOOM 2025 + UP 主实况
