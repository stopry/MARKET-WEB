/**
 * Created by Alvis on 2017/8/25.
 */


var validate = {
    checkMobile: function (str) { //手机正则
        var re = /^(13[0-9]|15[0-9]|17[013678]|18[0-9]|14[57])[0-9]{8}$/;
        if (re.test(str)) {
            return true;
        } else {
            return false;
        }
    },
    checkPwd: function (pwd) { //密码正则,由字母开头
        var re = /^[a-zA-Z][a-zA-Z0-9_]{5,19}$/;
        if (re.test(pwd)) {
            return true;
        } else {
            return false;
        }
    },
    /**
     * 检查是否为正整数
     * @param num
     * @returns {boolean}
     */
    checkPInt: function (num) {
        var re = /^[1-9][0-9]*$/;
        if (re.test(num)) {
            return true;
        } else {
            return false;
        }
    },
    isInt:function (num){
        var re = /^[-]?[0-9]*$/;
        if (re.test(num)) {
            return true;
        } else {
            return false;
        }
    },
    showErr: function (msg, attr) {
        var index = layer.tips(msg, attr, {
            tips: 3
        });
        $(attr).on('focus', function () {
            setTimeout(function () {
                layer.close(index);
            }, 300);
        });
    },

}
