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



    $("#next").click(function () {
        var iptVal = $.trim($("#rchNum").val());
        money = iptVal||money;
        //var money=$("#rchNum").val();
        if(money<10){
            showTips('充值金额必须大于10元',"error");
            return;
        }
        //微信支付
        if(payChannel == 1){
            //
            if(Util.isWeiXin()){
                var redirect_url = 'http%3a%2f%2fpay.zjiayuan.com%2fwxpay.html%3fmoney%3d'+money+'%26userId%3d'+userInfo.id;
                var appid = 'wxaaefb51cb3707a3a';
                var url= 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid + '&redirect_uri=' + redirect_url + '&response_type=code&scope=snsapi_base&state=123#wechat_redirect';
                location.href=url;
            }else {
                showTips('请在微信中打开', "warm");
               /*
                var data = {
                    clientId: "123456",
                    openid: "",
                    payAmt: money,
                    payChannel: "1",
                    payType: "3",
                    uid: userInfo.id
                }

                ajaxHelper.post(getPayUrl("pay/pay"), data, function (ret) {
                    if (ret.success) {
                        var obj = ret.obj;
                        if(obj.retcode == 'SUCCESS'){
                            var qrurl=obj.payinfo;
                            var orderno=obj.order;
                            window.location.href="/html/wexin-pay-QR.html?qrurl="+qrurl+"&orderno="+orderno+"&money="+money
                        }else {
                            showTips('获取二维码异常', "error");
                        }

                    } else {
                        showTips('获取二维码异常', "error");
                    }
                });*/
            }

        }
        //支付宝支付
        if(payChannel == 2){
            var data = {
                clientId: "123456",
                openid: "",
                payAmt: money,
                payChannel: "2",
                payType: "4",
                uid: userInfo.id
            }

            ajaxHelper.post(getPayUrl("pay/pay"), data, function (ret) {
                if (ret.success) {
                    var obj = JSON.parse(ret.obj);
                    var qrurl=obj.trade_qrcode;
                    var orderno=obj.out_no;
                    window.location.href="/html/alipay-pay-QR.html?qrurl="+qrurl+"&orderno="+orderno+"&money="+money

                } else {
                    showTips('获取二维码异常', "error");
                }
            });
        }
        //银联支付
        if(payChannel == 3){
            var data = {
                clientId: "123456",
                openid: "",
                payAmt: money,
                payChannel: "3",
                payType: "6",
                uid: userInfo.id
            }

            ajaxHelper.post(getPayUrl("/pay/pay"), data, function (ret) {
                if (ret.success) {
                    var obj = ret.obj;
                    $("#form").attr("action",obj.url);
                    $("#inputCharset").val(obj.requestorder.inputCharset);
                    $("#pickupUrl").val(obj.requestorder.pickupUrl);
                    $("#receiveUrl").val(obj.requestorder.receiveUrl);
                    $("#version").val(obj.requestorder.version);
                    $("#signType").val(obj.requestorder.signType);
                    $("#merchantId").val(obj.requestorder.merchantId);
                    $("#orderNo").val(obj.requestorder.orderNo);
                    $("#orderAmount").val(obj.requestorder.orderAmount);
                    $("#orderCurrency").val(obj.requestorder.orderCurrency);
                    $("#orderDatetime").val(obj.requestorder.orderDatetime);
                    $("#orderExpireDatetime").val(obj.requestorder.orderExpireDatetime);
                    $("#productName").val(obj.requestorder.productName);
                    $("#productDesc").val(obj.requestorder.productDesc);
                    $("#payType").val(obj.requestorder.payType);
                    $("#ext1").val(obj.requestorder.ext1);
                    $("#signMsg").val(obj.strSignMsg);
                    $("#form").submit();
                } else {
                    showTips('获取银联支付异常', "error");
                }
            });
        }

    })

});