plugins {
    id("com.android.application")
}

android {
    namespace = "tw.anatomy.atlas"
    compileSdk = 35

    defaultConfig {
        applicationId = "tw.anatomy.atlas"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "1.0"
    }

    // 固定的簽章檔：每次打包出來的 APK 簽章都一樣，新版才能直接覆蓋安裝舊版。
    // 這是自己安裝用的簽章，要上架 Google Play 請改用自己的正式簽章。
    signingConfigs {
        create("sideload") {
            storeFile = file("sideload.keystore")
            storePassword = "android"
            keyAlias = "atlas"
            keyPassword = "android"
        }
    }

    buildTypes {
        getByName("release") {
            isMinifyEnabled = false
            signingConfig = signingConfigs.getByName("sideload")
        }
        getByName("debug") {
            signingConfig = signingConfigs.getByName("sideload")
        }
    }

    // App 內顯示的網頁就是 anatomy/app/ 這個資料夾（和 PWA 同一份）
    sourceSets {
        getByName("main") {
            assets.srcDirs("../../app")
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}
