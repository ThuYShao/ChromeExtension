var debug = true;
var debug1 = true;
var current_url = window.location.href;
// var current_referrer = document.referrer;
// var current_serp_link = "";

// 只记录SERP界面，不需要存储链接关系
// function storage_link() {
//     var temp_ref = current_referrer.match(/www\.(baidu)?(sogou)?(so)?\.com\/(s|web)/g);
//     if (temp_ref != null) { //SERP页面直接link的页面,serp_link是自身
//         current_serp_link = current_url;
//         /**
//          * 请求background存储serp_link链接关系
//          */
//         chrome.runtime.sendMessage({
//             link_store: "request",
//             url: current_url,
//             serp_link: current_serp_link
//         }, function (response) {
//             if (debug) console.log(response);
//         });
//     }
//     else {
//         /**
//          * 请求background获取referrer的serp_link链接关系
//          */
//         chrome.runtime.sendMessage({ref_request: current_referrer}, function (response) {
//             current_serp_link = response;
//             if (current_serp_link != "") { //SERP页面间接link的页面
//                 /**
//                  * 请求background存储serp_link链接关系
//                  */
//                 chrome.runtime.sendMessage({
//                     link_store: "request",
//                     url: current_url,
//                     serp_link: current_serp_link
//                 }, function (response) {
//                     if (debug) console.log(response);
//                 });
//             }
//         });
//     }
// }

/**
 * 请求background判断用户是否登录,只有登录状态下插件才会执行初始化
 */
chrome.runtime.sendMessage({log_status: "request"}, function (response) {
    if (response.log_status == true) {
        // storage_link(); // 存储当前链接

        if (debug) console.log("content.js is loaded");
        /**
         * 页面初始化
         */
        viewState.initialize(); // 页面初始化, viewState对应相关page
        if (debug) console.log("initialize done");
        /**
         * 监听页面变化
         */
        document.addEventListener("DOMSubtreeModified", function (event) {
            if (current_url != window.location.href) {
                if (debug) {
                    console.log('current_url differ from window');
                    console.log(current_url);
                    console.log(window.location.href);
                }
                viewState.sendMessage();

                // current_referrer = current_url;
                current_url = window.location.href;
                // storage_link();
                viewState.initialize(); //注意此处初始化时由于刚监听到url发生改变,页面结果大部分内容其实还没来得及发生变化,所以跟页面元素相关的初始化一定要注意.
                if (debug) console.log("initialize again");
            }
            else {
                var origin = "???";
                var temp_sogou = window.location.href.match(/www\.sogou\.com\/web/g);
                var temp_server = window.location.href.match(/exp_domain_expertise\/\d+\/search/g);
                if (temp_sogou != null){ // from sogou SERP
                    origin = "sogou";
                }
                else if (temp_server != null){ // from server SERP
                    origin = "server"; 
                }
                if (origin != "???") { // SERP
                    viewState.update();
                }
                //if (debug) console.log("update again");
            }
        });
    }
});


