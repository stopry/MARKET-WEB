$(function () {
    var showBuySale = true;//默认显示买三卖三
    //头部商品切换
    $(".greenItemWrap .greemItem").click(function () {
        $(this).addClass('active').siblings('.greemItem').removeClass('active');
    });

    //卖三买三切换显示
    $(".dgtTableWrap .dgtOpenBtn").click(function () {
        $(this).toggleClass('close');
        $(".dgtTableWrap").toggleClass('close');
        if($(this).hasClass('close')){
            showBuySale = false;
        }else{
            showBuySale = true;
        }
        autoHeightChart();
    });

    var cType;

    //图标标签切换
    $(".chartChange .chartBtn").click(function () {
        $(this).addClass('seled').siblings('.chartBtn').removeClass('seled');
        var type = $(this).data('type');
        var proId = getProId();
        createChart(proId, type);
        cType = type;
    });

    //涨跌信息显示隐藏
    $(".fdWrap").click(function () {
        $(".dfInfo").toggleClass('active');
        $(".xsjIcon").toggleClass('active');
    });

    //显示/关闭委托订单弹框
    function showDlgBox(bool) {
        if (bool) {
            $('.dgtOrderBox').addClass('active');
            showLayerBlack(true);
        } else {
            $('.dgtOrderBox').removeClass('active');
            showLayerBlack(false);
        }
    }

    //显示委托订单弹框
    $('.oprBtnWrap .dlgOrder').click(function () {
        var proId = getProId();
        //加载委托列表
        loadEntrust(proId);

        showDlgBox(1);
    });
    //关闭委托订单弹框
    $('.dgtOrderBox .closeBtn').click(function () {
        showDlgBox(!1);
    });

    //显示购买弹框
    function showBuyBox() {
        showLayerBlack(1);
        $(".marketBuyBoxObj").addClass('active');

        //初始化购买价
        var price = $($('#ms1').children()[1]).html();
        if (price == '--') {
            price = nowPrice;
        }
        $("#mrPrice").val(price);
        loadBuyInfo();
    }

    //关闭购买弹框
    function closeBuyBox() {
        showLayerBlack(!1);
        $(".marketBuyBoxObj").removeClass('active');
    }

    $('.oprBtn.saleBtn').click(function () {
        showBuyBox();
    });
    $(".marketBuyBoxObj .closeIcon").click(function () {
        closeBuyBox();
    });

    //显示卖出弹框
    function showSaleBox() {
        showLayerBlack(1);
        $(".marketSaleBox").addClass('active');

        //初始化购卖价
        var price = $($('#mb1').children()[1]).html();
        if (price == '--') {
            price = nowPrice;
        }
        $("#mcPrice").val(price);
        loadSaleInfo();
    }

    //关闭卖出弹框
    function closeSaleBox() {
        showLayerBlack(!1);
        $(".marketSaleBox").removeClass('active');
    }

    $('.oprBtn.buyBtn').click(function () {
        showSaleBox();
    });
    $(".marketSaleBox .closeIcon").click(function () {
        closeSaleBox();
    });

    //买入框买入量选择
    $(".marketBuyBoxObj .selPerArea .item").click(function () {
        $(this).addClass('active').siblings('.item').removeClass('active');
    });
    //卖出框买入量选择
    $(".marketSaleBox .selPerArea .item").click(function () {
        $(this).addClass('active').siblings('.item').removeClass('active');
        // autoShowFee();
    });

    //委托订单点击撤销
    $(document).on('click', '.entOrderTable tr .canelBtn', function () {
        var id = $(this).data('val');
        var proId = getProId();
        showConDia('确认撤销此订单吗?', function () {
            ajaxHelper.get(getUrl('tran/cancelOrder'), {'orderId': id}, function (ret) {
                if (ret.success) {
                    loadEntrust(proId, false);
                    showTips('撤消申请成功', 'success');
                } else {
                    showTips(ret.msg)
                }
            });
        }, function () {

        });
    });

    //买入卖出点击效果
    $(document).on('click', '.marketSaleBox .fiveTable tr', function (e) {
        var _html = $(this).find('td:nth-child(2)').html();

        var type = $(this).data('type');

        if (_html == '--') {
            return;
        }

        var tagetPos = {
            x: "2.5rem",
            y: "4.21875rem"
        };
        $('.marketSaleBox .aniText').show();

        var px = e.pageX;
        var py = e.pageY;

        var ww = $(window).width();
        var wh = $(window).height();

        var ox;
        var oy;

        if (isPc()) {
            ox = 600 - (ww - px) + 150 + 'px';
            oy = (wh - py - 30) / 60 + 'rem';
        } else {
            ox = ww - (ww - px) / 0.8 + 'px';
            oy = (wh - py) / 1.1 + 'px';
        }

        $('.marketSaleBox .aniText').html(_html);
        $('.marketSaleBox .aniText').css({
            bottom: oy,
            left: ox,
            opacity: 1
        });

        $('.marketSaleBox .aniText').stop().animate({
            bottom: tagetPos.y,
            left: tagetPos.x,
            opacity: 0.6
        }, 800, function () {
            $('.marketSaleBox .aniText').hide();
            $('#mcPrice').val(_html);
            if (type == 'mr') {
                caclCanBuy();
            }
        });
        autoShowFee();
    });

    $(document).on('click', '.marketBuyBoxObj .fiveTable tr', function (e) {
        var _html = $(this).find('td:nth-child(2)').html();

        var type = $(this).data('type');

        if (_html == '--') {
            return;
        }

        var tagetPos = {
            x: "2.5rem",
            y: "4.21875rem"
        };
        $('.marketBuyBoxObj .aniText').show();

        var px = e.pageX;
        var py = e.pageY;

        var ww = $(window).width();
        var wh = $(window).height();

        var ox;
        var oy;

        if (isPc()) {
            ox = 600 - (ww - px) + 150 + 'px';
            oy = (wh - py - 30) / 60 + 'rem';
        } else {
            ox = ww - (ww - px) / 0.8 + 'px';
            oy = (wh - py) / 1.1 + 'px';
        }

        $('.marketBuyBoxObj .aniText').html(_html);
        $('.marketBuyBoxObj .aniText').css({
            bottom: oy,
            left: ox,
            opacity: 1
        });

        $('.marketBuyBoxObj .aniText').stop().animate({
            bottom: tagetPos.y,
            left: tagetPos.x,
            opacity: 0.6
        }, 800, function () {
            $('.marketBuyBoxObj .aniText').hide();
            $('#mrPrice').val(_html);
            if (type == 'mr') {
                caclCanBuy();
            }
        });

    });


    //卖出价格限制
    var mcPrice = 0.00;
    $('#mcPrice').keydown(function () {
        mcPrice = $(this).val();
    });

    $('#mcPrice').blur(function () {
        var cPrice = $(this).val();
        if (!/^\d+(\.\d{1,2})?$/.test(cPrice)) {
            $(this).val(mcPrice);
        }
    });

    $('#mcPrice').change(function () {
        $(this).val(Number($(this).val()).toFixed(2));
    });

    $('#mcCnt').change(function () {
        var cnt = $(this).val();
        changeMrCnt(cnt, 'mc');
    });

    //买入价格限制
    var mrPrice = 0.00;
    $('#mrPrice').keydown(function () {
        mrPrice = $(this).val();
        caclCanBuy();
    });

    $('#mrPrice').blur(function () {
        var cPrice = $(this).val();
        if (!/^\d+(\.\d{1,2})?$/.test(cPrice)) {
            $(this).val(mrPrice);
        }
        caclCanBuy();
    });

    $('#mrPrice').change(function () {
        $(this).val(Number($(this).val()).toFixed(2));
        caclCanBuy();
    });

    $('#mrCnt').change(function () {
        var cnt = $(this).val();
        changeMrCnt(cnt, 'mr');
    });

    function changeMrCnt(cnt, key) {
        if (cnt % minTran != 0) {
            if (cnt >= canTranCnt) {
                $('#' + key + 'Cnt').val(canTranCnt);
            } else {
                $('#' + key + 'Cnt').val(parseInt(cnt / minTran) * minTran);
            }
        }

        if (canTranCnt2 == cnt) {
            $('#' + key + '_2_cnt').addClass('active');
        } else {
            $('#' + key + '_2_cnt').removeClass('active');
        }

        if (canTranCnt3 == cnt) {
            $('#' + key + '_3_cnt').addClass('active');
        } else {
            $('#' + key + '_3_cnt').removeClass('active');
        }

        if (canTranCnt == cnt) {
            $('#' + key + '_all_cnt').addClass('active');
        } else {
            $('#' + key + '_all_cnt').removeClass('active');
        }
    }

    //价格增加按扭
    $('.addPrice').on('click', function () {
        var priceKey = $(this).data('val');
        var price = (Number($('#' + priceKey).val()) + 0.01).toFixed(2);
        if (price > zt) {
            showTips('价格不能高于跌停价','warm');
            return;
        }
        $('#' + priceKey).val(price);
        var type = $(this).data('type');
        if (type == 'mr') {
            caclCanBuy();
        }
    });

    //价格减少按扭
    $('.subPrice').on('click', function () {
        var priceKey = $(this).data('val');
        var price = (Number($('#' + priceKey).val()) - 0.01).toFixed(2);
        if (price < dt) {
            showTips('价格不能低于跌停价','warm');
            return;
        }
        $('#' + priceKey).val(price);
        var type = $(this).data('type');
        if (type == 'mr') {
            caclCanBuy();
        }
    });

    //数量增加按扭
    $('.addCnt').on('click', function () {
        var cntKey = $(this).data('val');
        var cnt = (Number($('#' + cntKey).val()) + minTran);
        if (cnt > canTranCnt) {
            showTips('您最多可交易' + canTranCnt);
            return;
        }
        $('#' + cntKey).val(cnt);
        var type = $(this).data('type');
        changeMrCnt(cnt, type);
    });

    //数量减少按扭
    $('.subCnt').on('click', function () {
        var cntKey = $(this).data('val');
        var cnt = (Number($('#' + cntKey).val()) - minTran);
        if (cnt <= 0) {
            showTips("数量不能少于" + minTran);
            return;
        }
        $('#' + cntKey).val(cnt);
        var type = $(this).data('type');
        changeMrCnt(cnt, type);
    });

    //可交易量
    var canTranCnt = 0;

    // 1/3 交易量
    var canTranCnt3 = 0;

    // 1/2 交易量
    var canTranCnt2 = 0;

    //可用金币
    var gold = 0;

    //加载可买入信息
    function loadBuyInfo(showload) {
        canTranCnt = 0;
        ajaxHelper.get(getUrl('user/getUser'), {}, function (ret) {
            if (ret.success) {
                var data = ret.obj;
                $('#mrGHtml').html('可用金币：' + data.usableBalance.toFixed(2));
                gold = data.usableBalance;
                caclCanBuy();
            } else {
                $('#mrCnt').attr('placeholder', '可购买' + canTranCnt);
            }
        }, showload);
    }


    function caclCanBuy() {
        var oldCanTranCnt2 = canTranCnt2;

        var oldCanTranCnt3 = canTranCnt3;

        var oldCanTranCnt = canTranCnt;

        var nowPrice = Number($('#mrPrice').val());
        if (nowPrice == 0) {
            canTranCnt = 0;
        } else {
            var cnt = parseInt(gold / nowPrice);
            var k = parseInt(cnt / minTran);
            canTranCnt = minTran * k;
        }
        $('#mrCnt').attr('placeholder', '可购买' + canTranCnt);


        canTranCnt2 = getCanTranCntPer(2);

        canTranCnt3 = getCanTranCntPer(3);

        if ($('#mrCnt').val() != '') {
            var oldCnt = $('#mrCnt').val();

            if (oldCnt == oldCanTranCnt) {
                $('#mrCnt').val(canTranCnt);
            }

            if (oldCnt == oldCanTranCnt2) {
                $('#mrCnt').val(canTranCnt2);
            }

            if (oldCnt == oldCanTranCnt3) {
                $('#mrCnt').val(canTranCnt3);
            }
        }

    }

    function getCanTranCntPer(i) {
        if (canTranCnt < minTran) {
            return 0;
        } else if (canTranCnt >= minTran && canTranCnt <= i * minTran) {
            return minTran;
        } else {
            var k = parseInt(canTranCnt / (i * minTran));
            return k * minTran;
        }
        return 0;
    }

    //加载可卖出信息
    function loadSaleInfo(showload) {
        canTranCnt = 0;
        var proId = getProId();
        ajaxHelper.get(getUrl('user/getItem'), {'proId': proId}, function (ret) {
            if (ret.success) {
                var data = ret.obj;
                if (data != null) {
                    $('#mcCntHtml').html('可交易量：' + data.cnt);
                    var k = parseInt(data.cnt / minTran);
                    canTranCnt = minTran * k;
                  canTranCnt2 = getCanTranCntPer(2);

                  canTranCnt3 = getCanTranCntPer(3);

                  $('#mcCnt').attr('placeholder', '可卖出' + data.cnt);
                }
            } else {
                canTranCnt = 0;
            }

        }, showload);
    }

    // 1/3
    $('.threeBtn').on('click', function () {
        var key = $(this).data('val');
        var target = $('#' + key);
        if (canTranCnt3 == 0) {
            showTips("您未有足够的商品可交易",'warm');
        } else {
            target.val(canTranCnt3);
        }
        autoShowFee();
    });

    // 1/2
    $('.twoBtn').on('click', function () {
        var key = $(this).data('val');
        var target = $('#' + key);
        if (canTranCnt2 == 0) {
            showTips("您未有足够的商品可交易",'warm');
        } else {
            target.val(canTranCnt2);
        }
      autoShowFee();
    });

    // all
    $('.allBtn').on('click', function () {
        var key = $(this).data('val');
        var target = $('#' + key);
        target.val(canTranCnt);
      autoShowFee();
    });

    //涨停
    var zt = 0;
    //跌停
    var dt = 0;
    //最小交易单位
    var minTran = 0;

    //当前价格
    var nowPrice = 0;

    // 图表对象
    var chart = null;


    var per;

    //初始化页面信息
    function init(proId, showLoading) {
        per = 1;
        setProId(proId);
        cType = 'K15';
        //加载商品信息
        loadProInfo(proId, showLoading);

        //加载物品信息
        loadItem(proId);

        //图标选择位置
        $(".chartChange .chartBtn").eq(1).addClass('seled').siblings('.chartBtn').removeClass('seled');

        createChart(proId, 'K15');

    }

    function createChart(proId, kType) {
        if (kType == "ML") {
            chart = MinuteChart.createNew(proId);
        } else {
            chart = CandleChart.createNew(proId, kType);
        }
        chart.createChart();
    }

    function getProId() {
        return localUtil.get("TRAN_PRO_ID");
    }

    function setProId(proId) {
        localUtil.set("TRAN_PRO_ID", proId);
    }

    function setProList(list) {
        sessionUtil.set("TRAN_PRO_LIST", JSON.stringify(list));
    }

    function getProList() {
        var list = sessionUtil.get("TRAN_PRO_LIST");
        if (list != null) {
            return JSON.parse(list);
        }
        return null;
    }

    loadProList();

    //加载商品列表信息
    function loadProList() {
        var list = getProList();
        if (list == null) {
            ajaxHelper.get(getUrl('pro/proList'), {}, function (ret) {
                if (ret.success) {
                    list = ret.obj;
                    //保存至缓存
                    setProList(list);
                    showProList(list);
                } else {
                    showTips('加载商品列表失败');
                }
            });
        } else {
            showProList(list);
        }

    }

    //展示商品列表
    function showProList(list) {
        if (list != null) {
            //获取当前所选商品
            var proId = getProId();
            if (proId == null) {
                proId = list[0].id;
                setProId(proId)
            }
            var html = '';
            $.each(list, function (key, val) {
                var active = proId == val.id ? 'active' : '';
                var proName = val.proName.substring(0, 2);
                html +=
                    '<div class="greemItem feedbtn ' + active + '" data-val="' + val.id + '">' +
                    '   <p class="treeName">' + proName + '</p>' +
                    '</div>';
            });
            $('.greenItemWrap').html(html);

            init(proId);
            //头部商品切换,得新绑定
            $(".greenItemWrap .greemItem").click(function () {
                var w = $(window).width();
                $(this).addClass('active').siblings('.greemItem').removeClass('active');
                var selectProId = $(this).data('val');
                var currProId = getProId();
                var _index = $(this).index();
                if(_index>2){
                    $("#greenTypeSel").animate({scrollLeft:w},300);
                }else{
                    $("#greenTypeSel").animate({scrollLeft:-w},300);
                }
                if (selectProId == currProId) {
                    return;
                }
                init(selectProId);
            });
        }
    }

    //加载商品信息
    function loadProInfo(proId, showLoading) {
        if (showLoading == void(0)) {
            showLoading = true;
        }
        ajaxHelper.get(getUrl('getTranInfo'), {'proId': proId}, function (ret) {
            if (ret.success) {
                buildProInfo(ret.obj);
            }
        }, showLoading);
    }

    setInterval(function () {
        if (per == 1) {
            return;
        }
        var proId = getProId();
        //加载商品信息
        loadProInfo(proId, false);
    }, 1000);

    function buildProInfo(obj) {
        //处理商品信息
        var proInfo = obj.proInfo;
        if (proInfo != null) {
            //商品图片
            $('.greenTextPic').attr('src', proInfo.proImg);
            minTran = proInfo.minTran;

        }

        var qInfo = obj.quotationInfo;
        if (qInfo != null) {
            if(qInfo.changePrice>=0){
                $("#upDownIndex").removeClass('down');
                $(".detailInfo").removeClass('down');
            }else{
                $("#upDownIndex").addClass('down');
                $(".detailInfo").addClass('down');
            }
            $('#nowPrice').html(qInfo.nowPrice.toFixed(2));
            $('#changeRate').html((qInfo.changeRate * 100).toFixed(2) + "%");
            $('#changePrice').html(qInfo.changePrice.toFixed(2));
            $('#toOpenPrice').html(qInfo.toOpenPrice.toFixed(2));
            $('#tranVolume').html(qInfo.tranVolume);
            $('#heightPrice').html(qInfo.heightPrice.toFixed(2));
            $('#lowPrice').html(qInfo.lowPrice.toFixed(2));

            //涨停
            $('#mczt').html('涨停:' + qInfo.goUpStaying.toFixed(2));
            $('#mrzt').html('涨停:' + qInfo.goUpStaying.toFixed(2));
            zt = qInfo.goUpStaying.toFixed(2);
            //跌停
            $('#mcdt').html('跌停:' + qInfo.fallStaying.toFixed(2));
            $('#mrdt').html('跌停:' + qInfo.fallStaying.toFixed(2));
            dt = qInfo.fallStaying.toFixed(2)

            nowPrice = qInfo.nowPrice.toFixed(2);

        }

        var i = 1;
        for (; i <= 5; i++) {
            if (i < 4) {
                $($('#mb' + i).children()[1]).html('--');
                $($('#mb' + i).children()[2]).html('--');
                $($('#ms' + i).children()[1]).html('--');
                $($('#ms' + i).children()[2]).html('--');

            }
            $($('#mrb' + i).children()[1]).html('--');
            $($('#mrb' + i).children()[2]).html('--');
            $($('#mrs' + i).children()[1]).html('--');
            $($('#mrs' + i).children()[2]).html('--');

            $($('#mcb' + i).children()[1]).html('--');
            $($('#mcb' + i).children()[2]).html('--');
            $($('#mcs' + i).children()[1]).html('--');
            $($('#mcs' + i).children()[2]).html('--');
        }

        var eMap = obj.eMap
        if (eMap != null) {

            //买1
            if (eMap.buy1 != null) {
                $($('#mb1').children()[1]).html(eMap.buy1.price.toFixed(2));
                $($('#mb1').children()[2]).html(eMap.buy1.cnt);

                $($('#mrb1').children()[1]).html(eMap.buy1.price.toFixed(2));
                $($('#mrb1').children()[2]).html(eMap.buy1.cnt);

                $($('#mcb1').children()[1]).html(eMap.buy1.price.toFixed(2));
                $($('#mcb1').children()[2]).html(eMap.buy1.cnt);
            }

            //买2
            if (eMap.buy2 != null) {
                $($('#mb2').children()[1]).html(eMap.buy2.price.toFixed(2));
                $($('#mb2').children()[2]).html(eMap.buy2.cnt);

                $($('#mrb2').children()[1]).html(eMap.buy2.price.toFixed(2));
                $($('#mrb2').children()[2]).html(eMap.buy2.cnt);

                $($('#mcb2').children()[1]).html(eMap.buy2.price.toFixed(2));
                $($('#mcb2').children()[2]).html(eMap.buy2.cnt);
            }

            //买3
            if (eMap.buy3 != null) {
                $($('#mb3').children()[1]).html(eMap.buy3.price.toFixed(2));
                $($('#mb3').children()[2]).html(eMap.buy3.cnt);

                $($('#mrb3').children()[1]).html(eMap.buy3.price.toFixed(2));
                $($('#mrb3').children()[2]).html(eMap.buy3.cnt);

                $($('#mcb3').children()[1]).html(eMap.buy3.price.toFixed(2));
                $($('#mcb3').children()[2]).html(eMap.buy3.cnt);
            }
            //买4
            if (eMap.buy4 != null) {
                $($('#mrb4').children()[1]).html(eMap.buy4.price.toFixed(2));
                $($('#mrb4').children()[2]).html(eMap.buy4.cnt);

                $($('#mcb4').children()[1]).html(eMap.buy4.price.toFixed(2));
                $($('#mcb4').children()[2]).html(eMap.buy4.cnt);
            }
            //买5
            if (eMap.buy5 != null) {
                $($('#mrb5').children()[1]).html(eMap.buy5.price.toFixed(2));
                $($('#mrb5').children()[2]).html(eMap.buy5.cnt);

                $($('#mcb5').children()[1]).html(eMap.buy5.price.toFixed(2));
                $($('#mcb5').children()[2]).html(eMap.buy5.cnt);
            }
            //卖1
            if (eMap.sell1 != null) {
                $($('#ms1').children()[1]).html(eMap.sell1.price.toFixed(2));
                $($('#ms1').children()[2]).html(eMap.sell1.cnt);
                $($('#mrs1').children()[1]).html(eMap.sell1.price.toFixed(2));
                $($('#mrs1').children()[2]).html(eMap.sell1.cnt);
                $($('#mcs1').children()[1]).html(eMap.sell1.price.toFixed(2));
                $($('#mcs1').children()[2]).html(eMap.sell1.cnt);
            }
            //卖2
            if (eMap.sell2 != null) {
                $($('#ms2').children()[1]).html(eMap.sell2.price.toFixed(2));
                $($('#ms2').children()[2]).html(eMap.sell2.cnt);
                $($('#mrs2').children()[1]).html(eMap.sell2.price.toFixed(2));
                $($('#mrs2').children()[2]).html(eMap.sell2.cnt);
                $($('#mcs2').children()[1]).html(eMap.sell2.price.toFixed(2));
                $($('#mcs2').children()[2]).html(eMap.sell2.cnt);
            }
            //卖3
            if (eMap.sell3 != null) {
                $($('#ms3').children()[1]).html(eMap.sell3.price.toFixed(2));
                $($('#ms3').children()[2]).html(eMap.sell3.cnt);
                $($('#mrs3').children()[1]).html(eMap.sell3.price.toFixed(2));
                $($('#mrs3').children()[2]).html(eMap.sell3.cnt);
                $($('#mcs3').children()[1]).html(eMap.sell3.price.toFixed(2));
                $($('#mcs3').children()[2]).html(eMap.sell3.cnt);
            }
            //卖4
            if (eMap.sell4 != null) {
                $($('#mrs4').children()[1]).html(eMap.sell4.price.toFixed(2));
                $($('#mrs4').children()[2]).html(eMap.sell4.cnt);
                $($('#mcs4').children()[1]).html(eMap.sell4.price.toFixed(2));
                $($('#mcs4').children()[2]).html(eMap.sell4.cnt);
            }
            //卖5
            if (eMap.sell5 != null) {
                $($('#mrs5').children()[1]).html(eMap.sell5.price.toFixed(2));
                $($('#mrs5').children()[2]).html(eMap.sell5.cnt);
                $($('#mcs5').children()[1]).html(eMap.sell5.price.toFixed(2));
                $($('#mcs5').children()[2]).html(eMap.sell5.cnt);
            }
        }

        if (per > 1) {
            var proId = getProId();

            var mLine = obj.mLine;
            if (mLine != null) {
                if (proId == mLine.proId && "ML" == cType) {
                    chart.flush(mLine);
                }
            }

            var kLine = obj.kLine;
            if (kLine != null) {
                // console.info(proInfo);
                if (proId == kLine.proId && "K15" == cType) {
                    // console.info(kLine);
                    chart.flush(kLine);
                }
            }
        }

        loadItem(obj.item);

        $('#entrustListCnt').html(obj.orderCnt);
        per++;

    }


    //加载浮动盈亏
    function loadItem(data) {
        if(data != null){
            $('#ccsl').html(data.cnt + data.dCnt);
            $('#avgPrice').val(data.avgPrice);
        }else{
            $('#ccsl').html(0);
            $('#avgPrice').val(0.00);
        }
        caleProfitLoss();
    }

    //计算浮动盈亏
    function caleProfitLoss() {
        var proId = getProId();
        var para = {
            'pid': proId,
        };
        ajaxHelper.get(getUrl('tran/caleProfitLossQuery'), para, function (ret) {
            if (ret.success) {
                var obj = ret.obj;
                $('#fdyk').html(obj);
                if(obj<0){
                    $('#fdyk').removeClass("upColor");
                    $('#fdyk').addClass("keyColor");
                }else {
                    $('#fdyk').addClass("upColor");
                    $('#fdyk').removeClass("keyColor");
                }
            }
        });

    }

    //加载委托列表
    function loadEntrust(proId, showLoad) {
        var para = {
            'proId': proId,
            'pageNum': 1,
            'type': 'CUR'
        };
        ajaxHelper.get(getUrl('tran/listEntrustOrder'), para, function (ret) {
            if (ret.success) {
                var list = ret.obj.records;
                if (list != null) {
                    showEntrustList(list);
                }
            }
        }, showLoad);
    }

    function showEntrustList(list) {
        var size = 0;
        if (list != null) {
            var html = '';
            $.each(list, function (key, val) {
                var cls1 = val.enType == 0 ? 'sale' : 'buy';
                var cls2 = val.trCnt > 0 ? 'ing' : 'fure';
                html += '<tr class="tabCon ' + cls1 + ' ' + cls2 + '">' +
                    '   <td>' +
                    '       ' + val.proName +
                    '       <span>' + (val.enType == 0 ? '买' : '卖') + '</span>' +
                    '   </td>' +
                    '   <td>' +
                    '       ' + val.enPrice +
                    '   </td>' +
                    '   <td>' + val.trCnt + '/' + val.enCnt + '</td>' +
                    '   <td>' +
                    '       <div class="canelBtn feedbtn" data-val="' + val.id + '">' +
                    '           撤销' +
                    '       </div>' +
                    '   </td>' +
                    '</tr>';
                size++;
            });
            $('#entrustList').html(html);
        }
        $('#entrustListCnt').html(size);
    }


    // 卖出
    var sellLock = Lock.createNew();
    $('.sellConfirmBtn').on('click', function () {
        var para = {
            'price': $('#mcPrice').val(),
            'cnt': $('#mcCnt').val(),
            'proId': getProId(),
            'type': 1
        }
        if (para.price == '') {
            showTips('请输入卖出价格','warm');
            return;
        }
        if (para.cnt == '') {
            showTips('请输入卖出数量','warm');
            return;
        }
        if (para.price > zt) {
            showTips('卖出价格不能高于涨停价','warm');
            return;
        }
        if (para.price < dt) {
            showTips('卖出价格不能低于跌停价','warm');
            return;
        }
        if (para.cnt < minTran) {
            showTips('数量不能小于' + minTran);
            return;
        }
        if (para.cnt % minTran != 0) {
            showTips('数量只能是' + minTran + '的倍数','warm');
            return;
        }
        if (!sellLock.getLock()) {
            return;
        }
        ajaxHelper.post(getUrl('tran/entrustOrder'), para, function (ret) {
            if (ret.success) {
                showTips('委托成功')
                closeSaleBox();
            } else {
                showTips(ret.msg);
            }
            loadSaleInfo(false);
        }, true, function () {
            sellLock.release();
        });
    });

    //买入
    var buyLock = Lock.createNew();
    $('.buyConfirmBtn').on('click', function () {
        var para = {
            'price': $('#mrPrice').val(),
            'cnt': $('#mrCnt').val(),
            'proId': getProId(),
            'type': 0
        }
        if (para.price == '') {
            showTips('请输入买入价格');
            return;
        }
        if (para.cnt == '') {
            showTips('请输入买入数量');
            return;
        }
        if (para.price > zt) {
            showTips('买入价格不能高于涨停价');
            return;
        }
        if (para.price < dt) {
            showTips('买入价格不能低于跌停价');
            return;
        }
        if (para.cnt < minTran) {
            showTips('数量不能小于' + minTran);
            return;
        }
        if (para.cnt % minTran != 0) {
            showTips('数量只能是' + minTran + '的倍数');
            return;
        }
        if (!buyLock.getLock()) {
            return;
        }
        ajaxHelper.post(getUrl('tran/entrustOrder'), para, function (ret) {
            if (ret.success) {
                showTips('委托成功')
                closeBuyBox();
            } else {
                showTips(ret.msg);
            }
            loadBuyInfo(false);
        }, true, function () {
            buyLock.release();
        });
    });
    //mobile短去除滚动条
    function removeScrollBar() {
        if(!isPc()){
            $("#greenTypeSel").removeClass('greenTypeSe2');
        }
    }
    removeScrollBar();
    //点击遮罩层关闭买入卖出和委托订单
    function closeBoxWhenCliclLayer() {
        $(document).on("click",".layerShadow2",function () {
            showDlgBox(!1);
            closeBuyBox();
            closeSaleBox();
        });
    }
    closeBoxWhenCliclLayer();
    //根据proId切换至指定商品选中状态
    function activeProById() {
        var w = $(window).width();
        var proId = localStorage.getItem('TRAN_PRO_ID');
        if(proId){
            proId = parseInt(proId)-4001;
            $(".greenItemWrap .greemItem").eq(proId).addClass('active').siblings('.greemItem').removeClass('active');
            if(proId>2){
                $("#greenTypeSel").scrollLeft(w);
            }
        }
    }
    activeProById();
    //图标大小自适应
    var buySaleH = $(".dgtTableWrap").height();//卖三买三高度
    function autoHeightChart() {
        // if(isPc()) return;
        var h = $(window).height();
        var selTreeH = $("#greenTypeSel").height();//头部选择高度
        var baseInfoH = $(".marketBaseInfo").height();//基本信息高度
        var changeCahrtTableH = $(".chartChange").height();//切换图标选择高度
        var oprBtnWrapH = $(".oprBtnWrap").height();//操作按钮区域高度
        var footerH = $(".footer").height();//footer高度
        //图标高度
        var chartH;
        // console.log(showBuySale);
        if(showBuySale){
            chartH = h-(selTreeH+baseInfoH+buySaleH+changeCahrtTableH+oprBtnWrapH+footerH)-70;
            // console.log(1);
        }else{
            chartH = h-(selTreeH+baseInfoH+changeCahrtTableH+oprBtnWrapH+footerH)-70;
            // console.log(2)
            // chartH =50;
        }
        // console.log((selTreeH+baseInfoH+buySaleH+changeCahrtTableH+oprBtnWrapH+footerH),(selTreeH+baseInfoH+changeCahrtTableH+oprBtnWrapH+footerH),"前后")
        // console.log(buySaleH,'卖三',h);
        // console.log(chartH);
        // $(".WrapB").height(chartH);
        // $(".marketDetailBox .ChartBox .chart").height(chartH+60);
        // $(".marketDetailBox .ChartBox").height(chartH+60);
        // $("#charts>div").height(chartH+60);
        //设置图表高度
        chart.option.grid[0].height = chartH;
        chart.chart.setOption(chart.option);
        // chart.setChartHeight(chartH);
    }
    GlobalAutoChart = autoHeightChart;
    GlobalAutoChartM = autoHeightChart;
    //翻转动画
    function ani(arr) {
        var l = arr.length;
        for(var i = 0;i<l;i++){
            $(arr[i]).removeClass("ani");
        }
        setTimeout(function () {
            for(var k = 0;k<l;k++){
                $(arr[k]).addClass("ani");
            }
        },2000);
    }
    setInterval(function () {
        var arr = [
            "#nowPrice",
            "#nowPriseBg",
            "#changePrice",
            "#changeRate",
            "#toOpenPrice",
            "#tranVolume",
            "#heightPrice",
            "#lowPrice",
            "#tranVolume",
            "#tt1",
            "#tt2",
            "#tt3",
            "#tt4",
            "#tt5",
            "#tt6",
            "#tt7",
            "#tt8",
            "#tt9",
            "#tt10",
            "#tt11",
            "#tt12"
        ];
        ani(arr);
    },5000);


  $('#mcPrice').keyup(function () {
    autoShowFee();
  });
  $('#mcCnt').keyup(function () {
    autoShowFee();
  });
});

//自动计算收费费
function autoShowFee() {
  setTimeout(function(){
    var val = $("#mcPrice").val();
    var num = $("#mcCnt").val();
    var fee = val*num*0.01;
    if(fee&&fee<1) fee=1;
    fee = fee.toFixed(2);
    $("#mcCharge").html(fee);
  },100)
  // console.log(val,num,fee);
}