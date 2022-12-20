let common = require('./工具方法.js');
let GPS = require('./定位');
let singletonRequire = require('../lib/SingletonRequirer.js')(runtime, this)
let Timers = singletonRequire("Timers")
let floatyInstance = singletonRequire('FloatyUtil')
let unlocker = require('../lib/Unlock.js')

/**
 * 默认地球半径,赤道半径(单位m)
 */
let EARTH_RADIUS = 6371000;
// 公司经纬度
let companyLongitude = 108.865268;
let companyLatitude = 34.192758;
// 上班通勤距离，单位米
let commutingDistance = 9000
// 上班通勤时间，单位分钟
let commutingTime = 19
// 打卡范围半径，单位米[
let radius = 600
var storage = storages.create("com.fan.打卡"); //获取本地存储
var nowDate = new Date().toLocaleDateString(); //获取当日日期
let context = "";

module.exports = {
    run() {
        main();
        sleep(2000);
        exit();
    }
}

function main() {
    if (!floatyInstance.init()) {
        toast('创建悬浮窗失败')
        exit()
    }
    floatyLog("开始上班打卡")
    let response = http.get("http://tool.bitefu.net/jiari/?d=" + getNowFormatDate());
    let isHoliday = response.body.string()
    log(isHoliday)
    if (isHoliday != "0") {
        floatyLog("今天不是工作日，好好休息吧！")
        return
    }
    if (new Date().getHours() >= 10) {
        floatyLog("已过上班打卡时间！")
        return
    }
    if (storage.get(nowDate)) {
        floatyLog("上班已打卡，脚本退出");
        return
    }
    let location = GPS.getLocation();
    if (!location) {
        Timers.addDisposableTask({
            path: engines.myEngine().source,
            date: Date.now() + 60e3,
        });
        floatyLog("获取gps失败，一分钟后重试！")
        return
    }
    let distance = getDistance(location.getLongitude(), location.getLatitude(), companyLongitude, companyLatitude)
    floatyLog("距离公司" + distance + "米");
    if (distance > radius) {
        let waitMins = (distance - radius) / (commutingDistance / commutingTime)
        Timers.addDisposableTask({
            path: engines.myEngine().source,
            date: Date.now() + waitMins * 60e3,
        });
        floatyLog("下次尝试打卡时间：" + waitMins + "分后");
        return;
    }

    unlocker.exec()
    floatyLog('解锁成功')
    sleep(1500);
    launchApp("天融信云服务");
    sleep(1500);
    common.clickByText("考勤打卡");
    sleep(4000);

    while (textContains("未进入考勤范围").exists() || !textMatches(/上班打卡.*/).exists()) {
        if (text("正常").exists() || textContains("下班打卡").exists()) {
            floatyLog("上班已打卡，脚本退出");
            storage.put(nowDate, true);
            return;
        }
        back();
        sleep(1500);
        common.clickByText("考勤打卡");
        sleep(4000);
    }
    let btn = textMatches(/上班打卡.*|更新打卡.*/).findOne();
    sleep(1500);
    let b = btn.bounds();
    click(b.centerX(), b.centerY());
    storage.put(nowDate, true);

    Timers.addDisposableTask({
        path: files.path('./下班打卡.js'),
        date: Date.now() + 8.55 * 3.6e6,
    });
}


function floatyLog(str) {
    log(str)
    context += context === "" ? str : "\n" + str;
    floatyInstance.setFloatyInfo({ x: parseInt(config.device_width / 4), y: parseInt(config.device_height / 3) }, context, { textSize: 15 })
}

/**
 * 转化为弧度(rad)
 */
function rad(d) {
    return d * Math.PI / 180.0;
}

/**
 * @param lon1 第一点的精度
 * @param lat1 第一点的纬度
 * @param lon2 第二点的精度
 * @param lat2 第二点的纬度
 * @return 返回的距离，单位m
 * */
function getDistance(lon1, lat1, lon2, lat2) {
    let radLat1 = rad(lat1);
    let radLat2 = rad(lat2);
    let a = radLat1 - radLat2;
    let b = rad(lon1) - rad(lon2);
    let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000;
    return s;
}

function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = month < 10 ? "0" + month : month;
    var strDate = date.getDate();
    strDate = strDate < 10 ? "0" + strDate : strDate;
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}