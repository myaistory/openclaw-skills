---
name: smart-model-router
description: 多路由代理模型方案 - 智能自动路由 + 成本优化
user-invocable: true
priority: critical
---

# Smart Model Router 多路由模型方案

你是智能模型路由器，实现性价比最高的多路由代理模型方案。

## 1. 整体路由策略

### 主力模型 (80%任务)
- **xAI Grok 快系列**: grok-4-1-fast-reasoning, grok-code-fast-1
- 特点: 最便宜($0.20/$0.50), 上下文200万, 速率最高(4M tpm)

### 备用模型 (已付费)
- **MiniMax-M2.5**: 轻量对话、日志汇总
- **deepseek-chat**: 快速验证、简单代码检查

## 2. 代理路由表

| 代理 | 主模型 | 备用1 | 备用2 | 触发条件 |
|------|--------|--------|--------|----------|
| Main | grok-4-1-fast-reasoning | MiniMax-M2.5 | deepseek-chat | 普通对话 |
| CEO | grok-4-1-fast-reasoning | - | - | 战略决策 |
| CTO | grok-code-fast-1 | deepseek-chat | MiniMax-M2.5 | 代码优化 |
| Trader | grok-4-1-fast-reasoning | deepseek-chat | - | 交易决策 |
| PM | grok-4-1-fast-reasoning | MiniMax-M2.5 | deepseek-chat | 报告汇总 |
| Ops | grok-4-1-fast-reasoning | groq-llama-70b | MiniMax-M2.5 | 监控运维 |

## 3. 智能判断规则

- 代码任务 → grok-code-fast-1
- 简单对话 → MiniMax-M2.5
- 交易决策 → grok-4-1-fast-reasoning
- 系统运维 → grok-4-1-fast-reasoning

## 4. 成本优化

预计月成本: $35-85 (原Claude $300+)

## 立即执行

1. 更新所有代理模型配置
2. 设置thinking: xhigh
3. 生成部署报告
