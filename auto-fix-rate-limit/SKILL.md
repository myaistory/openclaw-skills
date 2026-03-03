# auto-fix-rate-limit Skill

## Description
自动检测 WebSocket 429 限流并实施智能指数退避重连策略。记录限流历史并提供状态管理 (running/paused)。

## Location
`/root/.openclaw/workspace/skills/auto-fix-rate-limit/`

## Features
- **自动检测**: 监控 WebSocket 连接中的 429 状态码
- **智能退避**: 指数退避算法，最大重试间隔 60 秒
- **历史记录**: 记录每次限流事件到 history.json
- **状态管理**: 支持 running/paused 状态切换
- **配置灵活**: 可配置最大重试次数、基础退避时间

## Files
- `SKILL.md` - 技能文档
- `index.js` - 主实现文件
- `config.json` - 配置文件
- `history.json` - 限流历史记录

## Usage
技能自动加载后，会监控所有 WebSocket 连接。当检测到 429 限流时自动触发退避重连。

### 状态控制
```bash
# 暂停技能
openclaw skills auto-fix-rate-limit pause

# 恢复技能
openclaw skills auto-fix-rate-limit resume

# 查看状态
openclaw skills auto-fix-rate-limit status
```

### 配置文件 (config.json)
```json
{
  "enabled": true,
  "maxRetries": 5,
  "baseDelayMs": 1000,
  "maxDelayMs": 60000,
  "exponentialBase": 2,
  "logHistory": true
}
```

## Installation
```bash
# 技能已在工作区，热加载即可
openclaw skills reload
```

## Author
CTO Agent - NeedleBot AI Trading System

## Version
1.0.0
