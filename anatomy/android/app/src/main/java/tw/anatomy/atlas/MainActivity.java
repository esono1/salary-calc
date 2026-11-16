package tw.anatomy.atlas;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.PendingIntent;
import android.content.Intent;
import android.content.pm.PackageInstaller;
import android.provider.Settings;
import android.graphics.Color;
import android.graphics.Insets;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;

import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * 肌肉圖譜 App。
 * 打開時讀網站上的最新版（網頁內容改了，App 就自動更新）；網頁讀過一次後會存在手機裡，之後沒網路也能用。
 * 第一次打開就沒網路時，改用 APK 內建的那一份。
 */
public class MainActivity extends Activity {
    private static final String ONLINE = "https://esono1.github.io/salary-calc/anatomy/app/";
    private static final String ONLINE_HOST = "esono1.github.io";
    private static final String ONLINE_PATH = "/salary-calc/anatomy/app/";
    private static final String BUILT_IN = "file:///android_asset/index.html";

    private WebView web;
    private FrameLayout frame;
    private boolean usingBuiltIn = false;

    /** 網頁和 App 溝通用 */
    public class Bridge {
        /** App 版本，網頁用來判斷要不要提醒重新安裝 */
        @JavascriptInterface
        public String appVersion() { return BuildConfig.VERSION_NAME; }

        /** 網頁切換深淺色時，讓狀態列、導覽列跟著換底色和圖示顏色 */
        /** 網頁按「更新 App」：下載新版 APK，下載完跳出系統的安裝確認 */
        @JavascriptInterface
        public void installUpdate(String url) { runOnUiThread(() -> startInstall(url)); }

        /** 網頁按「改用線上版」時，重新讀網站 */
        @JavascriptInterface
        public void retryOnline() { runOnUiThread(MainActivity.this::loadOnline); }

        @JavascriptInterface
        public void setBarColors(String hex, boolean dark) {
            runOnUiThread(() -> applyBarColors(hex, dark));
        }
    }

    @SuppressWarnings("deprecation")
    private void applyBarColors(String hex, boolean dark) {
        int c;
        try { c = Color.parseColor(hex); } catch (Exception e) { return; }
        frame.setBackgroundColor(c);
        Window w = getWindow();
        w.setStatusBarColor(c);
        w.setNavigationBarColor(c);
        if (Build.VERSION.SDK_INT >= 30) {
            WindowInsetsController ic = w.getInsetsController();
            if (ic != null) {
                int mask = WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS | WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS;
                ic.setSystemBarsAppearance(dark ? 0 : mask, mask);
            }
        } else {
            View d = w.getDecorView();
            int f = d.getSystemUiVisibility();
            int light = View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR | (Build.VERSION.SDK_INT >= 26 ? View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR : 0);
            d.setSystemUiVisibility(dark ? (f & ~light) : (f | light));
        }
    }

    @SuppressLint({"SetJavaScriptEnabled", "AddJavascriptInterface"})
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        web = new WebView(this);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccess(true);
        s.setBuiltInZoomControls(false);
        s.setSupportZoom(false);
        s.setCacheMode(WebSettings.LOAD_DEFAULT);
        web.addJavascriptInterface(new Bridge(), "AndroidBridge");

