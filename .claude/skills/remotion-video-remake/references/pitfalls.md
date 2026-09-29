# 已知陷阱與解法

實際重製兩支影片時踩過的坑。遇到對應情況時查這裡。

## 分析原片
- **Windows 的 ffmpeg 不支援 `-pattern_type glob`**：非連號檔案要先複製成 `n_%02d` 連號再 tile。
- **`drawtext` 可能直接 segfault**（缺 fontconfig）：不要在縮圖上疊時間戳，改用「位置＝時間」的規則（見 analyze_video.sh 開頭說明）。
- **`fps=1/4` 取的是每段中間的幀**：縮圖 i 大約是第 `4i+2` 秒，不是 `4i`。精確時間以逐秒字幕條為準。
- **scene 偵測抓不到交叉淡化**：`cuts.txt` 空的或很少不代表沒換場，靠縮圖判斷。
- **雙行字幕**：預設只裁到底部一行；看到歌詞上方還有字時，把 `sub_top_ratio` 調小、`sub_height_ratio` 調大重跑，或另外抽單幀確認。
- 讀字幕圖時仔細分辨簡繁與同形字；有疑問的句子再抽該秒的全幅畫面確認。

## 專案建立
- `npx create-video@latest --yes --blank --no-tailwind <dir>` 目前仍會裝 tailwind，無妨，別花時間移除。
- 目前資料夾非空時要建在子資料夾（create-video 拒絕非空目錄）。
- 套件用 `npx remotion add @remotion/transitions @remotion/media @remotion/fonts` 安裝，版本才會對齊。

## 畫面
- **`BigLine` 長句最後幾個字被擠小**：flex 子元素會被壓縮 → 容器 `width: max-content`、字元 `flexShrink: 0`（範本已修）。
- **道具沒拿在手上**：照 components.md 的公式算手的位置，不要目測。
- **大字壓到底部字幕**：大字底邊至少離畫面底部 160px；日曆、卡片等主體往上移。
- **TransitionSeries 讓場景變短**：每個轉場會吃掉重疊的幀，用 `scripts/timeline.mjs` 算 durationInFrames，確保總長等於原片、每場景在正確秒數開始。
- 同一 SVG 文件內 `<defs>` 的 id 重複時，定義相同就沒問題；若不同（例如不同色的漸層）要加後綴區分。

## 預覽與驗證
- **`npx remotion still` 每次都重新 bundle，很慢**：大量抽幀用 `scripts/render_stills.mjs`（bundle 一次）。
- **第一次跑 render_stills 會下載 Chrome Headless Shell（~113 MB）**，之後就快了。
- 偶發的單張 still 失敗（exit 127）重跑即可。
- **Studio 的 port**：`remotion render` 期間會佔用 3000，Studio 用 `--port=3100` 之類的其他 port。
- Studio 用 `.claude/launch.json` 設定，`runtimeExecutable: "npm"`、`runtimeArgs: ["--prefix", "<專案資料夾>", "run", "dev", "--", "--no-open", "--port=3100"]`，再用瀏覽器面板的 `preview_start` 開啟；launch.json 放在工作目錄根。
- Studio 伺服器可能被 app 自動關閉；使用者說「開啟服務」時先 `preview_list` 檢查，再重新啟動並等 HTTP 200 才導覽。

## 匯出
- 3–4 分鐘 1080p、SVG 很多的影片，`--concurrency=50%` 約 **45–60 分鐘**，先告知使用者。
- 背景算繪會在對話 session 結束時被中止，而且不會留下檔案。完成前別結束工作；若被中止，要明確告訴使用者並提議重跑。
- 等待用 `Monitor`（tail 輸出、只 grep 每 1000 幀與錯誤），不要 `sleep` 輪詢。
- 完成後用 ffprobe 驗證：解析度、`nb_frames` 等於預期、長度與原片相差 < 0.1 秒、有 aac 音軌。
- 清理暫存時不要用 `rm -f "$VAR"/*` 這類含變數的刪除（會被安全檢查擋下），改寫到新的資料夾即可。
