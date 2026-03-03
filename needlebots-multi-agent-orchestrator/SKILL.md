---
name: needlebots-multi-agent-orchestrator
description: NeedleBot 多代理系统核心编排器，协调 CEO/CTO/PM/Ops/Trader 五大角色协同工作
user-invocable: true
priority: highest
---

# NeedleBot Multi-Agent Orchestrator - 多代理系统核心编排器

## 🎯 核心功能

本技能是 NeedleBot AI 交易系统的核心编排器，负责协调 5 个持久化代理角色的高效协同工作。

### 代理角色映射

| 角色 | 代理 ID | 模型 | 核心职责 |
|------|--------|------|--------|
| **CEO** | ceo | Grok-4 | 资金调度 + 进化方向 |
| **CTO** | cto | Qwen | 代码修改 + 信号算法 |
| **PM** | pm | - | 进度跟踪 + 报告生成 |
| **Ops** | ops | Groq | 监控 + 自动修复 + 部署 |
| **Trader** | trader | - | 实盘执行 + PNL 管理 |

---

## 📋 使用指令

### 基本使用

```
/needlebots-orchestrator [action] [options]
```

### 可用操作

#### 1. 系统状态
```
/needlebots-orchestrator status
```
- 显示所有代理状态
- 显示系统健康度
- 显示当前任务队列

#### 2. 任务分发
```
/needlebots-orchestrator dispatch <task> --to <role>
```
- 将任务分发给指定角色
- 支持多角色协作任务
- 自动跟踪执行进度

#### 3. 代理会话管理
```
/needlebots-orchestrator session <action> <role>
```
- 启动/停止代理会话
- 查看会话状态
- 重置代理状态

#### 4. 系统报告
```
/needlebots-orchestrator report [--period daily|weekly]
```
- 生成系统执行报告
- 汇总各代理工作成果
- 分析系统效率

#### 5. 紧急干预
```
/needlebots-orchestrator emergency <action>
```
- 暂停所有代理
- 紧急资金保护
- 系统安全模式

---

## 🔧 立即执行的行为

### 启动时自动执行

1. **初始化代理会话**
   - 为 5 个角色创建持久化 session
   - 配置各代理的模型和参数
   - 建立代理间通信通道

2. **加载系统配置**
   - 读取代理角色定义
   - 加载任务路由规则
   - 配置监控和告警阈值

3. **启动协调引擎**
   - 启动任务调度器
   - 启动进度跟踪器
   - 启动冲突解决机制

### 运行时行为

```javascript
// NeedleBot 多代理协调引擎
class NeedleBotOrchestrator {
  constructor() {
    this.agents = {
      ceo: { model: 'grok-4', role: 'CEO', session: null },
      cto: { model: 'qwen', role: 'CTO', session: null },
      pm: { model: 'default', role: 'PM', session: null },
      ops: { model: 'groq', role: 'Ops', session: null },
      trader: { model: 'default', role: 'Trader', session: null }
    };
    
    this.taskQueue = new PriorityTaskQueue();
    this.coordinationLog = [];
  }
  
  async initialize() {
    // 1. 创建所有代理的持久会话
    for (const [role, config] of Object.entries(this.agents)) {
      config.session = await this.createPersistentSession(role, config.model);
    }
    
    // 2. 建立代理间通信
    await this.establishCommunicationChannels();
    
    // 3. 启动监控循环
    this.startMonitoringLoop();
    
    return { status: 'initialized', agents: Object.keys(this.agents) };
  }
  
  async dispatchTask(task) {
    // 1. 分析任务类型
    const analysis = this.analyzeTask(task);
    
    // 2. 确定目标代理
    const targetAgent = this.selectAgent(analysis);
    
    // 3. 如果需要多代理协作
    if (analysis.requiresCollaboration) {
      return this.executeCollaborativeTask(task, analysis.collaborators);
    }
    
    // 4. 分发给单一代理
    return this.executeSingleAgentTask(task, targetAgent);
  }
  
  async executeCollaborativeTask(task, collaborators) {
    const workflow = {
      id: generateId(),
      task: task,
      collaborators: collaborators,
      steps: [],
      status: 'running'
    };
    
    // 协调多代理执行
    for (const agent of collaborators) {
      const step = await this.agents[agent].session.execute(task.subtask[agent]);
      workflow.steps.push({ agent, result: step });
    }
    
    // 整合结果
    workflow.result = this.integrateResults(workflow.steps);
    workflow.status = 'completed';
    
    return workflow;
  }
  
  startMonitoringLoop() {
    setInterval(async () => {
      // 检查所有代理健康状态
      const health = await this.checkAgentHealth();
      
      // 检测异常
      const anomalies = this.detectAnomalies(health);
      
      // 如果有异常，通知 Ops 处理
      if (anomalies.length > 0) {
        await this.agents.ops.session.notify(anomalies);
      }
      
      // 更新系统状态
      this.updateSystemStatus(health);
    }, 5000); // 每 5 秒检查一次
  }
}
```

