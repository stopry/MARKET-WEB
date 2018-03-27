var pageNum = 1;
var totalPage = 10;
var isLoading = false;
//1 挂 2 摘
var type = 1;
$(function () {
    objVerticalCenter('.paiBox');
    objVerticalCenter('.listedSelProBox');

    //显示挂牌弹框
    function showGuaBox() {
        showLayerBlack(1);
        $(".paiBox.gau").addClass('active');
        type = 1;
    }

    //关闭挂牌弹框
    function closeGuaBox() {
        showLayerBlack(!1);
        $(".paiBox.gau").removeClass('active');
        $("#itemcnt").val("");
        $("#minTran").val("");

        $("#g_greenId").val("");
        $("#g_greenName").val("");
        $("#g_cnt").val("");
    }

    $(".botOprArea .guaPai").click(function () {
        showGuaBox();
    });
    $(".paiBox.gau .closeThis").click(function () {
        closeGuaBox();
    });

    //显示摘牌弹框
    function showZaiBox() {
        showLayerBlack(1);
        $(".paiBox.zai").addClass('active');
        type = 2;
    }

    //关闭摘牌弹框
    function closeZaiBox() {
        showLayerBlack(!1);
        $(".paiBox.zai").removeClass('active');
        $("#itemcnt").val("");
        $("#minTran").val("");
        $("#z_greenId").val("");
        $("#z_greenName").val("");
        $("#z_cnt").val("");
    }

    $(".botOprArea .zaiPai").click(function () {
        showZaiBox();
    });
    $(".paiBox.zai .closeThis").click(function () {
        closeZaiBox();
    });

    //显示绿能选择框
    function showGreenSelBox() {
        showLayerDia(1);
        $(".listedSelProBox").addClass('active');
        if(type==1){
            loadGameitem();
        }else if (type==2){
            loaditem();
        }
    }

    //关闭绿能选择框
    function closeGreenSelBox() {
        showLayerDia(!1);
        $(".listedSelProBox").removeClass('active');

    }

    $(".paiBox.zai .iptDiv .selAdonGreen").click(function () {
        showGreenSelBox();
    });
    $(".paiBox.gau .iptDiv .selAdonGreen").click(function () {
        showGreenSelBox();
    });
    $(".listedSelProBox .closeThis").click(function () {
        closeGreenSelBox();
    });
    //选择绿能
    $(document).on('click', ".greenSelBox .greenItem", function () {
        $(this).addClass('active');
        $(this).siblings('.greenItem').removeClass('active');
    });

    $("#selGreen").click(function () {
        closeGreenSelBox();
        var gid = $(".greenSelBox .active").attr("greenId");
        var gname = $(".greenSelBox .active").attr("greenName");
        var cnt = $(".greenSelBox .active").attr("cnt");
        var minTran = $(".greenSelBox .active").attr("minTran");
        $("#itemcnt").val(cnt);
        $("#minTran").val(minTran);
        if(parseInt(cnt)<parseInt(minTran)){
            minTran=0;
        }
        if (type == 1) {
            $("#g_greenId").val(gid);
            $("#g_greenName").val(gname);
            $("#g_cnt").val(minTran);
        } else if (type == 2) {
            $("#z_greenId").val(gid);
            $("#z_greenName").val(gname);
            $("#z_cnt").val(minTran);
        }
    });


    $(".addNum").click(function () {
        var min = parseInt($("#minTran").val());
        var itemcnt = parseInt($("#itemcnt").val());
        if (min == null) {
            return;
        }
        if (type == 1) {
            var cnt = parseInt($("#g_cnt").val());
            if (cnt + min > itemcnt) {
                return;
            }
            $("#g_cnt").val(cnt + min);
        } else if (type == 2) {
            var cnt = parseInt($("#z_cnt").val());
            if (cnt + min > itemcnt) {
                return;
            }
            $("#z_cnt").val(cnt + min);
        }
    });

    $(".rscNum").click(function () {
        var min = parseInt($("#minTran").val());
        if (min == null) {
            return;
        }
        if (type == 1) {
            var cnt = parseInt($("#g_cnt").val());
            if (cnt - min < min) {
                return;
            }
            $("#g_cnt").val(cnt - min);
        } else if (type == 2) {
            var cnt = parseInt($("#z_cnt").val());
            if (cnt - min < min) {
                return;
            }
            $("#z_cnt").val(cnt - min);
        }
    });

    $(".max").click(function () {
        var min = parseInt($("#minTran").val());
        var itemcnt = parseInt($("#itemcnt").val());
        if (min == null) {
            return;
        }
        var max = parseInt(itemcnt/min)*min;
        if (type == 1) {
            $("#g_cnt").val(max);
        } else if (type == 2) {
            $("#z_cnt").val(max);
        }
    });

    $(".min").click(function () {
        var min = parseInt($("#minTran").val());
        var itemcnt = parseInt($("#itemcnt").val());
        if (min == null) {
            return;
        }
        if(itemcnt<min){
            return;
        }
        if (type == 1) {
            $("#g_cnt").val(min);
        } else if (type == 2) {
            $("#z_cnt").val(min);
        }
    });


    $(".proIpt.num").change(function () {
        var min = parseInt($("#minTran").val());
        var itemcnt = parseInt($("#itemcnt").val());
        if (min == null) {
            return;
        }
        if (type == 1) {
            var cnt=parseInt($("#g_cnt").val());
            if(cnt<min){
                $("#g_cnt").val(min);
            }
            if(cnt>itemcnt){
                cnt=itemcnt;
            }
            if(cnt%min!=0){
                var max = parseInt(itemcnt/min)*min;
                $("#g_cnt").val(max);
            }else {
                $("#g_cnt").val(cnt);
            }
        } else if (type == 2) {
            var cnt=parseInt($("#z_cnt").val());
            if(cnt<min){
                $("#z_cnt").val(min);
            }
            if(cnt>itemcnt){
                cnt=itemcnt;
            }
            if(cnt%min!=0){
                var max = parseInt(itemcnt/min)*min;
                $("#z_cnt").val(max);
            }else {
                $("#z_cnt").val(cnt);
            }
        }
    });


    loadList(1);
    $(window).scroll(function () {
        if (isBot()) {
            if (isLoading) return;
            pageNum++;
            // console.log(pageNum);
            if (pageNum > totalPage) {
                // showTips('没有更多了');
                $(".loadFinished").addClass('active');
                return;
            }
            isLoading = true;
            loadList(pageNum);
        } else {

        }
    });


    function loadList(pageNum) {
        var para = {
            pageNum: pageNum
        };

        var lock = Lock.createNew();
        if (!lock.getLock()) {
            return;
        }
        ajaxHelper.get(getUrl('listing/list'), para, function (ret) {
            if (ret.success) {
                var data = ret.obj;
                var items = data.records;
                totalPage = data.pages;
                var html = "";
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];

                    html += '<li class="listedItem feedbtn"> <div class="conLeft fl">';
                    html += '<img src="../assets/images/tree' + (item.pId).toString().substring(3, 4) + '_img.png" alt=""> <p class="proDesc">';
                    html += item.pName + ' <span class="up">(' + showType(item.type) + ')</span> </p> </div>';
                    html += '<div class="conCenter fl">';
                    html += '<h2 class="proCnt">' + item.cnt + '</h2>';
                    html += '<p class="proStatus ing">' + showstatus(item.type, item.status) + '</p> </div>';
                    html += '<div class="conRight fr">';
                    // html += '<p class="date apyTime">申请日期：' + Util.formatDate(item.applyTime) + '</p>';
                    html += '<p class="date apyTime">申请日期：' + Util.formatDate(item.applyTime) + '</p>';
                    // html += '<p class="date useTime">生效日期：' + Util.formatDate(item.completeTime) + '</p>';
                    html += '<p class="date useTime">生效日期：' + Util.formatDate(item.completeTime) + '</p>';
                    html += '</div> </li>';
                }
                if (html != "") {
                    $('#ul').append(html);

                } else {
                    // $(".noCon").removeClass("hide");
                }

            } else {
                showTips('加载信息异常', "error");
            }
            lock.release();
            isLoading = false;
        }, true, function () {
            isLoading = false;
        }, function () {
            isLoading = false;
        });
    }


    function loaditem() {

        var lock = Lock.createNew();
        if (!lock.getLock()) {
            return;
        }
        ajaxHelper.get(getUrl('user/getItemList'), null, function (ret) {
            if (ret.success) {
                var items = ret.obj;
                var html = "";
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    if(item.cnt<=0){
                        continue;
                    }
                    html += '<div class="greenItem feedbtn" greenId="' + item.pId + '" greenName="' + item.pName + '" cnt="' + item.cnt + '" minTran="' + item.minTran + '" >';
                    html += '<img src="../assets/images/tree' + (item.pId).toString().substring(3, 4) + '_txt.png" alt="">';
                    html += '</div>';
                }

                $('#goods').html(html);

            }
            lock.release();
        });
    }

    function loadGameitem() {

        var lock = Lock.createNew();
        if (!lock.getLock()) {
            return;
        }
        ajaxHelper.get(getUrl('listing/gameItemList'), null, function (ret) {
            if (ret.success) {
                var items = ret.obj;
                var html = "";
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    html += '<div class="greenItem feedbtn" greenId="' + item.itemTypeId + '" greenName="' + item.name + '" cnt="' + item.cnt + '" minTran="' + item.minTran + '" >';
                    html += '<img src="../assets/images/tree' + (item.itemTypeId).toString().substring(3, 4) + '_txt.png" alt="">';
                    html += '</div>';
                }

                $('#goods').html(html);

            }
            lock.release();
        });
    }


});


