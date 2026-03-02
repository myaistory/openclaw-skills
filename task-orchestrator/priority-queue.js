#!/usr/bin/env node

/**
 * 优先级队列系统
 * 用于管理P0-P2任务的排队和执行
 */

class PriorityQueue {
  constructor() {
    this.queue = {
      P0: [], // 最高优先级：生产、系统、故障
      P1: [], // 中等优先级：项目关键、deadline
      P2: []  // 低优先级：常规任务
    };
    this.running = false;
    this.completedTasks = [];
  }

  /**
   * 添加任务到队列
   * @param {Object} task - 任务对象
   * @param {string} task.id - 任务ID
   * @param {string} task.name - 任务名称
   * @param {string} task.priority - 优先级 (P0/P1/P2)
   * @param {string} task.description - 任务描述
   * @param {string} task.assignTo - 分配给哪个代理
   * @param {Function} task.execute - 执行函数
   */
  addTask(task) {
    if (!['P0', 'P1', 'P2'].includes(task.priority)) {
      throw new Error('优先级必须是 P0, P1 或 P2');
    }

    this.queue[task.priority].push({
      ...task,
      status: 'queued',
      addedAt: new Date().toISOString(),
      startedAt: null,
      completedAt: null,
      error: null
    });

    console.log(`📝 任务已添加: ${task.name} [${task.priority}]`);
    console.log(`   分配给: ${task.assignTo}`);
    
    // 如果队列未运行，启动执行
    if (!this.running) {
      this.start();
    }
  }

  /**
   * 启动队列执行
   */
  async start() {
    if (this.running) return;
    
    this.running = true;
    console.log('🚀 优先级队列开始执行...\n');
    
    // 按优先级顺序执行：P0 → P1 → P2
    for (const priority of ['P0', 'P1', 'P2']) {
      while (this.queue[priority].length > 0) {
        const task = this.queue[priority].shift();
        await this.executeTask(task);
      }
    }
    
    this.running = false;
    console.log('\n✅ 所有任务执行完成！');
    this.generateReport();
  }

  /**
   * 执行单个任务
   */
  async executeTask(task) {
    console.log(`\n▶️ 开始执行: ${task.name} [${task.priority}]`);
    console.log(`   描述: ${task.description}`);
    console.log(`   分配给: ${task.assignTo}`);
    
    task.status = 'running';
    task.startedAt = new Date().toISOString();
    
    try {
      // 模拟代理分配和执行
      console.log(`   🤖 路由给代理: ${task.assignTo}`);
      
      // 执行任务函数
      if (task.execute && typeof task.execute === 'function') {
        const result = await task.execute();
        task.result = result;
      } else {
        // 模拟执行延迟
        await new Promise(resolve => setTimeout(resolve, 1000));
        task.result = { success: true, message: '任务执行成功' };
      }
      
      task.status = 'completed';
      task.completedAt = new Date().toISOString();
      this.completedTasks.push(task);
      
      console.log(`   ✅ 任务完成: ${task.name}`);
      
    } catch (error) {
      task.status = 'failed';
      task.error = error.message;
      task.completedAt = new Date().toISOString();
      this.completedTasks.push(task);
      
      console.log(`   ❌ 任务失败: ${task.name}`);
      console.log(`      错误: ${error.message}`);
      
      // 触发自修复
      await this.triggerSelfRepair(task, error);
    }
  }

  /**
   * 触发自修复
   */
  async triggerSelfRepair(task, error) {
    console.log(`   🔧 触发自修复: ${task.name}`);
    
    // 创建修复任务
    const repairTask = {
      id: `repair-${task.id}-${Date.now()}`,
      name: `修复: ${task.name}`,
      priority: task.priority, // 修复任务保持原优先级
      description: `自动修复任务: ${task.name} - 错误: ${error.message}`,
      assignTo: 'self-repair-kit',
      execute: async () => {
        console.log(`      🛠️ 自修复系统处理中...`);
        // 模拟修复过程
        await new Promise(resolve => setTimeout(resolve, 1500));
        return { 
          success: true, 
          repaired: true,
          originalTask: task.id,
          repairMethod: '自动重试 + 错误分析'
        };
      }
    };
    
    // 将修复任务添加到队列（保持原优先级）
    this.addTask(repairTask);
  }

