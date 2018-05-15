var cashType = 1;
$(function () {

    var alipayAcc = ''
    var ylAcc = ''
    var isBindAlipay = false;
    var isBindYL = false;
    

    $(".cashOrSel .selItem").click(function(){
        $(this).addClass('active').siblings('.selItem').removeClass('active');
        var _index = $(this).index();
        if(_index=='1'){
            cashType = 0;
            if(!isBindYL){
                $("#cashBank").val('');
                layer.confirm('你还未绑定提现银行卡，去绑定？', {
                    btn: ['去绑定'] //按钮
                }, function () {
                    location.href = '/html/admin_account.html';
                });
                return;
            }
            $("#cashBank").val(ylAcc);
        }else{
            cashType = 1;
            if(!isBindAlipay){
                $("#cashBank").val('')
                layer.confirm('你还未绑定支付宝，去绑定？', {
                    btn: ['去绑定'] //按钮
                }, function () {
                    location.href = '/html/bindAliPay.html';
                });
                return;
            }
            $("#cashBank").val(alipayAcc);
        }
    })

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
                if(obj.bankName == null || obj.cardNo == null){
                    //showTips('请先设置提现账户',"error");
                }else {
                     $("#cashBank").val(obj.bankName+"-"+obj.realName+"-"+obj.cardNo);
                     ylAcc = obj.bankName+"-"+obj.realName+"-"+obj.cardNo;
                     isBindYL = true;
                }

                if(obj.alipayName&&obj.alipayAcc){
                    alipayAcc = obj.alipayName+"-"+obj.alipayAcc;
                    isBindAlipay = true;
                    $("#cashBank").val(alipayAcc);
                 }else{
                    showTips('您还未绑定支付宝',"error");
                    layer.confirm('你还未绑定支付宝，去绑定？', {
                        btn: ['去绑定'] //按钮
                    }, function () {
                        location.href = '/html/bindAliPay.html';
                    });
                 }

            } else {
                showTips('加载信息异常',"error");
            }
            lock.release();
        },false);
    }



});


function withdraw() {
    // showTips('提现系统维护中','warm');
    // return;
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
    }else if(amt<50 || amt>1000000) {
        showTips('提现金币必须大于50小于1000000金币');
        return false;
    }
    else if(amt%50!=0){
        showTips('提现金币必须必须是50的倍数');
        return false;
    }

    var data = {
        amt: $("#cashGold").val(),
        payPwd: $("#payPwd").val(),
        type:cashType
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