/**
 * Agent Browser 工具
 * 用于OpenClaw浏览器自动化
 */

const { spawn } = require('child_process');

class BrowserTool {
    constructor() {
        this.browser = null;
    }

    async open(url) {
        return this.run('open', url);
    }

    async click(selector) {
        return this.run('click', selector);
    }

    async type(selector, text) {
        return this.run('type', selector, text);
    }

    async screenshot(path = '/tmp/screenshot.png') {
        return this.run('screenshot', path);
    }

    async snapshot() {
        return this.run('snapshot');
    }

    async scroll(direction, px = '300') {
        return this.run('scroll', direction, px);
    }

    async run(...args) {
        return new Promise((resolve, reject) => {
            const proc = spawn('npx', ['agent-browser', ...args], {
                stdio: 'inherit'
            });
            
            proc.on('close', (code) => {
                if (code === 0) resolve({ success: true });
                else reject(new Error(`Exit code: ${code}`));
            });
        });
    }
}

module.exports = BrowserTool;