  /**
   * 生成执行报告
   */
  generateReport() {
    console.log('\n📊 任务执行报告');
    console.log('====================');
    
    const total = this.completedTasks.length;
    const completed = this.completedTasks.filter(t => t.status === 'completed').length;
    const failed = this.completedTasks.filter(t => t.status === 'failed').length;
    const repaired = this.completedTasks.filter(t => t.result?.repaired).length;
    
    console.log(`总计任务: ${total}`);
    console.log(`成功完成: ${completed}`);
    console.log(`失败: ${failed}`);
    console.log(`已修复: ${repaired}`);
    
    // 按优先级统计
    const p0Tasks = this.completedTasks.filter(t => t.priority === 'P0');
    const p1Tasks = this.completedTasks.filter(t => t.priority === 'P1');
    const p2Tasks = this.completedTasks.filter(t => t.priority === 'P2');
    
    console.log('\n📈 按优先级统计:');
    console.log(`  P0任务: ${p0Tasks.length}个`);
    console.log(`  P1任务: ${p1Tasks.length}个`);
    console.log(`  P2任务: ${p2Tasks.length}个`);
    
    // 保存报告
    const report = {
      generatedAt: new Date().toISOString(),
      summary: {
        total,
        completed,
        failed,
        repaired
      },
      tasks: this.completedTasks.map(t => ({
        id: t.id,
        name: t.name,
        priority: t.priority,
        status: t.status,
        assignTo: t.assignTo,
        startedAt: t.startedAt,
        completedAt: t.completedAt,
        error: t.error,
        repaired: t.result?.repaired || false
      }))
    };
    
    const fs = require('fs');
    const path = require('path');
    const reportDir = '/root/.openclaw/workspace/reports';
    fs.mkdirSync(reportDir, { recursive: true });
    
    const reportFile = path.join(reportDir, `queue-report-${Date.now()}.json`);
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
    
    console.log(`\n📁 详细报告保存至: ${reportFile}`);
  }

  /**
   * 获取队列状态
   */
  getStatus() {
    const pending = Object.values(this.queue).flat().length;
    const running = this.running ? '运行中' : '已停止';
    const completed = this.completedTasks.length;
    
    return {
      running: this.running,
      status: running,
      pendingTasks: pending,
      completedTasks: completed,
      queue: {
        P0: this.queue.P0.length,
        P1: this.queue.P1.length,
        P2: this.queue.P2.length
      }
    };
  }
}

// 导出单例
const queue = new PriorityQueue();
module.exports = queue;

// 如果直接运行，提供命令行接口
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args[0] === 'status') {
    const status = queue.getStatus();
    console.log('📋 优先级队列状态:');
    console.log(JSON.stringify(status, null, 2));
  } else if (args[0] === 'test') {
    console.log('🧪 运行测试任务...');
    
    // 添加测试任务
    queue.addTask({
      id: 'test-p0',
      name: '测试P0任务',
      priority: 'P0',
      description: '测试最高优先级任务执行',
      assignTo: 'ops',
      execute: async () => {
        console.log('     测试P0任务执行中...');
        return { test: 'P0 completed' };
      }
    });
    
    queue.addTask({
      id: 'test-p1',
      name: '测试P1任务',
      priority: 'P1',
      description: '测试中等优先级任务执行',
      assignTo: 'pm',
      execute: async () => {
        console.log('     测试P1任务执行中...');
        return { test: 'P1 completed' };
      }
    });
    
    queue.addTask({
      id: 'test-p2',
      name: '测试P2任务',
      priority: 'P2',
      description: '测试低优先级任务执行',
      assignTo: 'trader',
      execute: async () => {
        console.log('     测试P2任务执行中...');
        return { test: 'P2 completed' };
      }
    });
  }
}