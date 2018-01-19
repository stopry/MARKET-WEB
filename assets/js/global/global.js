
$(function(){
    FastClick.attach(document.body);
    function autoFooterHeader(){
        var winWidth = $(window).width();
        // var fwidth = $('.footer').width()|600;
        var fwidth = 600;
        var left = (winWidth-fwidth)/2;
        $(".header").css("left",left+'px');
        $(".footer").css("left",left+'px');
        $(".tipsArea").css("left",left+'px');
        $(".goldTotal").css("left",left+'px');
        $("#alertWeek").css("left",left+'px');
        $(".oprBtnWrap").css("left",left+'px');
        $(".dgtOrderBox").css("left",left+'px');
        $(".marketBuyBox").css("left",left+'px');
        $(".marketsaleBox").css("left",left+'px');
        $(".botOprArea").css("left",left+'px');
    }
    function setFont() {
       var _winW = $(window).width();
       if(_winW>640){
         $('html').css('font-size','60px');
       }
     }
     
     function setHF(){
         if(isPc()){
            setFont();
            $(window).resize(function () {
                setFont()
            });
            autoFooterHeader();
            $(window).resize(function(){
                autoFooterHeader();
            })
         }
     }
     setHF();
     _Z.ui.feedbtn('.feedbtn');
});
//判断是否是pc
function isPc() {
    var ua = window.navigator.userAgent.toLowerCase();//微信
    var u = navigator.userAgent;//手机类型android或ios
    if(ua.match(/MicroMessenger/i) == 'micromessenger'){//微信
        return false;
    }else if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {//安卓手机
        return false;
    } else if (u.indexOf('iPhone') > -1) {//苹果手机
        return false;
    } else {
        return true;
    }
};
//显示提示信息
function showTips(msg,cla) {
    msg = msg || '空';
    cla = cla || '';
    var timer = null;
    $('#alertWeek').remove();
    var $alert = $('<div class="week-alert '+cla+'" id="alertWeek"></div>');
    $('body').append($alert);
    if(isPc()){
        var winWidth = $(window).width();
        var left = (winWidth-600)/2;
        $('#alertWeek').css('left',left+'px');
    }
    $alert.html(msg);
    $alert.addClass('alert-show');
    clearTimeout(timer);
    timer = setTimeout(function ()  {
            $alert.remove();
    }, 1900);
};
//显示关闭加载 TRUE显示 false关闭 默认打开
function showLoading(bool) {
    if(bool){
        $('#loadingToast').remove();
        var loading = $(
            "<div id=\"loadingToast\" style=\"opacity: 1; display: block;\">\n" +
            "    <div class=\"weui-mask_transparent\"></div>\n" +
            "    <div class=\"weui-toast\">\n" +
            "      <i class=\"weui-loading weui-icon_toast\"></i>\n" +
            "      <p class=\"weui-toast__content\">数据加载中</p>\n" +
            "    </div>\n" +
            "  </div>"
        );
        $('body').append(loading);
    }else{
        $('#loadingToast').remove();
    }
};
//显示遮罩层
function showLayer(bool) {
    $('.layerShadow').remove();
    if(bool){
        var $alert = $('<div class="layerShadow"></div>');
        $('body').append($alert);
    }else{
        $('.layerShadow').remove();
    }
};
//显示带背景色的遮罩层
function showLayerBlack(bool) {
    $('.layerShadow2').remove();
    if(bool){
        var $alert = $('<div class="layerShadow2"></div>');
        $('body').append($alert);
    }else{
        $('.layerShadow2').remove();
    }
};
//固定定位元素垂直居中
function objVerticalCenter(obj){
    var h = $(window).height();
    var w = $(window).width();
    var ow = $(obj).width();
    var oh = $(obj).height();
    var l = (w-ow)/2+'px';
    var t = (h-oh)/2+'px';
    $(obj).css({top:t,left:l});
};
//显示确认对话框的遮罩层
function showLayerDia(bool) {
    $('.layerShadow3').remove();
    if(bool){
        var $alert = $('<div class="layerShadow3"></div>');
        $('body').append($alert);
    }else{
        $('.layerShadow3').remove();
    }
};
//显示操作确认框
function showConDia(text,confirmFn,cancelFn){
    var body = $('body');
    showLayerDia(1);

    var confirDia =$(
        '<div class="confirmDia">'+
        '<div class="conHeader"><i class="closeThis feedbtn">×</i></div>'+
        '<div class="diaText">'+
        text+
        '</div>'+
        '<div class="btnWrap">'+
        '<div class="opBtn cancelBtn fl feedbtn">'+
        '取消'+
        '</div>'+
        '<div class="opBtn confimBtn fr feedbtn">'+
        '确定'+
        '</div>'+
        '</div>'+
        '</div>'
    );
    confirDia.css({
        height:'200px',
        top:($(window).height()-200)/2
    });
    body.append(confirDia);
    confirDia.find('.cancelBtn').click(function(){
        cancelFn();
        confirDia.remove();
        $('.confirmDia').remove();
        showLayerDia(!1);
    });
    confirDia.find('.confimBtn').click(function(){
        confirmFn();
        $('.confirmDia').remove();
        confirDia.remove();
        showLayerDia(!1);
    });
    //关闭
    confirDia.find('.closeThis').click(function(){
        $('.confirmDia').remove();
        confirDia.remove();
        showLayerDia(!1);
    });
};
//显示带输入框的确认框
function showConIpt(text,confirmFn,cancelFn){
    var body = $('body');
    showLayerDia(1);
    var confirDia =$(
        '<div class="confirmDia">'+
        '<div class="conHeader"><i class="closeThis feedbtn">×</i></div>'+
        '<div class="diaText">'+
        text+
        '</div>'+
        '<input type="password" placeholder="请输入交易密码" id="payPwd">'+
        '<div class="btnWrap">'+
        '<div class="opBtn cancelBtn fl feedbtn">'+
        '取消'+
        '</div>'+
        '<div class="opBtn confimBtn fr feedbtn">'+
        '确定'+
        '</div>'+
        '</div>'+
        '</div>'
    );
    confirDia.css({
        height:'200px',
        top:($(window).height()-200)/2
    });
    body.append(confirDia);
    confirDia.find('.cancelBtn').click(function(){
        cancelFn();
        confirDia.remove();
        showLayerDia(!1);
    });
    confirDia.find('.confimBtn').click(function(){
        var pwd = confirDia.find('#payPwd').val();
        if(!pwd){
            showTips('请输入交易密码','error');
            return;
        }
        confirmFn(pwd);
        confirDia.remove();
        showLayerDia(!1);
    });
    //关闭
    confirDia.find('.closeThis').click(function(){
        confirDia.remove();
        showLayerDia(!1);
    });
};
//判断页面是否到达底部
function isBot(){
    var wh = $(window).height();
    var sct = $(window).scrollTop();
    var dh = $(document).height();
    if(wh+sct===dh){
        //到达底部
        return true;
    }
    //没有
    return false;
};
//验证码倒计时
/**
*@obj 获取验证码的按钮
*@_interVal 倒计时
*@_timer 倒计时时间
 *
 * *  */
