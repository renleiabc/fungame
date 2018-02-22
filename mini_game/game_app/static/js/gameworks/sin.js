$(function () {
         //步数分割函数
    var fastSin = function (steps) {
        var table = [], ang = 0, angStep;
        angStep = (Math.PI * 2) / steps;
        do {
            table.push(Math.sin(ang));
            ang += angStep;
        } while (ang < Math.PI * 2);
        return table;
    }
    var sinTable = fastSin(4096),
        $drawTarget = $("#draw-target"),
        divs = '',
        i, $bars, x = 0;
    //获取正弦曲线图的宽度
    var width = $drawTarget.width();
    //ang正弦曲线的开始角度
    //正弦波的频率，定义了波的“紧密度”；
    //height正弦波的幅度，也影响画线的宽度；
    var drawGraph = function (ang, freq, heigth) {
        var heigth2 = heigth * 2;
        for (var i = 0; i < width; i++) {
            $bars[i].style.top = 160 - heigth + sinTable[(ang +
                (i * freq)) & 4095] * heigth + 'px';

            $bars[i].style.height = heigth2 + 'px';

        }
    };
    for (i=0;i<width;i++){
          divs += '<div style="position:absolute; width:1px; ' +
              'height:40px; ' + 'background-color:#0d0; top:0px; ' +
              'left: ' + i + 'px;"></div>';
    }

    $drawTarget.append(divs);
    $bars = $drawTarget.children();
    setInterval(function () {
        drawGraph(x*80,32-(sinTable[(x*20)&4095]*16),60-(sinTable[(x*10)&4095]*20));
        x++;
    },20)

})