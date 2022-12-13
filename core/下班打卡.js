var common = require('./工具方法.js');

module.exports = {
    run() {
        main();
    }
}
function main() {
    floatyLog("开始下班打卡")
    sleep(1500);
    launchApp("天融信云服务");
    sleep(1500);
    common.clickByText("考勤打卡");
    while (!textMatches(/下班打卡.*|更新打卡.*/).findOne(4000)) {
        back();
        sleep(1500);
        common.clickByText("考勤打卡");
    }
    common.clickByTextMatches(/下班打卡.*|更新打卡.*/);
}

function floatyLog(str) {
    log(str)
    context += "\n" + str;
    floatyInstance.setFloatyInfo({ x: parseInt(config.device_width / 3.7), y: parseInt(config.device_height / 3) }, context, { textSize: 15 })
}