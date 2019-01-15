package com.quickwallet.modules.layer2;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;


public class Layer2Module extends ReactContextBaseJavaModule {
    private final String SOCKET_URL  = "socketUrl";



    private Callback startSessionCallback;
    private Callback onNewMsgCallback;
    private Callback sendMsgCallback;
    private Callback eventsCallback;


    public Layer2Module(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "Layer2Module";
    }

    @ReactMethod
    public void initL2SDK(String cpKey, String address, String socketUrl, Promise promise) {
        try{

            WritableMap map = Arguments.createMap();
            map.putBoolean("isInit", true);
            promise.resolve(map);

        } catch (Exception e){
            promise.reject("-3001",e.getMessage());
        }
    }

    @ReactMethod
    public void onWatchEvents(Callback callback) {
        try {
            eventsCallback = callback;

            WritableArray array = Arguments.createArray();
            array.pushString("001");
            array.pushString("002");
            array.pushString("003");
            eventsCallback.invoke(array);
        } catch (Exception e) {
            WritableArray array = Arguments.createArray();
            array.pushString(e.getMessage());
        }
    }


    @ReactMethod
    public void addPN(String pnAddresss, Promise promise) {
        try{

            WritableMap map = Arguments.createMap();
            map.putBoolean("isAddPN", true);
            promise.resolve(map);

        } catch (Exception e){
            promise.reject("-3001",e.getMessage());
        }
    }

    // Android fun 重名
    @ReactMethod
    public void deposit(String pnAddresss, String amount, Promise promise) {
        try{

            WritableMap map = Arguments.createMap();
            map.putBoolean("isDeposit", true);
            promise.resolve(map);

        } catch (Exception e){
            promise.reject("-3001",e.getMessage());
        }
    }

    @ReactMethod
    public void withdraw(String pnAddresss, String amount, Promise promise) {
        try{

            WritableMap map = Arguments.createMap();
            map.putBoolean("isWithdraw", true);
            promise.resolve(map);

        } catch (Exception e){
            promise.reject("-3001",e.getMessage());
        }
    }

    @ReactMethod
    public void forceLeavePN(String pnAddresss, Promise promise) {
        try{

            WritableMap map = Arguments.createMap();
            map.putBoolean("isForceLeavePN", true);
            promise.resolve(map);

        } catch (Exception e){
            promise.reject("-3001",e.getMessage());
        }
    }

    @ReactMethod
    public void startSession(Callback callback) {
        try{
            startSessionCallback = callback;

            WritableArray array = Arguments.createArray();
            array.pushString("001");
            array.pushString("002");
            array.pushString("003");
            startSessionCallback.invoke(array);
        } catch (Exception e){

        }
    }

    @ReactMethod
    public void onNewMsg(Callback callback) {
        try{
            onNewMsgCallback = callback;
        } catch (Exception e){

        }
    }


    @ReactMethod
    public void sendMsg(String msg, String pnAddresss, String amount, Callback callback) {
        try{
            sendMsgCallback = callback;
        } catch (Exception e){

        }
    }

    @ReactMethod
    public void endSession(Promise promise) {

    }

    @ReactMethod
    public void queryUserInfo( String pnAddresss, Promise promise ) {
        try{

            WritableMap userInfo = Arguments.createMap();
            userInfo.putString("userAddress","0x0d0707963952f2fba59dd06f2b425ace40b492fe");
            userInfo.putString("balance","1000");
            WritableMap map = Arguments.createMap();
            map.putMap("userInfo",userInfo);
            promise.resolve(map);
        } catch (Exception e){
            promise.reject("-3001",e.getMessage());
        }
    }

    @ReactMethod
    public void queryTransaction( String pnAddresss, Promise promise ) {
        try{
            WritableMap transaction = Arguments.createMap();
            transaction.putInt("id",1);
            transaction.putString("from","0x0d0707963952f2fba59dd06f2b425ace40b492fe");
            transaction.putString("to","0xf68b24279c7fdee7cb48f07f8cd088373d49a195");
            transaction.putString("additionalHash","0xf8417f84702fcf8ed0a0a33ece2e78c2f6598799d056f16571bf03ad48d52321");
            transaction.putString("nonce","1");
            transaction.putString("amount","20000");

            WritableArray array = Arguments.createArray();
            array.pushMap(transaction);

            promise.resolve(array);

        } catch (Exception e){
            promise.reject("-3001",e.getMessage());
        }


    }

    @ReactMethod
    public void queryPN( Promise promise ) {
        try{
            WritableMap pn = Arguments.createMap();
            pn.putString("pnAddress", "0x833f4fc95ebdb9a9628afb8475d797f2b2df6a486a6cfb3b7a0ac525db972678");
            pn.putString("tokenAddress","");
            pn.putInt("decimal",18);
            pn.putString("cpAddress","0x6cc5f688a315f3dc28a7781717a9a798a59fda7b");
            pn.putString("cpDeposit", "10000");
            pn.putString("cpPoolBalance","10003");
            pn.putString("userBalance","97");

            WritableArray array = Arguments.createArray();
            array.pushMap(pn);

            promise.resolve(array);
        } catch (Exception e){
            promise.reject("-3001",e.getMessage());
        }
    }
}
