var lock = Lock.createNew();

function guazhai() {
    var pId;
    var pName;
    var cnt;
    var paypwd;
    if (type == 1) {
        pId = ($("#g_greenId").val()).trim();
        paypwd = ($('#g_password').val()).trim();
        pName = ($("#g_greenName").val()).trim();
        cnt = ($('#g_cnt').val()).trim();
    } else if (type == 2) {
        pId = ($("#z_greenId").val()).trim();
        paypwd = ($('#z_password').val()).trim();
        pName = ($("#z_greenName").val()).trim();
        cnt = ($('#z_cnt').val()).trim();
    }
    var para = {
        "type": type,//图形验证码后缀uuid
        "pId": pId,//图形验证码
        "pName": pName,//图形验证码
        "cnt": cnt,//图形验证码
        "paypwd": paypwd//密码

    };
    if (!pId) {
        showTips('请选择绿能');
        return false;
    }
    if (!pName) {
        showTips('请选择绿能');
        return false;
    }
    if (!cnt) {
        showTips('请输入数量');
        return false;
    }
    if (parseInt(cnt)<=0) {
        showTips('请输入数量');
        return false;
    }
    if (!paypwd) {
        showTips('请输入二级密码');
        return false;
    }

    if (!lock.getLock()) {
        return;
    }
    ajaxHelper.post(getUrl('listing/listAndDelist'), para, function (res) {
        if (!res.success) {
            showTips(res.msg);
        } else {
            showTips('操作成功');
            location.reload();
        }
        lock.release();
    }, false, false)

};

function showType(type) {
    if (type == 1) {
        return '上市';
    } else if (type == 2) {
        return '下架';
    }

}

function showstatus(type, status) {
    if (status == 1) {
        return '申请中';
    } else if (status == 2 && type == 1) {
        return '已上市';
    } else if (status == 2 && type == 2) {
        return '已下架';
    } else if (status == 3) {
        return '失败';
    }

}