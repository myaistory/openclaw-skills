---
name: lobster-workflow
description: 多代理协调工作流系统，负责任务分发、进度跟踪和结果整合
user-invocable: true
priority: high
---

# Lobster Workflow - 多代理协调工作流

## 🎯 核心功能

本技能提供多代理协调和工作流管理能力，支持复杂任务的自动化分解、分发和跟踪。

### 功能模块

1. **多代理协调** - 协调多个代理协同工作
2. **任务分发** - 将复杂任务分解并分发给合适的代理
3. **进度跟踪** - 实时跟踪任务进度和状态

---

## 📋 使用指令

### 基本使用

```
/lobster-workflow [action] [options]
```

### 可用操作

#### 1. 创建工作流
```
/lobster-workflow create <workflow_name>
```
- 定义工作流名称
- 设置工作流步骤
- 配置代理分配

#### 2. 执行工作流
```
/lobster-workflow execute <workflow_name> [params]
```
- 启动工作流执行
- 传递参数
- 监控进度

#### 3. 查看进度
```
/lobster-workflow status <workflow_id>
```
- 显示当前进度
- 显示各步骤状态
- 显示代理状态

#### 4. 暂停/恢复
```
/lobster-workflow pause <workflow_id>
/lobster-workflow resume <workflow_id>
```
- 暂停工作流执行
- 恢复工作流执行

#### 5. 取消工作流
```
/lobster-workflow cancel <workflow_id>
```
- 取消正在执行的工作流
- 清理资源
- 记录取消原因

---

## 🔧 立即执行的行为

### 启动时自动执行

1. **加载工作流定义**
   - 从 `workflows/` 目录加载工作流模板
   - 解析工作流依赖关系
   - 初始化工作流引擎

2. **注册代理连接器**
   - 建立与所有代理的连接
   - 配置通信协议
   - 设置超时和重试策略

3. **初始化跟踪系统**
   - 启动进度跟踪器
   - 配置状态存储
   - 设置通知回调

### 运行时行为

```javascript
// 工作流执行引擎
class LobsterWorkflow {
  async execute(workflow, params) {
    const execution = {
      id: generateId(),
      workflow: workflow.name,
      status: 'running',
      steps: [],
      startTime: Date.now()
    };
    
    // 按顺序或并行执行步骤
    for (const step of workflow.steps) {
      const stepResult = await this.executeStep(step, params);
      execution.steps.push(stepResult);
      
      // 检查是否需要继续
      if (!this.shouldContinue(stepResult, step.condition)) {
        break;
      }
    }
    
    execution.status = 'completed';
    execution.endTime = Date.now();
    
    return execution;
  }
  
  async executeStep(step, params) {
    // 选择代理
    const agent = await this.selectAgent(step.agent);
    
    // 执行任务
    const result = await agent.execute(step.task, params);
    
    // 更新进度
    this.updateProgress(step.id, result);
    
    return result;
  }
}
```

---

## 📊 工作流定义

### 工作流结构

```yaml
workflow:
  name: "交易分析工作流"
  description: "自动分析市场并生成交易信号"
  version: "1.0"
  
  steps:
    - id: 1
      name: "数据收集"
      agent: "data-collector"
      task: "collect_market_data"
      timeout: 30s
      retry: 3
      
    - id: 2
      name: "技术分析"
      agent: "analyst"
      task: "technical_analysis"
      depends_on: [1]
      timeout: 60s
      
    - id: 3
      name: "风险评估"
      agent: "risk-manager"
      task: "assess_risk"
      depends_on: [2]
      timeout: 30s
      
    - id: 4
      name: "生成信号"
      agent: "trader"
      task: "generate_signal"
      depends_on: [2, 3]
      timeout: 30s
```

### 步骤类型

| 类型 | 描述 | 示例 |
|------|------|------|
| sequential | 顺序执行 | 步骤 2 在步骤 1 完成后执行 |
| parallel | 并行执行 | 步骤 2 和 3 同时执行 |
| conditional | 条件执行 | 如果条件满足则执行 |
| loop | 循环执行 | 重复执行直到满足条件 |

### 状态管理

| 状态 | 描述 | 转移 |
|------|------|------|
| pending | 等待执行 | → running |
| running | 执行中 | → completed/failed |
| completed | 已完成 | - |
| failed | 失败 | → retry/cancelled |
| cancelled | 已取消 | - |

---

## 🚨 错误处理

### 重试策略

```yaml
retry:
  max_attempts: 3
  backoff: exponential
  initial_delay: 1s
  max_delay: 30s
  retry_on:
    - timeout
    - network_error
    - temporary_failure
```

### 失败处理

1. **单步失败**
   - 重试指定次数
   - 如果仍然失败，标记为 failed
   - 根据条件决定是否继续

2. **工作流失败**
   - 停止后续步骤
   - 执行回滚操作
   - 发送失败通知

3. **补偿机制**
   - 定义补偿步骤
   - 撤销已完成的操作
   - 恢复到一致状态

---

## 📁 文件结构

```
lobster-workflow/
├── SKILL.md              # 本文件
├── workflows/            # 工作流定义
│   ├── trading-analysis.yaml
│   ├── daily-report.yaml
│   └── system-check.yaml
├── engine/               # 工作流引擎
│   ├── executor.js
│   ├── scheduler.js
│   └── monitor.js
├── templates/            # 工作流模板
│   └── default-template.yaml
└── logs/                 # 执行日志
    └── workflow-logs.json
```

---

## 📈 性能指标

- **工作流完成率**: 目标 >95%
- **平均执行时间**: 根据工作流复杂度
- **步骤成功率**: 目标 >98%
- **代理利用率**: 目标 >80%

---

## 🔄 监控与报告

### 实时监控

```
工作流 ID: wf-12345
状态：running
进度：3/5 步骤完成
当前步骤：风险评估 (67%)
已用时间：2m 34s
预计剩余：1m 15s
```

### 执行报告

```yaml
execution_report:
  workflow_id: wf-12345
  workflow_name: "交易分析工作流"
  status: completed
  start_time: "2026-03-03T12:00:00Z"
  end_time: "2026-03-03T12:05:23Z"
  duration: 5m 23s
  
  steps:
    - id: 1
      name: "数据收集"
      status: completed
      duration: 45s
      agent: "data-collector"
      
    - id: 2
      name: "技术分析"
      status: completed
      duration: 1m 32s
      agent: "analyst"
      
    # ... 更多步骤
```

---

## 🔄 更新与维护

### 定期任务

- **实时**: 监控工作流执行状态
- **每小时**: 清理已完成的工作流
- **每日**: 生成执行报告
- **每周**: 优化工作流定义

### 版本历史

- v1.0.0 (2026-03-03): 初始版本，多代理协调和任务分发

---

*Lobster Workflow - 让复杂任务自动化，多代理协同工作*
