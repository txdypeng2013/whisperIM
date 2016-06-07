/*! mobileKit - v1.0.0 - 2015-07-31
* http://www.uedcool.com
* Copyright (c) 2015 Jinher Software; Licensed BSD */
$(function(){
    $(window).on('scroll',function(){
        $(window).scrollTop() > 300 ? $('.backToTop').show() : $('.backToTop').hide();
    })
    $('.backToTop').on('click',function(){
        $(window).scrollTop(0)
    })
});;var Checkbox = function (option) {
    if(option.type=='checkbox'){
        return _checkbox();
    }else{
        return _radio();
    }
    /**
     * 操作复选框状态的函数
     * @method _checkbox
     * @return getChecked，setChecked，enable，disable函数
     * */
    function _checkbox(){
        var ck = $(option.obj);

        /**
         * @property enableFlag
         * @type boolean
         * @default true
         * */
        var enableFlag = option.enable;
        ck.checked = option.checked;

        /**
         * 禁用状态下，阻止浏览器默认行为
         * @event disableCallback
         * @param e {object} 事件对象
         * @return boolean
         * */
        var disableCallback = function (e) {
            return false;
        };

        /**
         * 获取复选框的当前值
         * @event getChecked
         * @return boolean 返回true/false 选中/未选中
         * */
        var getChecked = function () {
            return ck.checked;
        };

        /**
         * 设置当前复选框的当前值
         * @event setChecked
         * @param bool {boolean} true/false 选中/未选中
         * */
        var setChecked = function (bool) {
            if (enableFlag) {
                if(bool){
                    ck.find('span').addClass('fa-check-square-o').removeClass('fa-square-o');
                }else{
                    ck.find('span').addClass('fa-square-o').removeClass('fa-check-square-o');
                }
                ck.checked =bool;
                ck.find('input').val(bool);
            }
        };

        /**
         * 将复选框设置为可用状态
         * @event enable
         * */
        var enable = function () {
            enableFlag = true;
            ck.css({opacity: 1});
            ck.off('click', disableCallback);
        };

        /**
         * 将复选框设置为禁用状态
         * @event disable
         * */
        var disable = function () {
            enableFlag = false;
            ck.css({opacity: 0.7});
            ck.on('click', disableCallback);
        };
        setChecked(ck.checked);
        return {
            getChecked: getChecked,
            setChecked: setChecked,
            enable: enable,
            disable: disable
        }
    }
    /**
     * 操作单选框状态的函数
     * @method _radio
     * @return getChecked，setChecked，enable，disable函数
     * */
    function _radio(){
        var ck = $(option.obj);

        /**
         * @property enableFlag
         * @type boolean
         * @default true
         * */
        var enableFlag = option.enable;
        ck.checked = option.checked;

        /**
         * @event disableCallback
         * @param e {object} 事件对象
         * @return boolean
         * */
        var disableCallback = function (e) {
            return false;
        };

        /**
         * 获取单选框的当前值
         * @event getChecked
         * @return boolean 返回true/false 选中/未选中
         * */
        var getChecked = function () {
            return ck.checked;
        };

        /**
         * 设置当前单选框的当前值
         * @event setChecked
         * @param bool {boolean} true/false 选中/未选中
         * */
        var setChecked = function (bool) {
            if (enableFlag) {
                if(bool){
                    $(option.radioSelector).find('.fa-dot-circle-o').parent().find('input').val(false);
                    $(option.radioSelector).find('.fa-circle').removeClass('fa-dot-circle-o').addClass('fa-circle-o');
                    ck.find("span").addClass('fa-dot-circle-o').removeClass('fa-circle-o');
                }else{
                    ck.find("span").addClass('fa-circle-o').removeClass('fa-dot-circle-o');
                }
                ck.checked =bool;
                ck.find('input').val(bool);
            }
        };

        /**
         * 将单选框设置为可用状态
         * @event enable
         * */
        var enable = function () {
            enableFlag = true;
            ck.css({opacity: 1});
            ck.off('click', disableCallback);
        };

        /**
         * 将单选框设置为禁用状态
         * @event disable
         * */
        var disable = function () {
            enableFlag = false;
            ck.css({opacity: 0.7});
            ck.on('click', disableCallback);
        };
        if($(option.radioSelector).find('.fa-dot-circle-o').length==0){
            setChecked(ck.checked);
        }else{
            setChecked(false);
        }
        return {
            getChecked: getChecked,
            setChecked: setChecked,
            enable: enable,
            disable: disable
        }
    }
};
;;(function($){
    $.extend($.fn, {
        dateMenu:function(options){
            /**
             * 当前日期
             * @method curYear
             * */
            var curYear = new Date().getFullYear();
            var defaults = {
                yearRange:curYear-4+'-'+(curYear+5)
            };
            var params = $.extend({},defaults,options);
            var yearDom = $(this).find('.year');
            var monthDom = $(this).find('.month');
            var dayDom = $(this).find('.day');

            var optYear = function(num){
                return '<option>'+ num +'</option>';
            };
            /**
             * 设置年份
             * @method construYear
             * @return string 年份
             * */
            var construYear = function(){
                var range = params.yearRange.split('-');
                var tpl = '';
                for(var i=range[0];i<=range[1];i++){
                    tpl += optYear(i);
                }
                return tpl;
            };
            yearDom.html(construYear());
            /**
             * 设置年份
             * @method construMonth
             * @return string 月份
             * */
            var construMonth = function(){
                var tpl = '';
                for(var i=1;i<=12;i++){
                    tpl += optYear(i);
                }
                return tpl;
            };
            monthDom.html(construMonth());
            /**
             * 设置年份
             * @method construDay
             * @return string 日期
             * */
            var construDay = function(){
                var _year = yearDom.val();
                var _month = monthDom.val();
                var days = new Date(_year,_month,0).getDate();
                var tpl = '';
                for(var i=1;i<=days;i++){
                    tpl += optYear(i);
                }
                return tpl;
            };
            dayDom.html(construDay());

            /**
             * 月份改变事件 :月份变更时，日期随之改变
             * @event monthDom.change
             * @example
             * <pre><code>
             *     &lt;select class="select-content month">
             *         &lt;option>+ construDay() +&lt;/option>
             *     &lt;/select>
             * </pre></code>
             * */
            monthDom.change(function(){
                dayDom.html(construDay());
            });
            /**
             * 年份改变事件 :年份变更时，日期随之改变
             * @event yearDom.change
             * @example
             * <pre><code>
             *     &lt;select class="select-content year">
             *         &lt;option>+ construDay() +&lt;/option>
             *     &lt;/select>
             * </pre></code>
             * */
            yearDom.change(function(){
                dayDom.html(construDay());
            });
            return this;
        }
    })
})(Zepto);
;$(function(){
    /**
     * 验证输入内容为空时
     * */
    $('.form-group input').on('blur',function(){
        if(isNull($(this).val())){
            $(this).closest('.ui-form').find('.reminder').show().html('请输入内容');
        }
    }).on('focus',function(){
        $(this).closest('.ui-form').find('.reminder').hide();
    });
    /**
     * 验证输入字符串是否只由汉字、字母、数字组成
     * */
    $('.form-group input[type="text"]').on('blur',function(){
        if(!isChinaOrNumbOrLett($(this).val())){
            $(this).closest('.ui-form').find('.reminder').show();
        }
    });
    /**
     * 验证手机号
     * */
    $('.form-group input[type="tel"]').on('blur',function(){
        if(!checkMobile($(this).val())){
            $(this).closest('.ui-form').find('.reminder').show();
        }
    });
    /**
     * 验证邮箱
     * */
    $('.form-group input[type="email"]').on('blur',function(){
        if(!isEmail($(this).val())){
            $(this).closest('.ui-form').find('.reminder').show();
        }
    })
});
/**
 * 检查输入字符串是否为空或者全部都是空格
 * @method isNull
 * @param str {string} 输入的内容
 * @return boolean ,true空 ,false非空
 */
