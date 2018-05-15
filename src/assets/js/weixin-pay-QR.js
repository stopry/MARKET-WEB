$(function () {

    var qrcode = new QRCode(document.getElementById("qrCode"), {
        width : 200,
        height : 200
    });


    var qrurl = Util.getQueryString('qrurl');
    var orderno = Util.getQueryString('orderno');
    var money = Util.getQueryString('money');

    $("#order").html(orderno);
    $("#amount").html(money);
    qrcode.makeCode(qrurl);


    setInterval(function () {
        query(orderno);
    },3000);

    function query(orderno) {
        var data = {
            orderNo: orderno
        }
        ajaxHelper.get(getPayUrl("pay/query"), data, function (ret) {
            if (ret.obj) {
                location.href = 'html/recharge-success.html?money='+money+'&type=wx';
            }
        },false);

    }

})