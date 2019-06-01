if (debug) console.log("Sogou Main Page is Loaded!");// remove suggested query on the top, mid and bottom

chrome.storage.local.get({'task_type': -1}, function(items){
    localStorage['task_type'] = items.task_type;
});

if (debug) console.log('get task type in sogou', localStorage['task_type']);

// 根据task_type去掉右边
if (localStorage['task_type'] != undefined && localStorage['task_type'] == 0){
    if (debug) console.log('remove right according to task_type in localStorage');
    $("#right").remove();
}


//去掉右边其他信息 原始界面不保留图谱关系
$("#right").children().not("#kmap_entity_div").remove();

//导航栏只保留网页
$("ul.searchnav").children("li").not(".cur").remove();
//$("div#stable_uphint").remove();
//$("#mid-hid-hidden.vrwrap").remove();
//$("#hint_container.hint").remove();
$(".hint-mid").children("a").attr("target", "_blank");
$("#hint_container.hint").find("a").attr("target", "_blank");

// remove the advertisement
$("div.sponsored").remove();


//不同页面的initialize和update不同 
mPage.initialize = function () {
    mPage.query = $("#upquery").val();
    mPage.page_id = parseInt($("#pagebar_container span").text());
    mPage.html = document.documentElement.outerHTML;
};

setTimeout(mPage.initialize, 3000);

mPage.update = function () {
    // 记录左边结果的点击信息和hover信息
    var results_divs = $("div.results");
    results_divs.children("div").each(function (id, element) {
        $(element).find("a").each(function (child_id, child_element) {
            if ($(child_element).attr("bindClick") == undefined) {
                $(child_element).attr("bindClick", true);
                $(child_element).click(function () {
                    mPage.myclick($(this).get(0), "left", id+1, -1);
                });           
            }
        });
    });

    // 记录左边结果的hover信息
    results_divs.children("div").each(function (id, element) {
        $(element).find("a").each(function (child_id, child_element) {
            if ($(child_element).attr("bindHover") == undefined) {
                $(child_element).attr("bindHover", true);
                $(child_element).hover(function(){
                    mPage.myhandlerIn($(this).get(0), "left", id+1, -1);
                }, function(){
                    mPage.myhandlerOut($(this).get(0), "left", id+1, -1);
                });
            }
        });
    });

    var kmap_div = $("div.rvr-model#kmap_entity_div");
    // 记录右边kmap_entity_div结果点击 hover信息
    kmap_div.children("ul").each(function(id, element){
        $(element).children("li").each(function(li_id, li_element){
            $(li_element).find("a").each(function (child_id, child_element){
                if($(child_element).attr("bindClick") == undefined){
                    $(child_element).attr("bindClick", true);
                    $(child_element).click(function(){
                        mPage.myclick($(this).get(0), "right", li_id+1, id+1)
                    });
                }
            });
        });
    });

    // 记录右边结果kmap_entity_div结果hover信息
    kmap_div.children("ul").each(function(id, element){
        $(element).children("li").each(function(li_id, li_element){
            $(li_element).find("a").each(function (child_id, child_element){
                if($(child_element).attr("bindHover") == undefined){
                    $(child_element).attr("bindHover", true);
                    $(child_element).hover(function(){
                        mPage.myhandlerIn($(this).get(0), "right", li_id+1, id+1);
                    }, function(){
                        mPage.myhandlerOut($(this).get(0), "right", li_id+1, id+1);
                    });
                }
            });
        });
    });

    var up_hint = $("div.top-hintBox#stable_uphint");
    up_hint.find("a").each(function (child_id, child_element) {
        if($(child_element).attr("bindClick") == undefined){
            $(child_element).attr("bindClick", true);
            $(child_element).click(function () {
                mPage.myclick($(this).get(0), "up_hint", child_id+1, -1);
            });
        }
        if($(child_element).attr("bindHover") == undefined){
            $(child_element).attr("bindHover", true);
            $(child_element).hover(function () {
                mPage.myhandlerIn($(this).get(0), "up_hint", child_id+1, -1);
            }, function () {
                mPage.myhandlerOut($(this).get(0), "up_hint", child_id+1, -1);
            });
        }
    });

    var down_hint = $("#hint_container.hint");
    down_hint.find("tr").each(function (tr_id, tr_element) {
        $(tr_element).children("td").each(function (td_id, td_element) {
            $(td_element).find("a").each(function (child_id, child_element) {
                if($(child_element).attr("bindClick") == undefined){
                    $(child_element).attr("bindClick", true);
                    $(child_element).click(function () {
                        mPage.myclick($(this).get(0), "down_hint", td_id+1, tr_id+1);
                    });
                }
                if($(child_element).attr("bindHover") == undefined){
                    $(child_element).attr("bindHover", true);
                    $(child_element).hover(function () {
                        mPage.myhandlerIn($(this).get(0), "down_hint", td_id+1, tr_id+1);
                    }, function () {
                        mPage.myhandlerOut($(this).get(0), "down_hint", td_id+1, tr_id+1);
                    });
                }
            });
        });
    });


};