function isNull( str ){
    if ( str == "" ) return true;
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    return re.test(str);
}
/**
 * 检查输入字符串是否只由汉字、字母、数字组成
 * @method isChinaOrNumbOrLett
 * @param s {string}
 * @return boolean ,true通过验证, false未通过验证
 * */
function isChinaOrNumbOrLett( s ){
    var regu = "^[0-9a-zA-Z\u4e00-\u9fa5]+$";
    var re = new RegExp(regu);
    if (re.test(s)) {
        return true;
    }else{
        return false;
    }
}
/**
 * 验证输入手机号码是否正确
 * @method checkMobile
 * @param s {number} 手机号
 * @return boolean ,true通过验证 ,false 未通过验证
 * */
function checkMobile( s ){
    var regu =/^[1][3578][0-9]{9}$/;
    var re = new RegExp(regu);
    if (re.test(s)) {
        return true;
    }else{
        return false;
    }
}
/**
 * 验证输入对象的值是否符合E-Mail格式
 * @method isEmail
 * @param str {string} 邮箱
 * @return boolean , true通过验证 ,false未通过验证
 * */
function isEmail( str ){
    var myReg = /^[-_A-Za-z0-9]+@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/;
    if(myReg.test(str)) return true;
    return false;
}
/**
 * @method isDate
 * @param data,fmt {string,string} 日期,日期格式
 * @return boolean ,true通过验证, false未通过验证
 * */
