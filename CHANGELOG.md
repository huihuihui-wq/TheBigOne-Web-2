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

*Commit: `717de54`*
*Branch: `main`*
*Repo: `github.com:huihuihui-wq/TheBigOne-Web-2.git`*
