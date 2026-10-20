# dsh-hyperframes 0.7.0 · Windows 真实宿主复跑说明

本包复跑**已验**部分：隔离安装、技能解析、真实宿主启动、设置面板挂载、工作台表单与六类服务端拒绝判据、三类来源信任栅栏。
**不包含**预览/导出正向链路——那需要 114 MB 浏览器 + 33 MB 官方依赖，见 §4。

## 1. 准备

需要：Windows x64、Node 24.x、官方 `@deepseek-ai/dsh@0.2.0-rc.2`、Chrome、Python 3，以及目标 npm tgz：

```powershell
npm pack dsh-hyperframes@0.7.0 --pack-destination .
```

固定读数（必须对上，否则不属本报告覆盖范围）：
- shasum `6a0f779066fd640dff514007533a2a3942e06fe9`
- integrity `sha512-xNs7A+gQW7G6peGOyozljKJg0daGvOffO4NQ4KoZevSX2LCN3p+GFS8h51hb4ifDXlsItK6LE+d3c4CNM/9zwA==`
- 936 文件 / 16,541,295 字节

## 2. 建隔离宿主

```powershell
Copy-Item .\config.example.json .\config.local.json
notepad .\config.local.json   # 填 dsh_home / dsh_bin / chrome_exe
```

`dsh_bin` 指向官方包的 `lib/bin.js`（不是 sh 包装器）。
`dsh_home` 必须是**空目录**，脚本不会读写日常 profile。

```
node host.mjs
```

只打印 `READY http://127.0.0.1:<port>`；带令牌地址只写 `evidence/host-host-local.json`，不打印、不公开。

## 3. 跑判据

```
node probes.mjs
```

期望（本报告实测）：

| 名称 | 期望 |
|---|---|
| list_ok | 200 |
| no_header | 400 "操作来源无效。" |
| cross_site | 403 |
| bad_origin | 403 |
| bad_action | 400 "操作无效。" |
| traversal_id | 400 "项目或任务编号无效。" |

对账发布件：

```
python -X utf8 verify-package.py --tarball dsh-hyperframes-0.7.0.tgz --profile-root <dsh_home>/profiles/web
```

## 4. 未验部分与达标条件

预览/导出需要：

1. `npm install --registry=https://registry.npmjs.org` 完成 `hyperframes@0.8.114` + `gsap@3.14.2`（约 33 MB 解包）
2. `hyperframes browser ensure` 下载 **chrome-headless-shell v152.0.7977.30（114 MB）**

本机实测：官方源元数据往返 41.8 s，`browser ensure` 200 秒到 3%。若你的网络能在合理时间内完成上述两项，可在工作台点「准备渲染环境」后继续「启动官方预览 → 导出 MP4」，把读数补进报告「未验」栏。

**注意**：Windows 就绪判定要求渲染浏览器名为 `chrome-headless-shell.exe`（`lib/media-workbench.js:75`），普通桌面 Chrome 不会被接受。

## 5. 公开边界

不上传：`config.local.json`、`evidence/host-host-local.json`、`isolated-home/`、原始 DOM、未遮罩截图、完整用户路径。
可公开：本目录脚本、`evidence/probes.json`、遮罩截图、`verify-package.py` 输出。
