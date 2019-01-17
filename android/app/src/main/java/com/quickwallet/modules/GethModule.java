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

import org.web3j.utils.Numeric;

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
    private final String CONTACT_IP_KEY = "contact_ip_key";
    private final String CHAIN_ID_KEY = "chain_id_key";
    private final String KEY_DIR = "key_dir";

    private final long SCRYPT_N = Geth.StandardScryptN; // 1024
    private final long SCRYPT_P = Geth.StandardScryptP; // 1

    private SharedPreferencesHelper sharedPreferencesHelper = new SharedPreferencesHelper(getReactApplicationContext(),GETH_INFO);


    public GethModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "GethModule";
    }

    @ReactMethod
    public void init( boolean isLogin, String contactIp, String chainId ) {
        try {
            sharedPreferencesHelper.put(CONTACT_IP_KEY, contactIp);
            sharedPreferencesHelper.put(CHAIN_ID_KEY, chainId);

            if (!isLogin) return;
            if (TextUtils.isEmpty(contactIp) || contactIp.length() == 0) return;
            if (account == null || keyStore == null) return;
            ethClient = getGethEthClient();
        } catch (Exception e) {
            Log.d("err", e.getMessage());
        }
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
    public void newWallet(String passphrase, Promise promise) {

        WritableMap map = Arguments.createMap();
        map.putString("mnemonic","mnemonic");
        map.putString("address","address");
        promise.resolve(map);
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
            if (ethClient == null){
                ethClient = getGethEthClient();
            }
            if (account == null){
                account = getGethAccount(passphrase);
            }
            if (keyStore == null){
                keyStore = getGethKeyStore(passphrase);
            }
            if (account == null ||keyStore == null ){
                Exception err = new Exception();
                promise.reject("-1001",err);
                return;
            }

            keyStore.unlock(account, passphrase);
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
            if (ethClient == null){
                ethClient = getGethEthClient();
            }

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
            if (ethClient == null){
                ethClient = getGethEthClient();
            }

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
            if (account == null){
                account = getGethAccount(passphrase);
            }
            if (keyStore == null){
                keyStore = getGethKeyStore(passphrase);
            }
            if (account == null ||keyStore == null ){
                Exception err = new Exception();
                promise.reject("-1001",err);
                return;
            }

            keyStore.unlock(account, passphrase);

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
            String value,
            String gas,
            Promise promise
    ) {
        try {
            if (ethClient == null){
                ethClient = getGethEthClient();
            }
            if (account == null){
                account = getGethAccount(passphrase);
            }
            if (keyStore == null){
                keyStore = getGethKeyStore(passphrase);
            }
            if (account == null ||keyStore == null ){
                Exception err = new Exception();
                promise.reject("-1001",err);
                return;
            }

            keyStore.unlock(account, passphrase);

            Address from = new Address(fromAddress);
            long number = -1;
            long nonce = 0;
            nonce = ethClient.getNonceAt(Geth.newContext(), from, number);

            Address to = new Address(toAddress);
            BigInt amount = new BigInt(Long.parseLong(value));
            long gasLimit = 21000;
            BigInt gasPrice = new BigInt(Long.parseLong(gas));
            byte[] data = null;
            Transaction transaction = new Transaction(nonce, to, amount, gasLimit, gasPrice, data);


            long chainId = Long.parseLong(String.valueOf(sharedPreferencesHelper.getSharedPreference(CHAIN_ID_KEY, "4")));
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
            String value,
            String gas,
            Promise promise
    ) {
        try {
            if (ethClient == null){
                ethClient = getGethEthClient();
            }
            if (account == null){
                account = getGethAccount(passphrase);
            }
            if (keyStore == null){
                keyStore = getGethKeyStore(passphrase);
            }
            if (account == null ||keyStore == null ){
                Exception err = new Exception();
                promise.reject("-1001",err);
                return;
            }

            keyStore.unlock(account, passphrase);

            Address from = new Address(fromAddress);
            long number = -1;
            long nonce = 0;
            nonce = ethClient.getNonceAt(Geth.newContext(), from, number);

            Address to = new Address(tokenAddress);
            BigInt amount = new BigInt(0);
            BigInt gasPrice = new BigInt( Long.parseLong(gas));

            // 构建 tokendata
            CallMsg callMsg = new CallMsg();
            BigInt datAmount = new BigInt(Long.parseLong(value));
            Address dataAddress = new Address(toAddress);

            callMsg.setFrom(from);
            callMsg.setGas(Long.parseLong(gas));
            callMsg.setTo(dataAddress);
            callMsg.setValue(datAmount);

            byte[] tokenData = Geth.generateERC20TransferData(dataAddress, datAmount);
            callMsg.setData(tokenData);

            long gasLimit = 21000;
            gasLimit = ethClient.estimateGas(Geth.newContext(), callMsg);
            gasLimit *= 2;

            Transaction transaction = new Transaction(nonce, to, amount, gasLimit, gasPrice, tokenData);

            long chainId = Long.parseLong(String.valueOf(sharedPreferencesHelper.getSharedPreference(CHAIN_ID_KEY, "4")));
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
    public void signMessage(
            String from,
            String message,
            Promise promise
    ) {
        try {
            if (account == null || keyStore == null){
                Exception err = new Exception();
                promise.reject("-1007",err);
                return;
            }

            byte[] unSignHash = org.web3j.crypto.Hash.sha3(message.getBytes());
            Address address = new Address(from);
            byte[] signByte =  keyStore.signHash(address, unSignHash);

//            keyStore.signHashPassphrase(account, passphrase, unSignHash);
            String data = Numeric.toHexString(signByte);

            WritableMap map = Arguments.createMap();
            map.putString("data",data);
            promise.resolve(map);
        } catch (Exception e) {
            promise.reject("-1003",e);
        }
    }

    @ReactMethod
    public void signTransaction(
            String passphrase,
            ReadableMap signInfo,
            Promise promise
    ) {
        try {
            if (ethClient == null){
                ethClient = getGethEthClient();
            }
            if (account == null){
                account = getGethAccount(passphrase);
            }
            if (keyStore == null){
                keyStore = getGethKeyStore(passphrase);
            }
            if (account == null ||keyStore == null ){
                Exception err = new Exception();
                promise.reject("-1001",err);
                return;
            }

            keyStore.unlock(account, passphrase);

            String fromAddress = signInfo.getString("from");
            Address from = new Address(fromAddress);

            String toAddress = signInfo.getString("to");
            Address to = new Address(toAddress);

            long value  = Long.parseLong(signInfo.getString("value"));
            BigInt amount = new BigInt(value);

            long gas  = Long.parseLong(signInfo.getString("gasPrice"));
            BigInt gasPrice = new BigInt(gas);

            long gasLimit  = Long.parseLong(signInfo.getString("gas"));

            long number = -1;
            long nonce = ethClient.getNonceAt(Geth.newContext(), from, number);

            byte [] data = signInfo.getString("data").getBytes();

            Transaction transaction = new Transaction(nonce, to, amount, gasLimit, gasPrice, data);

            long chainId = Long.parseLong(String.valueOf(sharedPreferencesHelper.getSharedPreference(CHAIN_ID_KEY, "4")));
            BigInt chainID = new BigInt(chainId);
            Transaction signedTx = keyStore.signTxPassphrase(account, passphrase, transaction, chainID);

            ethClient.sendTransaction(Geth.newContext(), signedTx);

            String txHash = signedTx.getHash().getHex();
            WritableMap map = Arguments.createMap();
            map.putString("data",txHash);
            promise.resolve(map);

        } catch (Exception e) {
            promise.reject("-1003",e);
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

    public EthereumClient getGethEthClient(){
        String contactIp = String.valueOf(sharedPreferencesHelper.getSharedPreference(CONTACT_IP_KEY, ""));
        ethClient = new EthereumClient(contactIp);
        return ethClient;
    }

    public KeyStore getGethKeyStore(String passphrase){

        try {
            String tempDir = getReactApplicationContext().getFilesDir().getAbsolutePath() + "/keyStoreTemp";
            FileUtil.createDir(tempDir);
            keyStore = new KeyStore(tempDir, SCRYPT_N,  SCRYPT_P);


            String keydir = String.valueOf(sharedPreferencesHelper.getSharedPreference(KEY_DIR, ""));
            boolean isExists =  FileUtil.isFileExists(keydir);
            if (!isExists){
                return null;
            }

            File keyFile = FileUtil.getFile(keydir);
            byte[] data = ByteUtil.getFileToByte(keyFile);

            keyStore.importKey(data, passphrase, passphrase);
            return keyStore;

        } catch (Exception e){
            return null;
        }
    }

    public Account getGethAccount(String passphrase){
        try {
            KeyStore keyStore = getGethKeyStore(passphrase);
            if (keyStore == null){
                return null;
            }
            String keydir = String.valueOf(sharedPreferencesHelper.getSharedPreference(KEY_DIR, ""));
            boolean isExists =  FileUtil.isFileExists(keydir);
            if (!isExists){
                return null;
            }

            File keyFile = FileUtil.getFile(keydir);
            byte[] data = ByteUtil.getFileToByte(keyFile);

            account = keyStore.importKey(data, passphrase, passphrase);
            return account;

        } catch (Exception e){
            return null;
        }
    }


}
