// 检查无障碍模式是否启用
if (app.versionCode >= 400) {
    auto.waitFor();
}
else {
    ShowMessage("版本号低于400，请手动检查无障碍模式")
}
// 获取设备屏幕信息
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

// 进入活动界面
CheckAndGoActivity();

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
    if (!text(actionName).exists()) return;

    ShowMessage("准备" + actionName);
    while (text(actionName).exists()) {
        ShowMessage("存在" + actionName);
        text(actionName).findOne().click();
        sleep(1500);
        swipe(width / 2, height - 400, width / 2, 0, 1000);
        sleep(5000);
        swipe(width / 2, height - 400, width / 2, 0, 1000);
        sleep(5000);
        swipe(width / 2, height - 400, width / 2, 0, 1000);
        var Timer = 0
        // 这个等待最多15s
        while (
            Timer <= 15000 &&
            !descMatches(" ?任务已?完成").exists() &&
            !textMatches(" ?任务已?完成").exists()
        ) {
            sleep(500);
            Timer += 500;
        }
        sleep(500);
        back();
        sleep(1000);
        // 防止淘宝骚操作，若返回主界面，尝试重新进入活动界面
        CheckAndGoActivity();
    }
    ShowMessage("完成" + actionName);
}

function DoClickAction(actionName) {
    if (!text(actionName).exists()) return;

    ShowMessage("准备" + actionName)
    if (text(actionName).exists()) {
        text(actionName).findOne().click();
        ShowMessage("完成" + actionName);
    }
    else {
        ShowMessage("不存在" + actionName)
    }
}

function ShowMessage(msg) {
    log(msg);
    sleep(1500);
    toast(msg);
    sleep(1500);
}

function DoLookAction(actionName) {
    if (!text(actionName).exists()) return;
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

function IsMainForm() {
    return className("android.view.View").desc("搜索").depth(12).exists();
}

function CheckAndGoActivity() {
    if (IsMainForm()) {
        ShowMessage("当前在主界面");
        if (desc("主互动").exists()) {
            ShowMessage("进入互动页面")
            desc("主互动").findOne().click();
            sleep(5000)
        }
        else if (className("android.widget.FrameLayout").depth(12).indexInParent(5).exists()) {
            ShowMessage("进入618列车界面")
            // 防止主页面浏览，导致无法进入列车界面
            for (var i = 0; i < 4; ++i) {
                swipe(width / 2, 400, width / 2, height, 1000);
            }
            sleep(1000);
            className("android.widget.FrameLayout").depth(12).indexInParent(5).click();
            sleep(5000);
        }
        else {
            ShowMessage("主互动不存在，直接执行领瞄币")
        }
    }
    if (
        descMatches("(.+)?我的列车(.+)?").exists() ||
        textMatches("(.+)?我的列车(.+)?").exists()) {
        if (!textMatches("关闭").exists()) {
            ShowMessage("进入领瞄币页面")
            click(width * 0.9, height * 0.9);
            sleep(1000);
        }
        if (textMatches("关闭").exists()) {
            ShowMessage("开始领取瞄币");
        } else {
            ShowMessage("无法检测到领瞄币窗口");
            exit();
        }
    }
    else {
        ShowMessage("无法找到领瞄币界面");
        exit();
    }
}