if (debug) console.log("Sogou Main Page is Loaded!");// remove suggested query on the top, mid and bottom

if (localStorage['task_type'] != undefined && localStorage['task_type'] == 0){
    if (debug) console.log('remove right according to task_type in localStorage')
    $("#right").remove();
}


//去掉右边其他信息 syq
$("#right").children().not("#kmap_entity_div, #kmap_relation_div").remove();

//导航栏只保留网页
$("ul.searchnav").children("li").not(".cur").remove();
$("div#stable_uphint").remove();
$("#mid-hid-hidden.vrwrap").remove();
$("#hint_container.hint").remove();
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
    // 记录左边结果的点击信息
    $("div.results").children("div").each(function (id, element) {
        $(element).find("a").each(function (child_id, child_element) {
            if ($(child_element).attr("bindClick") == undefined) {
                $(child_element).attr("bindClick", true);
                $(child_element).click(function () {
                    mPage.click($(this).get(0), "content", -1 ,id+1);
                });
            }
        });
    });

    // 记录左边结果的hover信息
    $("div.results").children("div").each(function (id, element) {
        $(element).find("a").each(function (child_id, child_element) {
            if ($(child_element).attr("bindHover") == undefined) {
                $(child_element).attr("bindHover", true);
                $(child_element).hover(function () {
                    mPage.hover($(this).get(0), "content", -1 ,id+1);
                });
            }
        });
    });

    // 记录右边kmap_entity_div结果点击信息
    $("div.rvr-model#kmap_entity_div").children("ul").each(function(id, element){
        $(element).children("li").each(function(li_id, li_element){
            $(li_element).find("a").each(function (child_id, child_element){
                if($(child_element).attr("bindClick") == undefined){
                    $(child_element).attr("bindClick", true);
                    $(child_element).click(function(){
                        mPage.click($(this).get(0), "content", id+1, li_id+1)
                    });
                }
            });
        });
    });


    // 记录右边结果kmap_entity_div结果hover信息
    $("div.rvr-model#kmap_entity_div").children("ul").each(function(id, element){
        $(element).children("li").each(function(li_id, li_element){
            $(li_element).find("a").each(function (child_id, child_element){
                if($(child_element).attr("bindHover") == undefined){
                    $(child_element).attr("bindHover", true);
                    $(child_element).hover(function(){
                        mPage.hover($(this).get(0), "content", id+1, li_id+1)
                    });
                }
            });
        });
    });

    // 需要增加kmap_relation_div结果点击信息
    // 需要增加kmap_relation_div结果hover 信息
};