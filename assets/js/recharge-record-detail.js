$(function () {
    var id=Util.getQueryString("id");
    var lock = Lock.createNew();
    if (!lock.getLock()) {
        return;
    }
    ajaxHelper.get(getUrl('acct/rechargeDetail'), {id:id}, function (ret) {
        if (ret.success) {
            var info = ret.obj;
            $("#payType").html(showPayChannel(info.payType));
            $("#payAmt").html(info.payAmt);
            $("#status").html(showRechargeStatus(info.status));
            $("#payType2").html(showPayChannel(info.payType));
            $("#remark").html(info.remark);
            $("#payTime").html(Util.formatDate(info.payTime));
            $("#outOrder").html(info.outOrder);

        } else {
            showTips('加载信息异常',"error");
        }
        lock.release();
    });

});

