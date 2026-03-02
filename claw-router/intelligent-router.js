#!/usr/bin/env node

/**
 * 智能路由系统
 * 根据任务类型自动路由给最合适的代理
 */

class IntelligentRouter {
  constructor() {
    this.agents = {
      'ceo': {
        name: 'CEO (战略决策)',
        model: 'xai/grok-4-0709',
        capabilities: ['strategy', 'decision', 'analysis', 'planning'],
        workload: 0,
        maxWorkload: 10
      },
      'cto': {
        name: 'CTO (技术实现)',
        model: 'qwen-portal/coder-model',
        capabilities: ['coding', 'debugging', 'architecture', 'technical'],
        workload: 0,
        maxWorkload: 15
      },
      'pm': {
        name: 'PM (项目管理)',
        model: 'deepseek/deepseek-chat',
        capabilities: ['planning', 'coordination', 'reporting', 'management'],
        workload: 0,
        maxWorkload: 12
      },
      'ops': {
        name: 'OPS (运维监控)',
        model: 'groq/llama-3.3-70b-versatile',
        capabilities: ['monitoring', 'maintenance', 'repair', 'infrastructure'],
        workload: 0,
        maxWorkload: 8
      },
      'trader': {
        name: 'TRADER (交易分析)',
        model: 'deepseek/deepseek-chat',
        capabilities: ['trading', 'analysis', 'risk', 'finance'],
        workload: 0,
        maxWorkload: 10
      }
    };
    
    this.routingHistory = [];
    this.routingRules = {
      // 关键词到代理的映射
      keywords: {
        'ceo': ['战略', '决策', '规划', '方向', 'vision', 'strategy', 'decision'],
        'cto': ['代码', '技术', '调试', '架构', '开发', 'code', 'technical', 'debug'],
        'pm': ['项目', '管理', '进度', '协调', '报告', 'project', 'management', 'coordinate'],
        'ops': ['运维', '监控', '修复', '服务器', '系统', '故障', 'ops', 'monitor', 'repair'],
        'trader': ['交易', '分析', '风险', '资金', '市场', 'trade', 'analysis', 'risk']
      },
      
      // 优先级路由规则
      priorityRouting: {
        'P0': ['ops', 'ceo'],      // P0任务优先给运维或CEO
        'P1': ['cto', 'pm'],       // P1任务优先给技术或项目经理
        'P2': ['trader', 'pm']     // P2任务优先给交易员或项目经理
      },
      
      // 任务类型路由
      taskTypeRouting: {
        'emergency': ['ops', 'ceo'],
        'technical': ['cto', 'ops'],
        'planning': ['pm', 'ceo'],
        'analysis': ['trader', 'ceo'],
        'routine': ['pm', 'trader']
      }
    };
  }

  /**
   * 智能路由决策
   */
  routeTask(task) {
    console.log(`\n🧭 智能路由分析: ${task.name}`);
    console.log(`   优先级: ${task.priority}`);
    console.log(`   描述: ${task.description}`);
    
    // 1. 分析任务内容
    const taskAnalysis = this.analyzeTask(task);
    console.log(`   分析结果: ${taskAnalysis.type} - ${taskAnalysis.keywords.join(', ')}`);
    
    // 2. 选择候选代理
    const candidateAgents = this.selectCandidates(task, taskAnalysis);
    console.log(`   候选代理: ${candidateAgents.map(a => this.agents[a].name).join(', ')}`);
    
    // 3. 考虑工作负载
    const availableAgents = this.filterByWorkload(candidateAgents);
    
    if (availableAgents.length === 0) {
      console.log(`   ⚠️ 所有候选代理都忙，选择负载最低的`);
      availableAgents.push(this.getLeastLoadedAgent(candidateAgents));
    }
    
    // 4. 最终选择
    const selectedAgent = availableAgents[0];
    const agentInfo = this.agents[selectedAgent];
    
    console.log(`   🎯 最终选择: ${agentInfo.name} (${selectedAgent})`);
    console.log(`       模型: ${agentInfo.model}`);
    console.log(`       能力: ${agentInfo.capabilities.join(', ')}`);
    console.log(`       当前负载: ${agentInfo.workload}/${agentInfo.maxWorkload}`);
    
    // 5. 更新工作负载
    this.updateWorkload(selectedAgent, 'add');
    
    // 6. 记录路由历史
    this.recordRouting({
      taskId: task.id,
      taskName: task.name,
      priority: task.priority,
      selectedAgent: selectedAgent,
      agentName: agentInfo.name,
      analysis: taskAnalysis,
      timestamp: new Date().toISOString()
    });
    
    return {
      agentId: selectedAgent,
      agentName: agentInfo.name,
      model: agentInfo.model,
      capabilities: agentInfo.capabilities,
      analysis: taskAnalysis
    };
  }

