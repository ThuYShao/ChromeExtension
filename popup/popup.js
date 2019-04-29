// var baseUrl = "http://166.111.138.86:15016";
var baseUrl = "http://127.0.0.1:8000";
var checkUrl = baseUrl + "/user/check/";
var registerUrl = baseUrl + "/user/signup/";
var feedbackUrl = baseUrl + "/task/home/";
var downloadLink = "";

function userTab() {
    $("#failMsg1").hide();
    $("#failMsg2").hide();
    $("#failMsg3").hide();
    $("#login").hide();
    $("#logged").show();
}

function loginTab() {
    $("#logged").hide();
    $("#failMsg1").hide();
    $("#failMsg2").hide();
    $("#failMsg3").hide();
    $("#login").show();
}

function verifyUser() {
    //console.log("checking...");
    var result = -1;
    if (localStorage['username'] != undefined && localStorage['password'] != undefined) {
        var name = localStorage['username'];
        var psw = localStorage['password'];
        //console.log("POSTing...");
        $.ajax
        ({
            type: "POST",
            url: checkUrl,
            dataType: 'json',
            async: false,
            data: {username: name, password: psw},
            success: function (data, textStatus) {
                if (data == 0) {
                    result = 0;
                }
                if (data == 1) {
                    result = 1;
                }
                if (data == 2) {
                    result = 2;
                }
            },
            error: function () {
                result = -1;
            }
        });
    }
    return result;
}

function register() {
    window.open(registerUrl);
}

function trylogin() {
    //console.log("logging...");
    localStorage['password'] = "" + $("#psw").val();
    localStorage['username'] = "" + $("#username").val();
    var verified = verifyUser();
    if (verified == 0) {
        userTab();
        chrome.browserAction.setBadgeText({text: 'on'});
        chrome.browserAction.setBadgeBackgroundColor({color: [255, 0, 0, 255]});
    } else {
        chrome.browserAction.setBadgeText({text: ''});
        if (verified == 1) {
            $("#failMsg2").hide();
            $("#failMsg3").hide();
            $("#failMsg1").show();
        }
        if (verified == 2) {
            $("#failMsg1").hide();
            $("#failMsg3").hide();
            $("#failMsg2").show();
        }
        if (verified == -1) {
            $("#failMsg1").hide();
            $("#failMsg2").hide();
            $("#failMsg3").show();
        }
    }
}

function feedback() {
    if (confirm("提示: 若正在进行搜索任务(搜索页面未关闭),请在进行标注前关闭搜索页面!\n若没有请忽略此信息"))
        window.open(feedbackUrl);
}

function download() {
    window.open(downloadLink, '_blank');
}

function logout() {
    localStorage['username'] = null;
    localStorage['password'] = null;
    localStorage['log_status'] = "off";
    chrome.browserAction.setBadgeText({text: ''});
    location.reload();
}

if (jQuery) {
    loginTab();
    $("#bt1").click(register);
    $("#bt2").click(trylogin);
    $("#bt4").click(feedback);
    $("#bt8").click(feedback);
    $("#bt6").click(logout);
    if (verifyUser() == 0) {
        userTab();
        chrome.browserAction.setBadgeText({text: 'on'});
        chrome.browserAction.setBadgeBackgroundColor({color: [255, 0, 0, 255]});
    }
    else {
        chrome.browserAction.setBadgeText({text: ''});
    }
} else {
    console.log("jQuery is needed!");
}


