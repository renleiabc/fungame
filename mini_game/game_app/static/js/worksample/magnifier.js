$(function () {
    var arrLi = document.getElementById("sul").children;
    var oDiv = document.getElementById("div1");
    //
    var minImgWidth = 200;
    var maxImgwidth = 800;
    for (var i = 0; i < arrLi.length; i++) {
        //li 绑定mousemove 事件
        //函数体内部不能出现i;
        arrLi[i].onmousemove = function (event) {
            //1.让div1 出来
            //2.给div1定位，跟随
            event = event || window.event;//事件对象；
            oDiv.style.display = "block";
            //left + oDiv width 大于浏览器的可视区域的width.
            //left --oDiv width
            oDiv.style.top = event.clientY + 10 + "px";
            oDiv.style.left = event.clientX + 10 + "px";
            var left = event.clientX + 10;
            var top = event.clientY + 10;
            var clientwidth = document.documentElement.clientwidth || document.body.clienwidth;
            if (left + oDiv.offsetwidth > clientwidth) {
                //大图
                left = left - oDiv.offsetwidth - 20;
            }

            //移动大图；相对div的位置，用margin；
            //left top;
            //坐标的相对位置除以小图的比值乘以大图的值，就可以得出在大图上的位置
            var imgLeft = Math.floor(event.offsetX / minImgWidth * maxImgwidth);
            var imgTop = Math.floor(event.offsetY / minImgWidth * maxImgwidth);
            var imgMarLeft = parseInt(-imgLeft + oDiv.offsetWidth / 2);
            var imgMarTop = parseInt(-imgTop + oDiv.offsetWidth / 2);
            var oMax = oDiv.children[0];
            //oMax = document.getElementById("img1");
            ////把大图相应的点，移动到 窗口oDiv1 的中心。
            if (imgMarTop > 0) {
                imgMarTop = 0;
            }
            if (imgMarLeft > 0) {
                imgMarLeft = 0;
            }
            if (imgMarLeft < -400) {
                imgMarLeft = -400;
            }
            if (imgMarTop < -400) {
                imgMarTop = -400;
            }

            oMax.style.marginTop = imgMarTop + "px";
            oMax.style.marginLeft = imgMarLeft + "px";
        }
        //oDiv.style.width "px" "20px" "100px"


        arrLi[i].onmouseover = function () {
            var srcImg = this.children[0].src;
            //将../images/的.jpg替换成-1.jpg；
            var newImg = srcImg.replace(".jpg", "-1.jpg");
            oDiv.children[0].src = newImg;
        }
        arrLi[i].onmouseout = function () {
            oDiv.style.display = "none";
        }
    }
    //div 设置溢出的隐藏，div中放置一个比div宽高都要大的图片
    //例如div 400*400 大图600*600
    //跟随鼠标移动div， div绝对定位。
    //大图可以不是绝对定位，设置margin来控制在div 中的位置即可；
    //改变大图margin的时候，由于div是溢出隐藏，从界面上来看，起到局部放大的效果

    //大图margin设置；
    //1,根据鼠标在小图中的坐标 offsetx offsety;
    //2,小图 宽高 大图的宽高 计算 鼠标坐在小图上的点， 对应的大图点的位置； 如下：
    //x=offsetX/170*600；
    ////y=offsetY/170*600；
    //3,把该点里移动到div的中心位置上，显示出来
    //4,对于大图margin 边界的控制，四个方向
})