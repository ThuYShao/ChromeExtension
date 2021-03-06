//console.log('basic.js loaded')
/**这个是最终要发给服务器的数据 */
var msg = {
    /**
     * 发送消息标记
     */
    send_flag: false,
    /**
     * 用户名,用于对应用户和log
     */
    username: "",
    /**
     * task_id, 用来对应task_id
     */
    task_id: "", 
    /**
     * 开始创建时间
     * 单位ms
     */
    start_timestamp: 0,
    /**
     * 结束浏览时间
     * 单位ms
     */
    end_timestamp: 0,
    /**
     * 浏览总时间
     * 单位ms
     */
    dwell_time: 0,
    /**
     * 一个pageTimestamp的数组
     * 记录了每一次查看页面的进入和离开时间点
     */
    page_timestamps: new Array(),
    /**
     * SERP页面源
     * "sogou/": 搜索页面
     * "search/": 服务器页面
     */
    origin: "",
    /**
     * 网页链接
     */
    url: "",
    /**
     * 搜索查询词
     */
    query: "",
    /**
     * 搜索页面序号
     */
    page_id: 0,
    /**
     * 保留页面整体的HTML用于以后使用
     */
    html: "",
    /**
     * 一个mouseMove的数组
     * 记录了鼠标此过程中的所有移动信息
     * 以及滑轮的信息
     */
    mouse_moves: "",
    /**
     * 为一个结果数组
     * 所有点击结果的信息
     */
    clicked_results: "",
    /**
    * 为一个hoverRes数组
    * 所有hover结果的信息
    */
    //hover_results: "", 
    hover_in_results: "",
    hover_out_results: "",

    /**
     * 直接来源网址
     */
    //referrer: "",
    /**
     * 在SERP上的来源网址
     * SERP自己的来源是空的
     */
    //serp_link: "",
    /**
     * 页面类型
     * "SERP": 搜索页面
     * "general": 非搜索页面
    */ 
    //type: "", //只记录SERP页面的

    initialize: function () {
        msg.send_flag = false;
        msg.username = "";
        msg.task_id = ""; 
        msg.start_timestamp = 0;
        msg.end_timestamp = 0;
        msg.dwell_time = 0;
        msg.page_timestamps = new Array();
        msg.origin = "";
        msg.url = "";
        msg.query = "";
        msg.page_id = 0;
        msg.html = "";
        msg.mouse_moves = "";
        msg.clicked_results = "";
        msg.hover_in_results = "";
        msg.hover_out_results = "";
    }
};

/**
 * 构造一个时间戳类，表示一次进入和离开页面的时间戳
 * @param {number} inT 进入时间
 * @param {number} outT 离开时间
 */
var pageTimestamp = function (inT, outT) {
    this.inT = inT;
    this.outT = outT;
    /**
     * 返回此次进入和离开的持续时间
     */
    this.getDwell = function () {
        return this.outT - this.inT;
    };
};

/**
 * 页面级别时间的管理
 * 所有关于该页面的时间戳事件由viewState改变pageManager状态
 */
var pageManager = {
    /**
     * 开始创建时间
     * 单位ms
     */
    start_timestamp: 0,
    /**
     * 结束浏览时间
     * 单位ms
     */
    end_timestamp: 0,
    /**
     * 浏览总时间
     * 单位ms
     */
    dwell_time: 0,
    /**
     * 一个pageTimestamp的数组
     * 记录了每一次查看页面的进入和离开时间点
     */
    page_timestamps: new Array(),
    /**
     * 上次进入这个页面查看的时间
     */
    lastViewTime: 0,

    /**
     * 开启一个页面
     */
    initialize: function () {
        pageManager.start_timestamp = (new Date()).getTime();
        pageManager.end_timestamp = pageManager.start_timestamp;
        pageManager.dwell_time = 0;
        pageManager.page_timestamps = new Array();
        pageManager.lastViewTime = pageManager.start_timestamp;
        if (debug) console.log("pageManager initialize");
    },
    /**
     * 用户开始查看这个页面
     */
    getIn: function () {
        pageManager.lastViewTime = (new Date()).getTime();
    },

    /**
     * 用户不再查看当前页面
     */
    getOut: function () {//切出页面
        pageManager.end_timestamp = (new Date()).getTime();
        pageManager.page_timestamps.push(new pageTimestamp(pageManager.lastViewTime, pageManager.end_timestamp));
        pageManager.dwell_time += pageManager.end_timestamp - pageManager.lastViewTime;
        pageManager.lastViewTime = pageManager.end_timestamp;
    }
};

