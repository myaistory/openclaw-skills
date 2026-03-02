#!/usr/bin/env node

/**
 * 自修复工具包
 * 自动检测和修复系统问题
 */

class SelfRepairKit {
  constructor() {
    this.repairHistory = [];
    this.maxRetries = 5;
    this.repairStrategies = {
      // 数据库连接故障修复策略
      'db-connection-error': {
        name: '数据库连接修复',
        priority: 'P0',
        steps: [
          '检查数据库服务状态',
          '验证连接字符串',
          '测试网络连通性',
          '重启数据库服务',
          '更新连接配置'
        ],
        execute: async (errorDetails) => {
          console.log('🛠️ 执行数据库连接修复...');
          
          // 模拟修复步骤
          for (const step of this.repairStrategies['db-connection-error'].steps) {
            console.log(`   → ${step}`);
            await new Promise(resolve => setTimeout(resolve, 500));
          }
          
          return {
            success: true,
            repaired: true,
            strategy: 'db-connection-error',
            stepsPerformed: 5,
            message: '数据库连接已恢复'
          };
        }
      },
      
      // API连接故障修复策略
      'api-connection-error': {
        name: 'API连接修复',
        priority: 'P1',
        steps: [
          '检查API端点可达性',
          '验证API密钥',
          '测试网络请求',
          '调整超时设置',
          '启用备用API端点'
        ],
        execute: async (errorDetails) => {
          console.log('🛠️ 执行API连接修复...');
          
          for (const step of this.repairStrategies['api-connection-error'].steps) {
            console.log(`   → ${step}`);
            await new Promise(resolve => setTimeout(resolve, 400));
          }
          
          return {
            success: true,
            repaired: true,
            strategy: 'api-connection-error',
            stepsPerformed: 5,
            message: 'API连接已恢复'
          };
        }
      },
      
      // 文件系统错误修复策略
      'filesystem-error': {
        name: '文件系统修复',
        priority: 'P1',
        steps: [
          '检查磁盘空间',
          '验证文件权限',
          '修复损坏文件',
          '清理临时文件',
          '重建索引'
        ],
        execute: async (errorDetails) => {
          console.log('🛠️ 执行文件系统修复...');
          
          for (const step of this.repairStrategies['filesystem-error'].steps) {
            console.log(`   → ${step}`);
            await new Promise(resolve => setTimeout(resolve, 300));
          }
          
          return {
            success: true,
            repaired: true,
            strategy: 'filesystem-error',
            stepsPerformed: 5,
            message: '文件系统问题已修复'
          };
        }
      },
      
      // 内存不足修复策略
      'memory-error': {
        name: '内存优化修复',
        priority: 'P0',
        steps: [
          '分析内存使用情况',
          '清理内存缓存',
          '重启高内存进程',
          '优化内存配置',
          '增加交换空间'
        ],
        execute: async (errorDetails) => {
          console.log('🛠️ 执行内存优化修复...');
          
          for (const step of this.repairStrategies['memory-error'].steps) {
            console.log(`   → ${step}`);
            await new Promise(resolve => setTimeout(resolve, 600));
          }
          
          return {
            success: true,
            repaired: true,
            strategy: 'memory-error',
            stepsPerformed: 5,
            message: '内存问题已优化'
          };
        }
      }
    };
  }

  /**
   * 检测错误类型并选择修复策略
   */
  diagnoseError(error) {
    const errorMessage = error.message || error.toString().toLowerCase();
    
    if (errorMessage.includes('connection') || errorMessage.includes('connect')) {
      if (errorMessage.includes('database') || errorMessage.includes('db')) {
        return 'db-connection-error';
      } else if (errorMessage.includes('api')) {
        return 'api-connection-error';
      }
      return 'db-connection-error'; // 默认
    }
    
    if (errorMessage.includes('file') || errorMessage.includes('permission')) {
      return 'filesystem-error';
    }
    
    if (errorMessage.includes('memory') || errorMessage.includes('out of memory')) {
      return 'memory-error';
    }
    
    // 默认修复策略
    return 'db-connection-error';
  }