function isDate( date, fmt ) {
    if (fmt==null) fmt="yyyyMMdd";
    var yIndex = fmt.indexOf("yyyy");
    if(yIndex==-1) return false;
    var year = date.substring(yIndex,yIndex+4);
    var mIndex = fmt.indexOf("MM");
    if(mIndex==-1) return false;
    var month = date.substring(mIndex,mIndex+2);
    var dIndex = fmt.indexOf("dd");
    if(dIndex==-1) return false;
    var day = date.substring(dIndex,dIndex+2);
    if(!isNumber(year)||year>"2100" || year< "1900") return false;
    if(!isNumber(month)||month>"12" || month< "01") return false;
    if(day>getMaxDay(year,month) || day< "01") return false;
    return true;
}
;;var isHistoryApi = !!(window.history && history.pushState);

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

window.addEventListener("popstate", function () {
    var currentState = {};
    //currentState = history.state;
    //解决UC不支持history.state的问题
    currentState.page = getQueryString('page');

    if (currentState.page == null) {
        closeModal();
    } else if (currentState.page) {
        openModal(currentState.page, 'history');
    }
});

function openModal(tag) {
    /**
     * 显示窗口
     * @method openModal
     * @param {String} ID 窗口元素的id
     * @example
     *
     * html代码:
     * <pre><code>
     *&lt;div class="modal" id="dialog">
     *      &lt;div class="modal-dialog">
     *          &lt;div class="modal-content">
     *              &lt;div class="modal-header">
     *                  &lt;h4 class="modal-title">Modal title&lt;/h4>
     *              &lt;/div>
     *              &lt;div class="modal-body">
     *                      &lt;p>One fine body&hellip;&lt;/p>
     *
     *              &lt;/div>
     *              &lt;div class="modal-footer">
     *                  &lt;button type="button" class="btn btn-default" data-dismiss="modal">Close&lt;/button>
     *                  &lt;button type="button" class="btn btn-primary">Save changes&lt;/button>
     *              &lt;/div>
     *          &lt;/div>
     *          &lt;!-- /.modal-content -->
     *      &lt;/div>
     *      &lt;!-- /.modal-dialog -->
     * &lt;/div>
     * &lt;!-- /.modal -->
     * </code></pre>
     *
     * javascript代码:
     *<pre><code>
     *     //打开窗口
     *    openModal("dialog");
     * </code></pre>
     */

    var scroll = $(window).scrollTop();
    $('body').attr('data-scroll', scroll).addClass('modal-open');
    $('.modal').removeClass('show');
    $('.page').addClass('fuzzy');
    if (arguments.length === 1) {
        history.pushState({page: tag}, "", "?page=" + tag);
    }
    if ($('#' + tag).is('.modal')) {
        var winH = $(window).height() - 10; //为了用户体验更加良好，设置了10px的偏移
        var modal = $('#' + tag).addClass('show').find('.modal-content');
        var mH = modal.height();
        var pos = winH - mH;
        modal.css('margin-top', pos > 0 ? pos / 2 : 0);

    }
}

