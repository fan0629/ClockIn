function MainExecutor() {

    this.exec = function () {
        if (new Date().getHours() < 12) {
            require("./上班打卡").run();
        } else {
            require("./下班打卡").run();
        }
    }
}

module.exports = new MainExecutor()