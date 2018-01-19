$(function () {
    var id=Util.getQueryString("id");
    var lock = Lock.createNew();
    if (!lock.getLock()) {
        return;
    }
    ajaxHelper.get(getUrl('acct/withdrawDetail'), {id:id}, function (ret) {
        if (ret.success) {
            var info = ret.obj;
            $("#amt").html((info.amt).toFixed(2));
            $("#status").html(showWithdrawStatus(info.status));
            $("#charge").html((info.charge).toFixed(2));
            $("#cardNo").html(info.cardNo);
            $("#withdrawTime").html(Util.formatDate(info.withdrawTime));
            $("#orderId").html(info.orderId);

        } else {
            showTips('加载信息异常',"error");
        }
        lock.release();
    });

});

