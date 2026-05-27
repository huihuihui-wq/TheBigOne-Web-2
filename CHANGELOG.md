# Changelog

## 2026-05-27

### ✅ 今日更新

#### 1. Pricing 页面重构（`src/pages/PricingPage.tsx`）
- **金币体系对齐新成本结构**
  - Free: 500 coins / month（不变）
  - Pro: 3,000 coins / month（原 15,000）
  - Studio: 8,000 coins / month（原 40,000）
- **删除旧文案**
  - 移除 "(~10-20 images, depending on model)" 等固定张数估算
  - 移除 Feature Comparison 中的 "Approx. Images" 行
- **模型文案更新**
  - 统一为 `All AI models (GPT Image 2, NanoBanana, Seedance 5.0（image）, LTX & more)`
- **插件状态更新**
  - Pro: `Photoshop plugin + Figma / Blender / Premiere (内测中)`
  - Studio: `Full plugin suite: PS / Figma / Blender / Premiere (内测中)`
- **CTA & 价格标签**
  - Free/Pro CTA 统一为 `GET STARTED →`
  - 年付标签增加 `· Save 20%`
- **Feature Comparison 表格**
  - 全部改为英文
  - 新增 Video Generation 行
  - Batch Processing: Free `—` / Pro `Limited (5)` / Studio `Unlimited`
- **新增交互**
  - 金币说明悬浮提示（ⓘ hover tooltip）
  - 本地存储说明小字（Local history 下方）

#### 2. 图片生成 Demo 接入真实接口（`src/sections/ImageGeneratorDemo.tsx`）
- **接入 `/api/generate/proxy`**
  - 从 `setTimeout` 模拟改为真实 `fetch` 调用
  - 使用 Supabase JWT 鉴权
- **请求体新增字段**
  - `model_key`: 根据选中模型传入（`gpt_image_2` / `nanobanana` / `flux_ultra`）
  - `generation_id`: 自动生成唯一 ID（`gen_${timestamp}_${random}`）
- **响应处理**
  - 读取响应头 `X-Deducted-Coins` 和 `X-Balance-After`
  - 兼容 JSON 返回（`image_url` / `url` / `data[0].url`）和图片二进制返回
- **UI 状态**
  - 生成中显示 loading spinner
  - 生成成功后展示图片 + 扣费信息（Deducted / Balance）
  - 错误处理：未登录、402 余额不足、网络错误等

#### 3. Guide 页面调整（`src/pages/GuidePage.tsx`）
- 移除 Plugin Installer 下载区块

### ⚠️ 存在的问题 / 待确认

1. **BizyAir 端点 URL 待确认**
   - `ImageGeneratorDemo.tsx` 中 `BIZYAIR_GENERATE_URL` 当前填的是 `'https://api.bizyair.cn/v1/images/generations'`
   - 如果实际端点不同，需要替换为真实 URL

2. **模型 key 映射待对齐**
   - 前端 Demo 目前只配置了 3 个模型：`gpt_image_2`、`nanobanana`、`flux_ultra`
   - 后端支持的全部 key：`gpt_image_2_high`、`flux_pro`、`recraft_v3`、`stable_image_core`、`stable_image_ultra`、`phi_4_multimodal`
   - 需要确认插件端和网页端是否使用同一套映射

3. **`/api/generate/proxy` 与 `/api/v1/tasks` 的分工**
   - 当前网页 Demo 用的是 `/api/generate/proxy`（同步代理）
   - 插件端实际可能用 `/api/v1/tasks`（异步任务）
   - 需要确认两端接口是否都需要扣费适配，还是只需改一处

4. **GuidePage 删除下载区块**
   - 插件下载入口已移除，需要确认用户是否从其他页面（如 Navbar 或 Hero）下载

---

## 2026-05-27 (晚)

### ✅ 今日更新（第二轮）

根据后端 SQL (`thebigone_pricing_update.sql`) 和定价文档 (`pricing_public_v1.1.md`) 同步前端：

#### 1. Pricing 页面 — 四档套餐对齐
- **新增 Lite 档位**：$9/月，2,000 金币（月付 only）
- **Pro 调整**：$19/月，5,000 金币，年付 $180/年（Save 21%）
- **Studio 调整**：$39/月，10,000 金币，年付 $390/年（Save 17%）
- **布局调整**：Pricing Cards 从 3 列改为 `1/2/4` 列响应式布局
- **Feature Comparison 表格**：增加 Lite 列，更新所有价格和金币数
- **删除已下架模型文案**：移除所有 `Seedance`、`LTX` 相关提及（数据库已标记 `is_active = false`）
- **删除 Video Generation feature**：因 LTX 已下架
- **年付标签**：改为 `SAVE UP TO 21%`

#### 2. ImageGeneratorDemo — 模型列表对齐数据库
- MODELS 更新为数据库实际存在的 image 模型：
  - `anima_turbo` (10 coins)
  - `anima_base` (15 coins)
  - `z_image_base` (20 coins)
  - `gpt_image_2` (35 coins)
  - `nanobanana` (50 coins)
- 底部 stats：`4 AI Models` → `8 AI Models`

### ⚠️ 新增待确认问题

1. **BizyAir 端点 URL**：`BIZYAIR_GENERATE_URL` 仍为占位符 `'https://api.bizyair.cn/v1/images/generations'`，需替换为真实端点
2. **Lite 功能边界**：文档未详细说明 Lite 的功能范围，当前假设与 Free 基本一致（仅金币多）
3. **年付按钮行为**：Lite 当前设置为月付 only（`priceYearly: 0`），如需支持年付请告知

---

## 2026-05-27 (晚 II)

### ✅ 今日更新（第三轮）

根据后端端点测试和定价反馈同步：

#### 1. Lite 年付价格更新
- **Lite 年付**：$85/年（Save 21%），月均约 $7

#### 2. ImageGeneratorDemo — 修正 BizyAir 端点 + 异步轮询
- **端点修正**：`BIZYAIR_GENERATE_URL` 从假端点 `'https://api.bizyair.cn/v1/images/generations'` 改为真实端点 `'https://api.bizyair.cn/w/v1/webapp/task/openapi/create'`
- **请求体格式**：`data` 从 `{ prompt, model, width, height }` 改为 BizyAir 原生格式 `{ web_app_id, input_values }`
- **异步轮询**：新增 `pollResult` 辅助函数，实现 create → poll 的完整异步链路
  - 每 2 秒轮询一次 `/api/generate/proxy/result?request_id=xxx`
  - 最多轮询 30 次（60 秒超时）
  - 支持状态：`Queued` / `Running` / `Success` / `Failed`
- **UI 状态**：生成按钮显示轮询进度（`Polling result… (3/30)`）

### ⚠️ 仍存在的问题

1. **`web_app_id` 映射待确认**
   - 当前所有模型都映射到同一个 `web_app_id: 54752`（后端提供的示例值）
   - 需要后端确认每个 `model_key` 对应的真实 `web_app_id`

2. **`input_values` 节点 ID 待确认**
   - 当前使用 `'36:CR Text.text'` 和 `'30:Seed_.seed'` 作为占位符
   - 不同工作流的节点 ID 不同，需要后端提供每个模型的正确参数映射

---

*Branch: `main`*
*Repo: `github.com:huihuihui-wq/TheBigOne-Web-2.git`*
*Branch: `main`*
*Repo: `github.com:huihuihui-wq/TheBigOne-Web-2.git`*
