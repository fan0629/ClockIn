var common = require('./工具方法.js');
var speed = 1;
var name = "🇨🇳🏅+1✨"
var accounts = [
    "2147741405",
    "142601",
    "zhangfan",
    "3357049050",
    "m1843586022",
    "5286"
]
var storage = storages.create("com.fan.能量雨"); //获取本地存储
var nowDate = new Date().toLocaleDateString(); //获取当日日期
var set = []; //记录成功操作
let unlocker = require('../lib/Unlock.js')
let singletonRequire = require('../lib/SingletonRequirer.js')(runtime, this)
let commonFunctions = singletonRequire('CommonFunction')

main();

function main() {
    commonFunctions.killDuplicateScript()
    unlocker.exec()

    commonFunctions.requestScreenCaptureOrRestart()
    commonFunctions.ensureDeviceSizeValid()

    set = storage.get(nowDate, set);
    toastLog(set)
    if (!requestScreenCapture()) {
        toastLog("请求截图失败,脚本退出");
        exit();
    }
    threads.start(function () {
        setTimeout(function () {
                toastLog("脚本超时退出");
                exit();
            },
            900000 / speed);
    });
    threads.start(function () {
        setInterval(function () {
            if (id("com.alipay.mobile.accountauthbiz:id/update_cancel_tv").findOnce()) {
                toastLog("发现升级窗口");
                common.clickUiObject(id("com.alipay.mobile.accountauthbiz:id/update_cancel_tv").findOne())
            }
        }, 4000 / speed)
    })

    if (!isCompletion(name)) {
        common.打开大号支付宝();
        let flag = 进入活动();
        if (flag)
            执行任务(accounts[0]);
        markCompletion(name)
        返回首页()
    }

    common.打开小号支付宝()
    for (let i = 0; i < accounts.length - 1; i++) {
        if (!isCompletion(accounts[i])) {
            common.otherAlipay(accounts[i].substring(0, 3) + "***@");
            浇水()
            let flag = 进入活动()
            if (flag)
                执行任务(accounts[i + 1])
            markCompletion(accounts[i])
            返回首页()
        }
    }

    common.打开大号支付宝();
    if (!isCompletion("5286")) {
        common.otherAlipay("137******86")
        浇水()
        let flag = 进入活动()
        toastLog(flag)
        if (flag)
            执行任务(name)
        markCompletion("5286")
        返回首页()
    }

    common.otherAlipay("184******27")
    let flag = 进入活动();
    if (flag)
        拯救能量()
    exit();
}

function 执行任务(id) {
    if (text("本场机会由好友\"").findOne(1500)) {
        拯救能量()
    }
    拯救能量()
    if (text("本场机会由好友\"").findOne(1500)) {
        拯救能量()
    }
    common.clickByText("再来一次", 1000);
    sleep(1000)
    common.clickByTextMatches(/查看全部好友>|更多好友/);
    sleep(1500)
    var uiObject = text(id).findOne();
    common.clickUiObject(uiObject.parent().child(uiObject.indexInParent() + 1))
    sleep(1000)
    do {
        back();
        sleep(3000);
        if (text("理财").exists()) {
            进入活动();
            break;
        }
    } while (!text("去拯救").exists());
    common.clickByText("去拯救", 1500)
    拯救能量()
    sleep(1000)
}

function 拯救能量() {
    sleep(1500)
    common.clickByTextMatches(/开始拯救绿色能量|再来一次|立即开启/);
    var startDate = new Date()
    sleep(1500)

    while (true) {
        var img = captureScreen();

        point = findColorEquals(img, 0xcbfe01, 70, 250, 190, 1500);
        if (point) {
            press(point.x, point.y + 15, 1);
        }

        point = findColorEquals(img, 0xcbfe01, 260, 50, 190, 1500);
        if (point) {
            press(point.x, point.y + 15, 1);
        }

        point = findColorEquals(img, 0xcbfe01, 450, 50, 190, 1500);
        if (point) {
            press(point.x, point.y + 15, 1);
        }

        point = findColorEquals(img, 0xcbfe01, 640, 50, 190, 1500);
        if (point) {
            press(point.x, point.y + 15, 1);
        }

        point = findColorEquals(img, 0xcbfe01, 830, 250, 190, 1500);
        if (point) {
            press(point.x, point.y + 15, 1);
        }

        point = findColorEquals(img, 0xcbfe01, 70, 1500, 950, 600);
        if (point) {
            press(point.x, point.y + 15, 1);
        }

        sleep(200)
        if (new Date() - startDate > 16500) {
            break;
        }
    }

    toastLog("拯救结束")
    sleep(1000)
}