---

## 📊 代理职责详解

### CEO (Chief Executive Officer)
**模型**: Grok-4
**核心职责**:
- 资金调度与分配
- 系统进化方向决策
- 战略规划与目标设定
- 重大风险决策
- 代理团队协调

**关键指令**:
```
/ceo allocate-funds <amount> --to <strategy>
/ceo set-strategy <strategy_name>
/ceo review-performance --period <daily|weekly>
/ceo approve-change <change_request>
```

### CTO (Chief Technology Officer)
**模型**: Qwen
**核心职责**:
- 代码开发与修改
- 信号算法优化
- 技术架构设计
- 代码质量审查
- 技术债务管理

**关键指令**:
```
/cto implement <feature>
/cto optimize <algorithm>
/cto review-code <path>
/cto fix-bug <issue_id>
```

### PM (Project Manager)
**模型**: Default
**核心职责**:
- 进度跟踪与报告
- 任务优先级管理
- 团队协调沟通
- 里程碑管理
- 风险预警

**关键指令**:
```
/pm track-progress <project>
/pm generate-report --period <daily|weekly>
/pm prioritize <task_list>
/pm alert-risk <risk_description>
```

### Ops (Operations)
**模型**: Groq
**核心职责**:
- 系统监控与告警
- 自动修复与恢复
- 部署与发布
- 性能优化
- 安全管理

**关键指令**:
```
/ops monitor <system_component>
/ops auto-fix <issue>
/ops deploy <version>
/ops optimize <resource>
```

### Trader
**模型**: Default
**核心职责**:
- 实盘交易执行
- PNL 管理与报告
- 风险控制执行
- 市场机会捕捉
- 交易策略实施

**关键指令**:
```
/trader execute <signal>
/trader report-pnl --period <daily|weekly>
/trader manage-risk <position>
/trader capture-opportunity <market_condition>
```

---

## 🔄 协作工作流

### 典型工作流：新策略部署

```
1. CEO: 批准新策略方向
   ↓
2. CTO: 开发策略代码
   ↓
3. PM: 跟踪开发进度
   ↓
4. Ops: 部署到生产环境
   ↓
5. Trader: 执行策略交易
   ↓
6. PM: 生成执行报告
   ↓
7. CEO: 审查结果并决策
```

### 紧急响应工作流

```
1. Ops: 检测到异常
   ↓
2. Ops: 自动尝试修复
   ↓
3. 如果修复失败 → 通知 CEO + CTO
   ↓
4. CEO: 决策是否暂停交易
   ↓
5. CTO: 分析技术原因
   ↓
6. Ops: 实施修复方案
   ↓
7. Trader: 恢复交易
```

---

## 🚨 冲突解决机制

### 决策冲突

当多个代理对同一决策有不同意见时：

```
1. PM 收集各方意见
2. CEO 做出最终决策
3. 所有代理执行决策
4. PM 记录决策过程
```

### 资源冲突

当多个任务竞争同一资源时：

```
1. PM 评估优先级
2. 按优先级分配资源
3. 低优先级任务排队
4. CEO 可调整优先级
```

### 执行冲突

当代理执行出现冲突时：

```
1. Ops 检测冲突
2. 暂停冲突操作
3. CEO + CTO 协商解决方案
4. Ops 实施解决方案
```

---

## 📈 监控指标

### 系统级指标

| 指标 | 目标 | 告警阈值 |
|------|------|--------|
| 系统可用性 | >99.9% | <99% |
| 任务完成率 | >95% | <90% |
| 平均响应时间 | <5s | >10s |
| 代理健康度 | 100% | <80% |

### 代理级指标

| 代理 | 关键指标 | 目标 |
|------|--------|------|
| CEO | 决策质量 | >90% 正确率 |
| CTO | 代码质量 | Bug 率 <0.1% |
| PM | 报告及时性 | 100% 准时 |
| Ops | 故障恢复时间 | <5 分钟 |
| Trader | PNL | 正收益 |

---

## 📁 文件结构

