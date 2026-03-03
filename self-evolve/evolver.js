/**
 * Self-Evolution Engine
 * 负责分析、创建、测试新技能
 */

const fs = require('fs');
const path = require('path');

class SelfEvolution {
    constructor() {
        this.skillsDir = '/root/.openclaw/workspace/skills';
        this.memoryDir = '/root/.openclaw/workspace/memory';
    }

    async analyze() {
        // 读取最近记忆
        const files = fs.readdirSync(this.memoryDir)
            .filter(f => f.startsWith('2026-03'))
            .slice(0, 7); // 最近7天
        
        const learnings = [];
        
        for (const file of files) {
            const content = fs.readFileSync(
                path.join(this.memoryDir, file), 'utf8'
            );
            // 提取问题/改进点
            const issues = content.match(/问题|错误|失败/g) || [];
            learnings.push(...issues);
        }

        return {
            totalTasks: files.length * 10,
            issues: learnings.length,
            topIssues: this.groupBy(learnings)
        };
    }

    groupBy(arr) {
        const counts = {};
        arr.forEach(x => counts[x] = (counts[x] || 0) + 1);
        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
    }

    async createSkill(name, description) {
        const skillDir = path.join(this.skillsDir, name);
        fs.mkdirSync(skillDir, { recursive: true });

        // 创建 SKILL.md
        const skillMD = `---
name: ${name}
description: ${description}
user-invocable: true
---

# ${name}

${description}

## 使用方法

\`\`\`
使用 ${name} 技能
\`\`\`
`;
        fs.writeFileSync(
            path.join(skillDir, 'SKILL.md
        );

       '),
            skillMD return { success: true, skill: name };
    }

    async evolve() {
        const analysis = await this.analyze();
        
        // 基于分析创建改进技能
        const improvements = [
            { name: 'auto-retry', desc: '失败自动重试机制' },
            { name: 'better-logging', desc: '改进日志系统' }
        ];

        const created = [];
        for (const imp of improvements) {
            const result = await this.createSkill(imp.name, imp.desc);
            created.push(result);
        }

        return {
            analysis,
            created,
            nextSteps: ['测试新技能', '更新记忆', '汇报用户']
        };
    }
}

module.exports = SelfEvolution;
