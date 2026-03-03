/**
 * auto-fix-rate-limit - WebSocket 429 限流自动修复技能
 * 
 * 功能:
 * - 自动检测 WebSocket 429 限流
 * - 智能指数退避重连
 * - 记录限流历史
 * - 状态：running/paused
 */

const fs = require('fs');
const path = require('path');

const SKILL_DIR = path.dirname(__filename);
const CONFIG_PATH = path.join(SKILL_DIR, 'config.json');
const HISTORY_PATH = path.join(SKILL_DIR, 'history.json');

// 默认配置
const DEFAULT_CONFIG = {
  enabled: true,
  maxRetries: 5,
  baseDelayMs: 1000,
  maxDelayMs: 60000,
  exponentialBase: 2,
  logHistory: true
};

// 技能状态
let state = {
  status: 'running', // running | paused
  activeRetries: new Map(), // connectionId -> retry count
  config: DEFAULT_CONFIG
};

// 加载配置
function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
      state.config = { ...DEFAULT_CONFIG, ...config };
    }
  } catch (err) {
    console.error('[auto-fix-rate-limit] 配置加载失败:', err.message);
  }
}

// 保存配置
function saveConfig() {
  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(state.config, null, 2));
  } catch (err) {
    console.error('[auto-fix-rate-limit] 配置保存失败:', err.message);
  }
}

// 记录限流历史
function logHistory(event) {
  if (!state.config.logHistory) return;
  
  try {
    let history = [];
    if (fs.existsSync(HISTORY_PATH)) {
      history = JSON.parse(fs.readFileSync(HISTORY_PATH, 'utf8'));
    }
    
    history.push({
      timestamp: new Date().toISOString(),
      ...event
    });
    
    // 保留最近 1000 条记录
    if (history.length > 1000) {
      history = history.slice(-1000);
    }
    
    fs.writeFileSync(HISTORY_PATH, JSON.stringify(history, null, 2));
  } catch (err) {
    console.error('[auto-fix-rate-limit] 历史记录失败:', err.message);
  }
}

// 计算退避延迟 (指数退避)
function calculateBackoffDelay(retryCount) {
  const { baseDelayMs, maxDelayMs, exponentialBase } = state.config;
  const delay = baseDelayMs * Math.pow(exponentialBase, retryCount);
  return Math.min(delay, maxDelayMs);
}

// 处理限流事件
function handleRateLimit(connectionId, response) {
  if (state.status === 'paused' || !state.config.enabled) {
    return false;
  }
  
  const retryCount = state.activeRetries.get(connectionId) || 0;
  
  if (retryCount >= state.config.maxRetries) {
    console.error(`[auto-fix-rate-limit] 连接 ${connectionId} 达到最大重试次数，停止重试`);
    state.activeRetries.delete(connectionId);
    logHistory({
      connectionId,
      event: 'max_retries_reached',
      retryCount
    });
    return false;
  }
  
  const delay = calculateBackoffDelay(retryCount);
  state.activeRetries.set(connectionId, retryCount + 1);
  
  console.log(`[auto-fix-rate-limit] 检测到限流 (429), 连接 ${connectionId}, 第 ${retryCount + 1} 次重试，延迟 ${delay}ms`);
  
  logHistory({
    connectionId,
    event: 'rate_limit_detected',
    retryCount: retryCount + 1,
    delayMs: delay,
    status: response?.status
  });
  
  // 安排重连
  setTimeout(() => {
    reconnect(connectionId);
  }, delay);
  
  return true;
}

// 重连逻辑
function reconnect(connectionId) {
  console.log(`[auto-fix-rate-limit] 执行重连：${connectionId}`);
  // 这里应该调用实际的 WebSocket 重连逻辑
  // 由于是技能框架，实际重连由主系统处理
  state.activeRetries.delete(connectionId);
}

// 重置连接的重试计数
function resetRetryCount(connectionId) {
  state.activeRetries.delete(connectionId);
}

// 技能控制
function setStatus(newStatus) {
  if (['running', 'paused'].includes(newStatus)) {
    state.status = newStatus;
    console.log(`[auto-fix-rate-limit] 状态已更改为：${newStatus}`);
    return true;
  }
  return false;
}

function getStatus() {
  return {
    status: state.status,
    enabled: state.config.enabled,
    activeRetries: state.activeRetries.size,
    config: state.config
  };
}

// WebSocket 拦截器 (需要在主系统中注册)
function interceptWebSocket(response, connectionId) {
  if (response?.status === 429) {
    return handleRateLimit(connectionId, response);
  }
  
  // 成功连接时重置计数
  if (response?.status === 200 || response?.status === 101) {
    resetRetryCount(connectionId);
  }
  
  return false;
}

// 初始化
loadConfig();
console.log('[auto-fix-rate-limit] 技能已加载，状态:', state.status);

// 导出接口
module.exports = {
  // 主要接口
  interceptWebSocket,
  handleRateLimit,
  
  // 状态控制
  setStatus,
  getStatus,
  
  // 配置管理
  loadConfig,
  saveConfig,
  
  // 工具函数
  calculateBackoffDelay,
  resetRetryCount,
  
  // 技能元数据
  name: 'auto-fix-rate-limit',
  version: '1.0.0',
  description: 'WebSocket 429 限流自动修复'
};
