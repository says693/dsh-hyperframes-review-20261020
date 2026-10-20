# dsh-hyperframes 0.7.0 · Windows 真实宿主 UI 增量复核

## 性质声明
本件为 intake 输入（外部贡献申报），不是悬赏：不 /claim、不自行加 bounty 标签。档位与是否受理由维护者裁定。

**与本插件既有 #1065 的关系（查重结论前置）**：#1065 已结算（medium/C/3），明确声明"**仅 Linux**（aarch64）"、"**Windows 未验**"、"宿主：deepseek-harness 需要 API key，**未跑**"，并把"DSH 桌面或 Web 设置页里的实际点击"列为**未验**。本件不做其已验面（预览绑定、路径穿越 15 探针、生命周期进程回收、F1/F2/F3 缺陷），只补它明确留白的部分：**Windows 上的真实 DSH 宿主 + 真实浏览器 UI 路径**。

**已主动撤下的内容**：本稿曾把"依赖安装硬编码 `--registry=https://registry.npmjs.org`"列为独立观察。经查 #1065 已将其写入"观察 3"并随该件结算，本稿**撤回该条独立发现**，不再重复申报。

## 锚点
- 仓库：`STARDUSTLC666/dsh-hyperframes`，分支 `master`
- 锚定提交：`f7a652090e91db6596565804c6280189dbbf64ee`（2026-10-18T05:53:59Z）
- npm：`dsh-hyperframes@0.7.0`，shasum `6a0f779066fd640dff514007533a2a3942e06fe9`，integrity `sha512-xNs7A+gQW7G6peGOyozljKJg0daGvOffO4NQ4KoZevSX2LCN3p+GFS8h51hb4ifDXlsItK6LE+d3c4CNM/9zwA==`，936 文件 / 16,541,295 字节
- 规则：`插件测评_AI编程工作流规范_v1.0.md`，Git blob `15658d890c80e559c4f41918171945ffe27dd874`

## 环境
Windows x64 · Node v24.19.0 · 官方 `@deepseek-ai/dsh@0.2.0-rc.2` · Chrome 155.0.8059.82
隔离：全新 `DSH_HOME` + 独立 profile，未触碰日常 profile 与工作区。
安装：`dsh plugin --profile web add dsh-hyperframes@0.7.0` → exit 0。

## 查重
- 悬赏仓**全文**检索 `"dsh-hyperframes"`（`search/issues`，非仅标题）：命中 5 条，直接相关仅 **#1065**；其余为 dsh-suite 聚合件、dsh-remotion、dsh-slack/dsh-voice 横评、dsh-cover-pipeline。
- 追加检索 `chrome-headless-shell`、`x-dsh-media`、`Windows + 工作台`：无第二件针对本插件 Windows 宿主 UI 的报告。
- 新增时段（2026-10-19T13:00Z 之后共 104 条 intake）逐条标题筛查：无本插件相关新件。
- 站点 review.lingshulab.com：该插件社区测评数 1。

## 实跑读数

| 用例 | 验收条件 | 实际读数 | HTTP/exit | 状态 |
|---|---|---|---|---|
| 隔离安装 | profile 登记并注入 bundle | dump 出现 `hyperframes-skills` | 0 | 已验 |
| 21 个随包技能 | 全部可解析 | 21/21 `ok:true, code:valid` | — | 已验 |
| 真实宿主启动 | Web 可达 | `127.0.0.1:11721` | 200 | 已验 |
| 首次引导 | 继续 → 稍后配置 | 两步点击成功，主界面可用 | — | 已验 |
| 设置面板挂载 | HyperFrames 项存在于侧栏 | 出现 `HyperFrames` 导航项 | — | 已验 |
| 工作台首屏 | 三段式文案与空态 | "还没有视频工程"等文案正确 | — | 已验 |
| 新建视频 → 保存 | 表单提交成功 | `action=create` | 200 | 已验 |
| 修订号自增 | 保存后 revision 递增 | 1 → 2 | 200 | 已验 |
| 修订冲突 | 旧 revision 被拒 | `409` 工程已在另一窗口更新 | 409 | 已验 |
| 标题上限 | >72 字符被拒 | `400` 标题需为 1–72 个字符 | 400 | 已验 |
| 时长范围 | 99 秒被拒 | `400` 时长需为 3–30 整秒 | 400 | 已验 |
| id 路径穿越 | `../../` 被拒 | `400` 项目或任务编号无效 | 400 | 已验 |
| 未知/缺失 action | 被拒 | `400` 操作无效 | 400 | 已验 |
| 插件层来源头 | 缺 `x-dsh-media` 被拒 | `400` 操作来源无效 | 400 | 已验 |
| 宿主层跨站 | 带 cookie + `sec-fetch-site: cross-site` | `403 forbidden` | 403 | 已验 |
| 宿主层坏 Origin | 带 cookie + `Origin: http://evil.test` | `403 forbidden` | 403 | 已验 |
| 宿主层无凭据 | 无 cookie | `401 unauthorized` | 401 | 已验 |

