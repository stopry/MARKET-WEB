/**
 * Created by Alvis on 2017/9/18.
 */
var pageNum = 1;
var totalPage = 10;
var isLoading = false;
$(function () {
    loadList(1);
    loadInfo();

    $(window).scroll(function () {
        if(isBot()){
            // console.log('到达底部')
            if(isLoading) return;
            pageNum++;
            if(pageNum>totalPage){
                // showTips('没有更多了');
                $(".loadFinished").addClass('active');
                return;
            }
            loadList(pageNum);
        }else{
            // console.log('没有到达')
        }
    });

});

function loadInfo() {
    ajaxHelper.get(getUrl('user/getUserInfo'), {}, function (ret) {
        if (ret.success) {
            var userInfo = ret.obj.userInfo;
            $('#totalRecharge').html(userInfo.totalRecharge);
            $('#totalWithdraw').html(userInfo.totalWithdraw);
            $('#totalBonus').html(userInfo.totalBonus);
        } else {
            showTips('加载信息异常',"error");
        }
    });
}

function loadList(pageNum) {
    var para = {
        pageNum: pageNum,
        // type: FormUtil.getParaVal('#type'),
        // startDate: FormUtil.getParaVal('#startDate'),
        // endDate: FormUtil.getParaVal('#endDate')
    };
    var lock = Lock.createNew();
    if (!lock.getLock()) {
        return;
    }
    isLoading  = true;
    ajaxHelper.post(getUrl('acct/recordList'), para, function (ret) {
        if (ret.success) {
            var data = ret.obj;
            var items = data.record;
            totalPage = data.totalPages;
            var html = "";
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if(item.tranAmt>0){
                    html += '<tr class="tableContent prtListContent sale">';
                }else {
                    html += '<tr class="tableContent prtListContent buy">';
                }
                html += '<td>' + showTyep(item.tranType) + '</td>';
                html += '<td>'+item.tranAmt+'</td>';
                html += '<td>'+new Date(item.tranTime).Format('yyyy/MM/dd hh:mm:ss')+'</td>';
                html += '</tr>';
            }
            if (html != "") {
                $('#tab').append(html);
            } else {
                // $(".noCon").removeClass("hide");
            }
            isLoading = false;
        }
        lock.release();
        isLoading = false;
    },true,function () {
        isLoading = false;
    },function () {
        isLoading = false;
    });
}

function showTyep(type) {
    if (type == '1') {
        return '充值';
    } else if (type == '2') {
        return '提现';
    } else if (type == '3') {
        return '购买';
    } else if (type == '4') {
        return '出售';
    } else if (type == '5') {
        return '推广奖励(注册)';
    } else if (type == '6') {
        return '推广奖励(首充)';
    } else if (type == '7') {
        return '推广奖励(交易)';
    } else if (type == '8') {
        return '推广奖励(消费)';
    } else if (type == '9') {
        return '系统奖励';
    } else if (type == '10') {
        return '活动奖励';
    } else if (type == '11') {
        return '消费';
    } else if (type == '12') {
        return '退费';
    } else if (type == '13') {
        return '指定购买';
    } else if (type == '14') {
        return '指定出售';
    }else if(type == '15'){
        return '收入';
    }else if(type == '16'){
        return '增加种树基金';
    }else if(type == '17'){
        return '提现冲正';
    }
}