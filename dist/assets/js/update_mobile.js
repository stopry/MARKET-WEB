$(function(){
    var uuid=Util.getQueryString("uuid");

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
    })
    //短信验证码
    var timer = 90;
    var interVal = null;
    $("#getVerCode").click(function(){
        if(!canGetVcode) return;
        var mobile=($("#mobile").val()).trim()
        captchaValue= ($("#verCode").val()).trim();
        if(!captchaValue){
            showTips('请输入验证码');
            return false;
        }
        ajaxHelper.post(getUrl('sms/su/sendBoundMobileSms'),{"mobile":mobile,"captchaCode":captchaCode,"captchaValue":captchaValue,"uuid":uuid},function(res){
            if(!res.success){
                showTips(res.msg);
            }else{
                vCodeCount("#getVerCode",interVal,timer);
                showTips('验证码发送成功');
            }
        },false,false)
    });

    //提交表单
    var lock = Lock.createNew();
    $('#updatePwdBtn').click(function(){
        var verCode = ($("#verCode").val()).trim();//短信验证码
        var msgCode = ($("#msgCode").val()).trim();//短信验证码
        var mobile = ($('#mobile').val()).trim();
        var reg = {
            "captchaCode": captchaCode,//图形验证码后缀uuid
            "captchaValue": verCode,//图形验证码
            "code":msgCode ,//验证码
            "mobile": mobile,
            "uuid": uuid,

        };
       if(!mobile){
           showTips('请输入手机号码');
           return false;
       } else if(!verCode){
            showTips('请输入验证码');
            return false;
        }else if(!msgCode){
            showTips('请输入短信验证码');
            return false;
        }else if(!validate.checkMobile(mobile)){
           showTips('请输入正确手机号码');
           return false;
       }else{
           if (!lock.getLock()) {
               return;
           }
            ajaxHelper.post(getUrl('security/bundleMobile'),reg,function(res){
                if(!res.success){
                    showTips(res.msg);
                }else{
                    showTips('修改成功');
                    location="user-center.html";
                }
                lock.release();
            },false,false)
        }
    });
})