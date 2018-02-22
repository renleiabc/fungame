/*canvas绘制柱形图*/
$(function () {
    /*利用jquery封装的ajax请求数据进行渲染*/
    $.ajax({
        type: 'GET',//要求为String类型的参数，（默认为当前页地址）发送请求的地址。
        url: './static/json/phone.json',//要求为String类型的参数，请求方式（post或get）默认为get。
        async: true,//要求为Boolean类型的参数，默认设置为true，所有请求均为异步请求。如果需要发送同步请求，请将此选项设置为false。
        data: '{}',
        dataType: 'json',//要求为String类型的参数，预期服务器返回的数据类型。
        success: function (data, textStatus) {
            var canvasID = document.getElementById('canvas');
            function arrData() {
                for (var i = 0; i < data.length; i++) {
                    data[i].num = Math.random() * 1000;
                }
                //绘制柱形图函数调用；
                transactionType(data, canvasID);
            }
            setInterval(arrData, 1000);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(textStatus)
        }
    });

    function transactionType(json, canvasID) {
        var canvas, context, start, end, showcanvas, showcontext;
        start = 10;
        // chart properties
        var cWidth, cHeight, cMargin, cSpace, rSpace;
        var cMarginSpace, cMarginHeight;
        // bar properties
        var bWidth, bMargin, totalBars, maxDataValue, markerVal, markerValHt;
        var bWidthMargin;
        // bar animation
        var ctr, numctr, speed, showId, showDiv;
        // axis property
        var totLabelsOnYAxis, imgURI, image;
        var transactionData, transction, data;
        data = json;
        showId = canvasID;
        //创建图表函数调用；
        barChart(data, showId);

//柱形图执行函数封装；

        function barChart(json, showId) {
            //取得要是显示的canvas画布；

            showcanvas = showId;
            //获取2D上下文；
            showcontext = showcanvas.getContext('2d');
            //动态创建离屏canvas;
            canvas = document.createElement('canvas');
            context = canvas.getContext('2d');
            //把离屏canavs的宽高和要显示的canavs一样；
            canvas.height = showcanvas.height;
            canvas.width = showcanvas.width;
            //获得的交易数据；
            var data = json;
            //绘制网格线函数调用；
            gridLine(context, 'lightgray', 10, 10, start, end);
            //初始化图表和数组值函数调用；
            chartSettings(data);
            //绘制X轴
            drawAxisLabelMarkers();
            //创建柱形图函数调用
            drawChartWithAnimation(data);
            //柱形图上显示的数据函数调用；
            axisdataY(data);
            //绘制显示的图片函数调用；
            drawImage();
        }

        //绘制柱形图网格线；
        function gridLine(context, color, stepx, stepy, start) {
            context.save();
            context.strokeStyle = color;
            context.lineWidth = 0.5;
            //绘制纵轴线段；
            for (var i = stepx + 0.5; i < context.canvas.width - 40; i += stepx) {
                context.beginPath();
                context.moveTo(start + i, 30);
                context.lineTo(start + i, context.canvas.height - 20);
                context.stroke();
                context.closePath();
            }
            //绘制横向线段；
            for (var i = stepy + 0.5 + 20; i < context.canvas.height - 10; i += stepy) {
                context.beginPath();
                context.moveTo(start + 10, i);
                context.lineTo(context.canvas.width - 40, i);
                context.stroke();
                context.closePath();
            }
            context.restore();

        }

        //初始图表和数组值；
        function chartSettings(data) {
            //X轴距离画布左边的距离
            cMargin = 10;
            //Y轴距离画布下边的距离；
            cSpace = 20;
            //X图表距离画布右边的距离；
            rSpace = 47;
            //X轴的长度；
            cWidth = canvas.width - cMargin - rSpace;
            //Y轴的长度；
            cHeight = canvas.height - cMargin - cSpace - 20;
            cMarginSpace = cWidth + cMargin + 20;
            cMarginHeight = cMargin + cHeight + 20;
            // bar properties
            bMargin = 10;
            totalBars = data.length;
            if (totalBars <= 8) {
                bWidth = 40;
            } else {
                bWidth = (cWidth / totalBars) - bMargin;
            }

            //在图表上找到最大值
            maxDataValue = 0;
            for (var i = 0; i < totalBars; i++) {
                var arrVal = data[i].num;
                var barVal = parseInt(arrVal);
                if (parseInt(barVal) > parseInt(maxDataValue))
                    maxDataValue = barVal;
            }

            totLabelsOnYAxis = 10;
            context.font = "bolder 10px Arial";
            // initialize Animation variables
            ctr = 0;
            numctr = 100;
            speed = 10;
        }

        // 绘制图表轴，标签和标记
        function drawAxisLabelMarkers() {
            context.lineWidth = "2.0";
            context.fillStyle = "#333";
            // 绘制Y轴
            drawAxis(cMargin + cMargin, cMarginHeight, cMargin + cMargin, cMargin + 10);
            // 绘制X轴；
            drawAxis(cMargin + cMargin, cMarginHeight, cMarginSpace, cMarginHeight);
            context.lineWidth = "1.0";
            drawMarkers();
        }

        // 绘制Y轴和X轴函数封装；
        function drawAxis(x, y, X, Y) {
            context.beginPath();
            context.moveTo(x, y);
            context.lineTo(X, Y);
            context.closePath();
            context.stroke();
        }

        // X和Y轴上的绘制图表标记
        function drawMarkers() {
            //对最大值除以一个整数totLabelsOnYAxis=10；并进行取整；
            var numMarkers = parseInt(maxDataValue / totLabelsOnYAxis);
            context.textAlign = "right";
            context.fillStyle = "#333";
            context.textAlign = 'center';
            // Add Y Axis title
            context.fillText('销量（台）', cMargin + cMargin + 10, cMargin - 15 + 15);
            // Add X Axis Title
            context.fillText('品牌', canvas.width - 12, cMarginHeight + cSpace / 3);

        }

        function drawChartWithAnimation(data) {
            // 循环创建矩形
            var bHt;
            for (var i = 0; i < totalBars; i++) {
                var arrVal = data[i].num;
                var bVal = parseInt(arrVal);
                if (maxDataValue == 0) {
                    bHt = 2;
                } else {
                    bHt = (bVal * cHeight / maxDataValue) / numctr * ctr;
                }
                var bX = bMargin + bMargin + (i * (bWidth + bMargin)) + bMargin + cMargin - 10;
                var bY = cMarginHeight - bHt - 2;
                var color = data[i].color;
                drawRectangle(bX, bY, bWidth, bHt, color);
            }
            // 超时运行，检查是否已达到
            // 所需高度；如果没有，保持生长;
            if (ctr < numctr) {
                ctr = ctr + 1;
                setTimeout(drawChartWithAnimation(data), 10);
            }
        }

        //显示每个柱形图的具体数据和名称；
        function axisdataY(data) {
            //创建每个柱形图所显示的数据；
            var bYtext;
            context.textAlign = "center";
            context.fillStyle = "#333";
            for (var i = 0; i < totalBars; i++) {
                var arrVal = data[i].num;
                var bVal = parseInt(arrVal);
                var name = data[i].name;
                var bHtext = (bVal * cHeight / maxDataValue);
                var bX = bMargin + bMargin + (i * (bWidth + bMargin)) + bMargin + bWidth / 2 + cMargin - 10;
                if (maxDataValue == 0) {
                    bYtext = cMarginHeight - 10;
                } else {
                    bYtext = cMarginHeight - bHtext - 10;
                }
                //显示出每个柱形图的数据；
                if (context.measureText(bVal).width > 40) {
                    context.save();
                    context.translate(bX, bYtext);
                    context.rotate(-0.3);
                    context.fillText(bVal, 0, 0);
                    context.restore();
                } else {
                    context.fillText(bVal, bX, bYtext);
                }
                //显示出每个柱形图的名称
                if (context.measureText(name).width > 50) {
                    context.save();
                    context.translate(bX, 446);
                    context.rotate(-0.2);
                    context.fillText(name, 0, 0);
                    context.restore();
                } else {
                    context.fillText(name, bX, 446);
                }
            }
        }

//生成柱形函数封装；
        function drawRectangle(x, y, w, h, color) {
            context.beginPath();
            context.rect(x, y, w, h);
            context.fillStyle = color;
            context.strokeStyle = color;
            context.fill();
            context.closePath();
            context.stroke();

        }

        //把离屏的canvas绘制到实际显示画布上；
        function drawImage() {
            //取得图像的数据 URI
            imgURI = canvas.toDataURL("image/png");
            //显示图像
            image = document.createElement("img");
            image.src = imgURI;
            //加载生成的图片；
            image.onload = function () {
                //每次图片加载完成以后首先清空原来的要显示的showcanavs画布；
                showcontext.clearRect(0, 0, canvas.width, canvas.height);
                //然后在所要生成的图片绘制到showcanavs画布上；
                showcontext.drawImage(image, 0, 0, canvas.width, canvas.height);
                //最后再清空动态生成的canvas.
                context.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
    }
})

