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
        ajaxHelper.get(getUrl('acct/rechargeList'), para, function (ret) {
            if (ret.success) {
                var data = ret.obj;
                var items = data.records;
                totalPage = data.pages;
                var html = "";
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                        var payChannel = item.payChannel //1 2 3 微信 支付宝 银联
                         html += "<li class=\"rchRecItem WrapB wx feedbtn\" onclick=\"location='/html/recharge-record-detail.html?id="+item.id+"'\">";
                         html += '<div class="recLeft fl"> <div class="rchType">';
                         html += '</div> <div class="payStr"> <div class="rchTypeText">';
                         html += showPayChannel(item.payChannel);
                         html += '</div> <div class="rchTime">';
                         html += Util.formatDate(item.payTime);
                         html += '</div></div> </div> <div class="recRight fr">';
                         html += item.payAmt;
                         html += '</div> </li>';

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