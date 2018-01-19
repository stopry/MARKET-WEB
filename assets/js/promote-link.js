$(function () {

    var qrcode = new QRCode(document.getElementById("qrcode"), {
        width : 100,
        height : 100
    });

    var lock = Lock.createNew();
    if (!lock.getLock()) {
        return;
    }
    ajaxHelper.get(getUrl('user/getUserInfo'), {}, function (ret) {
        if (ret.success) {
            var userInfo = ret.obj.userInfo;
            var qrStr = 'http://www.zjiayuan.com?sid='+userInfo.id;
            $('.codeText').html(userInfo.id);
            $('.promoteLinkText').html(qrStr);
            $('#foo').html(qrStr);
            qrcode.makeCode(qrStr);
            new Clipboard('.copyAddress');
            $("#copyAddress").click(function () {
                showTips('复制成功',"success");
            })
        } else {
            showTips('加载信息异常',"error");
        }
        lock.release();
    });
});