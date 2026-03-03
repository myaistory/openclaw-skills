---
name: telegram-trading
description: Telegram交易信号推送 - 自动发送交易信号到Telegram
---

# Telegram Trading 技能

## 概述

自动将交易信号推送到Telegram。

## 功能

### 1. 实时信号推送
- 检测到插针信号时自动推送
- 包含代币、价格、置信度

### 2. 交易执行通知
- 买入/卖出执行时通知
- 包含数量、价格、盈亏

### 3. 日报/周报
- 每日交易总结
- 每周收益报告

## 配置

需要设置:
- TELEGRAM_BOT_TOKEN
- TELEGRAM_CHAT_ID

## 使用方法

### 发送信号
```javascript
const tg = new TelegramNotifier({
  token: process.env.TELEGRAM_BOT_TOKEN,
  chatId: process.env.TELEGRAM_CHAT_ID
});

await tg.sendSignal({
  token: 'COUNCIL',
  price: 0.0001,
  drop: 5.2,
  recovery: 18.5,
  confidence: 85
});
```

### 消息格式

📊 **交易信号**
- 代币: COUNCIL/SOL
- 跌幅: -5.2%
- 回升: +18.5%
- 置信度: 85%

## 来源

基于 Telegram Bot API
- https://core.telegram.org/bots/api
