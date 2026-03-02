---
name: self-repair-kit
description: OpenClaw自我修复工具包 - 自动诊断和修复系统问题
---

# Self-Repair-Kit 技能

## 概述

自动修复工具包，帮助OpenClaw诊断和修复常见问题。

## 功能

### 1. 系统健康检查
- 检查服务运行状态
- 检查API可用性
- 检查内存/CPU使用

### 2. 错误自动修复
- 重启失败服务
- 清理日志
- 修复配置错误

### 3. 安全审计 (集成SlowMist安全指南)
- 3层防御矩阵
- 红黄线规则
- 夜间自动审计

## 安全指南集成

本技能已集成 [SlowMist OpenClaw安全实践指南](https://github.com/slowmist/openclaw-security-practice-guide)：

### 核心原则
1. **零摩擦操作**: 减少手动安全设置
2. **高风险需确认**: 不可逆操作需人工批准
3. **显式夜间审计**: 13项核心指标每日报告
4. **默认零信任**: 假设提示注入始终可能

### 防御矩阵
1. **行动前**: 行为黑名单 + 技能安装审计
2. **行动中**: 权限收紧 + 跨技能检查
3. **行动后**: 夜间自动审计 + Git灾备

## 使用方法

### 健康检查
```
请检查系统健康状态
```

### 安全审计
```
请执行安全审计
```

### 部署防御
```
请部署安全防御矩阵
```

## 文件

- `security-guide.md` - 完整安全指南 (SlowMist提供)
- `auto-repair.sh` - 自动修复脚本
- `health-check.sh` - 健康检查脚本

## 来源

- 安全指南: [SlowMist OpenClaw Security Practice Guide](https://github.com/slowmist/openclaw-security-practice-guide)
- Stars: 136+
