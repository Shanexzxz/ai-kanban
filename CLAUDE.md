# AI Kanban - AI Agent 平台监控看板

## 项目概述

为风险投资机构内部 AI Agent 平台搭建三层监控看板，洞察员工使用情况并为平台迭代提供数据支撑。

- **机构规模**: 约 100 名员工
- **受众**: 平台管理团队 + 机构高管
- **核心目标**: 使用情况可视化 + 迭代优化线索

## 平台功能

- **通用对话**: 支持 Claude / ChatGPT / DeepSeek / Hunyuan 3.0 / Kimi 2.6，用户可自由切换
- **私有化模型**: DeepSeek / Hunyuan 3.0 / Kimi 2.6，处理敏感文件（系统强制拦截，涉及内部数据时 100% 禁止调用外部模型）
- **IC Memo Agent**: 用户上传投资分析文件，生成标准格式 IC Memo，支持手动编辑和对话调整
- **技能管理**: 首期仅 IC Memo（后续扩展）
- **连接器**: 对接外部数据源如 Notion（首期开发中）

## 部门分组

智能应用组、医疗健康组、内容金融组、投资组合管理组、数字化平台组、技术企业组、消费组、全球娱乐组

## 看板架构: 三层分层

- **L1 Overview**: 覆盖率、留存、使用深度、回答质量、调用与消耗
- **L2 行为分析**: 通用对话、DeepSeek、IC Memo、用户分群与迁移
- **L3 安全合规 + 系统观测**: 拦截统计、系统性能、告警管理

## 项目结构

```
AI Kanban/
├── CLAUDE.md                    # 本文件
├── .claude/settings.json        # 项目级 Claude Code 设置
├── demo/                        # 前端 Demo（静态 HTML + ECharts）
│   ├── index.html
│   ├── css/style.css
│   └── js/
│       ├── mock-data.js
│       ├── l1-overview.js
│       ├── l2-analysis.js
│       └── l3-operations.js
└── docs/
    └── superpowers/
        ├── specs/               # 设计规格文档
        └── plans/               # 实施规划文档
```

## 关键设计决策

1. Token 消耗 = 使用深度指标（非成本视角）
2. 安全合规 = 统计拦截事件（系统已 100% 强制拦截）
3. 功能和模型是正交维度，分开展示
4. 热力图支持按调用次数/Token 消耗切换口径
5. IC Memo 不推断采纳率，关注行为模式
6. 留存按分组查看

## 工作规范

- 修改实现时**必须同步更新 spec 文档**
- 设计文档: `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md`
- 实施计划: `docs/superpowers/plans/YYYY-MM-DD-<topic>.md`
- Demo 使用纯静态 HTML + ECharts，无构建工具
- 使用 Superpowers 工作流: brainstorm → plan → implement → verify
