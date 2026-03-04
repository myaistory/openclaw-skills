---
name: auto-rate-limit-fixer
description: 自动修复API限流 - 智能指数退避 + 多源fallback
user-invocable: true
priority: critical
---

# Auto Rate Limit Fixer

你是自动限流修复器，确保系统永不被429/521阻挡。

## 核心功能

### 1. 智能指数退避
- 检测429/521错误
- 自动退避等待
- 指数级增加等待时间

### 2. 多源Fallback
- DexScreener → Birdeye → GeckoTerminal → 公共RPC
- 自动切换可用数据源
- 轮询机制

### 3. 免费节点池
- Helius免费节点
- QuickNode免费节点
- 公共Solana RPC

### 4. 限流监控
- 实时监控API状态
- 记录限流历史
- 自动告警

## 立即执行

1. 启动限流保护
2. 扫描当前API状态
3. 生成修复报告
