// 检查无障碍模式是否启用
auto.waitFor();
// 获取设备
var height = device.height;
var width = device.width;

ShowMessage(
    "欢迎来到领瞄币脚本\n" +
    "Github项目: tb618\n" +
    "设备宽: " + width + "\n" + 
    "设备高: " + height + "\n" + 
    "手机型号: " + device.model + "\n" +
    "安卓版本: " + device.release);

var appName = "手机淘宝";
ShowMessage("打开" + appName)
launchApp(appName);
sleep(3000);
ShowMessage("进入互动页面")
desc("主互动").findOne().click();
sleep(5000)
ShowMessage("进入领瞄币页面")
click(width * 0.9, height * 0.9);
ShowMessage("开始领取瞄币")
// 执行领瞄币操作
DoActions();
ShowMessage("结束")
ShowMessage(
    "Github项目: tb618\n" +
    "好用的话请点个Star哦!");

function DoActions() {
    DoClickAction("签到");
    DoClickAction("去兑换");
    DoVisitAction("去浏览");
    DoVisitAction("去进店");
    DoVisitAction("去围观");
}

function DoVisitAction(actionName) {
    ShowMessage("准备" + actionName);
    while (text(actionName).exists()) {
        ShowMessage("存在" + actionName);
        text(actionName).findOne().click();
        sleep(1500);
        swipe(width / 2, height - 400, width / 2, 0, 1000);
        sleep(6000);
        swipe(width / 2, height - 400, width / 2, 0, 1000);
        sleep(6000);
        swipe(width / 2, height - 400, width / 2, 0, 1000);
        sleep(1500);
        back();
        sleep(1600);
    }
    ShowMessage("完成" + actionName);
}

function DoClickAction(actionName){
    
    ShowMessage("准备" + actionName)
    if (text(actionName).exists()) {
        text(actionName).findOne().click();
        ShowMessage("完成" + actionName);
    }
    else{
        ShowMessage("不存在" + actionName)
    }
}

function ShowMessage(msg){
    sleep(1500);
    toast(msg);
    sleep(1500);
}

function DoLookAction(actionName) {
    // 去签到
    ShowMessage("准备" + actionName)
    while (text(actionName).exists()) {
        text(actionName).findOne(1000).click();
        ShowMessage(actionName + "成功");
        back();
        sleep(5000);
    }
    ShowMessage("完成" + actionName);
    sleep(1500);
}