```
needlebots-multi-agent-orchestrator/
├── SKILL.md                  # 本文件
├── orchestrator/             # 核心编排器
│   ├── main-orchestrator.js  # 主编排逻辑
│   ├── task-dispatcher.js    # 任务分发器
│   ├── conflict-resolver.js  # 冲突解决器
│   └── health-monitor.js     # 健康监控
├── agents/                   # 代理配置
│   ├── ceo-config.json
│   ├── cto-config.json
│   ├── pm-config.json
│   ├── ops-config.json
│   └── trader-config.json
├── workflows/                # 协作工作流
│   ├── strategy-deployment.yaml
│   ├── emergency-response.yaml
│   └── daily-operations.yaml
├── sessions/                 # 会话管理
│   └── session-manager.js
└── logs/                     # 系统日志
    ├── orchestration-log.json
    └── agent-activity-log.json
```

---

## 🔄 会话管理

### 持久化会话创建

```javascript
async function createPersistentSessions() {
  const sessions = {};
  
  // 为每个代理创建持久会话
  const agents = ['ceo', 'cto', 'pm', 'ops', 'trader'];
  
  for (const agent of agents) {
    sessions[agent] = await sessions_spawn({
      name: `needlebot-${agent}`,
      model: getAgentModel(agent),
      persistent: true,
      context: {
        role: agent.toUpperCase(),
        system: 'needlebot-multi-agent',
        capabilities: getAgentCapabilities(agent)
      }
    });
  }
  
  return sessions;
}
```

### 会话通信

```javascript
// 代理间消息传递
async function sendToAgent(agent, message) {
  const session = sessions[agent];
  return await session.send(message);
}

// 广播消息
async function broadcast(message, exclude = []) {
  const recipients = Object.keys(sessions).filter(a => !exclude.includes(a));
  return await Promise.all(
    recipients.map(agent => sendToAgent(agent, message))
  );
}
```

---

## 🚨 安全机制

### 资金保护

```
1. 所有资金操作需要 CEO 批准
2. 大额交易 (>10% 资金) 需要双重确认
3. 异常交易自动暂停并告警
4. 每日资金报告自动发送给 CEO
```

### 代码安全

```
1. 所有代码修改需要 CTO 审查
2. 生产环境代码需要 CEO 批准
3. 自动回滚机制
4. 代码变更日志
```

### 系统安全

```
1. Ops 持续监控系统安全
2. 自动检测异常行为
3. 紧急停止按钮
4. 安全审计日志
```

---

## 📋 启动检查清单

### 系统启动前

- [ ] 所有 5 个代理会话已创建
- [ ] 代理间通信通道已建立
- [ ] 监控系统已启动
- [ ] 告警阈值已配置
- [ ] 日志系统已就绪

### 每日检查

- [ ] 所有代理健康状态正常
- [ ] 任务队列无积压
- [ ] 系统指标在正常范围
- [ ] 无未处理的告警
- [ ] 日志系统正常写入

### 每周检查

- [ ] 系统性能分析
- [ ] 代理效率评估
- [ ] 任务完成率统计
- [ ] 系统优化建议
- [ ] 下周计划制定

---

## 📊 系统报告模板

### 日报

```markdown
# NeedleBot 系统日报 - {date}

## 系统概览
- 运行时间：{uptime}
- 系统健康度：{health}%
- 任务完成：{completed}/{total}

## 代理状态
| 代理 | 状态 | 任务数 | 成功率 |
|------|------|--------|--------|
| CEO | {status} | {count} | {rate}% |
| CTO | {status} | {count} | {rate}% |
| PM | {status} | {count} | {rate}% |
| Ops | {status} | {count} | {rate}% |
| Trader | {status} | {count} | {rate}% |

## 今日亮点
- {highlight1}
- {highlight2}

## 需要关注
- {concern1}
- {concern2}

## 明日计划
- {plan1}
- {plan2}
```

### 周报

```markdown
# NeedleBot 系统周报 - {week}

## 本周总结
- 总任务数：{total}
- 完成率：{rate}%
- 系统可用性：{availability}%

## 各代理表现
{agent_performance_details}

## PNL 报告
- 本周收益：{pnl}
- 胜率：{win_rate}%
- 最大回撤：{max_drawdown}%

## 技术进展
{technical_progress}

## 下周计划
{next_week_plan}
```

---

## 🔄 更新与维护

### 定期任务

- **实时**: 监控代理状态和系统健康
- **每分钟**: 更新任务队列状态
- **每小时**: 生成系统快照
- **每日**: 生成日报，清理旧日志
- **每周**: 生成周报，系统优化

### 版本历史

- v1.0.0 (2026-03-03): 初始版本，5 代理多代理系统核心编排器

---

*NeedleBot Multi-Agent Orchestrator - 五代理协同，智能交易系统核心*
