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


})