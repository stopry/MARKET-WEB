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
        ajaxHelper.get(getUrl('promote/promoteList'), para, function (ret) {
            if (ret.success) {
                var data = ret.obj;
                $("#total").html(data.total+"<span>人</span>");
                var items = data.records;
                totalPage = data.pages;
                var html = "";
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    html += '<tr class="tableContent prtListContent">';
                    html += '<td>'+item.id+'</td>';
                    html += '<td>'+item.realName+'</td>';
                    html += '<td>'+Util.formatDate(item.createTime)+'</td>';
                    html += '</tr>';
                }
                if (html != "") {
                    $('#tb').append(html);
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