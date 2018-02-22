$(function () {
    /*利用jquery封装的ajax请求数据进行渲染*/
    $.ajax({
        type: 'GET',//要求为String类型的参数，（默认为当前页地址）发送请求的地址。
        url: './static/json/learn.json',//要求为String类型的参数，请求方式（post或get）默认为get。
        async: true,//要求为Boolean类型的参数，默认设置为true，所有请求均为异步请求。如果需要发送同步请求，请将此选项设置为false。
        data: '{}',
        dataType: 'json',//要求为String类型的参数，预期服务器返回的数据类型。
        success: function (data, textStatus) {
            //取得标题导航的高度；
            var heigit = $(".learning").height();
            //每页的导航链接条数；
            var each = Math.floor(heigit / 30);
            //总页码数
            var count = Math.ceil(data.length / each);
            //默认情况下
            var str = "";
            for (var i = 0; i < each; i++) {
                var num = i + 1;
                str += ' <a href=' + data[i].link + ' target="_blank">' + num + '、' + data[i].str + '</a>';
            }
            $(".learning").append(str);
            $(".tcdPageCode").createPage({
                pageCount: count,
                current: 1,
                backFn: function (page) {
                    //console.log(p);
                    var str = "";
                    $(".learning").html('');
                    if (page < count) {
                        for (var i = (page - 1) * each; i < page * each; i++) {
                            var num = i + 1;
                            str += ' <a href=' + data[i].link + ' target="_blank">' + num + '、' + data[i].str + '</a>';
                        }
                        $(".learning").append(str);
                    } else {
                        for (var i = (page - 1) * each; i < data.length; i++) {
                            var num = i + 1;
                            str += ' <a href=' + data[i].link + ' target="_blank">' + num + '、' + data[i].str + '</a>';
                        }
                        $(".learning").append(str);
                    }

                }
            });
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(textStatus)
        }
    });
$(document).on("mouseover",".learning>a",function (event) {
    var pageX = event.pageX+10;
    var pageY = event.pageY+10;
    var text = $(this).text();
    $(".title-page").css({
        top:pageY,
        left:pageX,
        display:"block"
    }).text(text);

})
    $(document).on("mouseout",".learning>a",function (event) {
    $(".title-page").css({
        display:"none"
    }).text("");

})




})
