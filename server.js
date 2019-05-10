if (debug) console.log('Server Mainpage is loaded')

// get right type save in local storage
function get_task_type(){
    if (debug) console.log('Get Task type in server')
    var server_url = window.location.href;
    chrome.runtime.sendMessage({task_type: "request", url: server_url}, function (response) {
        if (debug) console.log(response); 
        if (response.task_type == 1) {
            /*if (debug) {
                console.log('get task_type');
                console.log(response.task_type); 
            }*/
            localStorage['task_type'] = 1;
        }else if (response.task_type == 0) {
            /*if (debug) {
                console.log('get task_type, right = 0');
                console.log(response.task_type);
            }*/
            localStorage['task_type'] = 0;
        }else{
            /*if (debug) {
                console.log('get task_type failed, right=1');
                console.log(response.task_type);
            }*/
            localStorage['task_type'] = 1;
        }
    });
}

get_task_type();

//initialize
mPage.initialize = function () {
    mPage.query = $("#upquery").val();
    mPage.page_id = parseInt($("#pagebar_container span").text());
    mPage.html = document.documentElement.outerHTML;
};

setTimeout(mPage.initialize, 3000);


// 绑定click和hover信息
mPage.update = function () {
    // 记录左边结果的点击信息
    var result_divs = $("div.results");
    result_divs.children("div").each(function (id, element) {
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
    result_divs.children("div").each(function (id, element) {
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

    var kmap_divs = $("div.rvr-model#kmap_entity_div");
    // 记录右边kmap_entity_div结果点击信息
    kmap_divs.children("ul").each(function(id, element){
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
    kmap_divs.children("ul").each(function(id, element){
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

    var tupu_div = $("div.tupu_img");
    // 需要增加kmap_relation_div结果点击信息
    if(tupu_div.attr("bindClick") == undefined){
        tupu_div.attr("bindClick", true);
        tupu_div.click(function(){
            mPage.myclick($(this).get(0), "tupu", 1, -1);
        });
    }

    // 需要增加kmap_relation_div结果hover 信息
    if(tupu_div.attr("bindHover") == undefined){
        tupu_div.attr("bindHover", true);
        tupu_div.hover(function(){
            mPage.myhandlerIn($(this).get(0), "tupu", 1, -1);
        }, function(){
            mPage.myhandlerOut($(this).get(0), "tupu", 1, -1);
        });
    }
};