function 进入活动() {
    common.clickByText("首页", 2000);
    var uiObject = id("com.alipay.android.phone.openplatform:id/app_text").text("蚂蚁森林").findOne();
    common.clickUiObject(uiObject);
    text("种树").findOne(3000);
    checkCloseBtn()
    sleep(800);
    var img = captureScreen();
    var templ = images.read("../resources/奖励.jpg");
    var p = findImage(img, templ);
    if (p) {
        log("发现任务入口" + p);
        click(p.x + 100, p.y + 10);
    } else {
        log("没找到能量雨入口");
        click(380, 1600);
    }

    let btn = text("领取能量双击卡").findOne(1000);
    if (btn) {
        common.clickUiObject(btn.parent().findOne(text("立即领取")))
    }
    common.clickByText("领取", 1000)
    return common.clickByText("去拯救", 2000);
}

function 返回首页() {
    do {
        back();
        sleep(1000);
    } while (!text("理财").exists());
}

function checkCloseBtn() {
    sleep(1000);
    if (className("Button").text("关闭").exists()) {
        toastLog("发现关闭按钮");
        className("Button").text("关闭").findOne().click();
    }
    if (id("com.alipay.mobile.blessingcard:id/cr_close").exists()) {
        toastLog("发现关闭控件");
        sleep(1500);
        className("ImageView").desc("关闭").findOne().click();
    }
}

function 浇水() {
    sleep(1000);
    common.clickByText("首页", 2000);
    sleep(1000);
    var uiObject = id("com.alipay.android.phone.openplatform:id/app_text").text("蚂蚁森林").findOne();
    common.clickUiObject(uiObject);
    //text("种树").findOne();
    sleep(3000);
    checkH5TvTitle();
    checkH5TvTitle();
    // 橙色能量
    click(360, 530)

    let names = ["思绪万千", "小长安"];
    for (let i = 0; i < 2; i++) {
        sleep(800)
        swipe(500, 1800, 500, 500, 1000);
        common.clickByText(names[i]);
        text(names[i] + "的蚂蚁森林").findOne();
        sleep(1000)
        点击浇水按钮()
        common.clickByText("66克", 1000);
        while (text("浇水送祝福").exists()) {
            common.clickByText("浇水送祝福", 1000);
            sleep(500);
        }
        back();
    }
    common.clickByText(name);
    for (let i = 0; i < 3; i++) {
        text(name + "的蚂蚁森林").findOne();
        sleep(1000)
        点击浇水按钮()
        common.clickByText("66克", 1000);
        while (text("浇水送祝福").exists()) {
            common.clickByText("浇水送祝福", 1000);
            sleep(500);
        }
    }
    送道具()
    返回首页();
}

function 点击浇水按钮() {
    var img = captureScreen();
    var templ = images.read("../resources/浇水.jpg");
    var p = findImage(img, templ);
    if (p) {
        log("发现浇水按钮" + p);
        click(p.x + 100, p.y + 10);
    } else {
        log("没找到浇水按钮");
    }
}

function 送道具() {
    for (let i = 0; i < 3; i++) {
        var img = captureScreen();
        var templ = images.read("../resources/送道具.jpg");
        var p = findImage(img, templ);
        if (p) {
            log("发现送道具按钮" + p);
            click(p.x + 100, p.y + 10);
        } else {
            log("没找到送道具按钮");
        }
        if (textMatches("/能量双击卡|保护罩|时光加速器/").findOne(2000)) {
            common.clickUiObject(textMatches("/能量双击卡|保护罩|时光加速器/").findOne().parent().findOne(text("赠送")));
            common.clickUiObject(text("确认赠送该道具?").findOne().parent().findOne(text("赠送")));
            sleep(1000)
        } else {
            break;
        }
    }
}

function checkH5TvTitle() {
    toastLog("检查H5页面title")
    var h5_tv_title = id("com.alipay.mobile.nebula:id/h5_tv_title").findOne(3000);
    if (h5_tv_title == null || h5_tv_title.text() != "蚂蚁森林") {
        toastLog(h5_tv_title);
        back();
        sleep(1000);
    }
}

function isCompletion(id) {
    return set.indexOf(id) != -1
}

function markCompletion(id) {
    set.push(id)
    storage.clear()
    storage.put(nowDate, set)
}


//
//
//