  /**
   * 分析任务内容
   */
  analyzeTask(task) {
    const text = (task.name + ' ' + task.description).toLowerCase();
    const keywords = [];
    const matchedAgents = new Set();
    
    // 检查关键词匹配
    for (const [agentId, agentKeywords] of Object.entries(this.routingRules.keywords)) {
      for (const keyword of agentKeywords) {
        if (text.includes(keyword.toLowerCase())) {
          keywords.push(keyword);
          matchedAgents.add(agentId);
        }
      }
    }
    
    // 确定任务类型
    let taskType = 'routine';
    if (task.priority === 'P0') {
      taskType = 'emergency';
    } else if (keywords.some(k => ['代码', '技术', '调试'].includes(k))) {
      taskType = 'technical';
    } else if (keywords.some(k => ['分析', '交易', '风险'].includes(k))) {
      taskType = 'analysis';
    } else if (keywords.some(k => ['项目', '管理', '进度'].includes(k))) {
      taskType = 'planning';
    }
    
    return {
      type: taskType,
      keywords: keywords,
      matchedAgents: Array.from(matchedAgents),
      textAnalysis: text.substring(0, 100) + '...'
    };
  }

  /**
   * 选择候选代理
   */
  selectCandidates(task, analysis) {
    let candidates = new Set();
    
    // 1. 基于关键词匹配
    if (analysis.matchedAgents.length > 0) {
      analysis.matchedAgents.forEach(agent => candidates.add(agent));
    }
    
    // 2. 基于优先级路由规则
    if (this.routingRules.priorityRouting[task.priority]) {
      this.routingRules.priorityRouting[task.priority].forEach(agent => candidates.add(agent));
    }
    
    // 3. 基于任务类型路由
    if (this.routingRules.taskTypeRouting[analysis.type]) {
      this.routingRules.taskTypeRouting[analysis.type].forEach(agent => candidates.add(agent));
    }
    
    // 如果没有匹配，使用默认路由
    if (candidates.size === 0) {
      candidates.add('pm'); // 默认给项目经理
    }
    
    return Array.from(candidates);
  }

  /**
   * 根据工作负载过滤代理
   */
  filterByWorkload(agentIds) {
    return agentIds.filter(agentId => {
      const agent = this.agents[agentId];
      return agent.workload < agent.maxWorkload;
    });
  }

  /**
   * 获取负载最低的代理
   */
  getLeastLoadedAgent(agentIds) {
    return agentIds.reduce((leastLoaded, agentId) => {
      const currentAgent = this.agents[agentId];
      const leastAgent = this.agents[leastLoaded];
      return currentAgent.workload < leastAgent.workload ? agentId : leastLoaded;
    }, agentIds[0]);
  }

  /**
   * 更新代理工作负载
   */
  updateWorkload(agentId, operation = 'add') {
    const agent = this.agents[agentId];
    
    if (operation === 'add') {
      agent.workload = Math.min(agent.workload + 1, agent.maxWorkload);
    } else if (operation === 'complete') {
      agent.workload = Math.max(agent.workload - 1, 0);
    } else if (operation === 'reset') {
      agent.workload = 0;
    }
  }

  /**
   * 记录路由历史
   */
  recordRouting(routingRecord) {
    this.routingHistory.push(routingRecord);
    
    // 保存历史记录
    const fs = require('fs');
    const path = require('path');
    
    const historyDir = '/root/.openclaw/workspace/routing-history';
    fs.mkdirSync(historyDir, { recursive: true });
    
    const historyFile = path.join(historyDir, 'routing-history.json');
    fs.writeFileSync(historyFile, JSON.stringify(this.routingHistory, null, 2));
  }

  /**
   * 获取路由统计
   */
  getRoutingStats() {
    const total = this.routingHistory.length;
    
    const byAgent = {};
    const byPriority = { P0: 0, P1: 0, P2: 0 };
    const byTaskType = {};
    
    this.routingHistory.forEach(record => {
      // 按代理统计
      byAgent[record.selectedAgent] = (byAgent[record.selectedAgent] || 0) + 1;
      
      // 按优先级统计
      if (byPriority[record.priority] !== undefined) {
        byPriority[record.priority]++;
      }
      
      // 按任务类型统计
      const taskType = record.analysis?.type || 'unknown';
      byTaskType[taskType] = (byTaskType[taskType] || 0) + 1;
    });
    
    // 计算负载情况
    const workload = {};
    Object.entries(this.agents).forEach(([agentId, agent]) => {
      workload[agentId] = {
        name: agent.name,
        current: agent.workload,
        max: agent.maxWorkload,
        utilization: (agent.workload / agent.maxWorkload * 100).toFixed(2) + '%'
      };
    });
    
    return {
      totalRoutings: total,
      byAgent: byAgent,
      byPriority: byPriority,
      byTaskType: byTaskType,
      workload: workload,
      efficiency: this.calculateEfficiency()
    };
  }

