# 全身肌肉分層圖譜

`muscle-atlas.html` 是單一檔案的 3D 肌肉檢視器（模型資料已內嵌），用瀏覽器直接打開即可。

- 487 塊肌肉（245 種，左右分開），每塊都可以單獨點選、拆下。
- 依「由淺到深」自動分成 6 層。從每塊肌肉表面往最近的皮膚發射射線，被哪些肌肉擋住，就代表被誰蓋住。
- 點選肌肉後會列出「被誰蓋住」和「蓋住了誰」，並附上面積比例。

## 三種用法

| 檔案 | 用途 |
|---|---|
| `muscle-atlas.html` | 單一檔案網頁（3D 引擎從網路載入） |
| `app/` | 可安裝的網頁版（PWA）：完全離線、可「加到主畫面」，iPhone 和 Android 都能用。放到 GitHub Pages 後，網址是 `https://<帳號>.github.io/salary-calc/anatomy/app/` |
| `android/` | Android App 專案，用 WebView 顯示 `app/index.html`。推送到 GitHub 後會由 `.github/workflows/anatomy-apk.yml` 自動打包，APK 在 Actions 該次執行的 Artifacts 區下載 |

Android 專案用 `app/sideload.keystore`（密碼 `android`）簽章，讓每次打包的新版能直接覆蓋安裝。這把簽章是公開的，只適合自己安裝用；要上架 Google Play 請改用自己保管的正式簽章。

## 重新產生

`build/` 內是產生資料的腳本。需要 npm 套件 `@authorod/svitylo-3d-anatomy-data@1.2.0`、`three@0.160.0`、`three-mesh-bvh@0.7.8`、`meshoptimizer`。依序執行 `node build.mjs`（Q=economy 或 standard），再執行 `node assemble.mjs`（單一網頁）和 `node assemble-app.mjs ../app`（離線版，需要 three@0.147.0）。

已知的資料修正：
- 原始模型的斜方肌上部與下部名稱標反，已依高度對調。
- 腹直肌前方的腹斜肌腱膜（腹直肌鞘）不算作肌肉覆蓋。

## 授權

模型來自 [Z-Anatomy](https://github.com/Z-Anatomy/Models-of-human-anatomy)（CC BY-SA 4.0），源自 BodyParts3D © The Database Center for Life Science（CC BY 4.0），由 Svitylo 3D Anatomy Atlas 轉成 glTF。本專案簡化網格、計算分層並加上繁體中文名稱，衍生資料以 CC BY-SA 4.0 釋出。僅供學習與繪畫參考，非醫療用途。
