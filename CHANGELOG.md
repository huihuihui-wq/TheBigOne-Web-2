# Changelog

## [v1.1.0] — 2026-05-27

> **升级目标**：对齐新成本结构，统一金币体系，接入真实生图接口，修复 Usage 数据不同步问题
> **后端依赖**：`thebigone_pricing_update.sql`（已执行）、`deduct_coins` RPC（已部署）

---

### 🆕 新增功能

#### 1. Pricing 页面 — 四档套餐 + 新金币体系
- **新增 Lite 档位**：$9/月（年付 $85/年，Save 21%），2,000 金币/月
- **Pro 调整**：$19/月（年付 $180/年，Save 21%），5,000 金币/月
- **Studio 调整**：$39/月（年付 $390/年，Save 17%），10,000 金币/月
- **布局**：Pricing Cards 从 3 列改为 `1/2/4` 列响应式布局
- **Feature Comparison**：增加 Lite 列，全部更新为最新价格和金币数
- **交互**：新增金币说明悬浮提示（ⓘ hover tooltip）、本地存储说明小字

#### 2. 图片生成 Demo — 接入真实生图接口
- 从 `setTimeout` 模拟改为真实调用 `/api/generate/proxy`
- 使用 Supabase JWT 鉴权
- 请求体新增 `model_key` + `generation_id`，后端按模型扣费
- 响应读取 `X-Deducted-Coins` / `X-Balance-After` 响应头，显示扣费过程
- 实现异步轮询：`create` → `poll result`，支持进度展示
- 错误处理：未登录、402 余额不足、网络错误、轮询超时

#### 3. 模型配置映射表（`src/lib/model-configs.ts`）
- 从插件端同步 19 个模型的工作流配置
- 前端自动读取 `text_to_image` 模型列表
- 每个模型动态构建正确的 `input_values`（prompt / seed / aspectRatio / width / height 等节点）

---

### 🐛 修复的 Bug

| Bug 描述 | 修复文件 | 修复方式 |
|---------|---------|---------|
| Pricing 仍显示旧金币数（Pro 15000 / Studio 40000） | `PricingPage.tsx` | 更新为 Pro 5000 / Studio 10000 / Lite 2000 |
| Pricing 仍显示已下架模型（Seedance / LTX） | `PricingPage.tsx` | 删除 Seedance / LTX 相关文案，因数据库已标记 `is_active = false` |
| 模型单价表仍显示旧价格（GPT Image 2 为 25 coins） | — | 删除 MODEL PRICING 区块（产品决策） |
| ImageGeneratorDemo 使用假的 BizyAir 端点 | `ImageGeneratorDemo.tsx` | 修正为 `https://api.bizyair.cn/w/v1/webapp/task/openapi/create` |
| API Keys → Usage Details 显示旧扣费金额（$0.02） | `ApiKeyPage.tsx` | 改为读取 `balance_transactions` 表（`type = 'deduct'`），显示金币扣减 |
| Feature Comparison 混合中英文 | `PricingPage.tsx` | 全部改为英文 |
| CTA 按钮文案不一致 | `PricingPage.tsx` | Free / Pro / Studio / Lite 统一为 `GET STARTED →` |

---

### ⚠️ 注意事项 / 已知问题

1. **BizyAir 节点参数格式待联调确认**
   - `aspectRatio` 节点值当前传的是 `"1:1"`、`"3:2"` 等字符串
   - 如果 BizyAir 工作流要求其他格式（如 `"1024x1024"` 或中文选项），联调时会报错，根据错误调整即可
   - 涉及的节点：`40:孤海_kontext生图比例.选择尺寸`、`82:孤海_kontext生图比例.选择尺寸`、`17:BizyAir_GPT_IMAGE_2_T2I_API.aspect_ratio`、`17:BizyAir_NanoBanana2.aspect_ratio`

2. **模型配置已和插件端同步**
   - `src/lib/model-configs.ts` 包含 19 个模型的 `webAppId` 和节点 ID
   - 前端和插件端共用同一套配置，后端不需要改

3. **Usage Details 只显示扣费记录**
   - `balance_transactions` 表包含 `deduct`（扣费）和 `top_up`（充值）两种类型
   - 当前 Usage Details 只筛选 `type = 'deduct'` 的记录展示
   - 如需展示充值记录，请告诉我

4. **Lite 年付**
   - Lite 年付价格为 $85/年（Save 21%），月均约 $7

5. **部署后请清除浏览器缓存**
   - 静态文件名已更新（hash 变化），但 CDN / 浏览器可能缓存旧版本
   - 建议用户强制刷新（Ctrl + F5）

---

### 📁 变更文件清单

- `src/pages/PricingPage.tsx` — Pricing 页面重构（四档、新价格、新文案）
- `src/pages/ApiKeyPage.tsx` — Usage Details 改为读取 `balance_transactions`
- `src/pages/GuidePage.tsx` — 移除 Plugin Installer 下载区块
- `src/sections/ImageGeneratorDemo.tsx` — 接入真实生图接口 + 异步轮询
- `src/lib/model-configs.ts` — 新增：模型工作流配置映射表（19 个模型）
- `CHANGELOG.md` — 本文档

---

*Commit: `258e97e`*
*Branch: `main`*
*Repo: `github.com:huihuihui-wq/TheBigOne-Web-2.git`*