/**
 * 关闭窗口
 * @method closeModal
 * @param {String} ID 窗口元素的id
 * @example
 *
 * html代码:
 * <pre><code>
 *&lt;div class="modal" id="dialog">
 *      &lt;div class="modal-dialog">
 *          &lt;div class="modal-content">
 *              &lt;div class="modal-header">
 *                  &lt;h4 class="modal-title">Modal title&lt;/h4>
 *              &lt;/div>
 *              &lt;div class="modal-body">
 *                      &lt;p>One fine body&hellip;&lt;/p>
 *
 *              &lt;/div>
 *              &lt;div class="modal-footer">
 *                  &lt;button type="button" class="btn btn-default" data-dismiss="modal">Close&lt;/button>
 *                  &lt;button type="button" class="btn btn-primary">Save changes&lt;/button>
 *              &lt;/div>
 *          &lt;/div>
 *          &lt;!-- /.modal-content -->
 *      &lt;/div>
 *      &lt;!-- /.modal-dialog -->
 * &lt;/div>
 * &lt;!-- /.modal -->
 * </code></pre>
 *
 * javascript代码:
 *<pre><code>
 *     //打开窗口
 *    closeModal("dialog");
 * </code></pre>
 */
function closeModal(tag) {
    var scroll = $('body').removeClass('modal-open').attr('data-scroll');
    $(window).scrollTop(scroll);
    $('body').removeAttr('data-scroll');
    $('.page').removeClass('fuzzy');
    if (tag) {
        $('#' + tag).removeClass('show');
        history.back();
    } else {
        $('.modal').removeClass('show');
    }
}

$(document).on('click', '[data-toggle="modal"]', function (e) {
    var $this = $(this);
    var href = $this.attr('href');
    openModal($this.attr('data-target'));

    if ($this.is('a')) {
        e.preventDefault()
    }

}).on('click', '[data-dismiss="modal"]', function (e) {
    var $this = $(this);
    var modalId = $this.parents('.modal').attr('id');
    closeModal(modalId);
});

$(function () {
    //url状态响应
    var p = getQueryString('page');
    if (p) {
        openModal(p, 'history');
    }

    $(window).resize(function () {
        var winH = $(window).height() - 10; //为了用户体验更加良好，设置了10px的偏移
        var modal = $('[class="modal show"]').find('.modal-content');
        var mH = modal.height();
        var pos = winH - mH;
        modal.css('margin-top', pos > 0 ? pos / 2 : 0);
    });
});
;$(function() {
    dropDown($('.totle-title'));
    /**
     * @method dropDown
     * */
    function dropDown (obj){
        obj.on('click',function(){
            if($(this).next().hasClass('hide')){
                $(this).next().removeClass('hide');
                $(this).removeClass('fa-caret-right').addClass('fa-caret-down');
            }else {
                $(this).next().addClass('hide');
                $(this).removeClass('fa-caret-down').addClass('fa-caret-right');
            }
        })
    }
});;/**
 * 打开侧边栏
 * @event openSideBar
 * @example
 * a.click(function(){
 *  b.show();
 * })
 * */
function openSideBar() {
    $(document).on('click','[data-toggle="dropDown"]',function() {
        var scroll = $(window).scrollTop();
        $('body').attr('data-scroll', scroll).addClass('modal-open');
        var tag = $(this).attr('data-target');
        var _oTag = $('#' + tag);
        var _width = $(document).width() * 2 / 3;
        _oTag.width(_width);
        _oTag.show();
    })
}

/**
 * 打开侧边栏接口
 * @method autoOpen
 * @param {string} oTag 标签
 * */
function autoOpen(option){
    var oTag = option.oTag;
    setTimeout(function(){
        var scroll = $(window).scrollTop();
        $('body').attr('data-scroll', scroll).addClass('modal-open');
        var _width = $(document).width() * 2 / 3;
        $(oTag).width(_width);
        $(oTag).show();
    },option.delay)
}

/**
 * 关闭侧边栏
 * @event closeSideBar
 * @example
 * a.click(function(){
 *  b.hide();
 * })
 * */
