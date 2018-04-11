/**
 * Created by Alvis on 2017/9/13.
 */
$(function () {

    $("#login_acct").val(localStorage.getItem('userName'));
    $("#login_pwd").val(localStorage.getItem('password'));




    var para = {
        userName: null,
        password: null,
        clientId: null,
        loginChannel: null
    }

    function initPara() {
        para.userName = FormUtil.getParaVal("#login_acct");
        para.password = FormUtil.getParaVal("#login_pwd");
        para.clientId = '098f6bcd4621d373cade4e832627b4f6';
        para.loginChannel = '1';
    }

    var lock = Lock.createNew();
    $('#login_commitBtn').on('click', function () {
        initPara();
        if (!validate.checkMobile(para.userName)) {
            validate.showErr('请输入正确的手机号码', '#login_acct');
            return;
        }
        if (!para.password) {
            validate.showErr('请输入密码', '#login_pwd');
            return;
        }
        if (!lock.getLock()) {
            return;
        }
        ajaxHelper.post(getUrl('oauth/token'), para, function (ret) {
            if (ret.success) {
                if (typeof localStorage === 'object') {
                    try {
                        localStorage.setItem('localStorage', 1);
                        localStorage.removeItem('localStorage');
                    } catch (e) {
                        Storage.prototype._setItem = Storage.prototype.setItem;
                        Storage.prototype.setItem = function() {};
                        showTips('请关闭无痕浏览模式后重试','error');
                        alert('请关闭无痕浏览模式后重试');
                        return;
                    }
                }
                showTips('登陆成功');
                oauth.setToken(ret.obj.accessToken);
                //记住密码
                if($("#remAct").prop('checked')){
                    localStorage.setItem('userName', para.userName);
                    localStorage.setItem('password', para.password);
                }else {
                    localStorage.setItem('userName', "");
                    localStorage.setItem('password', "");
                }
                window.location.href="/index.html";
            } else {
                showTips(ret.msg,"error");
            }
            lock.release();
        });
    });
})