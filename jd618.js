//京东618叠蛋糕js脚本0521
/**
 * 作者: dkl78167816
 * 原创作者：ZainCheung
 * 代码参考并感谢: Mr.Lih,以及没有找到出处的一位大佬
 */

var speed = 1;
var taskList = ['去加购','8秒', '浏览5个', '浏览可得'];
var appName = "京东";
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

var i = 0;
var j = 0;
while (taskType == 1) {
  var next = false;
  var a = text("去完成").findOnce(j);
  if (a != null) {
      //获取父控件
      var b = a.parent().parent().parent();
      //获取第一个子控件
      var c = b.child(0).child(1).text();
      taskList.forEach(task => {
          switch (task) {
              case '8秒':
                    if (c.search(task) != -1) {
                        i++;
                        next = true;
                        log("开始执行8秒任务");
                        a.click();
                        j = 0;
                        var timer = 0
                        while (!textContains("恭喜完成").exists()) {
                            sleep(5000);
                            timer += 5000;
                            if (timer >= 20000) {
                                break;
                            }
                        }
                        if (timer >= 20000) break;
                        log("已完成第" + i + "次任务！");
                        backPage();
                        sleep(1000);
                    }
                  break;
              case '浏览5个':
                    if (c.search(task) != -1) {
                        i++;
                        next = true;
                        log("开始执行浏览5个商品任务");
                        sleep(random(501, 515) * speed);
                        a.click();
                        while (idContains("view_").findOnce(0) == null) {
                            sleep(random(501, 531) * speed);
                        }
                        for (var t = 0; t < 5; t++) {
                            if (textContains("浏览以下").findOnce()) {
                                idContains("view_").findOnce(t).click();
                                sleep(random(1501, 1535) * speed)
                                back()
                                sleep(random(1501, 1535) * speed)
                            } else { }
                        }
                        textStartsWith("已完成").findOne(8000);
                        sleep(random(1001, 1031) * speed);
                        backPage();
                        sleep(random(2001, 2051) * speed);
                        j = 0;
                  }
                  break;
              case '去加购':
                  if (c.search(task) != -1) {
                      i++;
                      next = true;
                      a.click();
                      log("开始执行加购任务");
                      sleep(random(2001, 2031) * speed);
                      for (var t = 0; t < 5; t++) {
                          idContains("cart_").findOnce(t).click();
                          sleep(random(1001, 1031) * speed)
                      }
                      backPage();
                      log("已完成第" + i + "次任务！");
                      sleep(random(2001, 2051) * speed);
                      j = 0;
                  }
                  break;
              case '浏览可得':
                  if (c.search(task) != -1) {
                      i++;
                      next = true;
                      a.click();
                      log("开始执行快速浏览任务");
                      sleep(random(1001, 1031) * speed);
                      back();
                      sleep(random(2001, 2051) * speed);
                      j = 0;
                  }
                  break;
              default:
                  break;
          }
      });
      if (next) { j = 0; }
      else { j++; }
  } else {
      correct();
  }
}

var errorTime = 0;
while (taskType == 2) {
    log("点击金币小人中");
    var t = idContains("goldElfin").findOne(5000);
    sleep(random(1000, 1010));
    if (t == null) {
        log("-1");
        errorTime += 1;
    } else {
        log("---1");
        errorTime = 0;
        t.click();
    } 
    if (errorTime == 4) {
        correct();
    }
}

function backPage() {
    try {
        id("fe").findOne().click();       
        log("点击id为fe的按钮");  
    } catch (error) {
        try {
            descContains("返回").findOne().click();
            log("点击文本为返回的按钮");
        } catch (error) {
            back();
            log("系统返回");
        }
    }
    log("返回操作完成");
}
/**
 * 偏离脚本预期界面，进行纠正
 */
function correct() {
    log("可能出了点问题,正在尝试第一次纠正");
    for (let index = 0; index < 3; index++) {
        back();
        sleep(500 * speed);
        if (text("去完成").findOnce(j) != null) {
            return;
        }
    }

    log("正在尝试第二次纠正");
    gotoActivity(task=true);
    if (text("去完成").findOnce(j) == null) {
        log("貌似没有任务了，脚本退出\n如未完成，请重新运行");
        exit();
    }
}

/**
 * 打开京东App并跳转到活动页面
 */
function gotoActivity(task) {
    // 打开京东APP
    launchApp(appName);
    log("进入活动中.......");
    // 睡眠5秒，等待程序加载
    sleep(5000 * speed);
    //检测是否在主界面，如果在，进入个人中心
    //如果不在，检测是否在个人中心，如果在，进入活动
    //如果不在，检测是否在活动页面，如果不在，进行纠正
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

// menu: while (true) {
//   var choose = dialogs.select("请根据你的手机性能(卡不卡)以及网速选择速度", "快速", "一般", "缓慢");
//   switch (choose) {
//     case -1:
//       toast("请选择");
//       continue menu;
//     case 0:
//       toast("即将快速执行脚本");
//       speed = 1;
//       break menu;
//     case 1:
//       toast("即将一般速度执行脚本");
//       speed = 1.5;
//       break menu;
//     case 2:
//       toast("即将低速执行脚本");
//       speed = 2;
//       break menu;

//     default:
//       break;
//   }
// }