package com.quickwallet;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.rnfs.RNFSPackage;
import com.github.wumke.RNExitApp.RNExitAppPackage;
import org.reactnative.camera.RNCameraPackage;
import com.mkuczera.RNReactNativeHapticFeedbackPackage;
import com.horcrux.svg.SvgPackage;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.quickwallet.modules.GethPackage;
import com.quickwallet.modules.bundle.BundlePackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import android.support.multidex.MultiDexApplication;
import android.support.multidex.MultiDex;
import android.content.Context;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends MultiDexApplication implements ReactApplication {
  @Override
  protected void attachBaseContext(Context base) {
    super.attachBaseContext(base);
    MultiDex.install(this);
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNFSPackage(),
            new RNExitAppPackage(),
            new RNCameraPackage(),
            new RNReactNativeHapticFeedbackPackage(),
            new SvgPackage(),
            new ReactNativeConfigPackage(),
            new RNI18nPackage(),
            new VectorIconsPackage(),
            new RNGestureHandlerPackage(),
            new RNDeviceInfo(),
              new GethPackage(),
              new BundlePackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
