$(function () {
    var type=Util.getQueryString('type');
    var money=Util.getQueryString('money');

    if(type =='wx'){
        $("#type").html("微信支付");
        $("#money").html("￥"+parseInt(money).toFixed(2));
    }
    if(type == 'yl'){
        $("#type").html("银联支付");
        $("#money").html("￥"+money);
    }
    if(type == 'zfb'){
        $("#type").html("支付宝支付");
        $("#money").html("￥"+parseInt(money).toFixed(2));
    }

    $("#ok").click(function () {
        location="gold-recharge.html";
    });
})