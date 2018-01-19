var pageNum = 1;
var totalPage = 10;
var isLoading = false;
$(function () {


    loadList(1);


    $(window).scroll(function () {
        if(isBot()){
            if(isLoading) return;
            pageNum++;
            if(pageNum>totalPage){
                // showTips('没有更多了');
                $(".loadFinished").addClass('active');
                return;
            }
            isLoading = true;
            loadList(pageNum);
        }else{

        }
    });


    function loadList(pageNum){
        var para = {
            pageNum: pageNum
        };

        var lock = Lock.createNew();
        if (!lock.getLock()) {
            return;
        }
        ajaxHelper.get(getUrl('promote/promoRewardteList'), para, function (ret) {
            if (ret.success) {
                var data = ret.obj;
                var items = data.record;
                totalPage = data.totalPages;
                var html = "";
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];

                    html += '<li class="rchRecItem AwardItem WrapB wx">';
                    html += '<div class="recLeft fl">';
                    html += '<div class="rchType userPic">';
                    html += '<img src="../assets/images/award_list_user_img.png" alt=""></div>';
                    html += '<div class="payStr">';
                    html += '<div class="rchTypeText">';
                    html += showTyep(item.tranType);
                    html += '</div><div class="rchTime">';
                    html += Util.formatDate(item.tranTime);
                    html += '</div></div></div>';
                    html += '<div class="recRight awardRight fr">';
                    html += item.tranAmt;
                    html += '<p>已到账</p></div></li>';

                }
                if (html != "") {
                    $('#ul').append(html);
                } else {
                    $(".pageCtr").hide();
                }
            } else {
                showTips('加载信息异常',"error");
            }
            lock.release();
            isLoading = false;
        });
    }


    function showTyep(type) {
        if (type == '5') {
            return '推广奖励(注册)';
        } else if (type == '6') {
            return '推广奖励(首充)';
        } else if (type == '7') {
            return '推广奖励(交易)';
        } else if (type == '8') {
            return '推广奖励(消费)';
        }
    }
});