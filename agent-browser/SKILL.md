---
name: agent-browser
description: 浏览器自动化工具 - Vercel agent-browser集成
---

# Agent Browser 技能

## 概述

集成 Vercel [agent-browser](https://github.com/vercel-labs/agent-browser) 浏览器自动化工具。

## 功能

### 1. 页面导航
- 打开指定URL
- 截图/录屏
- 获取页面快照

### 2. 元素交互
- 点击/双击元素
- 输入文本
- 表单填写
- 下拉选择

### 3. 页面操作
- 滚动页面
- 等待加载
- 执行JavaScript
- 文件上传/下载

## 使用方法

### 打开网页并截图
```
agent-browser open https://www.google.com
agent-browser screenshot /tmp/page.png
```

### 获取页面元素
```
agent-browser snapshot
```

### 点击元素
```
agent-browser click "#submit-button"
```

### 输入文本
```
agent-browser type "#search-input" "搜索内容"
```

## 命令列表

| 命令 | 说明 |
|------|------|
| open \<url\> | 打开URL |
| click \<sel\> | 点击元素 |
| type \<sel\> \<text\> | 输入文本 |
| screenshot [path] | 截图 |
| snapshot | 获取页面快照 |
| eval \<js\> | 执行JS |
| scroll \<dir\> [px] | 滚动 |

## 来源

- GitHub: https://github.com/vercel-labs/agent-browser
- Stars: 17,000+
- License: Apache 2.0
