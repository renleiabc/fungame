
$(function () {
    var $btn = $('.g-lottery-img');// 旋转的div
    var playnum = 5; //初始次数，由后台传入
    $('.playnum').html(playnum);//显示还剩下多少次抽奖机会
    var isture = 0;//是否正在抽奖
    var clickfunc = function () {
        var data = [1, 2, 3, 4, 5, 6];//抽奖
        //data为随机出来的结果，根据概率后的结果
        data = data[Math.floor(Math.random() * data.length)];//1~6的随机数
        switch (data) {
            case 1:
                rotateFunc(1, 0, '恭喜您获得2000元理财金');
                break;
            case 2:
                rotateFunc(2, 0, '恭喜您获得2000元理财金');
                break;
            case 3:
                rotateFunc(3, 0, '恭喜您获得2000元理财金');
                break;
            case 4:
                rotateFunc(4, -60, '谢谢参与');
                break;
            case 5:
                rotateFunc(5, 120, '谢谢参与');
                break;
            case 6:
                rotateFunc(6, 120, '谢谢参与');
                break;
        }
    }
    $(".playbtn").click(function () {
        $(".luck").text("")
        if (isture) return; // 如果在执行就退出
        isture = true; // 标志为 在执行
        if (playnum <= 0) { //当抽奖次数为0的时候执行
            alert("没有次数了");
            $('.playnum').html(0);//次数显示为0
            isture = false;
        } else { //还有次数就执行
            playnum = playnum - 1; //执行转盘了则次数减1
            if (playnum <= 0) {
                playnum = 0;
            }
            $('.playnum').html(playnum);
            clickfunc();
        }
    });
    var rotateFunc = function (awards, angle, text) {
        isture = true;
        $btn.stopRotate();
        $btn.rotate({
            angle: 0,//旋转的角度数
            duration: 4000, //旋转时间
            animateTo: angle + 1440, //给定的角度,让它根据得出来的结果加上1440度旋转
            callback: function () {
                isture = false; // 标志为 执行完毕
                $(".luck").text(text)
            }
        });
    };
});