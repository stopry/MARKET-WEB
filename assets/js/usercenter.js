$(function(){

    loadInfo();

    //eixtLogin
    $('#eixtLogin').on('click', function () {
        showConDia('确认退出登陆吗?',function () {
            oauth.clean();
            location="login.html";
        },function () {

        })
    });
    //头像上传
    upUserHeadeImg();
   function upUserHeadeImg(){
        var imgName,imgUrl;  //图片名图片路径
        var uploader = new plupload.Uploader({
            browse_button: 'userPic', //触发文件选择对话框的按钮，为那个元素id
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
        var index = null;
        uploader.init();
        uploader.bind('FilesAdded',function (up,files) {
            ajaxHelper.get(getUrl('upload/getUploadPublicInfo'),{'dir': 'upload/hear-img/'},function (res) {
                if(res.success){
                    var res = res.obj;
                    var key = res.dir + Util.createUUID() + Util.getFilenameSuffix(files[0].name);
                    imgName = key;
                    imgUrl = res.imgUrl;
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
                }else{
                    showTips(res.msg,'error');
                }
            },true);
        });
        uploader.bind('BeforeUpload', function (up, file) {
            showLoading(1);
        });
        uploader.bind('FileUploaded', function (up, file, info) {
            ajaxHelper.post(getUrl('upload/saveHearImg'),{'url': imgUrl + '/' + imgName},function (res) {
                if(res.success){
                    showTips('上传成功','success');
                    $('#userPic').attr('src',imgUrl + '/' + imgName);
                }else{
                    showTips('上传失败','error');
                }
                showLoading(!1);
            },true,false,false);
        });
        uploader.bind('Error',function (up,err) {
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
        })
   }

   $("#listed").click(function () {


       window.location.href="/html/listed-market.html";
   });

});

function loadInfo() {
    var lock = Lock.createNew();
    if (!lock.getLock()) {
        return;
    }
    ajaxHelper.get(getUrl('user/getUserInfo'), {}, function (ret) {
        if (ret.success) {
            var userInfo = ret.obj.userInfo;
            $('#userName').html(userInfo.realName);
            $('#userId').html(userInfo.id);
            $('#userPic').attr('src', userInfo.headerUrl);
            $('#usableBalance').html((userInfo.usableBalance).toFixed(2));
            $('#blockedBalance').html((userInfo.blockedBalance).toFixed(2));
            $('#totalBalance').html((userInfo.blockedBalance + userInfo.usableBalance).toFixed(2));
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
        } else {
            showTips('加载信息异常',"error");
        }
        lock.release();
    });
}