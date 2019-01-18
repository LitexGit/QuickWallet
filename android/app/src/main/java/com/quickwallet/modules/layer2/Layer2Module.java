package com.quickwallet.modules.layer2;

import com.alibaba.fastjson.JSON;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

import sdk.L2;
import sdk.SignHandler;

public class Layer2Module extends ReactContextBaseJavaModule implements SignHandler, sdk.Callback {

    private Callback callCallback;
    private L2 layer2;


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
            layer2 = new L2();
            String dataPath = getReactApplicationContext().getFilesDir().getAbsolutePath() + "/puppet";
            getPuppetDir(dataPath);

            layer2.initL2SDK(cpKey, dataPath, address, socketUrl, this);

            

            WritableMap map = Arguments.createMap();
            map.putString("cpKey", cpKey);
            map.putString("dataPath", dataPath);
            map.putString("address", address);
            map.putString("socketUrl", socketUrl);

            WritableArray array = Arguments.createArray();
            array.pushNull();
            array.pushMap(map);
            callback.invoke(array);

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



    @Override
    public void sendTx(String s, sdk.Callback callback) {
        // SignTx

        String error = "callback-error-msg";
        Map map = new HashMap();
        map.put("isSend",true);
        String json = JSON.toJSONString(map);

        callback.onResult(error, json);
    }

    @Override
    public void signMsg(String s, sdk.Callback callback) {
        // SignMsg

        String error = "callback-error-msg";
        Map map = new HashMap();
        map.put("data","0XBKHSJCKSCBSKCSJACNB");
        String json = JSON.toJSONString(map);

        callback.onResult(error, json);
    }

    @Override
    public void onResult(String s, String s1) {


        WritableArray array = Arguments.createArray();
        array.pushString(s);
        array.pushString(s1);
        callCallback.invoke(array);
    }


    public static boolean getPuppetDir(String dataPath) {
        File file = new File(dataPath);
        if (file.isFile()){
            file.delete();
        }
        if (file.isDirectory()) return true;
        return file.mkdirs();
    }

}