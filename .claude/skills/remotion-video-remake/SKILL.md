---
name: remotion-video-remake
description: 讀取一支現有影片（MV、歌詞影片、廣告、活動紀錄、短片），分析它的分鏡、歌詞與節奏，再用 Remotion 重新製作成插畫動畫或動態排版影片——先出關鍵畫面預覽給使用者確認，再做完整影片、卡拉 OK 字幕、預覽與匯出 MP4。只要使用者給了一個影片檔並說「重新製作」「重製」「改成動畫」「用 Remotion 做一支一樣的」「照這支影片的節奏做」，或想把實拍影片變成卡通／插畫版，就使用這個 skill，即使沒有明說 Remotion。
---

# Remotion 影片重製

把一支現有影片重做成 Remotion 動畫：**保留原片的時間軸、歌詞與情緒，換成新的畫面**。
原曲音軌直接沿用，所以時間必須對準原片——這是整個流程的骨幹。

開始前先載入 `remotion-best-practices`（以及它指向的 remotion-create、remotion-markup、remotion-interactivity），
Remotion 的 API 慣例以那些 skill 為準；這個 skill 只負責「重製」這件事的流程與經驗。

## 流程總覽

1. 分析原片 → 場景表＋歌詞時間軸
2. 和使用者決定風格
3. 關鍵畫面預覽 → **等使用者確認**（這是關卡，確認前不做完整影片）
4. 寫製作計畫
5. 完整製作
6. 抽幀驗證
7. Studio 預覽 → 使用者要求時才匯出 MP4

每個階段結束都用一兩句話告訴使用者進度；使用者說中文就用中文回報。

---

## 1. 分析原片

```bash
bash <skill>/scripts/analyze_video.sh <影片> <scratchpad>/analysis
```

產出 `info.txt`、`contact.jpg`（每 4 秒一張縮圖）、`subs_XX.jpg`（每秒一列字幕條）、`music.m4a`、`cuts.txt`。
用 Read 看圖：

- **縮圖總表** → 列出場景（時間、地點、人物、動作、情緒）。縮圖 i ≈ 第 4i+2 秒。
- **字幕條** → 逐句抄錄 `{ start, end, text }`（秒）。第 k 張、第 r 列（0 起算）＝第 `(k-1)*25 + r` 秒。
  同一句連續出現的列就是它的起訖；空白列是間隔。
- 找出**重複段落**（副歌通常出現 2–3 次）：之後可以做成一個元件、用 props 帶不同時間重用。
- 沒有字幕的影片：用縮圖＋`cuts.txt` 抓段落，必要時問使用者歌詞或旁白稿。

把歌詞寫成專案的 `src/lyrics.ts`（格式見 `assets/template-src/lyrics.example.ts`）。

## 2. 決定風格

用 AskUserQuestion 問（附上建議選項，推薦項放第一個）：

- **畫風**：插畫角色重演（例：繪本風火柴人）／動態大字歌詞＋插畫／保留原片畫面＋動態包裝。
- **預覽要幾張**：關鍵段落（開場、主歌、副歌、轉折、結尾）或每場景一張。

使用者常會給參考圖（例如「市民改成動物，參考附圖」「市長參考這張照片」）。照參考圖的**特徵**重畫成同一套畫風
（線條粗細、配色、比例一致），不要貼原圖。參考真人照片時，抓髮型、眼鏡、服裝、配件等特徵畫成卡通；
使用者要求修改特徵（例如「市長是捲髮」）就照改並出對照圖。

預設不使用原片實拍畫面與電視台 logo，成品只在本機產生。

## 3. 關鍵畫面預覽（關卡）

1. 建專案（見 remotion-create；非空資料夾就建子資料夾）、`npx remotion add @remotion/transitions @remotion/media @remotion/fonts`、
   把 `music.m4a` 放進 `public/`。
2. 從 `assets/template-src/` 複製需要的元件（清單與 API 見 `references/components.md`），依新風格改造。
3. 為每個關鍵時刻做一個場景元件並註冊 Composition；另外做一張**角色總表**（全部角色排排站），
   以及元件展示頁（`scenes-examples/Gallery.tsx` 的做法），讓使用者能在 Studio 逐一檢視。
