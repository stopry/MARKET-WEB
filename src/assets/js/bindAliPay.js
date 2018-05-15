$(function () {


    var userInfo=JSON.parse(localStorage.getItem('userInfo'));
    $("#realName").val(userInfo.realName);

    autoInput();
    function autoInput(){
        if(!userInfo.alipayName||!userInfo.alipayAcc) return;

        $("#aliName").val(userInfo.alipayName)
        $("#aliAct").val(userInfo.alipayAcc)
        $('#bindBankBtn').addClass('dis').removeClass('feedbtn').prop('disabled',true);
    }

    var bindLock = Lock.createNew();
    $('#bindBankBtn').on('click', function () {
        // if(is)
        var para = {};
        para.alipayName = FormUtil.getParaVal('#aliName');
        para.alipayAcc = FormUtil.getParaVal('#aliAct');
        if (!bindLock.getLock()) {
            return;
        }
        ajaxHelper.post(getUrl('security/bandAliPay'), para, function (ret) {
            if (ret.success) {
                showTips('绑定成功','success');
                setTimeout(function () {
                  location="user-center.html";
                },2000);
            } else {
                showTips(ret.msg,"error");
            }
            bindLock.release();
        });
    });
});