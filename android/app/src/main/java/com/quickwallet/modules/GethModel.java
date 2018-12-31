package com.quickwallet.modules;

import android.content.SharedPreferences;
import android.provider.ContactsContract;
import android.text.TextUtils;
import android.util.Log;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.uimanager.IllegalViewOperationException;
import com.quickwallet.utils.SharedPreferencesHelper;

import geth.Account;
import geth.Address;
import geth.BigInt;
import geth.CallMsg;
import geth.Context;
import geth.EthereumClient;
import geth.Geth;
import geth.KeyStore;
import geth.Transaction;

public class GethModel extends ReactContextBaseJavaModule {
    private Account account;
    private KeyStore keyStore;
    private EthereumClient ethClient;
    private final String GETH_INFO  = "geth_info";
    private final String RAWURL  = "rawurl";

    private  String keystoreTemp = "a/b/c";
    private  String keystoreDir = "a/c/d";

    private SharedPreferencesHelper sharedPreferencesHelper = new SharedPreferencesHelper(getReactApplicationContext(),GETH_INFO);

    public GethModel(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "GethModel";
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
    }

    @ReactMethod
    public void isUnlockAccount(
            Callback errorCallback,
            Callback successCallback
    ) {
        if (account == null || keyStore == null || ethClient == null){
            errorCallback.invoke();
        } else {
            successCallback.invoke();
        }
    }

    @ReactMethod
    public void unlockAccount(
            String passphrase,
            Callback errorCallback,
            Callback successCallback
    ) {
        try {
            // 01：删除 keystoreTemp 路径下的文件
            // 02：常数获取
            keyStore = new KeyStore(keystoreTemp, Geth.StandardScryptN,  Geth.StandardScryptN);
            // 03：校验 keystoreDir 文件是否存在
            // 04：文件 ==> data
            byte[] data = null;

            account = keyStore.importKey(data, passphrase, passphrase);
            successCallback.invoke(account.getAddress().getHex());
        } catch (Exception e) {
            errorCallback.invoke(e.getMessage());
        }
    }

    @ReactMethod
    public void randomMnemonic(
            Callback errorCallback,
            Callback successCallback
    ) {
        try {
            String mnemonic = "";
            byte[] privateKeyFromMnemonic = Geth.getPrivateKeyFromMnemonic(mnemonic);
            Log.d("TAG", "new privateKeyFromMnemonic is " + new String(privateKeyFromMnemonic));
            String result = new String(privateKeyFromMnemonic);
            successCallback.invoke(result);
        } catch (Exception e) {
            errorCallback.invoke(e.getMessage());
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
            // 01:清空 keystoreDir 下的文件
            keyStore = new KeyStore(keystoreDir, Geth.StandardScryptN,  Geth.StandardScryptN);
            // 02:私钥转data
            byte[] data = null;
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
            // 01:清空 keystoreDir 下的文件
            keyStore = new KeyStore(keystoreDir, Geth.StandardScryptN,  Geth.StandardScryptN);
            // 02:私钥转data
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
            keyStore = new KeyStore(keystoreTemp, Geth.StandardScryptN,  Geth.StandardScryptN);
            // 01: 校验 keyStore 文件是否存在
            // 02: keyStore 转 data
            byte[] data = null;
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
            Context context = new Context();
            nonce = ethClient.getNonceAt(context, from, number);

            Address to = new Address(toAddress);
            BigInt amount = new BigInt(value);
            long gasLimit = 21000;
            BigInt gasPrice = new BigInt(gas);
            byte[] data = null;
            Transaction transaction = new Transaction(nonce, to, amount, gasLimit, gasPrice, data);

            long chainId = 4;
            BigInt chainID = new BigInt(chainId);
            // android 签名不需要 passphrase
            Transaction signedTx = keyStore.signTx(account, transaction, chainID);

            // 函数无返回值
            ethClient.sendTransaction(context, signedTx);

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
            Context context = new Context();
            nonce = ethClient.getNonceAt(context, from, number);

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
            ethClient.sendTransaction(context, signedTx);

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
            // 01：hash ==> data
            byte[] data = null;
            byte[] hashData = keyStore.signHashPassphrase(account, passphrase, data);
            // data ==> string
            successCallback.invoke(hashData);
        } catch (Exception e) {
            errorCallback.invoke(e.getMessage());
        }
    }

}
































