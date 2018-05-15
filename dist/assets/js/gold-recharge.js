$(function () {
    //若是从market APP跳转至本页面
    var _token = Util.getQueryString('token');
    if(_token){//如果带了token过来
        _token = decodeURI(_token);
        oauth.setToken(_token);
        //加载信息
        loadInfo();
    }
    //如果由其他应用跳转过来- isFromGame 重新加载用户信息
    if(sessionStorage.getItem('isFromGame')){
        loadInfo();
    }

    var userInfo=JSON.parse(localStorage.getItem('userInfo'));

    function loadInfo() {
        var lock = Lock.createNew();
        if (!lock.getLock()) {
            return;
        }
        ajaxHelper.get(getUrl('user/getUserInfo'), {}, function (ret) {
            if (ret.success) {
                userInfo = ret.obj.userInfo;
                localStorage.setItem('userInfo', JSON.stringify(userInfo));
                userInfo = JSON.parse(localStorage.getItem('userInfo'));
            } else {
                showTips('加载信息异常',"error");
            }
            lock.release();
        });
    }


    var money = 10;//默认金额50
    var payType = 1;//默认支付方式快捷支付 input输入支付为2
    var payChannel = 1;//默认支付渠道 微信 1 2 3 微信 支付宝 银联
    var _index = 0;//默认快捷支付选择的dom index

    // 快捷支付选择效果
    $(".quickPayBox .payItem").click(function () {
        payType = 1;
        $(this).addClass('active').siblings(".payItem").removeClass('active');
        var idx = $(this).index();
        _index = idx;
        var _money = $(this).data("val");
        money = _money;
        //$("#rchNum").val(money);
    });
    //支付渠道选择效果
    $(".thirdPay .thirdItem").click(function () {
        $(this).addClass('active').siblings(".thirdItem").removeClass('active');
        var _idx = $(this).index();
        payChannel = _idx+2;
        console.log(payChannel);
    });
    // 输入框事件
    $(".rchNum").focus(function () {//输入框获得焦点事件
        $(".quickPayBox .payItem").removeClass('active');
    }).blur(function () {//输入框是去焦点事件
        var iptMoney = $.trim($(this).val());
        if(!iptMoney||iptMoney<=0){
            $(this).val('');
            $(".quickPayBox .payItem").eq(_index).addClass('active').siblings(".payItem").removeClass('active');
        }else{
            money = iptMoney;
            payType = 2;
        }
    });



    $("#next").click(function (){
        showTips('充值暂时关闭', "warm");

    })

});