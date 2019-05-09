/**管理页面信息的接口 */
var mPage = {
    /**
     * 返回值
     */
    click_results: new Array(),
    hover_in_results: new Array(), 
    hover_out_results: new Array(), 
    query: "",
    page_id: 0,
    html: null,
    /**
     * 获得当前搜索查询词
     */
    getQuery: function () {
        return mPage.query;
    },
    /**
     * 获得当前搜索页面序号
     */
    getPageId: function () {
        return mPage.page_id;
    },
    /**
     * 获得当前搜索原始网页
     */
    getHtml: function () {
        return mPage.html;
    },
    /**
     * 返回当前页面所有点击结果信息
     */
    getClickedResults: function () {
        return mPage.click_results;
    },
    
    getHoverInResults: function() {
        return mPage.hover_in_results; 
    }, 
    getHoverOutResults: function(){
        return mPage.hover_out_results; 
    },
    /**
     * 点击事件的处理
     */
    myclick: function (link_obj, type, id, father_id) {
        var new_click = {
            href: $(link_obj).attr("href"),
            type: type, 
            id: id, 
            father_id: father_id
        }; // add father_id, -1 from left, >=1 from kmap_entity
        mPage.click_results.push(new_click);
    },
    /**
     * 悬停事件的处理
     */
    /*hover: function(link_obj, type, id, father_id){
        var new_hover = {
            href: $(link_obj).attr("href"), 
            type: type, 
            id: id,
            father_id: father_id
        };
        mPage.hover_results.push(new_hover);
    },*/

    myhandlerIn: function(link_obj, type, id, father_id) {
        var new_hover_in = {
            href: $(link_obj).attr("href"),
            type: type,
            id: id,
            father_id: father_id,
            timestamps_in: (new Date()).getTime()
        };
        mPage.hover_in_results.push(new_hover_in); 
    },

    myhandlerOut: function(link_obj, type, id, father_id) {
        var new_hover_out = {
            href: $(link_obj).attr("href"),
            type: type,
            id: id,
            father_id: father_id,
            timestamps_out: (new Date()).getTime()
        };
        mPage.hover_out_results.push(new_hover_out); 
    },

    lastUpdate: 0,
    /**
     * 更新页面的click绑定
     * 在页面DOM树更新的时候触发
     */
    update: function () {
        if (debug) console.log("mPage update");
    },

    /**
     * 页面信息初始化,不同搜索引擎页面初始化的格式不一样
     */
    initialize: function () {
        mPage.click_results = new Array();
        mPage.hover_in_results = new Array();
        mPage.hover_out_results = new Array();  
        if (debug) console.log("mPage initialize");
    }
};

var debug = true;
if (debug) console.log("page.js is loaded");
mPage.initialize();