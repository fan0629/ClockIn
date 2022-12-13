var common = {
    clickUiObject: (uiObject, clickable) => {
        if (uiObject == null) {
            return false;
        }
        if (clickable == null) {
            clickable = true
        }
        if (clickable && uiObject.clickable()) {
            log("点击 " + (uiObject.text() === "" ? uiObject.desc() : uiObject.text()) + " 控件");
            return uiObject.click();
        }

        let childrenUi = uiObject.children()
        for (let child of childrenUi) {
            if (child.clickable()) {
                log("点击 " + (uiObject.text() === "" ? uiObject.desc() : uiObject.text()) + " 子控件");
                return child.click();
            }
        }

        var uiObjectParent = uiObject.parent();
        while (uiObjectParent) {
            if (uiObjectParent.clickable()) {
                log("点击 " + (uiObject.text() === "" ? uiObject.desc() : uiObject.text()) + " 父控件");
                return uiObjectParent.click();
            }
            uiObjectParent = uiObjectParent.parent();
        }

        sleep(1000);
        let b = uiObject.bounds();
        log("点击 " + (uiObject.text() === "" ? uiObject.desc() : uiObject.text()) + " 坐标");
        return click(b.centerX(), b.centerY());
    },
    clickByText: (text, timeout, clickable) => {
        if (clickable == null) {
            clickable = true
        }
        if (timeout) {
            let uiObject = this.text(text).findOne(timeout);
            return common.clickUiObject(uiObject, clickable);
        }
        let uiObject = this.text(text).findOne();
        return common.clickUiObject(uiObject, clickable);
    },
    clickByTextContains: (text, timeout) => {
        if (timeout) {
            let uiObject = this.textContains(text).findOne(timeout);
            return common.clickUiObject(uiObject);
        }
        let uiObject = this.textContains(text).findOne();
        return common.clickUiObject(uiObject);
    },
    clickByTextStartsWith: (text, timeout) => {
        if (timeout) {
            let uiObject = this.textStartsWith(text).findOne(timeout);
            return common.clickUiObject(uiObject);
        }
        let uiObject = this.textStartsWith(text).findOne();
        return common.clickUiObject(uiObject);
    },
    clickByTextEndsWith: (text, timeout) => {
        if (timeout) {
            let uiObject = this.textEndsWith(text).findOne(timeout);
            return common.clickUiObject(uiObject);
        }
        let uiObject = this.textEndsWith(text).findOne();
        return common.clickUiObject(uiObject);
    },
    clickByTextMatches: (reg, timeout, clickable) => {
        if (clickable == null) {
            clickable = true
        }
        if (timeout) {
            let uiObject = this.textMatches(reg).findOne(timeout);
            return common.clickUiObject(uiObject, clickable);
        }
        let uiObject = this.textMatches(reg).findOne();
        return common.clickUiObject(uiObject, clickable);
    },
    clickByDesc: (desc, timeout) => {
        if (timeout) {
            let uiObject = this.desc(desc).findOne(timeout);
            return common.clickUiObject(uiObject);
        }
        let uiObject = this.desc(desc).findOne();
        return common.clickUiObject(uiObject);
    },
    clickByDescContains: (desc, timeout) => {
        if (timeout) {
            let uiObject = this.descContains(desc).findOne(timeout);
            return common.clickUiObject(uiObject);
        }
        let uiObject = this.descContains(desc).findOne();
        return common.clickUiObject(uiObject);
    },
    clickByDescStartsWith: (desc, timeout) => {
        if (timeout) {
            let uiObject = this.descStartsWith(desc).findOne(timeout);
            return common.clickUiObject(uiObject);
        }
        let uiObject = this.descStartsWith(desc).findOne();
        return common.clickUiObject(uiObject);
    },
    clickByDescEndsWith: (desc, timeout) => {
        if (timeout) {
            let uiObject = this.descEndsWith(desc).findOne(timeout);
            return common.clickUiObject(uiObject);
        }
        let uiObject = this.descEndsWith(desc).findOne();
        return common.clickUiObject(uiObject);
    },
    clickByDescMatches: (reg, timeout) => {
        if (timeout) {
            let uiObject = this.descMatches(desc).findOne(timeout);
            return common.clickUiObject(uiObject);
        }
        let uiObject = this.descMatches(reg).findOne();
        return common.clickUiObject(uiObject);
    },
    //屏幕解锁
    unlock: (password) => {
        if (!device.isScreenOn()) {
            //点亮屏幕
            device.wakeUp();
            //由于MIUI的解锁有变速检测，因此要点开时间以进入密码界面
            sleep(1000);
            swipe(800, 0, 800, 800, 800);
            sleep(1000);
            click(220, 330);
            //输入屏幕解锁密码，其他密码请自行修改
            for (var item of password) {
                desc(item).findOne().click();
            }
            sleep(2000);
            back();
            sleep(1000);
            toastLog("解锁成功");
        }
    },

    closeCurrentApp: () => {
        common.killApp(getAppName(currentPackage()))
    },

    otherAlipay: (account) => {
        sleep(1000);
        common.clickByText("我的");
        //common.clickByText("设置");
        //text("支付宝会员").findOne();
        do {
            common.clickUiObject(id("com.alipay.mobile.antui:id/right_container_2").findOne());
            sleep(1000)
        } while (!textMatches(/切换账号|换账号登录|登录其他账号/).exists());
        common.clickByTextMatches(/切换账号|换账号登录|登录其他账号/);
        //text("换个新账号登录").findOne();
        sleep(2500);
        if (account) {
            toastLog(account)
            let accUi = textStartsWith(account).findOne()
            if (accUi.parent().child(0).text() === "当前") {                
                do {
                    back();
                    sleep(1000);
                } while (!text("理财").exists());
            } else {
                common.clickUiObject(accUi);
                sleep(3000);
                common.clickByText("我的");
                let currentAccountName = id("com.alipay.android.phone.wealth.home:id/account").findOne().text();
                if (!currentAccountName.startsWith(account)) {
                    this.otherAlipay(account);
                }
            }
        } else {
            common.clickUiObject(id("com.alipay.mobile.securitybiz:id/tv_am_item_account").findOnce(4));
        }
        sleep(1000);
    },

    打开小号支付宝: () => {
        home();
        sleep(1000);
        home();
        sleep(1000);
        home();
        common.clickUiObject(desc("支付宝").boundsInside(0, 0, 1080, 2340).findOne());
        toastLog("打开小号支付宝");
    },
    打开大号支付宝: () => {
        home();
        sleep(1000);
        home();
        sleep(1000);
        common.clickByDesc("第2屏");
        sleep(1500);
        common.clickUiObject(boundsInside(50, 50, 1000, 2300).text("支付宝").findOne());
        toastLog("打开大号支付宝");
    },
    killApp: (appName) => {
        let packageName = getPackageName(appName);
        app.openAppSetting(packageName);
        text(appName).waitFor();
        let is_sure = textMatches(/(.*强.*|.*停.*|.*结.*)/).findOne();
        if (is_sure.enabled()) {
            common.clickUiObject(textMatches(/(.*强.*|.*停.*|.*结.*)/).findOne());
            common.clickUiObject(textMatches(/(.*确.*|.*定.*)/).findOne());
            log(appName + "应用已被关闭");
            sleep(1000);
            back();
        } else {
            log(appName + "应用不能被正常关闭或不在后台运行");
            back();
        }
    }
};
module.exports = common;