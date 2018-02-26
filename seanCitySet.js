/*!
 *
 *  seanSelCity.js 区域选择插件v.10
 *  author:sean
 *  date:2017-09-01
 *  ps:点选li项后会动态为元素创建data-cityid属性并赋值该li项id
 *  
 *
 *  Include   
            1.区划数据源 cityJson.js(已闭包处理)
            如果不使用该数据源，需要渲染控件时传递参数
            
            { 
                province:[{ "id": "820000", "name": "澳门", "city": [{ "id": "820001", "name": "澳门" },...] }],
                area:[{ "id": "320104", "name": "秦淮区", "pid": "320100" },...]
            }             
 *            
            2.popt.js   
 */
; (function ($) {
    //定义CitySelObj的构造函数
    var CitySelObj = function (obj, opt) {
        this.$element = obj,
        this.defaults = {
            province: cityData.province,
            area: cityData.area
        },
        this.options = $.extend({}, this.defaults, opt)
    }
    CitySelObj.prototype = {
        getCity: function (obj) {
            var c = obj.data('id');
            var e = this.options.province;
            var f;
            var g = '';
            for (var i = 0, plen = e.length; i < plen; i++) {
                if (e[i]['id'] == parseInt(c)) {
                    f = e[i]['city'];
                    break
                }
            }
            for (var j = 0, clen = f.length; j < clen; j++) {
                g += '<a data-level="1" data-id="' + f[j]['id'] + '" data-name="' + f[j]['name'] + '" title="' + f[j]['name'] + '">' + f[j]['name'] + '</a>'
            }
            $("#_cityProvince li").removeClass("citySel");
            $("#_cityProvince li:eq(1)").addClass("citySel");
            //console.info(g)
            return g;
        },
        getArea: function (obj) {
            var c = obj.data('id');
            var e = this.options.area;
            var f = [];
            var g = '';
            for (var i = 0, plen = e.length; i < plen; i++) {
                if (e[i]['pid'] == parseInt(c)) {
                    f.push(e[i]);
                }
            }
            for (var j = 0, clen = f.length; j < clen; j++) {
                g += '<a data-level="1" data-id="' + f[j]['id'] + '" data-name="' + f[j]['name'] + '" title="' + f[j]['name'] + '">' + f[j]['name'] + '</a>'
            }
            $("#_cityProvince li").removeClass("citySel");
            $("#_cityProvince li:eq(2)").addClass("citySel");
            return g;
        },
        renderSel: function () {
            var $this = this;
            var $ele = this.$element
            $ele.click(function (e) {
                var content = '<div class="_citys">'+
                                '<span title="关闭" class="cClose" id="cClose">×</span>' +
                                '<span title="清空" class="cClear"  id="cClear">清空</span>' +
                                '<ul id="_cityProvince" class="_citys0">' +
                                    '<li class="citySel">省份</li>' +
                                    '<li>城市</li>' +
                                    '<li>区县</li>' +
                                '</ul>' +
                                '<div id="_citys0" class="_citys1"></div>' +
                                '<div style="display:none" id="_citys1" class="_citys1"></div>' +
                                '<div style="display:none" id="_citys2" class="_citys1"></div>' +
                              '</div>';
                Iput.show({ id: this, event: e, content: content, width: "465" });
                $("#cClose").click(function () {
                    Iput.colse();
                });
                $("#cClear").click(function () {
                    $ele.val('')
                    if(typeof($($ele).attr('data-cityId'))!='undefined')
                        $($ele).attr('data-cityId','')
                });
                var tb_province = [];

                var b = $this.options.province;
                for (var i = 0, len = b.length; i < len; i++) {
                    tb_province.push('<a data-level="0" data-id="' + b[i]['id'] + '" data-name="' + b[i]['name'] + '">' + b[i]['name'] + '</a>');
                }
                $("#_citys0").append(tb_province.join(""));

                //province
                $("#_citys0 a").click(function () {
                    var g = $this.getCity($(this));
                    $("#_citys1 a").remove();
                    $("#_citys1").append(g);
                    $("._citys1").hide();
                    $("._citys1:eq(1)").show();
                    $("#_citys0 a,#_citys1 a,#_citys2 a").removeClass("AreaS");
                    $(this).addClass("AreaS");
                    var lev = $(this).data("name");
                    $($ele).val($(this).data("name"));
                    if (document.getElementById("hid_province") == null) {
                        var hcitys = $('<input>', {
                            type: 'hidden',
                            name: "hid_province",
                            "data-id": $(this).data('id'),
                            id: "hid_province",
                            val: lev
                        });
                        $(this).after(hcitys);
                    }
                    else {
                        $("#hid_province").val(lev);
                        $("#hid_province").attr("data-id", $(this).data('id'));
                    }
                    $($ele).attr("data-cityId", $(this).data('id'))
                    //city
                    $("#_citys1 a").click(function () {
                        $("#_citys1 a,#_citys2 a").removeClass("AreaS");
                        $(this).addClass("AreaS");
                        var lev = $(this).data("name");
                        if (document.getElementById("hid_city") == null) {
                            var hcitys = $('<input>', {
                                type: 'hidden',
                                name: "hid_city",
                                "data-id": $(this).data('id'),
                                id: "hid_city",
                                val: lev
                            });
                            $(this).after(hcitys);
                        }
                        else {
                            $("#hid_city").attr("data-id", $(this).data('id'));
                            $("#hid_city").val(lev);
                        }
                        $($ele).attr("data-cityId", $(this).data('id'))
                        var bc = $("#hid_province").val();
                        $($ele).val(bc + "-" + $(this).data("name"));

                        var ar = $this.getArea($(this));

                        $("#_citys2 a").remove();
                        $("#_citys2").append(ar);
                        $("._citys1").hide();
                        $("._citys1:eq(2)").show();
                        //county
                        $("#_citys2 a").click(function () {
                            $("#_citys2 a").removeClass("AreaS");
                            $(this).addClass("AreaS");
                            var lev = $(this).data("name");
                            if (document.getElementById("hid_area") == null) {
                                var hcitys = $('<input>', {
                                    type: 'hidden',
                                    name: "hid_area",
                                    "data-id": $(this).data('id'),
                                    id: "hid_area",
                                    val: lev
                                });
                                $(this).after(hcitys);
                            }
                            else {
                                $("#hid_area").val(lev);
                                $("#hid_area").attr("data-id", $(this).data('id'));
                            }
                            $($ele).attr("data-cityId", $(this).data('id'))
                            var bc = $("#hid_province").val();
                            var bp = $("#hid_city").val();
                            $($ele).val(bc + "-" + bp + "-" + $(this).data("name"));
                            Iput.colse();
                        });
                    });
                });
                $("#_cityProvince li").click(function () {
                    $("#_cityProvince li").removeClass("citySel");
                    $(this).addClass("citySel");
                    var s = $("#_cityProvince li").index(this);
                    $("._citys1").hide();
                    $("._citys1:eq(" + s + ")").show();
                });
            })
        }
    }
    $.fn.seanSelCity = function (options) {
        var citySelObj = new CitySelObj(this, options);
        return citySelObj.renderSel();
    }
})(jQuery);



