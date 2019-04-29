if (debug) console.log("Sogou Main Page is Loaded!");
// remove suggested query on the top, mid and bottom
$("#right").hide()
$("#right").children().not("#kmap_entity_div, #kmap_relation_div").remove();
$("div#stable_uphint").remove();
$("#mid-hid-hidden.vrwrap").remove();
$("#hint_container.hint").remove();
// remove the advertisement
$("div.sponsored").remove();

// js that only remain kmap_entity_div and kmap_relation_div
// $(document).ready(function(){
//     $("#right").children().not("#kmap_entity_div,#kmap_relation_div").remove()
// });

//remove right
// $("#right").remove();

mPage.initialize = function () {
    mPage.query = $("#upquery").val();
    mPage.page_id = parseInt($("#pagebar_container span").text());
    mPage.html = document.documentElement.outerHTML;
};

setTimeout(mPage.initialize, 3000);

mPage.update = function () {
    $("ul.searchnav").find("a").each(function (id, element) {
        if ($(element).attr("bindClick") == undefined) {
            $(element).attr("bindClick", true);
            $(element).click(function () {
                mPage.click($(this).get(0), "tab", 0);
            });
        }
    });
    $("div.results").children("div").each(function (id, element) {
        $(element).find("a").each(function (child_id, child_element) {
            if ($(child_element).attr("bindClick") == undefined) {
                $(child_element).attr("bindClick", true);
                $(child_element).click(function () {
                    mPage.click($(this).get(0), "content", id+1);
                });
            }
        });
    });
};