        web.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri u = request.getUrl();
                if (isAppPage(u)) return false;
                // 其他連結（模型來源、下載新版 APK）交給手機的瀏覽器
                try { startActivity(new Intent(Intent.ACTION_VIEW, u)); } catch (Exception ignored) { }
                return true;
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                if (request.isForMainFrame()) fallBack("錯誤 " + error.getErrorCode() + " " + error.getDescription());
            }

            @Override
            public void onReceivedHttpError(WebView view, WebResourceRequest request, WebResourceResponse response) {
                if (request.isForMainFrame() && response.getStatusCode() >= 400) fallBack("HTTP " + response.getStatusCode());
            }
        });

        // Android 15 起畫面會延伸到狀態列底下。WebView 本身不理會內縮，
        // 所以外面包一層容器，由容器往內縮，避免狀態列和導覽列蓋住按鈕
        frame = new FrameLayout(this);
        frame.setBackgroundColor(Color.parseColor("#120f15"));
        frame.addView(web, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        frame.setOnApplyWindowInsetsListener((v, insets) -> {
            if (Build.VERSION.SDK_INT >= 30) {
                Insets b = insets.getInsets(WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout());
                v.setPadding(b.left, b.top, b.right, b.bottom);
            } else {
                v.setPadding(insets.getSystemWindowInsetLeft(), insets.getSystemWindowInsetTop(),
                        insets.getSystemWindowInsetRight(), insets.getSystemWindowInsetBottom());
            }
            // 已經由容器處理，不再交給 WebView，避免內縮兩次
            return Build.VERSION.SDK_INT >= 30 ? WindowInsets.CONSUMED : insets.consumeSystemWindowInsets();
        });

        setContentView(frame);
        if (savedInstanceState != null) web.restoreState(savedInstanceState);
        else loadOnline();
    }

    private void loadOnline() {
        usingBuiltIn = false;
        web.loadUrl(ONLINE);
    }

    /** 從背景切回來時，如果正在用離線備份，就再試一次線上版 */
    @Override
    protected void onResume() {
        super.onResume();
        // 剛從「允許安裝」設定頁回來：繼續下載安裝
        if (pendingUrl != null && (Build.VERSION.SDK_INT < 26 || getPackageManager().canRequestPackageInstalls())) {
            String u = pendingUrl; pendingUrl = null; startInstall(u); return;
        }
        if (usingBuiltIn && web != null) loadOnline();
    }

    private static boolean isAppPage(Uri u) {
        if ("file".equals(u.getScheme())) return true;
        String path = u.getPath() == null ? "" : u.getPath();
        return "https".equals(u.getScheme()) && ONLINE_HOST.equals(u.getHost()) && path.startsWith(ONLINE_PATH);
    }

    // ---------- App 內更新：用系統的 PackageInstaller 安裝下載的 APK（使用者仍需按「安裝」確認）
    private static final String ACTION_INSTALL = "tw.anatomy.atlas.INSTALL_STATUS";
    private String pendingUrl = null;
    private boolean installing = false;

    private void tellPage(String js) {
        if (web != null) web.post(() -> web.evaluateJavascript("try{" + js + "}catch(e){}", null));
    }

    private void startInstall(String url) {
        if (installing) return;
        // Android 8 以上：第一次需要允許「安裝不明應用程式」
        if (Build.VERSION.SDK_INT >= 26 && !getPackageManager().canRequestPackageInstalls()) {
            pendingUrl = url;
            tellPage("window.__apkStatus&&__apkStatus('perm')");
            try {
                startActivity(new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES, Uri.parse("package:" + getPackageName())));
            } catch (Exception e) { tellPage("window.__apkStatus&&__apkStatus('error','無法開啟設定')"); }
            return;
        }
        installing = true;
        new Thread(() -> {
            PackageInstaller.Session session = null;
            try {
                PackageInstaller pi = getPackageManager().getPackageInstaller();
                PackageInstaller.SessionParams params = new PackageInstaller.SessionParams(PackageInstaller.SessionParams.MODE_FULL_INSTALL);
                int id = pi.createSession(params);
                session = pi.openSession(id);
                HttpURLConnection c = (HttpURLConnection) new URL(url + (url.contains("?") ? "&" : "?") + "t=" + System.currentTimeMillis()).openConnection();
                c.setUseCaches(false);
                c.connect();
                if (c.getResponseCode() != 200) throw new Exception("HTTP " + c.getResponseCode());
                long total = c.getContentLengthLong(), done = 0;
                int lastPct = -1;
                try (InputStream in = c.getInputStream(); OutputStream out = session.openWrite("app.apk", 0, total > 0 ? total : -1)) {
                    byte[] buf = new byte[65536];
                    int n;
                    while ((n = in.read(buf)) > 0) {
                        out.write(buf, 0, n);
                        done += n;
                        int pct = total > 0 ? (int) (done * 100 / total) : -1;
                        if (pct != lastPct && pct % 5 == 0) { lastPct = pct; final int p = pct; tellPage("window.__apkStatus&&__apkStatus('progress'," + p + ")"); }
                    }
                    session.fsync(out);
                }
                Intent i = new Intent(this, MainActivity.class).setAction(ACTION_INSTALL);
                int flags = PendingIntent.FLAG_UPDATE_CURRENT | (Build.VERSION.SDK_INT >= 31 ? PendingIntent.FLAG_MUTABLE : 0);
                PendingIntent pend = PendingIntent.getActivity(this, 0, i, flags);
                tellPage("window.__apkStatus&&__apkStatus('confirm')");
                session.commit(pend.getIntentSender());
                session.close();
            } catch (Exception e) {
                if (session != null) try { session.abandon(); } catch (Exception ignored) { }
                installing = false;
                final String msg = String.valueOf(e.getMessage()).replace("'", " ");
                tellPage("window.__apkStatus&&__apkStatus('error','" + msg + "')");
            }
        }).start();
    }

    @SuppressWarnings("deprecation")
    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        if (intent == null || !ACTION_INSTALL.equals(intent.getAction())) return;
        int status = intent.getIntExtra(PackageInstaller.EXTRA_STATUS, PackageInstaller.STATUS_FAILURE);
        if (status == PackageInstaller.STATUS_PENDING_USER_ACTION) {
            Intent confirm = intent.getParcelableExtra(Intent.EXTRA_INTENT);
            if (confirm != null) { confirm.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK); startActivity(confirm); }
            return;
        }
        installing = false;
        if (status != PackageInstaller.STATUS_SUCCESS) {
            String msg = String.valueOf(intent.getStringExtra(PackageInstaller.EXTRA_STATUS_MESSAGE)).replace("'", " ");
            tellPage("window.__apkStatus&&__apkStatus('error','" + msg + "')");
        }
    }

    /** 讀不到網站時改用 APK 內建的網頁，並把原因帶給網頁顯示 */
    private void fallBack(String why) {
        if (usingBuiltIn) return;
        usingBuiltIn = true;
        web.loadUrl(BUILT_IN + "#offline=" + Uri.encode(why == null ? "" : why));
    }

    @Override
    protected void onSaveInstanceState(Bundle out) {
        super.onSaveInstanceState(out);
        web.saveState(out);
    }
}