/**当前页面可见性 */
var viewState = {
    /**
     * 当前状态
     * true 用户正在查看页面
     * false 用户切出页面以外
     */
    show: true,
    /**
     * 上次操作时间
     */
    lastOp: 0,
    /**
     * 超时时长
     * 如果用户超过这个时间没有任何动作，
     * 我们认为用户离开。
     * 当前时限：10s
     */
    timeLimit: 10000,
    /**
     * 检查是否超时
     */
    check: function () {
        if (debug) console.log("check state");
        if ((new Date()).getTime() - viewState.lastOp >= viewState.timeLimit && viewState.show == true)
            viewState.toggleState();
        else if (viewState.show == true)
            setTimeout(viewState.check, viewState.timeLimit);
    },
    /**
     * 切换当前可见状态
     */
    toggleState: function () {
        if (debug) console.log("View State Changed from " + viewState.show + " to " + !viewState.show);
        if (viewState.show == false) {
            viewState.show = true;
            viewState.check();
            pageManager.getIn();
        } else {
            viewState.show = false;
            pageManager.getOut();
            mRec.pause();
        }
    },

    /**
     * 进入页面
     */
    getIn: function () {
        viewState.lastOp = (new Date()).getTime();
        if (viewState.show == false) {
            viewState.toggleState();
        }
    },
    /**
     * 离开页面
     */
    getOut: function () {
        if (viewState.show == true) {
            viewState.toggleState();
        }
    },
    /**
     * 标签栏切入页面响应的函数
     */
    tabEnter: function () {
        viewState.getIn();
    },
    /**
     * 标签栏切出页面响应的函数
     * 在页面关闭时也会响应
     * 会在 onbeforeunload 之后响应
     * 切入后台(alt+tab)不会响应，
     * 只有标签页切换才会响应
     */
    tabLeave: function () {
        viewState.getOut();
    },
    /**
     * 获得焦点
     * 如果同时触发tabEnter,会在tabEnter之后调用
     */
    focus: function () {
        if (debug) console.log("focus");
        viewState.getIn();
    },
    /**
     * 失去焦点
     * 比如鼠标点击地址栏或切入后台
     */
    blur: function () {
        if (debug) console.log("blur");
        viewState.getOut();
    },
    /**
     * 鼠标在当前页面内移动了一下
     * @param {鼠标位置信息} e
     */
    mMove: function (e) {
        viewState.getIn();
        mRec.move(e);
    },
    /**
     *  鼠标滚轮滚动
     */
    mScroll: function () {
        viewState.getIn();
        mRec.scroll();
    },
    /**
     * 页面内容改变
     */
    update: function () {
        //if (debug) console.log("update");
        mPage.update();
        //viewState.getIn();
    },
    /**
     * 页面关闭
     * 关闭页面时会发送msg
     */
    close: function () {
        viewState.sendMessage();
    },
    /**
     * 页面初始化
     */
    initialize: function () {
        var origin = "???";
        var temp_sogou = window.location.href.match(/www\.sogou\.com\/web/g);
        var temp_server = window.location.href.match(/exp_domain_expertise\/\d+\/search/g);
        if (temp_sogou != null){ // from sogou SERP
            origin = "sogou";
        }
        else if (temp_server != null){ // from server SERP
            origin = "server"; 
        }

        if (origin != "???"){
            if (debug) console.log("View state initialize, extension is working on SERP, origin=" + origin);

            document.addEventListener("visibilitychange", function (event) {
                var hidden = event.target.webkitHidden;
                if (hidden) viewState.tabLeave();
                else viewState.tabEnter();
            }, false);
            window.onbeforeunload = viewState.close;
            $(window).focus(viewState.focus);
            $(window).blur(viewState.blur);
            viewState.show = true;
            viewState.lastOp = (new Date()).getTime();

            $(window).bind('mousemove', viewState.mMove);
            $(window).bind('scroll', viewState.mScroll);
            /**
             * 发送执行脚本的请求
             * 执行相应搜索引擎的页面脚本
             */
            chrome.runtime.sendMessage({file: origin + ".js"}, function (response) {
                if (response.scriptFinish == true) {
                    if (debug) console.log("execute script done");
                    pageManager.initialize();
                    mPage.initialize(); // 管理页面信息
                    mRec.initialize(); //记录鼠标移动和滚动的对象
                    viewState.check();
                }
            });
        }
        else { //非SERP页面, 不进行任何记录
            if (debug) console.log("View state initialize, extension is working on untracking page, nothing works");
            //$(window).unbind('mousemove', viewState.mMove);
            //$(window).unbind('scroll', viewState.mScroll);
        }
    },
    /**
     * 发送信息
     */
    sendMessage: function () {
        var origin = "???";
        var temp_sogou = window.location.href.match(/www\.sogou\.com\/web/g);
        var temp_server = window.location.href.match(/exp_domain_expertise\/\d+\/search/g);
        if (temp_sogou != null){ // from sogou SERP
            origin = "sogou";
        }
        else if (temp_server != null){ // from server SERP
            origin = "server"; 
        }

        if (origin != "???"){
            if (debug) console.log("in SERP, send message");
            pageManager.getOut();
            mRec.end();
            msg.send_flag = true;
            msg.start_timestamp = pageManager.start_timestamp;
            msg.end_timestamp = pageManager.end_timestamp;
            msg.dwell_time = pageManager.dwell_time;
            msg.page_timestamps = JSON.stringify(pageManager.page_timestamps);
            msg.url = current_url; //current url in content.js

            msg.origin = origin; 
            msg.query = mPage.getQuery();
            msg.page_id = mPage.getPageId();
            msg.html = mPage.getHtml();
            msg.mouse_moves = JSON.stringify(mRec.getData());
            msg.clicked_results = JSON.stringify(mPage.getClickedResults());
            msg.hover_in_results = JSON.stringify(mPage.getHoverInResults());
            msg.hover_out_results = JSON.stringify(mPage.getHoverOutResults());
            chrome.runtime.sendMessage(msg);
            msg.initialize();
        }
        else{
            if (debug) console.log("not in SERP, not need to send"); 
        }
    }
};
