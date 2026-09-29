# anima — 用 Remotion 重製影片

把現有影片（MV、歌詞影片）分析後，用 [Remotion](https://www.remotion.dev/) 重新製作成插畫動畫，並產生字幕。

目前的作品是《麥克風交給您》：把真人實拍 MV 重製成擬人動物市民、捲髮市長、台北天際線風格的動態歌詞動畫，附卡拉 OK 逐字變色字幕與頻道浮水印。

## 目錄結構

```
anima/
├─ mic-mv/             《麥克風交給您》Remotion 專案
├─ videos/             原片、成品 MP4、SRT 字幕（不進版控）
├─ mic-preview/        關鍵畫面預覽圖（不進版控）
├─ .claude/
│  ├─ skills/          Claude Code skills（Remotion 系列、remotion-video-remake、video2txt）
│  └─ launch.json      Remotion Studio 啟動設定（mic-mv-studio，port 3100）
├─ .agents/skills/     Remotion Agent Skills 安裝來源
├─ .remotion/          Remotion 下載的 headless Chrome（不進版控）
└─ skills-lock.json    Remotion skills 的來源與版本紀錄
```

## mic-mv 專案

- 規格：1920×1080、30fps、6750 幀（3 分 45 秒），Remotion 4.0.529
- 主合成：`MicMV`（15 個場景、約 50 個分鏡，場景間 15 幀淡入淡出）

```
mic-mv/src/
├─ MicMV.tsx           主合成：TransitionSeries＋音樂＋字幕＋浮水印
├─ Root.tsx            登錄主合成、各場景與元件總覽
├─ lyrics.ts           61 句歌詞與時間軸（取自原片字幕）
├─ components/
│  ├─ Animal.tsx       擬人動物市民（11 種）＋ CAST 陣容
│  ├─ Mayor.tsx        市長角色（捲髮、圓眼鏡、西裝外套）
│  ├─ Skyline.tsx      藍天＋綠色台北天際線＋區名牌
│  ├─ Kit.tsx          動態大字 BigLine、麥克風、聲波、放射線、色票
│  ├─ Stage.tsx        畫布、市民列、分鏡切換、卡拉 OK 字幕
│  ├─ Watermark.tsx    頻道浮水印
│  ├─ Effects.tsx      光芒、粒子、花瓣等效果
│  └─ Figure.tsx       簡易小人（備用）
├─ scenes/             Verse1 / Chorus / Verse2 / Bridge / Outro / CastSheet
├─ gallery/            元件預覽頁（Studio 的 Components 資料夾）
└─ lib/                動畫工具函式、路徑變形
```

音樂放在 `mic-mv/public/music.m4a`（從原片抽出的音軌）。

## 使用方式

### 安裝

```bash
cd mic-mv
npm i
```

### 預覽（Remotion Studio）

```bash
cd mic-mv
npm run dev -- --port=3100
```

開啟 http://localhost:3100/MicMV 。左側 `MicMV-Scenes` 可單獨預覽各場景，`Components` 可看各元件。

在 Claude Code 桌面版中，也可直接用 `.claude/launch.json` 的 `mic-mv-studio` 設定啟動。

### 匯出 MP4

```bash
cd mic-mv
npx remotion render MicMV ../videos/mic-remotion.mp4 --concurrency=50%
```

約 13 分鐘（依電腦效能而定）。

### 產生字幕

使用 `video2txt` skill（Whisper 語音辨識＋ AI 校正）：

```
/video2txt videos/麥克風交給您.mp4 生成 SRT 字幕檔
```

需要 Python 3.11/3.12 與 `.claude/skills/video2txt/requirements.txt` 的套件。
注意：faster-whisper 1.2.x 需搭配 PyAV 13（`pip install "av>=12,<14"`），PyAV 19 會出現 `metadata_errors` 錯誤。

歌曲類影片 Whisper 辨識率較低，較精準的字幕可直接依 `mic-mv/src/lyrics.ts` 的逐句時間產生。

## Skills

| Skill | 用途 |
|---|---|
| `remotion-*`（12 個） | Remotion 官方 Agent Skills：建立專案、動畫寫法、預覽、算繪、字幕等 |
| `remotion-video-remake` | 讀取影片 → 分析分鏡與歌詞 → 先出關鍵畫面預覽 → 完整重製 → 匯出 |
| `video2txt` | 影片／音訊轉 SRT、ASS、TXT，並校正語音辨識錯誤 |

## 需求

- Node.js（開發時使用 v24）
- FFmpeg / ffprobe
- Python 3.11 或 3.12（僅字幕功能需要）
- Windows 系統字型「微軟正黑體」（畫面文字使用）
