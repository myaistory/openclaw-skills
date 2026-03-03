/**
 * Telegram 交易通知器
 */

class TelegramNotifier {
    constructor(config) {
        this.token = config.token;
        this.chatId = config.chatId;
        this.apiUrl = `https://api.telegram.org/bot${this.token}`;
    }

    async sendSignal(signal) {
        const message = this.formatSignal(signal);
        return this.sendMessage(message);
    }

    formatSignal(signal) {
        return `📊 *交易信号*
        
🪙 代币: ${signal.token}
💰 价格: $${signal.price}
📉 跌幅: -${signal.drop}%
📈 回升: +${signal.recovery}%
🎯 置信度: ${signal.confidence}%

${signal.status === 'active' ? '⚡ 等待执行' : '✅ 已执行'}`;
    }

    async sendMessage(text) {
        const url = `${this.apiUrl}/sendMessage`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: this.chatId,
                text: text,
                parse_mode: 'Markdown'
            })
        });
        return response.json();
    }

    async sendDailyReport(report) {
        const message = `📈 *每日交易报告*

✅ 交易次数: ${report.trades}
💚 胜率: ${report.winRate}%
💰 总盈亏: ${report.pnl} SOL
📊 最大回撤: ${report.maxDrawdown}%`;
        return this.sendMessage(message);
    }
}

module.exports = TelegramNotifier;