function closeSideBar(option){
    var closeTag = option.closeTag;
    $(document).on('click','[data-dismiss="modal"]',function(){
        $(closeTag).hide();
        var scroll = $('body').removeClass('modal-open').attr('data-scroll');
        $(window).scrollTop(scroll);
        $('body').removeAttr('data-scroll');
    });
}

/**
 * 关闭侧边栏接口
 * @method autoClose
 * @param {string} oTag 标签
 * */
function autoClose(option){
    var oTag = option.oTag
    setTimeout(function(){
        $(oTag).hide();
        var scroll = $('body').removeClass('modal-open').attr('data-scroll');
        $(window).scrollTop(scroll);
        $('body').removeAttr('data-scroll');
    },option.delay)
};$(function () {
    $(document).on('click', '.spinner', function (e) {

        var $this = $(this),
            $input = $this.find('input'),
            $val = parseInt($input.val()),
            $min = parseInt($input.prop('min')),
            $max = parseInt($input.prop('max')),
            $minus = $this.find('.minus'),
            $plus = $this.find('.plus');

        if ($(e.target).is('.minus') && !$this.is('.disable')) {
            if ($val > $min) {
                --$val;
                $input.val($val);
            }
            updata();
        } else if ($(e.target).is('.plus') && !$this.is('.disable')) {
            if ($val < $max) {
                ++$val;
                $input.val($val);
            }
            updata();
        }
        function updata() {
            var isMax = $val == $max,
                isMin = $val == $min;

            if (isMax) {
                $plus.addClass('disable');
            } else {
                $plus.removeClass('disable');
            }

            if (isMin) {
                $minus.addClass('disable');
            } else {
                $minus.removeClass('disable');
            }
            $this.trigger('spinner:change');
        }


    }).on('blur','.spinner > input', function (e) {
        $(this).parent().trigger('spinner:change');
    }).on('click','.spinner > input', function (e) {
        $(this)[0].select();
    })
});

(function ($) {
    $.fn.spinner = function (options) {
        /**
         * 数字微调组件允许开发人员使用代码来控制值和状态,获取当前值。
         *
         *
         * @method spinner
         * @param {Number|String} value 组件值/状态，参数：无 | 数值 | disable | enable
         * @return {Number} value 返回组件的当前值
         * @example
         *
         * html代码:
         *<pre><code>
         *
         * &lt;div class="spinner" id="test">
         * &lt;a href="javascript:void(0);" class="minus">&lt;/a>&lt;input type="number" min="1" max="10" value="1" maxlength="3">&lt;a href="javascript:void(0);" class="plus">&lt;/a>&lt;!--代码禁止换行-->
         * &lt;/div>
         *
         *</code></pre>
         *
         * javascript代码:
         *<pre><code>
         *     //获取当前值
         *     $("#test").spinner() //返回当前值
         *
         *     //设置组件值，并返回当前值
         *     $("#test").spinner(20) //设置值为20，并返回当前值20
         *
         *     //设置禁用状态
         *     $("#test").spinner("disable") //返回当前值
         *
         *     //设置启用状态
         *     $("#test").spinner("enable") //返回当前值
         *
         *   </code></pre>
         */
        options = typeof options === "string" ? options.toLowerCase() : options;
        var $this = $(this),
            $input = $this.find('input'),
            $val = parseInt($input.val()),
            $min = parseInt($input.prop('min')),
            $max = parseInt($input.prop('max')),
            $minus = $this.find('.minus'),
            $plus = $this.find('.plus');

        function updata() {
            var isMax = $val == $max,
                isMin = $val == $min;

            if (isMax) {
                $plus.addClass('disable');
            } else {
                $plus.removeClass('disable');
            }

            if (isMin) {
                $minus.addClass('disable');
            } else {
                $minus.removeClass('disable');
            }

            /**
             * 状态改变事件
             * @event spinner:change
             * @example
             * html代码:
             * <pre><code>
             * &lt;div class="spinner" id="test">
             * &lt;a href="javascript:void(0);" class="minus">&lt;/a>&lt;input type="number" min="1" max="10" value="1" maxlength="3">&lt;a href="javascript:void(0);" class="plus">&lt;/a>&lt;!--代码禁止换行-->
             * &lt;/div>
             * </code></pre>
             *
             *javascript代码:
             * <pre><code>
             * //添加状态变更事件
             * $("#test").on("spinner:change",function(){
             *  alert("状态/值改变");
             * }) //返回当前值
             *
             * </code></pre>
             */
            $this.trigger('spinner:change');
        }


        if (typeof options === "number") {
            $input.val(options);
            $val = options;
            updata();
        } else if (options === 'disable') {
            $this.addClass("disable");
            $input.prop("disabled", true);
            updata();
        } else if (options === 'enable') {
            $this.removeClass("disable");
            $input.prop("disabled", false);
            updata();
        }
        return $val;
    }
})(Zepto);

