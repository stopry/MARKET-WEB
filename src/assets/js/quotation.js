$(function () {

    //向后台取banner图-
    function getBanner(){
        var lock = Lock.createNew();
        if (!lock.getLock()) {
            return;
        }
        ajaxHelper.get(getUrl('/banner/list'),{position:11},function(res){
            if(res.success){
                var list = res.obj;
                var html = '';
                if(list&&list.length>0){
                    for(var i = 0;i<list.length;i++){
                        html+='<div class="swiper-slide" onclick="location=\''+list[i].toUrl+'\'"><img src="'+list[i].imgUrl+'" alt=""></div>'
                    }
                    $("#swiper-wrapper").html(html);
                }
            }
           var mySwiper = new Swiper('.swiper-container', {
                direction: 'horizontal',
                loop: true,
                autoplay : 5000,
                speed:1000,
                // 如果需要分页器
                pagination:  '.swiper-pagination',
            })
            lock.release();
        })
    }
    getBanner();

    load();

    function load(){
        var lock = Lock.createNew();
        if (!lock.getLock()) {
            return;
        }
        ajaxHelper.post(getUrl('showOverallMarket'), null, function (ret) {
            if (ret.success) {
                var obj = ret.obj;
                $('#ul').html("");
                var html = "";
                for (var key in obj) {

                    html += '<li class="quotationItem up feedbtn" onclick="tomark('+obj[key].proId+')"> <div class="proBase fl"> <div class="baseTop"> <img class="proPic" src="../assets/images/green.png" alt="">';
                    html += obj[key].proName;
                    html += '</div> <div class="quoText clip ani">'+(obj[key].nowPrice).toFixed(2)+'</div> </div> <div class="proDetail fr"> <div class="detailItem fl itemL"> <dl class="itemTab"> <div class="dt">';
                    html += '<dd class="nth">今开</dd> <dd class="clip ani">'+(obj[key].toOpenPrice).toFixed(2)+'</dd> </div>';
                    html += '<div class="dt">';
                    html += '<dd class="nth">最高</dd> <dd class="highest clip ani">'+(obj[key].heightPrice).toFixed(2)+'</dd> </div>';
                    html += '<div class="dt"> <dd class="nth">最低</dd> <dd class="lowest clip ani">'+(obj[key].lowPrice).toFixed(2)+'</dd> </div> </dl> </div>';
                    html += '<div class="detailItem fr itemR"> <dl class="itemTab"> <div class="dt">';

                    // html += '<dd>涨跌幅</dd> <dd class="range clip ani">'+changeToPercent((obj[key].changeRate))+'</dd> </div>';
                    html += '<dd>涨跌幅</dd> <dd class="range clip ani">'+(obj[key].changeRate*100).toFixed(2)+"%"+'</dd> </div>';

                    html += '<div class="dt"> <dd>涨跌额</dd> <dd class="limit clip ani">'+(obj[key].changePrice).toFixed(2)+'</dd> </div>';
                    html += '<div class="dt"> <dd>成交量</dd> <dd class="clip ani">'+obj[key].tranVolume+'</dd> </div> </dl> </div> </div> </li>';
                }
                $('#ul').append(html);

            } else {
                showTips('加载信息异常',"error");
            }
            lock.release();
        },false);
    }
    setInterval(load,5000);
});


function tomark(pid) {
    localUtil.set("TRAN_PRO_ID", pid);
    location="market.html";

}