4. 用 `scripts/render_stills.mjs` 出圖，並把原片同一秒的畫面並排拼成對照圖（左原片右重製），用 SendUserFile 傳給使用者。
5. **停下來等回饋。** 使用者可能改好幾輪（換角色、改髮型…），每輪只重畫受影響的畫面再出對照圖。
   為什麼要卡在這裡：完整影片有數十個分鏡，風格不對的話全部要重做；預覽階段改一個元件成本最低。

## 4. 製作計畫

使用者確認後，寫出（或更新）計畫：段落表（時間、歌詞重點、每句對應的分鏡）、要新增的場景、檔案結構、驗證方式。
在 plan mode 時寫進計畫檔；否則在對話中列出重點。時間以第 1 步的歌詞表為準。

## 5. 完整製作

**結構**（參考 `scenes-examples/MicMV.tsx`、`Chorus.tsx`）：

- `src/lyrics.ts` — 全部歌詞時間。
- `src/scenes/*.tsx` — 依段落分檔；每個場景用 `Shots` 切成分鏡，**一句歌詞一個鏡頭**，畫面要演出那句話的意思
  （例：「一九九九 打了多少通電話」→ 1999 卡片＋永遠跑不完的「處理中」進度條）。
  重複的副歌做成一個元件，用 `beats`（本地秒）props 對準每次出現的時間，並換主角讓三次不重複。
- `src/<Main>.tsx` — `TransitionSeries` 串場景＋`<Audio src={staticFile("music.m4a")} />`＋`Subtitles` 字幕層。
- `src/Root.tsx` — 主合成＋每個場景各自註冊（connected compositions，放 Folder），元件展示頁放另一個 Folder。

**時間對準**：用腳本算每個場景的 durationInFrames，讓場景剛好在原片的秒數開始、總長等於原片：

```bash
node <skill>/scripts/timeline.mjs --total <原片秒數> --overlap 15 0 8 17 25 ...
```

**字幕**：底部字幕條逐字逐句變色（`Stage.tsx` 的 `Subtitles`）。所有句子都要有，
包括畫面上已用大字呈現的句子。重點詞可以另外用 `BigLine` 做大字動態排版。

每寫完一批就 `npx tsc --noEmit`。

## 6. 抽幀驗證

```bash
node <skill>/scripts/render_stills.mjs --project <專案> --comp <主合成> --out <scratchpad>/check <每個分鏡中段的秒數...>
```

讀 `sheet.jpg` 逐格檢查：

- 角色、道具、文字互不遮擋；道具真的在手上（手的座標公式見 components.md）
- 大字在安全區內、不壓到底部字幕、長句沒被擠壓
- 畫面內容和當下那句歌詞相符；字幕正確、有逐字變色
- 轉場點的場景在正確秒數出現

修正後只重抽受影響的秒數確認。已知陷阱見 `references/pitfalls.md`。

## 7. 預覽與匯出

- **Studio 預覽**：在工作目錄的 `.claude/launch.json` 加設定（port 不要用 3000，算繪時會佔用），
  用 `preview_start` 開啟並導到主合成，告訴使用者網址與怎麼播放。
- **匯出 MP4**：使用者要求才做。先說明大約耗時（3–4 分鐘 1080p 約 45–60 分鐘），再在背景執行：

  ```bash
  npx remotion render <主合成> <輸出.mp4> --concurrency=50%
  ```

  用 Monitor 追進度。完成後用 ffprobe 確認解析度、幀數、長度（與原片差 < 0.1 秒）、音軌，再回報檔案位置。
  背景算繪在 session 結束時會中止且不留檔案——若發生，明確告訴使用者並提議重跑。

## 交付時回報

- 影片規格（解析度、fps、幀數、長度）與檔案位置
- 段落 → 畫面對照表
- 驗證做了什麼、修了哪些問題
- 下一步選項（再調整哪裡／匯出）