var canGetVcode = true;//是否可以获取验证码
function vCodeCount(obj,_interVal,_timer){
    canGetVcode = false;
    console.log(canGetVcode,444);
    $(obj).addClass('disable');
    _interVal = setInterval(function () {
        _timer -- ;
        $(obj).html(_timer);
        if(_timer<=0){
            clearInterval(_interVal);
            canGetVcode = true;
            _timer = 90;
            $(obj).removeClass('disable');
            $(obj).html('重新获取');
        }
    },1000);
};
//更新本地存储的用户信息；
function updateUserInfo() {
    var lock = Lock.createNew();
    if (!lock.getLock()) {
        return;
    }
    ajaxHelper.get(getUrl('user/getUserInfo'), {}, function (ret) {
        if (ret.success) {
            var userInfo = ret.obj.userInfo;
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
        } else {
            // showTips('加载账户信息异常',error);
        }
        lock.release();
    });
}

//显示返回游戏浮标
function initBackGameBtn(){
    var BackBtn = '<div class="backGame feedbtn" onclick="backGame()"></div>';
    $('.backGame').remove();
    $('body').append(BackBtn);
    var isTouch = false;
    var w = $(window).width();
    var h = $(window).height();
    var btn = document.querySelector('.backGame');
    btn.addEventListener('touchstart',function(){
        event.stopPropagation();
        $('.backGame').css('opacity',0.618);
        isTouch = true;
    });
    btn.addEventListener('touchmove',function(event){
        event.stopPropagation();
        event.preventDefault();
        if(!isTouch) return;
        var x = event.changedTouches['0'].clientX-20;
        var y = event.changedTouches['0'].clientY-20;
        if(Math.abs(x)>w-20||x<-20) return;
        if(Math.abs(y)>h-20||y<-20) return;
        // console.log(x,y);
        $(btn).css({top:y,left:x});
    });
    btn.addEventListener('touchcancel',function(){
        event.stopPropagation();
        $('.backGame').css('opacity',1);
        isTouch = true;
    });
    btn.addEventListener('touchend',function(){
        event.stopPropagation();
        $('.backGame').css('opacity',1);
        isTouch = true;
    });
}
function backGame(){
    window.open("http://www.zjiayuan.com", "_blank");
}
$(function(){
   if(sessionStorage.getItem('isFromGame')){
       initBackGameBtn();
   }
});