**分层归因说明**：`403/401` 来自 **DSH 宿主**的浏览器信任栅栏与鉴权，不是插件自身代码；插件自身只做 `x-dsh-media` 等检查（400）。两层独立，不可混计。

### 首次渲染环境准备（未完成，如实记录）

| 尝试 | 读数 |
|---|---|
| UI「准备渲染环境」#1 | 15 分钟后仍 `running`，stage=下载官方依赖 |
| UI「准备渲染环境」#2（缓存预热后） | 8 分钟后仍 `running`，同上 |
| 官方 `hyperframes browser ensure` | 200 秒到 **3%**（3.4 MB / 114.0 MB，目标 Chrome Headless Shell v152.0.7977.30） |
| 官方 `init`（手动补插件同款环境变量） | **exit 0**，脚手架生成完整 |

## 观察

### O1（Windows 特有）就绪判定强制要求专用 `chrome-headless-shell.exe`
`lib/media-workbench.js:75`：
```js
ready = pkg.version === version && stamp.version === version && !(this.engine === 'hyperframes' && process.platform === 'win32' && !/^chrome-headless-shell\.exe$/i.test(basename(file)));
```
在 Windows 上，即使用户本机已有可用 Chrome，只要渲染浏览器不是名为 `chrome-headless-shell.exe` 的专用件，`environment().ready` 恒为 `false`，工作台持续显示"渲染环境 · 首次需下载"，用户必须先完成 114 MB 下载。

- **性质**：已验的代码与行为事实（读数见上）。
- **是否缺陷**：**未定**。固定专用 headless-shell 可能是有意为之（渲染一致性/CI 可复现）。本件只陈述事实与用户可见后果，不做定性。
- **#1065 关系**：#1065 明确"Windows 未验"，本条属其留白。

## 诚实边界

**已验**
- 隔离安装、21/21 技能解析、真实宿主启动、引导与设置面板挂载
- 工作台 UI 渲染、表单提交、工程创建/保存/修订自增
- 六类服务端拒绝判据（均在真实宿主中产生）
- 插件层 / 宿主层两类来源栅栏的分离读数
- O1 的代码位置与行为后果

**未验及原因**
- **预览 / 导出 / 真实 MP4**：需 114 MB headless-shell + 33 MB 官方依赖；本机 200 秒仅 3%，未完成。**环境未备，不是插件失败**。
- 「准备渲染环境」按钮完整链路：同上。
- 模型侧自动调用技能：宿主无 API key。
- Linux / macOS：本机仅 Windows。
- 跨机器空缓存安装。

**不确定**
- O1 属设计选择还是遗漏。
- 快网络下 prepare 的完成时间与成功率。

**排除**
- 不把"下载慢/卡住"记为插件缺陷：同机官方源元数据往返 41.8 s，属本机网络。
- 不重复 #1065 的 F1/F2/F3、预览绑定、路径穿越 15 探针、生命周期进程回收。
- 不重复 #1065 观察 3（写死 registry）——本稿已主动撤回该条。
- 不申报驱动侧错误为产品问题（下节保留）。

## 驱动与环境失败（保留）
1. 无 web app 的 profile 下 `dsh --profile X --help` 挂起 → 该 profile 仅含 `dsh-base`，非插件问题。
2. 首次 Chrome 启动用 `which dsh` 的 sh 包装器交 node 执行 → `SyntaxError`；改用 `lib/bin.js` 后正常。
3. 宿主前台启动被工具 120 s 超时终止 → 改后台常驻。
4. 手动 `hyperframes init` 漏 `HYPERFRAMES_SKIP_SKILLS=1` 时挂在技能检查 → 补回后 exit 0。插件 `childEnv()` 第 37 行本就设置该变量，说明**驱动错误而非产品缺陷**。
5. 首次保存选中搜索框导致 `title:""` 被拒 → 改用 `#hyperframes-title` 后 200。**驱动错误**。

## 交付
- 报告、复跑 kit、证据包 SHA256 见附件清单。
- 不上传：宿主 token、`isolated-home`、`config.local`、原始 DOM、未遮罩截图、完整用户路径。

## 人工事项
本件已验范围无需人工补测。若要补未验面（预览/导出），需在能完成 114 MB 下载的网络下按 REPRODUCE.md §4 重跑。
