package com.quickwallet.modules.layer2;

import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class Layer2Module extends ReactContextBaseJavaModule {
    public Layer2Module(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "Layer2Module";
    }

    @ReactMethod
    public void show(String message) {
        Log.d("show", message);
    }
}
