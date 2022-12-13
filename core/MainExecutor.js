function MainExecutor() {

  this.exec = function () {
    require("./上班打卡").main();
  }
}
module.exports = new MainExecutor()