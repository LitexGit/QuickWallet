package com.quickwallet.modules;

import android.net.Uri;
import android.text.TextUtils;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.quickwallet.utils.ByteUtil;
import com.quickwallet.utils.FileUtil;
import com.quickwallet.utils.SharedPreferencesHelper;

import java.io.File;

import geth.Account;
import geth.Address;
import geth.BigInt;
import geth.CallMsg;
import geth.EthereumClient;
import geth.Geth;
import geth.KeyStore;
import geth.Transaction;

public class GethModule extends ReactContextBaseJavaModule {
    private Account account;
    private KeyStore keyStore;
    private EthereumClient ethClient;

    private final String GETH_INFO  = "geth_info";
    private final String RAWURL  = "rawurl";
    private final String KEY_TEMP = "key_temp";
    private final String KEY_DIR = "key_dir";

    private SharedPreferencesHelper sharedPreferencesHelper = new SharedPreferencesHelper(getReactApplicationContext(),GETH_INFO);


    public GethModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "GethModule";
    }

    @ReactMethod
    public void init(boolean isLogin, String rawurl) {

        if (TextUtils.isEmpty(rawurl)){
            sharedPreferencesHelper.put(RAWURL, "");
        } else {
            sharedPreferencesHelper.put(RAWURL, rawurl);
        }

        if (!isLogin) return;
        if (TextUtils.isEmpty(rawurl) || rawurl.length() == 0) return;
        if (account == null || keyStore == null) return;
        ethClient = new EthereumClient(rawurl);
    }

    @ReactMethod
    public void unInit() {
        if (account != null) account = null;
        if (keyStore != null) keyStore = null;
        if (ethClient != null) ethClient = null;
        sharedPreferencesHelper.put(RAWURL, "");
        String keyTemp = String.valueOf(sharedPreferencesHelper.getSharedPreference(KEY_TEMP, ""));
        FileUtil.deleteFile(keyTemp);
        String keydir = String.valueOf(sharedPreferencesHelper.getSharedPreference(KEY_DIR, ""));
        FileUtil.deleteFile(keydir);
    }

    @ReactMethod
    public void isUnlockAccount(Promise promise) {
        if (account == null || keyStore == null || ethClient == null){
            WritableMap map = Arguments.createMap();
            map.putBoolean("result",true);
            promise.resolve(map);
        } else {
            Exception err = new Exception();
            promise.reject("-1001",err);
        }
    }

    @ReactMethod
    public void unlockAccount(
            String passphrase,
            Callback errorCallback,
            Callback successCallback
    ) {
        try {
            String keyTemp = String.valueOf(sharedPreferencesHelper.getSharedPreference(KEY_TEMP, ""));
            boolean result = FileUtil.createDir(keyTemp);
            if (!result){
                errorCallback.invoke("Create a cache file exception");
                return;
            }
            keyStore = new KeyStore(keyTemp, Geth.StandardScryptN,  Geth.StandardScryptN);
            String keydir = String.valueOf(sharedPreferencesHelper.getSharedPreference(KEY_DIR, ""));
            boolean isExists =  FileUtil.isFileExists(keydir);
            if (!isExists){
                errorCallback.invoke("Keystore file does not exist");
                return;
            }
            File keyFile = FileUtil.getFile(keydir);
            byte[] data = ByteUtil.getFileToByte(keyFile);

            account = keyStore.importKey(data, passphrase, passphrase);
            successCallback.invoke(account.getAddress().getHex());

        } catch (Exception e) {
            errorCallback.invoke(e.getMessage());
        }
    }

    @ReactMethod
    public void randomMnemonic(Promise promise) {
        try {
            String mnemonic = Geth.createRandomMnemonic();
            Log.d()
            WritableMap map = Arguments.createMap();
            map.putString("mnemonic",mnemonic);
            promise.resolve(map);
        } catch (Exception e) {
            promise.reject("-1002",e);
        }
    }

    @ReactMethod
    public void importPrivateKey(
            String privateKey,
            String passphrase,
            Callback errorCallback,
            Callback successCallback
    ) {
        try {
            String rawurl = String.valueOf(sharedPreferencesHelper.getSharedPreference(RAWURL, ""));
            ethClient = new EthereumClient(rawurl);
            String keydir = String.valueOf(sharedPreferencesHelper.getSharedPreference(KEY_DIR, ""));
            FileUtil.deleteFile(keydir);
            keyStore = new KeyStore(keydir, Geth.StandardScryptN,  Geth.StandardScryptN);
            byte[] data = privateKey.getBytes();
            account = keyStore.importECDSAKey(data, passphrase);
            successCallback.invoke(account.getAddress().getHex());
        } catch (Exception e) {
            errorCallback.invoke(e.getMessage());
        }
    }

    @ReactMethod
    public void importMnemonic(
            String mnemonic,
            String passphrase,
            Callback errorCallback,
            Callback successCallback
    ) {
        try {
            String rawurl = String.valueOf(sharedPreferencesHelper.getSharedPreference(RAWURL, ""));
            ethClient = new EthereumClient(rawurl);
            String keydir = String.valueOf(sharedPreferencesHelper.getSharedPreference(KEY_DIR, ""));
            FileUtil.deleteFile(keydir);
            keyStore = new KeyStore(KEY_DIR, Geth.StandardScryptN,  Geth.StandardScryptN);
            byte[] privateKeyFromMnemonic = Geth.getPrivateKeyFromMnemonic(mnemonic);
            Log.d("TAG", "new privateKeyFromMnemonic is " + new String(privateKeyFromMnemonic));
            account = keyStore.importECDSAKey(privateKeyFromMnemonic, passphrase);
            successCallback.invoke(account.getAddress().getHex());
        } catch (Exception e) {
            errorCallback.invoke(e.getMessage());
        }
    }

    @ReactMethod
    public void exportPrivateKey(
            String passphrase,
            Callback errorCallback,
            Callback successCallback
    ) {
        try {
            keyStore = new KeyStore(KEY_TEMP, Geth.StandardScryptN,  Geth.StandardScryptN);
            String keydir = String.valueOf(sharedPreferencesHelper.getSharedPreference(KEY_DIR, ""));
            boolean isExists =  FileUtil.isFileExists(keydir);
            if (!isExists){
                errorCallback.invoke("Keystore file does not exist");
                return;
            }
            File keyFile = FileUtil.getFile(keydir);
            byte[] data = ByteUtil.getFileToByte(keyFile);

            account = keyStore.importKey(data, passphrase, passphrase);
            String privateKey = keyStore.exportECSDAKeyHex(account, passphrase);
            Log.d("TAG", "new json" + privateKey  );
            successCallback.invoke(privateKey);
        } catch (Exception e) {
            errorCallback.invoke(e.getMessage());
        }
    }

    @ReactMethod
    public void transferEth(
            String passphrase,
            String fromAddress,
            String toAddress,
            Integer value,
            Integer gas,
            Callback errorCallback,
            Callback successCallback
    ) {
        try {
            if (account == null || keyStore == null || ethClient == null){
                errorCallback.invoke("Wallet not unlocked");
                return;
            }
            Address from = new Address(fromAddress);
            long number = -1;
            long nonce = 0;
            nonce = ethClient.getNonceAt(Geth.newContext(), from, number);

            Address to = new Address(toAddress);
            BigInt amount = new BigInt(value);
            long gasLimit = 21000;
            BigInt gasPrice = new BigInt(gas);
            byte[] data = null;
            Transaction transaction = new Transaction(nonce, to, amount, gasLimit, gasPrice, data);

            long chainId = 4;
            BigInt chainID = new BigInt(chainId);
            Transaction signedTx = keyStore.signTx(account, transaction, chainID);

            // 函数无返回值
            ethClient.sendTransaction(Geth.newContext(), signedTx);

            // 定义函数返回值
            successCallback.invoke();
        } catch (Exception e) {
            errorCallback.invoke(e.getMessage());
        }
    }

    @ReactMethod
    public void transferTokens(
            String passphrase,
            String fromAddress,
            String toAddress,
            String tokenAddress,
            Long value,
            Long gas,
            Callback errorCallback,
            Callback successCallback
    ) {
        try {
            if (account == null || keyStore == null || ethClient == null){
                errorCallback.invoke("Wallet not unlocked");
                return;
            }
            Address from = new Address(fromAddress);
            long number = -1;
            long nonce = 0;
            nonce = ethClient.getNonceAt(Geth.newContext(), from, number);

            Address to = new Address(tokenAddress);
            BigInt amount = new BigInt(0);
            BigInt gasPrice = new BigInt(gas);

            // 构建 tokendata
            CallMsg callMsg = new CallMsg();
            BigInt datAmount = new BigInt(value);
            Address dataAddress = new Address(toAddress);

            callMsg.setFrom(from);
            callMsg.setGas(gas);
            callMsg.setTo(dataAddress);
            callMsg.setValue(datAmount);

            byte[] tokenData = Geth.generateERC20TransferData(dataAddress, datAmount);
            callMsg.setData(tokenData);

            long gasLimit = 21000;

            Transaction transaction = new Transaction(nonce, to, amount, gasLimit, gasPrice, tokenData);

            long chainId = 4;
            BigInt chainID = new BigInt(chainId);
            Transaction signedTx = keyStore.signTx(account, transaction, chainID);

            // 函数无返回值
            ethClient.sendTransaction(Geth.newContext(), signedTx);

            // 定义函数返回值
            successCallback.invoke();
        } catch (Exception e) {
            errorCallback.invoke(e.getMessage());
        }
    }

    @ReactMethod
    public void signHash(
            String passphrase,
            Object hash,
            Callback errorCallback,
            Callback successCallback
    ) {
        try {
            if (account == null || keyStore == null || ethClient == null){
                errorCallback.invoke("Wallet not unlocked");
                return;
            }
            ByteUtil.objectToByte(hash);
            byte[] data = null;
            byte[] hashData = keyStore.signHashPassphrase(account, passphrase, data);
            String hashStr = new String(hashData);
            successCallback.invoke(hashStr);
        } catch (Exception e) {
            errorCallback.invoke(e.getMessage());
        }
    }

    public void saveKeystorePath(Account account){
        String url = account.getURL();
        String keydir = FileUtil.getFilePath(getReactApplicationContext(), Uri.parse(url));
        sharedPreferencesHelper.put(KEY_DIR, keydir);
    }
}