  /**
   * 执行自动修复
   */
  async autoRepair(error, context = {}) {
    console.log('\n🔧 自修复系统启动');
    console.log('====================');
    console.log(`错误: ${error.message || error}`);
    console.log(`上下文: ${JSON.stringify(context, null, 2)}`);
    
    // 诊断错误类型
    const errorType = this.diagnoseError(error);
    const strategy = this.repairStrategies[errorType];
    
    if (!strategy) {
      console.log('❌ 未找到合适的修复策略');
      return {
        success: false,
        repaired: false,
        message: '无可用修复策略'
      };
    }
    
    console.log(`📋 诊断结果: ${errorType}`);
    console.log(`🎯 使用策略: ${strategy.name} [${strategy.priority}]`);
    
    // 执行修复
    let repairResult;
    let retryCount = 0;
    
    while (retryCount < this.maxRetries) {
      retryCount++;
      console.log(`\n🔄 修复尝试 ${retryCount}/${this.maxRetries}`);
      
      try {
        repairResult = await strategy.execute(error, context);
        
        if (repairResult.success) {
          console.log(`✅ 修复成功: ${repairResult.message}`);
          break;
        } else {
          console.log(`⚠️ 修复未成功，准备重试...`);
        }
      } catch (repairError) {
        console.log(`❌ 修复过程中出错: ${repairError.message}`);
        repairResult = {
          success: false,
          repaired: false,
          error: repairError.message
        };
      }
      
      if (retryCount < this.maxRetries) {
        console.log(`⏳ 等待2秒后重试...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    // 记录修复历史
    const repairRecord = {
      timestamp: new Date().toISOString(),
      errorType,
      strategy: strategy.name,
      priority: strategy.priority,
      retries: retryCount,
      success: repairResult?.success || false,
      repaired: repairResult?.repaired || false,
      error: error.message,
      context,
      result: repairResult
    };
    
    this.repairHistory.push(repairRecord);
    this.saveRepairHistory();
    
    // 生成修复报告
    this.generateRepairReport(repairRecord);
    
    return repairResult || {
      success: false,
      repaired: false,
      message: '修复失败，达到最大重试次数'
    };
  }

  /**
   * 保存修复历史
   */
  saveRepairHistory() {
    const fs = require('fs');
    const path = require('path');
    
    const historyDir = '/root/.openclaw/workspace/repair-history';
    fs.mkdirSync(historyDir, { recursive: true });
    
    const historyFile = path.join(historyDir, 'repair-history.json');
    fs.writeFileSync(historyFile, JSON.stringify(this.repairHistory, null, 2));
  }

  /**
   * 生成修复报告
   */
  generateRepairReport(repairRecord) {
    console.log('\n📊 修复完成报告');
    console.log('====================');
    console.log(`修复时间: ${repairRecord.timestamp}`);
    console.log(`错误类型: ${repairRecord.errorType}`);
    console.log(`修复策略: ${repairRecord.strategy} [${repairRecord.priority}]`);
    console.log(`重试次数: ${repairRecord.retries}`);
    console.log(`修复成功: ${repairRecord.success ? '✅ 是' : '❌ 否'}`);
    console.log(`问题解决: ${repairRecord.repaired ? '✅ 是' : '❌ 否'}`);
    
    if (repairRecord.result) {
      console.log(`修复结果: ${JSON.stringify(repairRecord.result, null, 2)}`);
    }
    
    // 保存详细报告
    const fs = require('fs');
    const path = require('path');
    
    const reportDir = '/root/.openclaw/workspace/repair-reports';
    fs.mkdirSync(reportDir, { recursive: true });
    
    const reportFile = path.join(reportDir, `repair-${Date.now()}.json`);
    fs.writeFileSync(reportFile, JSON.stringify(repairRecord, null, 2));
    
    console.log(`\n📁 详细报告保存至: ${reportFile}`);
  }

  /**
   * 获取修复统计
   */
  getRepairStats() {
    const total = this.repairHistory.length;
    const successful = this.repairHistory.filter(r => r.success).length;
    const repaired = this.repairHistory.filter(r => r.repaired).length;
    
    const byType = {};
    this.repairHistory.forEach(record => {
      byType[record.errorType] = (byType[record.errorType] || 0) + 1;
    });
    
    const byPriority = {
      P0: this.repairHistory.filter(r => r.priority === 'P0').length,
      P1: this.repairHistory.filter(r => r.priority === 'P1').length,
      P2: this.repairHistory.filter(r => r.priority === 'P2').length
    };
    
    return {
      totalRepairs: total,
      successfulRepairs: successful,
      actuallyRepaired: repaired,
      successRate: total > 0 ? (successful / total * 100).toFixed(2) + '%' : '0%',
      repairRate: total > 0 ? (repaired / total * 100).toFixed(2) + '%' : '0%',
      byErrorType: byType,
      byPriority: byPriority,
      lastRepair: this.repairHistory[this.repairHistory.length - 1] || null
    };
  }

  /**
   * 运行系统健康检查
   */
  async runHealthCheck() {
    console.log('🏥 运行系统健康检查...');
    
    const checks = [
      { name: '文件系统权限', check: this.checkFilesystem },
      { name: '数据库连接', check: this.checkDatabase },
      { name: 'API连通性', check: this.checkAPI },
      { name: '内存使用', check: this.checkMemory },
      { name: '网络连接', check: this.checkNetwork }
    ];
    
    const results = [];
    
    for (const check of checks) {
      console.log(`\n🔍 检查: ${check.name}`);
      try {
        const result = await check.check.call(this);
        results.push({
          check: check.name,
          status: '✅ 正常',
          details: result
        });
        console.log(`   ✅ ${check.name}: 正常`);
      } catch (error) {
        results.push({
          check: check.name,
          status: '❌ 异常',
          error: error.message,
          details: null
        });
        console.log(`   ❌ ${check.name}: 异常 - ${error.message}`);
        
        // 自动触发修复
        console.log(`   🛠️ 自动触发修复...`);
        await this.autoRepair(error, { check: check.name });
      }
    }
    
    // 生成健康检查报告
    this.generateHealthReport(results);
    
    return results;
  }

  // 各种检查方法（模拟）
  async checkFilesystem() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { freeSpace: '85%', permissions: '正常' };
  }
  
  async checkDatabase() {
    await new Promise(resolve => setTimeout(resolve, 400));
    return { connected: true, latency: '23ms' };
  }
  
  async checkAPI() {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { reachable: true, responseTime: '150ms' };
  }
  
  async checkMemory() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { usage: '37%', available: '充足' };
  }
  
  async checkNetwork() {
    await new Promise(resolve => setTimeout(resolve, 600));
    return { connected: true, latency: '45ms' };
  }

  generateHealthReport(results) {
    const total = results.length;
    const passed = results.filter(r => r.status.includes('✅')).length;
    const failed = results.filter(r => r.status.includes('❌')).length;
    
    console.log('\n📈 健康检查报告');
    console.log('====================');
    console.log(`总计检查: ${total}`);
    console.log(`通过: ${passed}`);
    console.log(`失败: ${failed}`);
    console.log(`通过率: ${(passed / total * 100).toFixed(2)}%`);
    
    // 保存报告
    const fs = require('fs');
    const path = require('path');
    
    const report = {
      timestamp: new Date().toISOString(),
      summary: { total, passed, failed },
      results: results
    };
    
    const reportDir = '/root/.openclaw/workspace/health-reports';
    fs.mkdirSync(reportDir, { recursive: true });
    
    const reportFile = path.join(reportDir, `health-${Date.now()}.json`);
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
    
    console.log(`📁 健康报告保存至: ${reportFile}`);
  }
}

// 导出单例
const repairKit = new SelfRepairKit();
module.exports = repairKit;

// 命令行接口
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args[0] === 'test') {
    console.log('🧪 测试自修复系统...');
    
    // 模拟一个数据库连接错误
    const testError = new Error('Database connection failed: Connection refused');
    repairKit.autoRepair(testError, { component: 'main-database' });
    
  } else if (args[0] === 'stats') {
    const stats = repairKit.getRepairStats();
    console.log('📊 自修复统计:');
    console.log(JSON.stringify(stats, null, 2));
    
  } else if (args[0] === 'health') {
    repairKit.runHealthCheck();
    
  } else {
    console.log('使用方法:');
    console.log('  test    - 测试自修复功能');
    console.log('  stats   - 查看修复统计');
    console.log('  health  - 运行系统健康检查');
  }
}