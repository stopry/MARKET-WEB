$(function () {
    var id=Util.getQueryString("id");
    var lock = Lock.createNew();
    if (!lock.getLock()) {
        return;
    }
    ajaxHelper.get(getUrl('tran/entrustRecordDetailQuery'), {id:id}, function (ret) {
        if (ret.success) {
            var info = ret.obj;
            $("#proName").html(info.proName+"("+(info.enType=="0"?"买":"卖")+")");
            $("#amt").html(info.trAmt);
            $("#trPrice").html(info.trPrice);
            $("#trCnt").html(info.trCnt);
            $("#trAmt").html(info.trAmt);
            $("#trCharge").html(info.trCharge);
            $("#trTime").html(Util.formatDate(info.trTime));

        } else {
            showTips('加载信息异常',"error");
        }
        lock.release();
    });

});





