$(function () {

    //银行卡号得到焦点时隐藏底部温馨提示
    $("#bankCard").focus(function () {
        $("#warmTips").hide();
    }).blur(function () {
        $("#warmTips").show();
    });

    objVerticalCenter(".selBankBox")

    $("#selBank").click(function () {
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


    var userInfo=JSON.parse(localStorage.getItem('userInfo'));
    if(userInfo.certLevel == "C0"){
        if(userInfo.levelStatus==='1'){
            $(".authC1").removeClass("active");
            $(".authC2").removeClass("active");
            $(".tipsMsg").addClass('active');
            $(".tipsMsg p").html('您的[C1]认证正在审核中，请耐心等待');
            return;
        }
        $(".authC1").addClass("active");
        $(".authC2").removeClass("active");
    }else if(userInfo.certLevel == "C1"){
        if(userInfo.levelStatus==='1'){
            $(".authC1").removeClass("active");
            $(".authC2").removeClass("active");
            $(".tipsMsg").addClass('active');
            $(".tipsMsg p").html('您的[C2]认证正在审核中，请耐心等待');
            return;
        }
        $(".authC1").removeClass("active");
        $(".authC2").addClass("active");
        upFrontIdCardRvs();
        upFrontIdCard();
    }else {
        showTips("你已经完成全部认证啦!",'success');
        $(".authC1").removeClass("active");
        $(".authC2").removeClass("active");
        $(".tipsMsg").addClass('active');
        $(".tipsMsg p").html('你已经完成全部认证啦!');
        return;
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
        if(!captchaValue){
            showTips('请输入验证码');
            return false;
        }
        ajaxHelper.post(getUrl('sms/su/sendConeSms'),{"captchaCode":captchaCode,"captchaValue":captchaValue},function(res){
            if(!res.success){
                showTips(res.msg);
            }else{
                vCodeCount("#getVerCode",interVal,timer);
                showTips('验证码发送成功');
            }
        },false,false)
    });

    var lock = Lock.createNew();
    $('#c1btn').on('click', function () {
        var para = {};
        para.realName = FormUtil.getParaVal('#realName');
        para.idCard = FormUtil.getParaVal('#idCard');
        para.code = FormUtil.getParaVal('#msgCode');
        para.bankName = FormUtil.getParaVal('#bankName');
        para.cardNo = FormUtil.getParaVal('#bankCard');
        if (!lock.getLock()) {
            return;
        }
        ajaxHelper.post(getUrl('security/commitCertOne'), para, function (ret) {
            if (ret.success) {
                showTips('C1认证成功');
                setTimeout(function(){location="user-center.html";},2000);
            } else {
                showTips(ret.msg,"error");
            }
            lock.release();
        });
    });

    //上传身份证图片参数
    var para = {
        passportFrontImg:null,
        passportBackImg:null
    };

    //上传正面身份证
    function upFrontIdCard(){
        var self = this;
        var frontImgUrl;
        var frontImgName;
        //身份证正面上传
        var uploader = new plupload.Uploader({
            browse_button: 'idCardPos', //触发文件选择对话框的按钮，为那个元素id
            url: 'http://oss.aliyuncs.com', //服务器端的上传页面地址
            multi_selection: false,
            filters: {
                mime_types: [
                    {
                        title: 'Image files',
                        extensions: 'jpg,jpeg,png,JPG,JPEG,PNG'
                    }
                ],
                max_file_size: '1mb', //最大只能上传1mb的文件
                prevent_duplicates: false //不允许选取重复文件
            },
        });
        var index;
        uploader.init();
        uploader.bind('FilesAdded',function (up,files) {
            var filename = files[0].name;
            ajaxHelper.get(getUrl('upload/getUploadPublicInfo'),{'dir': 'upload/hear-img/'},function (res) {
                if(res){
                    var res = res.obj;
                    var key = res.dir + Util.createUUID() + Util.getFilenameSuffix(filename);
                    frontImgName = key;
                    frontImgUrl = res.imgUrl;
                    var new_multipart_params = {
                        'key': key,
                        'policy': res.policy,
                        'OSSAccessKeyId': res.accessid,
                        'success_action_status': '200', //让服务端返回200,不然，默认会返回204
                        'signature': res.signature,
                    };
                    uploader.setOption({
                        'url': res.host,
                        'multipart_params': new_multipart_params
                    });
                    uploader.start();
                }
            },true);
        });
        uploader.bind('BeforeUpload', function (up, file) {
            showLoading(1);
        });

        uploader.bind('FileUploaded', function (up, file, info) {
            para.passportFrontImg = frontImgUrl + '/' + frontImgName;
            showTips("图片上传成功",'success');
            showLoading(!1);
            $('#imgFront').attr('src',frontImgUrl + '/' + frontImgName);
        });
        uploader.bind('Error', function (up, err) {
            showLoading(!1);
            if (err.code == -600) {
                showTips("图片不能超过1M",'warm');
            } else if (err.code == -601) {
                showTips("只支持jpg或png文件",'warm');
            } else if (err.code == -602) {
                showTips("请不要重复上传同一文件",'warm');
            } else {
                showTips("上传失败",'error');
            }
        });
    }
    //上传正面反面身份证
    function upFrontIdCardRvs(){
        var self = this;
        var frontImgUrl;
        var frontImgName;
        //身份证反面上传
        var uploader = new plupload.Uploader({
            browse_button: 'idCardRvs', //触发文件选择对话框的按钮，为那个元素id
            url: 'http://oss.aliyuncs.com', //服务器端的上传页面地址
            multi_selection: false,
            filters: {
                mime_types: [
                    {
                        title: 'Image files',
                        extensions: 'jpg,jpeg,png,JPG,JPEG,PNG'
                    }
                ],
                max_file_size: '1mb', //最大只能上传1mb的文件
                prevent_duplicates: false //不允许选取重复文件
            },
        });
        var index;
        uploader.init();
        uploader.bind('FilesAdded',function (up,files) {
            var filename = files[0].name;

            ajaxHelper.get(getUrl('upload/getUploadPublicInfo'),{'dir': 'upload/hear-img/'},function (res) {
                if(res.success){
                    var res = res.obj;
                    var key = res.dir + Util.createUUID() + Util.getFilenameSuffix(filename);
                    frontImgName = key;
                    frontImgUrl = res.imgUrl;
                    var new_multipart_params = {
                        'key': key,
                        'policy': res.policy,
                        'OSSAccessKeyId': res.accessid,
                        'success_action_status': '200', //让服务端返回200,不然，默认会返回204
                        'signature': res.signature,
                    };
                    uploader.setOption({
                        'url': res.host,
                        'multipart_params': new_multipart_params
                    });
                    uploader.start();
                }
            },true);
        });
        uploader.bind('BeforeUpload', function (up, file) {
            showLoading(1);
        });

        uploader.bind('FileUploaded', function (up, file, info) {
            para.passportBackImg = frontImgUrl + '/' + frontImgName;
            showLoading(false);
            showTips("图片上传成功",'success');
            $('#imgRvs').attr('src',frontImgUrl + '/' + frontImgName);
        });

        uploader.bind('Error', function (up, err) {
            showLoading(!1);
            if (err.code == -600) {
                showTips("图片不能超过1M",'warm');
            } else if (err.code == -601) {
                showTips("只支持jpg或png文件",'warm');
            } else if (err.code == -602) {
                showTips("请不要重复上传同一文件",'warm');
            } else {
                showTips("上传失败",'error');
            }
        });
    }


    var certLock = Lock.createNew();
    $('#c2btn').on('click', function (ret) {
        // var para = {
        //     passportFrontImg: FormUtil.getParaVal('#idCardPos'),
        //     passportBackImg: FormUtil.getParaVal('#idCardRvs')
        // }
        if (!para.passportFrontImg) {
            showTips('请上传身份证正面照', 'warm');
            return;
        }
        if (!para.passportBackImg) {
            showTips('请上传身份证背面照', 'warm');
            return;
        }
        if (!certLock.getLock()) {
            return;
        }
        ajaxHelper.post(getUrl('security/commitCert'), para, function (ret) {
            if (ret.success) {
                showTips('上传成功，请耐心等待','success');
                updateUserInfo();
                setTimeout(function () {
                    window.location.reload();
                },2000);
            } else {
                showTips(ret.msg,"error");
            }
            certLock.release();
        });
    });
});