/**
 * Auto Rate Limit Fixer
 * 智能限流修复 + 多源fallback
 */

const axios = require('axios');

class RateLimitFixer {
    constructor() {
        this.dataSources = [
            { name: 'DexScreener', url: 'https://api.dexscreener.com/latest/dex/tokens/', status: 'active' },
            { name: 'Birdeye', url: 'https://public-api.birdeye.io/public/', status: 'cooldown' },
            { name: 'GeckoTerminal', url: 'https://api.geckoterminal.com/api/v2/', status: 'cooldown' }
        ];
        this.currentSource = 0;
        this.retryCount = 0;
        this.maxRetries = 3;
    }

    async checkStatus() {
        console.log('📊 检查API状态...');
        for (const source of this.dataSources) {
            try {
                const response = await axios.get(source.url + 'solana', { timeout: 5000 });
                source.status = 'active';
                console.log(`✅ ${source.name}: 正常`);
            } catch (e) {
                source.status = 'error';
                console.log(`❌ ${source.name}: ${e.response?.status || 'error'}`);
            }
        }
        return this.dataSources;
    }

    async exponentialBackoff(retryCount) {
        const delay = Math.min(1000 * Math.pow(2, retryCount), 30000);
        console.log(`⏳ 退避等待: ${delay/1000}秒`);
        await new Promise(r => setTimeout(r, delay));
    }

    async getTokenPrice(tokenAddress) {
        for (let i = 0; i < this.dataSources.length; i++) {
            const source = this.dataSources[this.currentSource];
            try {
                const response = await axios.get(source.url + tokenAddress, { timeout: 5000 });
                this.retryCount = 0;
                return { data: response.data, source: source.name };
            } catch (e) {
                console.log(`⚠️ ${source.name} 失败: ${e.response?.status}`);
                this.retryCount++;
                
                if (this.retryCount >= this.maxRetries) {
                    this.currentSource = (this.currentSource + 1) % this.dataSources.length;
                    this.retryCount = 0;
                    console.log(`🔄 切换到: ${this.dataSources[this.currentSource].name}`);
                }
                
                await this.exponentialBackoff(this.retryCount);
            }
        }
        return null;
    }
}

module.exports = RateLimitFixer;
