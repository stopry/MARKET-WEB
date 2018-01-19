$(function () {


    load();


    function load() {
        var lock = Lock.createNew();
        if (!lock.getLock()) {
            return;
        }
        ajaxHelper.get(getUrl('user/getUser'), null, function (ret) {
            if (ret.success) {
                var obj = ret.obj;
                $("#useableGold").val(obj.usableBalance);
                if(obj.bankName == null || obj.cardNo == null || obj.realName == null){
                    showTips('请先设置提现账户',"error");
                }else {
                     $("#cashBank").val(obj.bankName+"-"+obj.realName+"-"+obj.cardNo);
                }

            } else {
                showTips('加载信息异常',"error");
            }
            lock.release();
        },false);
    }



});


function withdraw() {
    var lock = Lock.createNew();
    if (!lock.getLock()) {
        return;
    }
    var amt=$("#cashGold").val();
    var pwd=$("#payPwd").val();
    if(!amt){
        showTips('请输入提现金额');
        return false;
    }else if(!pwd){
        showTips('请输入支付密码');
        return false;
    }else if(pwd.length!=6||isNaN(pwd)){
        showTips('支付密码必须是6位纯数字');
        return false;
    }else if(amt<100 || amt>10000) {
        showTips('提现金额必须大于100元小于10000元');
        return false;
    }

    var data = {
        amt: $("#cashGold").val(),
        payPwd: $("#payPwd").val()
    }
    ajaxHelper.post(getUrl("acct/withdraw"), data, function (ret) {
        if (ret.success) {
            showTips('提现成功');
            location.reload();
        } else {
            showTips('提现异常', "error");
        }
        lock.release();
    },false);
}