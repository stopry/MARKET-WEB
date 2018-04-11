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
        ajaxHelper.post(getUrl('tran/entrustRecordQuery'), para, function (ret) {
            if (ret.success) {
                var data = ret.obj;
                var items = data.record;
                totalPage = data.totalPages;
                var html = "";
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];

                        html += "<li class=\"rchRecItem AwardItem WrapB wx feedbtn "+(item.enType=="0"?"buy":"sale")+"\" onclick=\"location='/html/trade-record-detail.html?id="+item.id+"'\">";
                        html += '<div class="recLeft fl">';
                        html += '<div class="rchType userPic">';
                        html += '<img src="../assets/images/green.png" alt=""></div>';
                        html += '<div class="payStr">';
                        html += '<div class="rchTypeText">';
                        html += item.proName+' <span class="tradeType">('+(item.enType=="0"?"市场买入":"市场卖出")+')</span></div>';
                        html += '<div class="rchTime">';
                        html += Util.formatDate(item.trTime);
                        html += '</div></div></div>';
                        html += '<div class="recRight awardRight fr">';
                        html += item.trCnt;
                        html += '<p>成交量</p></div></li>';

                }
                if (html != "") {
                    $('#ul').append(html);

                } else {
                    // $(".noCon").removeClass("hide");
                }

            } else {
                showTips('加载信息异常',"error");
            }
            lock.release();
            isLoading = false;
        },true,function () {
            isLoading = false;
        },function () {
            isLoading = false;
        });
    }
});





