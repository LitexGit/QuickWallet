
function executeOnceInLifetime() {
    // App首次安装  //01：启动 --> 查询设备信息 --> 未注册 --> 首次安装 02：本地文件存储
}
function executeOncePerVersion (){
    // App每次版本迭代时 DeviceInfo.getVersion
}

function executeOnceDaily (){
    // 每天刷新任务 Moment
}

function executeOncePerLaunch() {
    //冷启动重置
}

function executeOncePerSession(){
    // 每次app唤醒刷新任务
}

export default {
    executeOnceInLifetime,
    executeOncePerVersion,
    executeOnceDaily,
    executeOncePerSession,
    executeOncePerLaunch,
};
