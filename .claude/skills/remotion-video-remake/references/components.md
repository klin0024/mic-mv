# 元件範本（assets/template-src/）

這些檔案來自兩支已完成的重製影片（教師節 MV：繪本風火柴人；《麥克風交給您》：動物市民＋動態歌詞）。
複製到新專案的 `src/` 底下使用，保持相同的相對路徑（`components/`、`lib/`），再依新影片改造。
它們是**起點不是規格**——角色、色票、背景都該依新影片與使用者的參考圖重畫。

## 目錄

| 檔案 | 用途 | 依賴 |
|---|---|---|
| `lib/anim.ts` | `ip()` 夾限 interpolate、`pop()` 彈出縮放、`win()` 淡入淡出窗、`s()` 秒→幀、`rand()`、字體常數 | remotion |
| `lib/path.ts` | `interpolatePath(t, a, b)`：同結構 SVG path 變形（打結的線拉直等） | — |
| `components/Stage.tsx` | `Stage`（全幅 SVG＋慢推鏡）、`Citizens`（一排角色）、`Shots`（場景內分鏡切換）、`Subtitles`（卡拉 OK 字幕）、`Bubble`、`SvgText` | Animal、Kit、lyrics、anim |
| `components/Kit.tsx` | `BigLine`（逐字彈出大字，白字粗描邊）、`Mic`、`Waves`（聲波）、`Burst`（放射線）、`C` 色票、`FONT_BOLD` | remotion |
| `components/Animal.tsx` | 11 種擬人動物＋`CAST` 陣容；參數：`armL/armR` 角度、`prop`（phone/mic/tea/plant）、`hat` | — |
| `components/Mayor.tsx` | 依照片畫的人物範例（捲髮、眼鏡、西裝、手錶、麥克風） | — |
| `components/Skyline.tsx` | 藍天＋綠色線條城市天際線＋區名牌＋街道 | Kit |
| `components/Effects.tsx` | `SunRays`、`Motes`（光點）、`Petals`（花瓣）、`Grain`（紙紋）、`Vignette`、`heartPath()` | remotion |
| `components/Figure.tsx` | 繪本風火柴人（教師節版），走路、揮手、發光 | — |
| `components/BookLandscape.tsx` | 翻開的書＋小路通往太陽的風景（day / blossom） | Effects |
| `components/Lyrics.tsx` | 另一種卡拉 OK 字幕：整句用 clip-path 由左向右填色（支援 `/` 雙行） | lyrics、anim |
| `lyrics.example.ts` | 歌詞時間軸格式 `{ start, end, text }`（秒） | — |
| `scenes-examples/MicMV.tsx` | 主合成範例：15 場景 TransitionSeries＋字幕層＋音樂 | 各場景 |
| `scenes-examples/Chorus.tsx` | 分鏡範例：一個副歌場景用 `Shots` 切 8 個鏡頭，`beats` prop 讓同一元件重用三次 | Stage、Kit… |
| `scenes-examples/Gallery.tsx` | 元件展示頁：每個元件一個 Composition，方便使用者在 Studio 檢視 | 全部 |

## 關鍵 API 與慣例

### 座標
- 所有場景畫在 `viewBox="0 0 1920 1080"` 的 SVG 裡（`Stage`）；文字標題用絕對定位的 HTML `div` 疊在上面（中文字型、描邊在 HTML 比 SVG 好控制）。
- 角色 `(x, y)` 是**腳底中心**；`s` 是縮放。`Animal` s=1 約 225px 高；`Mayor` s=1 約 330px 高；`Figure` s=1 約 100px 高。

### 手上拿東西（最常出錯）
道具要畫在手的位置，不要憑感覺放。手的位置由肩膀＋手臂角度計算：
- `Animal`：肩膀 `(±(W/2-4), -128)`，W = 84（熊／河狸／大象／烏龜）或 66；手臂長 58；
  手 = `sx + side*sin(θ)*58, -128 + cos(θ)*58`，再乘上 `s` 加到 `(x, y)`。`prop` 參數會自動畫在右手。
- `Mayor`：兩段手臂（上臂 56、前臂 52，手肘彎 ±20°），`micHand` 自動畫麥克風。要在場景裡把東西（聲波、飛出的麥克風）對準手時，照 `Mayor.tsx` 的 `arm()` 算一次世界座標。

### 時間
- `useCurrentFrame()` 在 `Sequence`／`Shots` 裡是**區段內的本地幀**。場景內的時間點一律寫成「本地秒」，用 `s(秒)` 轉幀。
- `Shots` 的 `at` 是場景內本地秒；每個 shot 自帶 8 幀縮放淡入。
- `BigLine` 的 `start` 是本地幀；字元逐一彈出（stagger 2 幀）。截圖時最後幾個字偏小通常只是動畫還沒跑完，不是版面錯誤。

### 字幕
- `Subtitles`（Stage.tsx）：每句逐字變色——未唱白字深藍框、已唱黃字橘框，正在唱的字小幅放大。句內每字時間平均分配（起訖依原片字幕）。
- 畫面上已經用 `BigLine` 大字呈現的句子，字幕照樣顯示（使用者要求所有句子都要逐字變色），但要檢查大字與字幕不重疊（大字離底部至少 ~160px）。

### 字型（Windows）
- 粗黑體：系統 `Microsoft JhengHei`（`FONT_BOLD`），不需載入。
- 手寫／黑板字：把 `C:\Windows\Fonts\kaiu.ttf` 複製到 `public/`，用 `@remotion/fonts` 的 `loadFont({ family: "TW-Kai", url: staticFile("kaiu.ttf") })`。
- Emoji 在 headless Chrome（Windows）會用 Segoe UI Emoji 正常顯示，可拿來當小圖示。
