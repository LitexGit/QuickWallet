package com.quickwallet.modules.bundle;

import android.content.Context;
import android.location.Address;
import android.support.annotation.RawRes;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

import java.io.IOException;
import java.io.InputStream;

public class BundleModule extends ReactContextBaseJavaModule {

  public BundleModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "BundleModule";
  }


  @ReactMethod
  public void readWeb3Provider(Promise promise) {

    WritableMap map = Arguments.createMap();
    map.putString("web3Provider", "123456");
    promise.resolve(map);

  }

  private String loadFile(Context context, @RawRes int rawRes) {
    byte[] buffer = new byte[0];
    try {
      InputStream in = context.getResources().openRawResource(rawRes);
      buffer = new byte[in.available()];
      int len = in.read(buffer);
      if (len < 1) {
        throw new IOException("Nothing is read.");
      }
    } catch (Exception ex) {
      Log.d("READ_JS_TAG", "Ex", ex);
    }
    return new String(buffer);

  }

}
