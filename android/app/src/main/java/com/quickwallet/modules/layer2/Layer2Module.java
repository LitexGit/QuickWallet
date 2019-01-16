package com.quickwallet.modules.layer2;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;


public class Layer2Module extends ReactContextBaseJavaModule {
    private final String SOCKET_URL  = "socketUrl";
    private final String DATA_PATH  = "dataPath";

    private Callback initCallback;
    private Callback callCallback;


    public Layer2Module(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "Layer2Module";
    }

    @ReactMethod
    public void initL2SDK(String cpKey, String address, String socketUrl,  Callback callback) {
        try{
            initCallback = callback;



            WritableMap map = Arguments.createMap();
            map.putString("cpKey", cpKey);
            map.putString("dataPath", DATA_PATH);
            map.putString("address", address);
            map.putString("socketUrl", socketUrl);

            WritableArray array = Arguments.createArray();
            array.pushNull();
            array.pushMap(map);
            initCallback.invoke(array);

        } catch (Exception e){

        }
    }

    @ReactMethod
    public void call(String command, String body,  Callback callback) {
        try{
            callCallback = callback;

            WritableMap map = Arguments.createMap();
            map.putString("command", command);
            map.putString("body", body);

            WritableArray array = Arguments.createArray();
            array.pushNull();
            array.pushMap(map);
            callCallback.invoke(array);

        } catch (Exception e){

        }
    }
}