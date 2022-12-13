var common = require('./工具方法.js');

module.exports = {
    run() {
        main();
    }
}
function main() {
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