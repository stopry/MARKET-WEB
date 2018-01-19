$(function () {
    //资讯行情新闻列表切换
    $(".ziXunHeader span").click(function () {
       $(this).addClass('active').siblings('span').removeClass('active');
       var _index = $(this).index();
       $(".ziXunCon .newList").eq(_index).addClass('active').siblings('.newList').removeClass('active');
    });
    
    //向后台取banner图-
    function getBanner(){
        var lock = Lock.createNew();
        if (!lock.getLock()) {
            return;
        }
        ajaxHelper.get(getUrl('/banner/list'),{position:10},function(res){
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
    
    function load() {
        var lock = Lock.createNew();
        if (!lock.getLock()) {
            return;
        }
        ajaxHelper.post(getUrl('showOverallMarket'), null, function (ret) {
            if (ret.success) {
                var obj = ret.obj;
                $('#ul').html("");
                var html = "";
                var i=1;
                for (var key in obj) {
                        html+= '<li class="hqItem feedbtn '+(obj[key].changePrice>=0?"up":"down")+'" onclick="tomark('+obj[key].proId+')"> <div class="rightInfo">';
                        html+= '<img  class="treeText" src="./assets/images/tree'+i+'_txt.png" alt="">';
                        html+= '<div class="upDown clip ani"> <span>'+(obj[key].nowPrice).toFixed(2)+'</span>';
                        html+= '</div> </div> <div class="botInfo"> <div class="price">';
                        html+= '涨跌额 '+(obj[key].changePrice).toFixed(2);
                        html+= '</div> <div class="fd"> 涨跌幅 <span>'+changeToPercent(obj[key].changeRate)+'</span> </div> </div> </li>';
                        i++;
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
    location="html/market.html";

}