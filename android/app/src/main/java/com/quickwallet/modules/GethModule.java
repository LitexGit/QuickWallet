package com.quickwallet.modules;

import android.net.Uri;
import android.text.TextUtils;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
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
import geth.Hash;
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

    private final long SCRYPT_N = 1024;
    private final long SCRYPT_P = 1;

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
        String keyTemp = getReactApplicationContext().getFilesDir().getAbsolutePath() + "/keyStoreTemp";
        FileUtil.deleteDirectory(keyTemp);
        String keydir = getReactApplicationContext().getFilesDir().getAbsolutePath() + "/keyStore";
        FileUtil.deleteDirectory(keydir);
    }

    @ReactMethod
    public void isUnlockAccount(Promise promise) {
        if (account == null || keyStore == null || ethClient == null){
            WritableMap map = Arguments.createMap();
            map.putBoolean("isUnlock",false);
            promise.resolve(map);
        } else {
            WritableMap map = Arguments.createMap();
            map.putBoolean("isUnlock",true);
            promise.resolve(map);
        }
    }

    @ReactMethod
    public void unlockAccount( String passphrase, Promise promise ) {
        try {
            String rawurl = String.valueOf(sharedPreferencesHelper.getSharedPreference(RAWURL, ""));
            ethClient = new EthereumClient(rawurl);

            String tempDir = getReactApplicationContext().getFilesDir().getAbsolutePath() + "/keyStoreTemp";
            FileUtil.createDir(tempDir);
            keyStore = new KeyStore(tempDir, SCRYPT_N,  SCRYPT_P);

            String keydir = String.valueOf(sharedPreferencesHelper.getSharedPreference(KEY_DIR, ""));
            boolean isExists =  FileUtil.isFileExists(keydir);
            if (!isExists){
                Exception err = new Exception();
                promise.reject("-1001",err);
                return;
            }

            File keyFile = FileUtil.getFile(keydir);
            byte[] data = ByteUtil.getFileToByte(keyFile);

            account = keyStore.importKey(data, passphrase, passphrase);
            String address = account.getAddress().getHex();

            WritableMap map = Arguments.createMap();
            map.putString("address",address);
            promise.resolve(map);

        } catch (Exception e) {
            promise.reject("-1002",e);
        }
    }

    @ReactMethod
    public void randomMnemonic(Promise promise) {
        try {
            String mnemonic = Geth.createRandomMnemonic();
            WritableMap map = Arguments.createMap();
            map.putString("mnemonic",mnemonic);
            promise.resolve(map);
        } catch (Exception e) {
            promise.reject("-1003",e);
        }
    }



    @ReactMethod
    public void importPrivateKey( String privateKey, String passphrase, Promise promise ) {
        try {
            String rawurl = String.valueOf(sharedPreferencesHelper.getSharedPreference(RAWURL, ""));
            ethClient = new EthereumClient(rawurl);

            String filesDir = getReactApplicationContext().getFilesDir().getAbsolutePath() + "/keyStore";
            FileUtil.deleteDirectory(filesDir);
            FileUtil.createDir(filesDir);

            keyStore = new KeyStore(filesDir, SCRYPT_N,  SCRYPT_P);
            byte[] data = hexStringToByteArray(privateKey);
            account = keyStore.importECDSAKey(data, passphrase);
            saveKeystorePath(account);
            String address = account.getAddress().getHex();
            WritableMap map = Arguments.createMap();
            map.putString("address",address);
            promise.resolve(map);
        } catch (Exception e) {
            promise.reject("-1004",e);
        }
    }

    @ReactMethod
    public void importMnemonic( String mnemonic, String passphrase, Promise promise ) {
        try {
            String rawurl = String.valueOf(sharedPreferencesHelper.getSharedPreference(RAWURL, ""));
            ethClient = new EthereumClient(rawurl);

            String filesDir = getReactApplicationContext().getFilesDir().getAbsolutePath() + "/keyStore";
            FileUtil.deleteDirectory(filesDir);
            FileUtil.createDir(filesDir);

            keyStore = new KeyStore(filesDir, SCRYPT_N,  SCRYPT_P);
            byte[] privateKeyFromMnemonic = Geth.getPrivateKeyFromMnemonic(mnemonic);

            account = keyStore.importECDSAKey(privateKeyFromMnemonic, passphrase);
            saveKeystorePath(account);
            String address = account.getAddress().getHex();
            WritableMap map = Arguments.createMap();
            map.putString("address",address);
            promise.resolve(map);

        } catch (Exception e) {
            promise.reject("-1005",e);
        }
    }

    @ReactMethod
    public void exportPrivateKey( String passphrase, Promise promise ) {
        try {
            String tempDir = getReactApplicationContext().getFilesDir().getAbsolutePath() + "/keyStoreTemp";
            FileUtil.createDir(tempDir);
            keyStore = new KeyStore(tempDir, SCRYPT_N,  SCRYPT_P);

            String keydir = String.valueOf(sharedPreferencesHelper.getSharedPreference(KEY_DIR, ""));
            boolean isExists =  FileUtil.isFileExists(keydir);
            if (!isExists){
                Exception err = new Exception();
                promise.reject("-1001",err);
                return;
            }
            File keyFile = FileUtil.getFile(keydir);
            byte[] data = ByteUtil.getFileToByte(keyFile);

            account = keyStore.importKey(data, passphrase, passphrase);
            String privateKey = keyStore.exportECSDAKeyHex(account, passphrase);

            WritableMap map = Arguments.createMap();
            map.putString("privateKey",privateKey);
            promise.resolve(map);

        } catch (Exception e) {
            promise.reject("-1006",e.getMessage());
        }
    }

    @ReactMethod
    public void transferEth(
            String passphrase,
            String fromAddress,
            String toAddress,
            Integer value,
            Integer gas,
            Promise promise
    ) {
        try {
            if (account == null || keyStore == null || ethClient == null){
                // Wallet not unlocked
                Exception err = new Exception();
                promise.reject("-1007",err);
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
            Transaction signedTx = keyStore.signTxPassphrase(account, passphrase,  transaction, chainID);

            ethClient.sendTransaction(Geth.newContext(), signedTx);

            String txHash = signedTx.getHash().getHex();
            WritableMap map = Arguments.createMap();
            map.putString("txHash",txHash);
            promise.resolve(map);
        } catch (Exception e) {
            promise.reject("-1008",e);
        }
    }

    @ReactMethod
    public void transferTokens(
            String passphrase,
            String fromAddress,
            String toAddress,
            String tokenAddress,
            Integer value,
            Integer gas,
            Promise promise
    ) {
        try {
            if (account == null || keyStore == null || ethClient == null){
                // Wallet not unlocked
                Exception err = new Exception();
                promise.reject("-1007",err);
                return;
            }
            Address from = new Address(fromAddress);
            long number = -1;
            long nonce = 0;
            nonce = ethClient.getNonceAt(Geth.newContext(), from, number);

            Address to = new Address(tokenAddress);
            BigInt amount = new BigInt(0);
            BigInt gasPrice = new BigInt(gas.longValue());

            // 构建 tokendata
            CallMsg callMsg = new CallMsg();
            BigInt datAmount = new BigInt(value.longValue());
            Address dataAddress = new Address(toAddress);

            callMsg.setFrom(from);
            callMsg.setGas(gas.longValue());
            callMsg.setTo(dataAddress);
            callMsg.setValue(datAmount);

            byte[] tokenData = Geth.generateERC20TransferData(dataAddress, datAmount);
            callMsg.setData(tokenData);

            long gasLimit = 21000;
            gasLimit = ethClient.estimateGas(Geth.newContext(), callMsg);
            gasLimit *= 2;

            Transaction transaction = new Transaction(nonce, to, amount, gasLimit, gasPrice, tokenData);

            long chainId = 4;
            BigInt chainID = new BigInt(chainId);
            Transaction signedTx = keyStore.signTxPassphrase(account, passphrase, transaction, chainID);

            ethClient.sendTransaction(Geth.newContext(), signedTx);

            String txHash = signedTx.getHash().getHex();
            WritableMap map = Arguments.createMap();
            map.putString("txHash",txHash);
            promise.resolve(map);
        } catch (Exception e) {
            promise.reject("-1009",e.getMessage());
        }
    }

    @ReactMethod
    public void sign(
            String passphrase,
            ReadableMap signInfo,
            Promise promise
    ) {
        try {
            if (account == null || keyStore == null || ethClient == null){
                Exception err = new Exception();
                promise.reject("-1007",err);
                return;
            }

            String fromAddress = signInfo.getString("fromAddress");
            Address from = new Address(fromAddress);

            String toAddress = signInfo.getString("toAddress");
            Address to = new Address(toAddress);

            long value  = Long.parseLong(signInfo.getString("amount"));
            BigInt amount = new BigInt(value);

            long gas  = Long.parseLong(signInfo.getString("gas"));
            BigInt gasPrice = new BigInt(gas);

            long number = -1;
            long nonce = ethClient.getNonceAt(Geth.newContext(), from, number);

            int type = signInfo.getInt("type");

            switch (type){
                case 1:{
                    Transaction transaction = null;
                    String symbol = signInfo.getString("symbol");

                    if (symbol.equals("ETH")){
                        transaction = getETHTx(from, to, nonce, amount, gasPrice);
                    } else {
                        String contractAddress = signInfo.getString("tokenAddress");
                        Address tokenAddress = new Address(contractAddress);
                        transaction = getTokenTx(tokenAddress, from, to, nonce, amount, gasPrice);
                    }

                    long chainId = 4;
                    BigInt chainID = new BigInt(chainId);
                    Transaction signedTx = keyStore.signTxPassphrase(account, passphrase, transaction, chainID);

                    ethClient.sendTransaction(Geth.newContext(), signedTx);

                    String txHash = signedTx.getHash().getHex();
                    WritableMap map = Arguments.createMap();
                    map.putString("txHash",txHash);
                    promise.resolve(map);
                    return;
                }
                case 2:{
                    String msgInfo = signInfo.getString("msgInfo");
                    CallMsg callMsg = getCallMsg(from, to, gasPrice, msgInfo);

                    // callMsg ==> unSignSata

                    byte[] unSignSata = null;
                    byte[] signData = keyStore.signHashPassphrase(account, passphrase, unSignSata);
                    String msgHash = Geth.newHashFromBytes(signData).getHex();

                    WritableMap map = Arguments.createMap();
                    map.putString("msgHash",msgHash);
                    promise.resolve(map);
                    return;
                }
                default:

                    break;
            }
        } catch (Exception e) {
            promise.reject("-1009",e.getMessage());
        }
    }

    public static CallMsg getCallMsg(
            Address from,
            Address to,
            BigInt gasPrice,
            String msgInfo
    ) {
        CallMsg callMsg = new CallMsg();
        callMsg.setFrom(from);
        callMsg.setTo(to);
        callMsg.setGasPrice(gasPrice);

        byte[] data = hexStringToByteArray(msgInfo);
        callMsg.setData(data);

        return callMsg;
    }

    public static Transaction getETHTx(
            Address from,
            Address to,
            long nonce,
            BigInt amount,
            BigInt gasPrice
    ) {

        try {
            long gasLimit = 21000;
            byte[] data = null;
            Transaction transaction = new Transaction(nonce, to, amount, gasLimit, gasPrice, data);
            return transaction;
        } catch (Exception e){
            Log.d("TAG", "getETHTx: "+ e);
            return null;
        }
    }

    public static Transaction getTokenTx(
            Address tokenAddress,
            Address from,
            Address to,
            long nonce,
            BigInt amount,
            BigInt gasPrice
    ) {
        try {
            BigInt tokenAmount = new BigInt(0);
            byte[] data = Geth.generateERC20TransferData(to, amount);

            long gasLimit = 21000;
            Transaction transaction = new Transaction(nonce, tokenAddress, tokenAmount, gasLimit, gasPrice, data);
            return  transaction;
        } catch (Exception e){
            Log.d("getTokenTx", "getTokenTx: "+e);
            return null;
        }

    }


    public void saveKeystorePath(Account account){
        String url = account.getURL();
        String keydir = Uri.parse(url).getPath();
        sharedPreferencesHelper.put(KEY_DIR, keydir);
    }

    public static byte[] hexStringToByteArray(String s) {
        int len = s.length();
        byte[] data = new byte[len / 2];
        for (int i = 0; i < len; i += 2) {
            data[i / 2] = (byte) ((Character.digit(s.charAt(i), 16) << 4)
                    + Character.digit(s.charAt(i+1), 16));
        }
        return data;
    }


}
