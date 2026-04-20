---
title: PBR 光照速记：从辐射度量学到 BRDF
date: 2026-04-20 11:00:00
categories:
  - 图形技术
  - 渲染
tags:
  - PBR
  - Shader
  - 实时渲染
description: 一篇 PBR 核心公式的速查笔记，适合需要快速唤起记忆的技术美术。
mathjax: true
---

## 为什么要学 PBR

- 所见即所得：参数与材质物理属性直接对应（金属度、粗糙度）
- 跨光照一致性：在不同光照下表现更自然
- 工业标准：Unity URP/HDRP、Unreal 默认都是 PBR

## 核心公式

### 渲染方程（Rendering Equation）

$$
L_o(p, \omega_o) = L_e(p, \omega_o) + \int_{\Omega} f_r(p, \omega_i, \omega_o) L_i(p, \omega_i) (n \cdot \omega_i) d\omega_i
$$

### Cook-Torrance BRDF

$$
f_r = k_d \frac{c}{\pi} + k_s \frac{DFG}{4(\omega_o \cdot n)(\omega_i \cdot n)}
$$

- **D（法线分布函数）**：常用 GGX / Trowbridge-Reitz
- **F（菲涅尔项）**：常用 Schlick 近似
- **G（几何遮蔽函数）**：Smith-GGX

## 参数对应

| 物理属性 | 美术参数 | 范围 |
|---|---|---|
| 反照率 | Albedo | 非金属 sRGB 0.2~0.9；金属读 F0 |
| 粗糙度 | Roughness | 0（镜面）~ 1（完全漫反射） |
| 金属度 | Metallic | 0（绝缘体）或 1（金属），避免中间值 |
| 法线 | Normal Map | 切线空间常用 |

## 参考

- 《Real-Time Rendering, 4th Ed.》Ch.9
- LearnOpenGL: PBR Theory
- Unity Shader 入门精要

