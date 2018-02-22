$(function () {
    $(".mouse1").mousedown(function (e) {
        //设置移动后的默认位置
        var endx = 0;
        var endy = 0;
        //获取div的初始位置，要注意的是需要转整型，因为获取到值带px
        var left = parseInt($(".mouse1").css("left"));
        var top = parseInt($(".mouse1").css("top"));
        //获取鼠标按下时的坐标，区别于下面的es.pageX,es.pageY
        var downx = e.pageX - 10;
        var downy = e.pageY - 10;     //pageY的y要大写，必须大写！！
        //    鼠标按下时给div挂事件
        var mouse = $(".mouse").children();
        for (var i = 1; i < mouse.length; i++) {
            console.log(mouse[i]);
            mouse[i].style.top = mouse[i].style.top + downx;
            mouse[i].style.left = mouse[i].style.left + downy;
        }
        $(".mouse1").on("mousemove", function (es) {
            //es.pageX,es.pageY:获取鼠标移动后的坐标
            var endx = es.pageX - downx + left;     //计算div的最终位置
            var endy = es.pageY - downy + top;
            for (var i = 1; i < mouse.length; i++) {
                console.log(mouse[i]);
                mouse[i].style.top = mouse[i - 1].style.top;
                mouse[i].style.left = mouse[i - 1].style.left;
            }
            //带上单位
            $(".mouse1").css({
                "left": endx + "px",
                "top": endy + "px"
            })
        });
    })


    $(".mouse1").mouseup(function () {
        //鼠标弹起时给div取消事件
        $(".mouse1").off("mousemove")
    })

})