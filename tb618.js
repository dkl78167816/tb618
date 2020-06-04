/**
 * @file   tb618.js
 * @brief  淘宝618活动自动领瞄币脚本
 * @author ZehuanZhang (https://github.com/ZehuanZhang)
 * @detail 本脚本任何人可自由使用，不包含任何收费、协助点击、分享等内容，
 *         若需移植、修改或分享，请保留该文件头，尊重劳动成果！
 */
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
CheckAndGoActivity(true);

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
    DoLookAction("去观看");
    DoFarmAction();
}

function WaitActionFinished(Timeout = 15000) {
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
}

function DoVisitAction(actionName) {
    if (!text(actionName).exists()) return;

    ShowMessage("准备" + actionName);
    while (text(actionName).exists()) {
        ShowMessage("存在" + actionName);
        text(actionName).findOnce().click();
        sleep(1500);
        swipe(width / 2, height - 400, width / 2, 0, 1000);
        sleep(5000);
        swipe(width / 2, height - 400, width / 2, 0, 1000);
        sleep(5000);
        swipe(width / 2, height - 400, width / 2, 0, 1000);
        // 鉴于前面操作需要一部分时间，这里减少一些
        WaitActionFinished(10000);
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
        text(actionName).findOnce().click();
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
    
    ShowMessage("准备" + actionName)
    while (text(actionName).exists()) {
        ShowMessage("存在" + actionName);
        text(actionName).findOnce().click();
        WaitActionFinished();
        ShowMessage("完成" + actionName);
        back();
        sleep(1000);
    }
    ShowMessage("完成" + actionName);
}

function DoFarmAction(){
    actionName = "去收菜";
    var Btn = text(actionName).findOnce();
    if (Btn) 
        Btn.click();
    else
        return;
    ShowMessage("准备" + actionName);
    sleep(4000);
    var GameRegion = className("android.view.View").depth(8).indexInParent(1).findOnce();
    if (GameRegion) {
        var aBnd = GameRegion.bounds();
        var X = aBnd.left;
        var Y = aBnd.top;
        var HStep = aBnd.height() / 5;
        var WStep = aBnd.width() / 4;
        click(X + WStep * 2, Y + HStep * 4)
        sleep(1500);
        click(X + WStep * 2, Y + HStep * 4)
        sleep(1500);
        click(X + WStep * 2, Y + HStep * 4)
        sleep(1500);
        back();
    }
    else 
        ShowMessage("无法定位界面");

    ShowMessage("完成" + actionName);
}

function IsMainForm() {
    return className("android.view.View").desc("搜索").depth(12).exists();
}

function CheckAndGoActivity(isBegining) {
    if (IsMainForm()) {
        GoActivityFlag = false;
        ShowMessage("当前在主界面");
        ShowMessage("尝试进入618列车界面");
        if (!(GoActivityFlag = TryGoActivityPage())) {
            ClickMainPage();
            sleep(2000);
            var RetryCoutner = 0;
            while (++RetryCoutner <= 10 && !(GoActivityFlag = TryGoActivityPage())) {
                swipe(width / 2, 400, width / 2, height * 0.4, 1000);
                sleep(1000);
            }
        }
        sleep(6000);

        if (!GoActivityFlag) {
            ShowMessage("进入主互动界面失败！");
            eixt();
        }
    }
    // 跳出领取祝福的处理
    var giftBtn = className("android.widget.Button").text("收下祝福").findOnce();
    if(giftBtn){
        ShowMessage("领取祝福");
        giftBtn.click();
        sleep(1500);
    }
    if (
        descMatches("(.+)?我的列车(.+)?").exists() ||
        textMatches("(.+)?我的列车(.+)?").exists()) {
        if (!textMatches("关闭").exists()) {
            ShowMessage("进入领瞄币页面");
            sleep(1000);
            ClickLingmiaobi();
            sleep(1500);
        }
        if (textMatches("关闭").exists()) {
            if (isBegining) {
                ShowMessage("开始领取瞄币");
            }
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

function ClickLingmiaobi() {
    var mbbtn = className("android.widget.Button").text("做任务，领喵币").findOnce();
    if (mbbtn) {
        mbbtn = mbbtn.parent();
        var bnd = mbbtn.bounds();
        click(bnd.centerX(), bnd.centerY());
    }
    else {
        click(width * 0.9, height * 0.9);
    }
}

function ClickMainPage() {
    // 查找淘宝按钮
    var MainPageBtn = className("android.widget.FrameLayout").clickable(true).selected(true).depth(9).findOnce();
    if (MainPageBtn) { // 找到
        MainPageBtn.click();
        sleep(1200);
    }
    else { //没有找到
        click(width * 0.125, height - 50);
        sleep(1200);
    }
}

function TryGoActivityPage() {
    var GoPage = className("android.widget.FrameLayout").
        depth(12).indexInParent(9).boundsInside(0, 200, device.width, device.height - 300).findOnce();
    if (GoPage) {
        GoPage.click();
        return true;
    }
    else {
        return false;
    }
}
