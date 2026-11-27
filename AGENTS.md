# AGENTS.md — 給 AI agent 的安裝與驗收指示

> 這份文件是給**同事電腦上的 AI agent**（Claude／GPT／DSH 等 coding agent）看的。
> 人類同事只需要說：「照這個 repo 的 AGENTS.md 幫我裝好並驗收」。

## 你的任務

把這個資料夾變成一部**可以製作 e-book 的機器**，然後回報結果。你不要改寫任何 e-book 內容，也不要刪除任何檔案。

## 0. 先看清楚事實，再動手

```powershell
Get-Location
Get-ChildItem            # 應該看到 engine/ books/ tools/ docs/ vendor/ index.html reader.html
python --version         # 或 py -3 --version
node --version
```

- 如果 `python` 不存在 → 見下面 §2 的第 1 項。
- 如果 `node` 不存在 → 見 §2 的第 2 項。

## 1. 一鍵檢查（先跑，不要猜）

```powershell
python tools\check_env.py
```

它會逐項報 `OK` 或 `MISSING`，並在最後列出要執行的補救指令。**以它的輸出為準**，不要自己另外判斷。

## 2. 安裝（只裝它說缺的）

1. **Python 套件**
   ```powershell
   python -m pip install pymupdf pillow numpy
   ```
   用途：PyMuPDF 讀 PDF 與文字座標；Pillow 開頁面圖、掃墨跡；numpy 做像素批量分析。

2. **Node 依賴**
   ```powershell
   cd tools\qa
   npm install --no-audit --no-fund
   cd ..\..
   ```
   用途：QA 腳本用 `puppeteer-core` 控制 Chrome。

3. **Google Chrome**
   - 先檢查：`Test-Path "C:\Program Files\Google\Chrome\Application\chrome.exe"`
   - 不存在時：**不要靜默安裝**。先問人類：可以裝 Chrome 嗎？裝在校內受管電腦可能要 IT 批准。
   - 裝好但路徑不同時，設環境變數：`$env:CHROME = "D:\...\chrome.exe"`（只對當前 session 有效；要持久就 `setx CHROME "D:\...\chrome.exe"`）。

4. **Manim（只有數理科要做動畫才裝）**
   ```powershell
   python -m pip install manim
   ```
   另需 ffmpeg 在 PATH。中文科不需要。

## 3. 驗收（做到這些才算完成）

```powershell
python tools\check_env.py          # 必須 exit 0，最後一行是 "Ready."
cd tools\qa
node check_book.mjs                # 應印出 Usage: node check_book.mjs <book-id> [--shots]
cd ..\..
python -m http.server 8090         # 另開一個視窗，然後開 http://127.0.0.1:8090/
```

首頁應該看到「書庫」頁面（書架是空的，因為還沒有任何書）。若畫面空白或 console 報錯，**先檢查是否經 http 開啟**（雙擊 `index.html` 不會動）。

## 4. 不要做的事

- 不要改 `engine/` 內任何檔案（它是所有書共用的）。
- 不要刪除 `vendor/`、`assets/`、`docs/`。
- 不要 `pip install` 到一個與 `check_env.py` 不同的 Python（它會印出自己用的路徑，跟著它）。
- 不要為了讓檢查通過而修改 `tools/check_env.py`。
- 不要嘗試靜默安裝 Chrome／Node／Python（受管電腦會失敗，而且可能違反校規）。

## 5. 回報格式

給人類一段簡短報告，包含：

1. Python 路徑與版本、Node 版本、Chrome 路徑（或「未安裝，已詢問」）
2. `check_env.py` 的最後 5 行輸出
3. `http://127.0.0.1:8090/` 是否打得開（截圖或描述）
4. 還缺什麼、下一步要人類提供什麼（通常是兩份教材 PDF）

## 6. 下一階段（安裝完成之後）

跟著 `docs/00-onepager.md`（一頁紙）或 `docs/01-workflow.md`（完整流程）做第一本書。
需要人類提供：**QUE（題目）與 ANS（答案）兩份 PDF**，以及要做的章節名稱。
