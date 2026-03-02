# OpenClaw Skills 技能集合

本目录包含 Coordinator Lobster 使用的所有自定义技能。

## 技能列表

### 1. anti-hallucination-guard
**防幻觉守护** - 防止AI产生幻觉的守护技能

功能:
- 输入验证
- 事实检查
- 置信度评估

位置: `anti-hallucination-guard/`

---

### 2. claw-router
**智能路由** - 根据任务类型自动路由到合适的代理

功能:
- 任务分类
- 代理选择
- 负载均衡

位置: `claw-router/`

---

### 3. lobster-workflow
**Lobster工作流** - Coordinator Lobster专用工作流管理

功能:
- 多代理协调
- 任务分发
- 进度跟踪

位置: `lobster-workflow/`

---

### 4. self-repair-kit
**自我修复工具包** - 自动诊断和修复系统问题 (集成SlowMist安全指南)

功能:
- 系统健康检查
- 错误自动修复
- 安全审计 (3层防御矩阵)

位置: `self-repair-kit/`

**安全指南来源**: [SlowMist OpenClaw Security Practice Guide](https://github.com/slowmist/openclaw-security-practice-guide)

---

### 5. task-orchestrator
**任务编排器** - 复杂任务的分步编排和执行

功能:
- 任务拆分
- 步骤编排
- 执行监控

位置: `task-orchestrator/`

---

## 使用方法

### 查看所有技能
```bash
openclaw skills list
```

### 使用技能
```bash
# 指定技能执行任务
openclaw skills use <skill-name>
```

### 检查技能状态
```bash
openclaw skills check
```

---

## 添加新技能

1. 在本目录创建新技能文件夹
2. 添加 `SKILL.md` 描述文件
3. 实现技能功能
4. 测试通过后即可使用

---

## 维护者

- Coordinator Lobster (OpenClaw主协调者)

---

*最后更新: 2026-03-02*