  /**
   * 计算路由效率
   */
  calculateEfficiency() {
    if (this.routingHistory.length === 0) return 0;
    
    // 简单的效率计算：关键词匹配的任务比例
    const matchedTasks = this.routingHistory.filter(record => 
      record.analysis?.matchedAgents?.length > 0
    ).length;
    
    return (matchedTasks / this.routingHistory.length * 100).toFixed(2) + '%';
  }

  /**
   * 生成路由报告
   */
  generateRoutingReport() {
    const stats = this.getRoutingStats();
    
    console.log('\n📊 智能路由系统报告');
    console.log('====================');
    console.log(`总计路由: ${stats.totalRoutings}`);
    console.log(`路由效率: ${stats.efficiency}`);
    
    console.log('\n👥 按代理分配:');
    Object.entries(stats.byAgent).forEach(([agentId, count]) => {
      const agentName = this.agents[agentId]?.name || agentId;
      console.log(`  ${agentName}: ${count} 个任务`);
    });
    
    console.log('\n🎯 按优先级分配:');
    Object.entries(stats.byPriority).forEach(([priority, count]) => {
      console.log(`  ${priority}: ${count} 个任务`);
    });
    
    console.log('\n📈 代理负载情况:');
    Object.entries(stats.workload).forEach(([agentId, load]) => {
      console.log(`  ${load.name}: ${load.current}/${load.max} (${load.utilization})`);
    });
    
    // 保存详细报告
    const fs = require('fs');
    const path = require('path');
    
    const report = {
      timestamp: new Date().toISOString(),
      stats: stats,
      recentRoutings: this.routingHistory.slice(-10) // 最近10条记录
    };
    
    const reportDir = '/root/.openclaw/workspace/routing-reports';
    fs.mkdirSync(reportDir, { recursive: true });
    
    const reportFile = path.join(reportDir, `routing-report-${Date.now()}.json`);
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
    
    console.log(`\n📁 详细报告保存至: ${reportFile}`);
    
    return report;
  }

  /**
   * 模拟任务完成
   */
  completeTask(agentId) {
    this.updateWorkload(agentId, 'complete');
    console.log(`✅ 任务完成，${this.agents[agentId].name} 负载减少`);
  }

  /**
   * 重置所有代理负载
   */
  resetAllWorkloads() {
    Object.keys(this.agents).forEach(agentId => {
      this.updateWorkload(agentId, 'reset');
    });
    console.log('🔄 所有代理负载已重置');
  }
}

// 导出单例
const router = new IntelligentRouter();
module.exports = router;

// 命令行接口
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args[0] === 'test') {
    console.log('🧪 测试智能路由系统...\n');
    
    // 测试任务1: 数据库故障 (P0)
    const task1 = {
      id: 'test-1',
      name: '数据库连接故障紧急修复',
      priority: 'P0',
      description: '生产数据库连接失败，需要立即修复'
    };
    
    const route1 = router.routeTask(task1);
    console.log(`\n路由结果: ${route1.agentName}`);
    
    // 测试任务2: 代码bug修复 (P1)
    const task2 = {
      id: 'test-2',
      name: '修复前端数据流bug',
      priority: 'P1',
      description: '前端页面数据显示异常，需要技术调试'
    };
    
    const route2 = router.routeTask(task2);
    console.log(`\n路由结果: ${route2.agentName}`);
    
    // 测试任务3: 项目进度报告 (P2)
    const task3 = {
      id: 'test-3',
      name: '生成每周项目进度报告',
      priority: 'P2',
      description: '汇总各项目进展，生成管理报告'
    };
    
    const route3 = router.routeTask(task3);
    console.log(`\n路由结果: ${route3.agentName}`);
    
    // 生成报告
    setTimeout(() => {
      router.generateRoutingReport();
    }, 1000);
    
  } else if (args[0] === 'stats') {
    const stats = router.getRoutingStats();
    console.log('📊 路由统计:');
    console.log(JSON.stringify(stats, null, 2));
    
  } else if (args[0] === 'report') {
    router.generateRoutingReport();
    
  } else if (args[0] === 'reset') {
    router.resetAllWorkloads();
    
  } else {
    console.log('使用方法:');
    console.log('  test    - 测试路由功能');
    console.log('  stats   - 查看路由统计');
    console.log('  report  - 生成路由报告');
    console.log('  reset   - 重置代理负载');
  }
}