;$(function () {
    $(".switch").on('click',function () {
        var $this = $(this);
        if ($this.is(".active")) {
            $this.removeClass("active").find('input[type="checkbox"]').prop('checked', false);
        } else {
            $this.addClass("active").find('input[type="checkbox"]').prop('checked', true);
        }
        $this.trigger('switch:change');
    }).on('swipeLeft swipeRight', function (e) {
        if (e.type === 'swipeLeft') {
            $(this).switch("off");
        } else if (e.type === 'swipeRight') {
            $(this).switch("on");
        }
    });
});


(function ($) {
    $.fn.switch = function (options) {
        /**
         * 开关组件允许开发人员使用代码来控制开关状态。
         *
         *
         * @method switch
         * @param {String} [state] 开关状态，参数：on | off | disable | enable
         * @return {Boolean} [state] 返回代表状态的布尔值 false | true
         * @example
         *
         * html代码:
         *<pre><code>
         *     &lt;div class="switch" id="test">
         *          &lt;div class="switch-handle">&lt;/div>
         *          &lt;input type="checkbox"/>
         *     &lt;/div>
         *
         *</code> </pre>
         *
         * javascript代码:
         *<pre><code>
         *     //获取状态
         *     $("#test").switch() //返回布尔值
         *
         *     //设置开启状态
         *     $("#test").switch("on") //返回布尔值 true
         *
         *     //设置关闭状态
         *     $("#test").switch("off") //返回布尔值 false
         *
         *     //设置禁用状态
         *     $("#test").switch("disable") //返回布尔值
         *
         *     //设置启用状态
         *     $("#test").switch("enable") //返回布尔值
         *
         *   </code> </pre>
         */
        options = typeof options === "string" ? options.toLowerCase() : "";
        var $this = $(this);
        if (options === 'on') {
            $this.addClass("active").find('input[type="checkbox"]').prop('checked', true);
            $this.addClass("active");
        } else if (options === 'off') {
            $this.removeClass("active").find('input[type="checkbox"]').prop('checked', false);
            $this.removeClass("active");
        } else if (options === 'disable') {
            $this.addClass("disable").find('input[type="checkbox"]').prop('disabled', true);
        } else if (options === 'enable') {
            $this.removeClass("disable").find('input[type="checkbox"]').prop('disabled', false);
        }
        /**
         * 状态改变事件
         * @event switch:change
         * @example
         *
         * html代码:
         * <pre><code>
         *  &lt;div class="switch" id="test">
         *      &lt;div class="switch-handle">&lt;/div>
         *      &lt;input type="checkbox"/>
         *  &lt;/div>
         * </code></pre>
         *
         *
         *javascript代码:
         * <pre><code>
         * //添加状态变更事件
         * $("#test").on("switch:change",function(){
         *  alert("状态改变")；
         * }) //返回布尔值
         *
         * </code></pre>
         */

        $(this).trigger('switch:change');
        return $this.find('input[type="checkbox"]').prop('checked');
    }
})(Zepto);;$(function(){
    $('.ui-tab .nav li').on('click',function(){
        $(".ui-tab .nav .current").removeClass('current');
        $(this).addClass('current');
        $('.ui-tab .content>li').addClass('hide');
        $('.ui-tab .content>li').eq($(this).index()).removeClass('hide');
    });
});;var toast = function (msg, callback, time) {
    /**
     * 简洁的信息提示框，自动在1.5秒后消失，用于在不阻断用户正常交互的情况下显示用户操作后的信息反馈。
     *
     * @method toast
     * @param {String} msg 信息的内容
     * @param {Function} [callback] 信息显示后的回调函数
     * @param {Number} [time=1500] 信息显示时间，默认1.5秒
     * @example
     * <pre><code>
     *    //一般
     *    toast("成功加入购物车");
     *
     *    //定义显示时间
     *    toast("加入购物车失败","",3000);
     *
     *    //定义回调
     *    toast("欢迎使用MobileKit框架！",function(){
     *          alert("信息显示完成");
     *    });
     * </code></pre>
     */
    var doc = document, timer;

    time = time || 1500;
    msg = msg.toString();
    if (doc.getElementById("styleToast") == null) {
        var style = doc.createElement("style");
        style.setAttribute("id", "styleToast");
        style.innerHTML = ".toast{box-sizing:border-box;position:fixed;width:100%;left:0;bottom:60px;z-index:999;display:none;padding:10px}" +
            ".toast-content{display: table;padding: 8px 10px;background-color: rgba(0,0,0,.8);" +
            "border:1px solid #fff;box-shadow: 0 0 10px #a3a3a3;margin: 0 auto;color: #fff;" +
            "border-radius: 6px;text-align: center;max-width:300px;font-size: .9rem;line-height:1.3}";
        var heads = doc.getElementsByTagName("head");
        if (heads.length) {
            heads[0].appendChild(style);
        } else {
            doc.body.appendChild(style);
        }
    }

    var toastBox = doc.createElement("div"),
        con = doc.createElement("div");
    toastBox.setAttribute("class", "toast");
    con.setAttribute("class", "toast-content");
    toastBox.appendChild(con);
    doc.body.appendChild(toastBox);

    toastBox.getElementsByTagName("div")[0].innerHTML = msg;
    toastBox.style.display = "block";
    timer = setTimeout(function () {
        toastBox.style.display = "none";
        toastBox.parentNode.removeChild(toastBox);
        if (typeof callback === "function") {
            callback();
        }
    }, time);
};
function initTreelistDate(args,obj,placeholder) {
    var html = '';
    for (var i = 0, len = args.length; i < len; i++){
        if(args[i].name){
            html += '<li data-val="' + args[i].name + '" id="' + args[i].id + '"><span>' + args[i].name + '</span>'; //一级
            var list = args[i]['childlist'];
            if(list){
                var len = list.length;
                if (len) {
                    html += '<ul>';
                    for(var j = 0; j< len; j++){
                        if(list[j].name){
                            html += '<li data-val="' + list[j].name + '" id="' + list[j].id +'"><span>' + list[j].name + '</span>'; //二级
                            var child = list[j]['childlist'];
                            if(child){
                                var child_len= child.length;
                                if(child_len){
                                    html += '<ul>';
                                    for(var k = 0 ; k < child_len; k++){
                                        if(child[k].name){
                                            html += '<li data-val="' + child[k].name + '" id="' + child[k].id +'"><span>' + child[k].name + '</span></li>'; //三级
                                        }
                                    }
                                    html += '</ul></li>';
                                }else{
                                    html += '</li>';
                                }
                            }else{
                                html += '</li>';
                            }
                        }
                    }
                    html += '</ul></li>';
                }else{
                    html += '</li>';
                }
            }
        }
    }
    obj.append(html);
    /*
     *  初始化treelist
     */
    obj.mobiscroll().treelist({
        placeholder: placeholder,
        lang: 'zh',
    });
}
/**
 * 获取选择数据id的方法
 */
function getTreelistId(id){
    var value = $('#' + id + "_dummy").val();
    var array = [];
    if(value){
        var arr = value.split(" ");
        for(var i =0, len = arr.length; i < len; i++){
            var obj = $('#' + id + ' li[data-val="'+ arr[i] +'"]');
            if(obj.length){
                var id = obj.attr('id');
                if(id){
                    array.push(id);
                }
            }
        }
    }
    return array;
}