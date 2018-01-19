var pageNum = 1;
var totalPage = 10;
var isLoading = false;
$(function () {
    var pid=Util.getQueryString("pid");

    loadList1(1);
    var type=1;
    $(window).scroll(function () {
        if(isBot()){
            if(isLoading) return;
            pageNum++;
            if(pageNum>totalPage){
                // $()
                // showTips('没有更多了');
                if(type==1){
                    $(".loadFinished1").addClass('active');
                }else{
                    $(".loadFinished2").addClass('active');
                }
                return;
            }
            if(type==1){
                isLoading = true;
                loadList1(pageNum);
            }else {
                isLoading = true;
                loadList2(pageNum)
            }
        }else{

        }
    });


    $(".hisTradeTab .tabItem").click(function () {
        $(this).addClass('active').siblings('.tabItem').removeClass('active');
        var _index = $(this).index();
        if(_index==0){
            $(".loadFinished1").removeClass('active');
            $(".enTrustOrder").removeClass('hide');
            $(".tradeDetail").addClass('hide');
            $('#ul1').html("");
            type=1;
            pageNum = 1;
            totalPage = 10;
            isLoading = false;
            loadList1(1);

        }else{
            $(".loadFinished2").removeClass('active');
            $(".enTrustOrder").addClass('hide');
            $(".tradeDetail").removeClass('hide');
            $('#ul2').html("");
            type=2;
            pageNum = 1;
            totalPage = 10;
            isLoading = false;
            loadList2(1);
        }
    });



    function loadList1(pageNum){
        var para = {
            pageNum: pageNum,
            proId: pid
        };

        var lock = Lock.createNew();
        if (!lock.getLock()) {
            return;
        }
        ajaxHelper.post(getUrl('tran/entrustOrderQuery'), para, function (ret) {
            if (ret.success) {
                var data = ret.obj;
                var items = data.records;
                totalPage = data.pages;
                var html = "";
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];

                    html += "<li class=\"rchRecItem AwardItem WrapB wx "+(item.enType=="0"?"buy":"sale")+" feedbtn\" onclick=\"location='/html/entrust-order-detail.html?id="+item.id+"'\">";
                    html += '<div class="recLeft fl">';
                    html += '<div class="rchType userPic">';
                    html += '<img src="../assets/images/green.png" alt="">';
                    html += '</div>';
                    html += '<div class="payStr">';
                    html += '<div class="rchTypeText">';
                    html +=  item.proName+'<span class="tradeType">('+showEnTyep(item.enType)+')</span>';
                    html += '</div>';
                    html += '<div class="rchTime">';
                    html += Util.formatDate(item.enTime);
                    html += '</div></div></div>';
                    html += '<div class="recRight awardRight fr">';
                    html += item.enCnt;
                    html += '<p>'+showTrStatus(item.trStatus)+'</p></div></li>';

                }
                if (html != "") {
                    $('#ul1').append(html);

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


    function loadList2(pageNum){
        var para = {
            pageNum: pageNum,
            proId:pid
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
                    $('#ul2').append(html);

                } else {
                    // $(".noCon").removeClass("hide");
                }

            } else {
                showTips('加载信息异常',"error");
            }
            isLoading = false;
            lock.release();
        },true,function () {
            isLoading = false;
        },function () {
            isLoading = false;
        });
    }


});