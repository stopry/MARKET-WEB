$(function () {
    var money = Util.getQueryString('money');
    var code = Util.getQueryString('code');
    var recDatas = {
        'code': code
    }

    var openid;
    ajaxHelper.get(getUrl('game/wx/getOpenid'), recDatas, function (ret) {
        if (ret.success) {
            openid = ret.obj;
            pay();
        } else {
            showTips('获取OPENID异常', "error");
        }
    });



    function  pay() {
        var userInfo=JSON.parse(localStorage.getItem('userInfo'));
        var data = {
            clientId: "123456",
            openid: openid,
            payAmt: "0.01",
            payChannel: "1",
            payType: "1",
            uid: userInfo.id
        }

        ajaxHelper.post(getPayUrl("pay/pay"), data, function (ret) {
            if (ret.success) {
                var obj = ret.obj;
                var payinfo = JSON.parse(obj.payinfo);
                toWxPay(payinfo);
            } else {
                showTips('获取OPENID异常', "error");
            }
        });
    }


    var wxData = {
        appId: null,
        timeStamp: null,//时间戳，自1970年以来的秒数
        nonceStr: null, //随机串
        package: null,
        signType: "MD5",//微信签名方式：
        paySign: null, //微信签名
    }



    function toWxPay(obj) {
        wxData.appId = obj.appId;
        wxData.timeStamp = obj.timeStamp+"";
        wxData.nonceStr = obj.nonceStr;
        wxData.package = obj.package;
        wxData.paySign = obj.paySign;
        if (typeof WeixinJSBridge == "undefined") {
            if (document.addEventListener) {
                document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
            } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
            }
        } else {
            onBridgeReady(wxData);
        }
    }


    function onBridgeReady(data) {

        WeixinJSBridge.invoke(
            'getBrandWCPayRequest', {
                "appId": data.appId,     //公众号名称，由商户传入
                "timeStamp": data.timeStamp,         //时间戳，自1970年以来的秒数
                "nonceStr": data.nonceStr, //随机串
                "package": data.package,
                "signType": "MD5",         //微信签名方式：
                "paySign": data.paySign//微信签名
            },
            function (res) {
                if (res.err_msg == "get_brand_wcpay_request:ok") {
                    location.href = 'html/recharge-success.html?money='+money+'&type=wx';
                }
            }
        );
    }
});