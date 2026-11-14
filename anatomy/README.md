# 全身肌肉分層圖譜

`muscle-atlas.html` 是單一檔案的 3D 肌肉檢視器（模型資料已內嵌），用瀏覽器直接打開即可。

- 487 塊肌肉（245 種，左右分開），每塊都可以單獨點選、拆下。
- 依「由淺到深」自動分成 6 層。從每塊肌肉表面往最近的皮膚發射射線，被哪些肌肉擋住，就代表被誰蓋住。
- 點選肌肉後會列出「被誰蓋住」和「蓋住了誰」，並附上面積比例。

## 重新產生

`build/` 內是產生資料的腳本。需要 npm 套件 `@authorod/svitylo-3d-anatomy-data@1.2.0`、`three@0.160.0`、`three-mesh-bvh@0.7.8`、`meshoptimizer`。依序執行 `node build.mjs`（Q=economy 或 standard）再執行 `node assemble.mjs`。

已知的資料修正：
- 原始模型的斜方肌上部與下部名稱標反，已依高度對調。
- 腹直肌前方的腹斜肌腱膜（腹直肌鞘）不算作肌肉覆蓋。

## 授權

模型來自 [Z-Anatomy](https://github.com/Z-Anatomy/Models-of-human-anatomy)（CC BY-SA 4.0），源自 BodyParts3D © The Database Center for Life Science（CC BY 4.0），由 Svitylo 3D Anatomy Atlas 轉成 glTF。本專案簡化網格、計算分層並加上繁體中文名稱，衍生資料以 CC BY-SA 4.0 釋出。僅供學習與繪畫參考，非醫療用途。
