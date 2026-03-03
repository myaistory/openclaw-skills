#!/bin/bash
# 24/7 Watchdog Script

CHECK_INTERVAL=300  # 5分钟
TELEGRAM_WEBHOOK="/root/.openclaw/workspace/agents/ops/telegram-webhook.js"

check_agents() {
    echo "检查子代理状态..."
    # 检查5个代理
    for agent in ceo cto pm ops trader; do
        echo "- $agent: 待检查"
    done
}

check_system() {
    echo "检查系统资源..."
    # CPU
    cpu=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)
    echo "CPU: $cpu%"
    
    # 内存
    mem=$(free | grep Mem | awk '{printf("%.0f", $3/$2 * 100)}')
    echo "内存: $mem%"
}

auto_fix() {
    echo "自动修复..."
    # PM2状态检查
    pm2 list | grep "online" || pm2 restart all
}

daily_report() {
    echo "生成每日报告..."
    # 清理日志
    find /root/.openclaw/logs -name "*.log" -mtime +7 -delete
}

# 主循环
while true; do
    check_agents
    check_system
    auto_fix
    sleep $CHECK_INTERVAL
done
