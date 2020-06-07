//京东618叠蛋糕js脚本0521
/**
 * 作者: dkl78167816
 * 代码参考并感谢: ZainCheung, Mr.Lih,以及没有找到出处的一位大佬
 */

const taskList = ['去加购','8秒', '浏览5个', '浏览可得'];
const appName = "京东";
const speed = 1;
var taskType = 1;

log("请确认无障碍和悬浮窗权限已开启,感谢使用\n作者:dkl78167816\n仅供学习参考");
chooseTask();
console.show();
auto.waitFor();

//打开活动页面
if (taskType == 1) {
    gotoActivity(true);
} else {
    gotoActivity(false);
}

sleep(1000 * speed);
//签到
if (taskType == 1 && !text("已签到").exists()) {
    text("签到").findOne().parent().click();
    log("已签到");
    sleep(100);
}

var buttonIndex = 0;
while (taskType == 1) {
    let doButton = text("去完成").findOnce(buttonIndex);
    if (doButton != null) {
        //按钮所在行的文字
        let buttonText = doButton.parent().parent().parent().child(0).child(1).text();
        //加购5个
        if (buttonText.search(taskList[0]) != -1) {
            doBuyList(doButton);
            sleep(2000 * speed);
        } 
        //浏览8秒 
        else if (buttonText.search(taskList[1]) != -1) {
            doView(doButton, 8);
            sleep(2000 * speed);
        }
        //浏览5个
        else if (buttonText.search(taskList[2]) != -1) {
            doViewList(doButton);
            sleep(2000 * speed);
        }
        //浏览可得
        else if (buttonText.search(taskList[3]) != -1) {
            doView(doButton, 1);
            sleep(2000 * speed);
        } else buttonIndex++;
    } else correct();
}

if (taskType == 2) {
    log("点击金币小人中");
    var errorTime = 0;
    while (1) clickGold();
}

/**
 * 点击按钮，以设定的浏览时长浏览页面，完成后回退页面
 * param button: 点击的按钮
 * param time: 秒
 */
function doView(button, time) {
    log("执行浏览任务");
    button.click();
    buttonIndex = max(0, buttonIndex-1);

    time *= 1000;
    sleep((time+2000) * speed);

    if (time == 1000) {
        log("完成浏览任务");
    } else {
        finishText = textContains("恭喜完成").findOne(6000 * speed);
        if (finishText == null) {
            log("出现了错误，任务未完成");
        } else {
            log("完成定时浏览任务");
        }
    }

    backPage();
}

/**
 * 点击按钮，浏览商品列表，完成后回退页面
 */
function doViewList(button) {
    log("执行浏览商品任务");
    button.click();
    while (idContains("view_").findOnce(0) == null) {
        sleep(random(501, 531) * speed);
    }

    let items = idContains("view_").find();
    for (let t = 0; t < 5; t++) {
        sleep(random(1501, 1535) * speed)
        doView(items[t], 1);
    }

    finishText = textStartsWith("已完成").findOne(6000 * speed);
    if (finishText == null) {
        log("出现了错误，任务未完成");
    } else {
        log("完成浏览商品任务");
    }
    backPage();
    buttonIndex = max(0, buttonIndex-1);
}

/**加购商品列表 */
function doBuyList(button) {
    button.click();
    log("执行加购任务");

    while (idContains("cart_").findOnce(0) == null) {
        sleep(random(501, 531) * speed);
    }
    for (var t = 0; t < 5; t++) {
        idContains("cart_").findOnce(t).click();
        sleep(random(1501, 1531) * speed);
    }

    finishText = textStartsWith("已完成").findOne(6000 * speed);
    if (finishText == null) {
        log("出现了错误，任务未完成");
    } else {
        log("完成浏览商品任务");
    }

    backPage();
    buttonIndex = max(0, buttonIndex-1);
}

function backPage() {
    try {
        id("fe").findOnce(0).click();       
    } catch (error) {
        try {
            descContains("返回").findOnce(0).click();
        } catch (error) {
            back();
        }
    }
}

/**
 * 偏离脚本预期界面，进行纠正
 */
function correct() {
    log("可能出了点问题,正在尝试第一次纠正");
    for (let index = 0; index < 3; index++) {
        back();
        sleep(500 * speed);
        if (text("去完成").findOnce(buttonIndex) != null) {
            return;
        }
    }

    log("正在尝试第二次纠正");
    gotoActivity(task=true);
    if (text("去完成").findOnce(buttonIndex) == null) {
        log("貌似没有任务了，脚本退出\n如未完成，请重新运行");
        exit();
    }
}

/**
 * 打开京东App并跳转到活动页面
 */
function gotoActivity(task) {
    log("进入活动中.......");
    if(!packageName("com.jingdong.app.mall").exists()) {
        // 打开京东APP
        launchApp(appName);
        // 睡眠5秒，等待程序加载
        sleep(7000 * speed);
        //检测是否在主界面，如果在，进入个人中心
        //如果不在，检测是否在个人中心，如果在，进入活动
        //如果不在，检测是否在活动页面，如果不在，进行纠正
    }
    if(descContains("我的").exists()){
        descContains("我的").findOne().click();
        sleep(2000 * speed);
        idContains("us").findOne().click();
    } else if (idContains("us").findOne(1000) != null) {
        idContains("us").findOne().click();
    } else if (className("android.view.View").text("做任务领金币").findOne(2000) == null) {
        correct();
    };

    if (task == true) {
        className("android.view.View").text("做任务领金币").waitFor();
        if (!textContains("任务每日0点刷新").exists()) {
            className("android.view.View").text("做任务领金币").findOne().parent().click()
        }
        textContains("任务每日0点刷新").waitFor()
        sleep(1000 * speed);
    }
}

/** 
 * 选择脚本任务
*/
function chooseTask() {
    var choose = dialogs.select("选择功能", "做任务", "点击金币小人");
    switch (choose) {
        case -1:
            toast("请选择");
            log("默认进行任务")
            break;
        case 0:
            toast("开始做任务");
            taskType = 1;
            break;
        case 1:
            toast("开始点击金币小人");
            taskType = 2;
            break;
    }
}

function clickGold() {
    var t = idContains("goldElfin").findOne(5000);
    if (t == null) {
        errorTime += 1;
    } else {
        errorTime = 0;
        t.click();
        sleep(random(1200, 1400));
    } 
    if (errorTime == 4) {
        log("不存在金币小人");
        correct();
    }  
}

function max(a, b) {
    if (a > b)
        return a;
    return b;
}
