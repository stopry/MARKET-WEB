$(function () {
    var userLv = null;
    //是否完成了实名认证
    function isC1Lv(userInfo){
        userLv = userInfo.certLevel;
        if(userLv=='C0'||userLv==null){
            showTips('请先完成[C1]实名认证','warm');
            $(".isC1").show();
        }else{
            $(".isC1").hide();
        }
    }


  //图形验证码
  var captchaCode;//uuid
  var captchaValue;//图形码
  var codeUrl;
  function getCaptcha() {
    captchaCode = Util.createUUID();
    codeUrl = '/market/captcha-image' + '?ck=' + captchaCode + '&' + new Date().getTime();
    $("#imgCode").attr('src', codeUrl);
  }
  getCaptcha();
  $("#imgCode").click(function(){
    getCaptcha();
  });
  //短信验证码
  var timer = 90;
  var interVal = null;
  $("#getVerCode").click(function(){
    if(!canGetVcode) return;
    captchaValue= ($("#verCode").val()).trim();
    var mobile= ($("#mobile").val()).trim();
    if(!mobile){
      showTips('请输入手机号码');
      return false;
    }
    if(!captchaValue){
      showTips('请输入验证码');
      return false;
    }
    ajaxHelper.post(getUrl('sms/su/sendConeSms'),{"captchaCode":captchaCode,"captchaValue":captchaValue,"mobile":mobile},function(res){
      if(!res.success){
        showTips(res.msg);
      }else{
        vCodeCount("#getVerCode",interVal,timer);
        showTips('验证码发送成功');
      }
    },false,false)
  });

    var userInfo=JSON.parse(localStorage.getItem('userInfo'));
    $("#realName").val(userInfo.realName);
    isC1Lv(userInfo);
    objVerticalCenter(".selBankBox")
    $(".selCashBank").click(function () {
        showLayerBlack(1);
        $(".selBankBox").addClass('active');
    });

    $(".closeBtn").click(function () {
        showLayerBlack(false);
        $(".selBankBox").removeClass('active');
    });

    $(".selBankBox .selBankList .bankListItem").click(function () {
        var _index = $(this).find(".bankName").html();
        $("#bankName").val(_index);
        $(".closeBtn").click();
    });

    var bindLock = Lock.createNew();
    $('#bindBankBtn').on('click', function () {
        var para = {};
        para.bankName = FormUtil.getParaVal('#bankName');
        para.cardNo = FormUtil.getParaVal('#cardNo');
        para.mobile = FormUtil.getParaVal('#mobile');
        para.code = FormUtil.getParaVal('#msgCode');
        if (!bindLock.getLock()) {
            return;
        }
        ajaxHelper.post(getUrl('security/updateBank'), para, function (ret) {
            if (ret.success) {
                showTips('绑定成功');
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