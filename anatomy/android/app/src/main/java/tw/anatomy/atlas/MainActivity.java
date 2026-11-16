package tw.anatomy.atlas;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.graphics.Insets;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.WindowInsets;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

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
    private boolean usingBuiltIn = false;

    /** 給網頁讀 App 版本，用來判斷要不要提醒重新安裝 */
    public static class Bridge {
        @JavascriptInterface
        public String appVersion() { return BuildConfig.VERSION_NAME; }
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
                if (request.isForMainFrame()) fallBack();
            }

            @Override
            public void onReceivedHttpError(WebView view, WebResourceRequest request, WebResourceResponse response) {
                if (request.isForMainFrame() && response.getStatusCode() >= 400) fallBack();
            }
        });

        // Android 15 起畫面會延伸到狀態列底下，這裡把內容往內縮，避免被狀態列和導覽列蓋住
        web.setOnApplyWindowInsetsListener((v, insets) -> {
            if (Build.VERSION.SDK_INT >= 30) {
                Insets b = insets.getInsets(WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout());
                v.setPadding(b.left, b.top, b.right, b.bottom);
            } else {
                v.setPadding(insets.getSystemWindowInsetLeft(), insets.getSystemWindowInsetTop(),
                        insets.getSystemWindowInsetRight(), insets.getSystemWindowInsetBottom());
            }
            return insets;
        });

        setContentView(web);
        if (savedInstanceState != null) web.restoreState(savedInstanceState);
        else web.loadUrl(ONLINE);
    }

    private static boolean isAppPage(Uri u) {
        if ("file".equals(u.getScheme())) return true;
        String path = u.getPath() == null ? "" : u.getPath();
        return "https".equals(u.getScheme()) && ONLINE_HOST.equals(u.getHost()) && path.startsWith(ONLINE_PATH);
    }

    private void fallBack() {
        if (usingBuiltIn) return;
        usingBuiltIn = true;
        web.loadUrl(BUILT_IN);
    }

    @Override
    protected void onSaveInstanceState(Bundle out) {
        super.onSaveInstanceState(out);
        web.saveState(out);
    }
}
