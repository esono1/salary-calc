# 全身肌肉分層圖譜

`muscle-atlas.html` 是單一檔案的 3D 肌肉檢視器（模型資料已內嵌），用瀏覽器直接打開即可。

- 487 塊肌肉（245 種，左右分開），每塊都可以單獨點選、拆下。
- 依「由淺到深」自動分成 6 層。從每塊肌肉表面往最近的皮膚發射射線，被哪些肌肉擋住，就代表被誰蓋住。
- 點選肌肉後會列出「被誰蓋住」和「蓋住了誰」，並附上面積比例。
- 點選肌肉後按 ▶，模型會做出這塊肌肉負責的關節動作（例如三角肌中束 → 肩外展）。骨架和每個頂點跟隨哪幾節骨頭，是 `build/rig.mjs` 依骨骼形狀自動算出的；肌肉功能表在 `build/func.mjs`。臉、眼、喉、骨盆底、呼吸肌等沒有明顯關節動作的肌肉只顯示功能說明。
- 起點與止點：點選肌肉後，骨頭上會用紅色（起點）和藍色（止點）標出附著位置，並列出所在的骨頭（`build/attach.mjs`）。原始模型只標了長在骨頭上的附著點，有些肌肉只畫了一側，已自動鏡像到另一側。
- 動作查詢：選一個關節動作（例如右肩外展），負責的主要肌肉和輔助肌肉會亮起來，其他變透明，並播放動作。
- 擺姿勢：用滑桿調整每個關節的角度，或套用預設姿勢（坐姿、跑步、深蹲等）。
- 收縮鼓起：播放動作時，收縮中的肌肉肌腹會沿長軸鼓起（肌腱不變）。
- 搜尋別名：可以用俗稱或肌群名稱搜尋，例如小腿肚、股四頭肌、旋轉肌袖、豎脊肌、膕繩肌。
- 精細模型：「顯示 → 模型 → 精細」會下載 `app/hd.bin`（約 5 MB，三角形約為標準版的 2 倍），選擇會被記住。

## 三種用法

| 檔案 | 用途 |
|---|---|
| `muscle-atlas.html` | 單一檔案網頁（3D 引擎從網路載入） |
| `app/` | 可安裝的網頁版（PWA）：完全離線、可「加到主畫面」，iPhone 和 Android 都能用。放到 GitHub Pages 後，網址是 `https://<帳號>.github.io/salary-calc/anatomy/app/` |
| `android/` | Android App 專案，用 WebView 顯示 `app/index.html`。推送到 GitHub 後會由 `.github/workflows/anatomy-apk.yml` 自動打包，APK 在 Actions 該次執行的 Artifacts 區下載 |

Android 專案用 `app/sideload.keystore`（密碼 `android`）簽章，讓每次打包的新版能直接覆蓋安裝。這把簽章是公開的，只適合自己安裝用；要上架 Google Play 請改用自己保管的正式簽章。

## 重新產生

`build/` 內是產生資料的腳本。需要 npm 套件 `@authorod/svitylo-3d-anatomy-data@1.2.0`、`three@0.160.0`、`three-mesh-bvh@0.7.8`、`meshoptimizer`。依序執行 `HD=1 node build.mjs`（HD=1 會另外產生精細模型 `hd.bin`，放到 `app/`），再執行 `node assemble.mjs`（單一網頁）和 `node assemble-app.mjs ../app`（離線版，需要 three@0.147.0）。

已知的資料修正：
- 原始模型的斜方肌上部與下部名稱標反，已依高度對調。
- 腹直肌前方的腹斜肌腱膜（腹直肌鞘）不算作肌肉覆蓋。

## 授權

模型來自 [Z-Anatomy](https://github.com/Z-Anatomy/Models-of-human-anatomy)（CC BY-SA 4.0），源自 BodyParts3D © The Database Center for Life Science（CC BY 4.0），由 Svitylo 3D Anatomy Atlas 轉成 glTF。本專案簡化網格、計算分層並加上繁體中文名稱，衍生資料以 CC BY-SA 4.0 釋出。僅供學習與繪畫參考，非醫療用途。
