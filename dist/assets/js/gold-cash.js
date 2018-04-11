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
        showTips('请输入二级密码');
        return false;
    }else if(pwd.length!=6||isNaN(pwd)){
        showTips('二级密码必须是6位纯数字');
        return false;
    }else if(amt<1000 || amt>1000000) {
        showTips('提现金币必须大于1000小于1000000金币');
        return false;
    }else if(amt%1000!=0){
        showTips('提现金币必须必须是1000的倍数');
        return false;
    }

    var data = {
        amt: $("#cashGold").val(),
        payPwd: $("#payPwd").val()
    }
    ajaxHelper.post(getUrl("acct/withdraw"), data, function (ret) {
        if (ret.success) {

            location = '/html/cash-success.html?gold='+data.amt;

            //   layer.confirm('提现成功', {
            //     btn: ['确定'] //按钮
            //   }, function () {
            //     location.reload();
            //   });
            // showTips('提现成功');
            // setTimeout(function () {
            //   location.reload();
            // },3000);
        } else {
            showTips(ret.msg, "error");
        }
        lock.release();
    },false);
}