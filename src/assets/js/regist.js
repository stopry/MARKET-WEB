$(function(){
    //自动填充推广码
    var channel = null;
    var field1 = null;
    var field2 = null;
    var field3 = null;
    var field4 = null;
    var field5 = null;
    function autoInputPrtCode(){
        var sid = Util.getQueryString("sid");
        channel = Util.getQueryString('channel');
        field1 = Util.getQueryString('field1');
        field2 = Util.getQueryString('field2');
        field3 = Util.getQueryString('field3');
        field4 = Util.getQueryString('field4');
        field5 = Util.getQueryString('field5');
        if(sid){
            $("#prtCode").val(sid).prop('disabled',true);
        }
    }
    autoInputPrtCode();

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
        var mobile = ($('#mobile').val()).trim();
        captchaValue= ($("#verCode").val()).trim();
        if(!validate.checkMobile(mobile)){
            showTips('请输入正确手机号');
            return;
        }
        if(!captchaValue){
            showTips('请输入验证码');
            return false;
        }
        if(!canGetVcode) return;
        ajaxHelper.post(getUrl('sms/sendRegSms'),{"mobile":mobile,"type":"1","captchaCode":captchaCode,"captchaValue":captchaValue},function(res){
            if(!res.success){
                showTips(res.msg)
            }else{
                vCodeCount("#getVerCode",interVal,timer);
                showTips('验证码发送成功');
                // $(".getMsgCode").html("重新获取"+timer);
                // $(".getMsgCode").prop("disabled",true);
                // interVal = setInterval(function(){
                //     timer--;
                //     $(".getMsgCode").prop("disabled",true);
                //     $(".getMsgCode").html("重新获取"+timer);
                //     if(timer<=0){
                //         $(".getMsgCode").prop("disabled",false);
                //         $(".getMsgCode").html("重新获取");
                //         timer = 90;
                //         clearInterval(interVal);
                //     }
                // },1000);
            }
        },false,false)
    });
    //条款显示隐藏
    $("#clauseTitle").click(function(){
        showLayerBlack(1);
        $(".readcClauseBox").show();
    });
    $("#close").click(function(){
        showLayerBlack(!1);
        $(".readcClauseBox").hide();
    });
    $("#okClose").click(function(){
        showLayerBlack(!1);
        $(".readcClauseBox").hide();
    });
    //提交表单
    var lock = Lock.createNew();
    $('#registBtn').click(function(){
        var mobile = ($('#mobile').val()).trim();
        var verCode = ($("#verCode").val()).trim();//短信验证码
        var msgCode = ($("#msgCode").val()).trim();//短信验证码
        var prtCode = ($('#prtCode').val()).trim();
        var password = ($('#password').val()).trim();
        var passwordT = ($('#passwordT').val()).trim();
        var reg = {
            "captchaCode": captchaCode,//图形验证码后缀uuid
            "captchaValue": verCode,//图形验证码
            "code":msgCode ,//验证码
            "field1": field1,//预留
            "field2": field2,//预留
            "field3": field3,//预留
            "field4": field4,//预留
            "field5": field5,//预留
            "channel":channel,//渠道
            "mobile": mobile,//手机号码
            "password": password,//密码
            "superiorId": prtCode|0//推荐码
        };
        if(!mobile){
            showTips('请输入手机号');
            return false;
        }else if(!verCode){
            showTips('请输入验证码');
            return false;
        }else if(!password){
            showTips('请输入密码');
            return false;
        }else if(!passwordT){
            showTips('请再次输入密码');
            return false;
        }else if(!validate.checkMobile(mobile)){
            showTips('请输入正确手机号码');
            return false;
        }else if(password.length<6||password.length>18){
            showTips('密码长度需要在6-18位之间');
            return false;
        }else if(!password===passwordT){
            showTips('两次密码不一样');
            return false;
        }else if(!$("#agreenClause").prop('checked')){
            showTips('请同意《Z家园服务条款》');
            return false;
        }else{
            if (!lock.getLock()) {
                return;
            }
            ajaxHelper.post(getUrl('reg/register'),reg,function(res){
                if(!res.success){
                    showTips(res.msg)
                }else{
                    showTips('注册成功');
                    $(".regSuccess").addClass('.active');
                    $(".registBox").addClass('.hide');
                }
                lock.release();
            },false,false)
        }
    });
})