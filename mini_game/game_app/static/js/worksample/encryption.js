window.onload = function () {

    var doc = document;
    var oBtn = doc.querySelector('#btn');
    document.onkeydown = function (event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && e.keyCode == 13) { // enter 键
            //要做的事情
            transformation();
            event.cancelBubble = true;
            event.preventDefault();
            event.stopPropagation();
        }
    };
    oBtn.onclick = function () {
        transformation();
    }

//转换函数
    function transformation() {
        var oEncryption = doc.querySelector("#encryption");
        var oDecrypt = doc.querySelector("#decrypt");
        var oTextInput = doc.querySelector("#textInput");
        var oTextOutput = doc.querySelector("#textOutput");
        var reg = new RegExp("^[0-9]*$");
        //获取输入文本框的值
        var textInput = oTextInput.value;
        //进行加密
        if (oEncryption.checked) {
            //赋值给输出文本框，进行输出
            var outResult = encodePassword(textInput)
            if (outResult === undefined) {
                oTextOutput.value = "";
            } else {
                oTextOutput.value = outResult;
                oTextInput.value = "";
            }
            //进行解密
        } else if (oDecrypt.checked) {
            //进行数字的验证，在解密的时候只能输入纯数字；
            if (!reg.test(oTextInput.value)) {
                alert("解密时，只能输入数字!");
                oTextInput.value = "";
                return false;
            }
            //赋值给输出文本框，进行输出
            var inResult = decodePassword(textInput);
            if (inResult === undefined) {
                oTextOutput.value = "";
            } else {
                oTextOutput.value = inResult;
                oTextInput.value = "";
            }
        }
    }

    /*加密函数*/
    function encodePassword(str) {
        var arrNum = [], compile, single;
        str = str.toString();
        //转码后，获得最终结果的变量；
        if (str === '') {
            alert("输入不能为空！");
            return;
        } else {
            // console.log(str);
            for (var i = 0; i < str.length; i++) {
                single = parseInt(str.charCodeAt(i), 10).toString();
                //如果字符的长度小于5，则给字符的前面补零，使其长度达到5；
                if (single.length < 5) {
                    //调用补零函数；
                    single = prefixInteger(single, 5);
                } else {
                    single = single;
                }
                //加密函数调用；
                single = encryption(single, i);
                //将组合好的字符存入数组里面；
                arrNum.push(single);
            }
            //console.log(JSON.stringify(arrNum));
            //将数组转化成为字符串；
            compile = arrNum.join('');
            //console.log(compile);
            decodePassword(compile);
            return compile;
        }
    }


//为字符加密
    function encryption(single, i) {
        //根据字符串的长度取得，该字符串所在的等级；
        i = i.toString();
        var len = parseInt(i).toString().length;
        //给字符的前后分别加上补充数，前面的数字表示字符的顺序，后面的字符为随机数
        switch (len) {
            case 1://当字符的长度为1-9时，加密处理；
                single = i + single + math_random(1000, 100);
                break;
            case 2://当字符的长度为10-99时，加密处理；
                single = i[0] + single + i[1] + math_random(100, 10);
                break;
            case 3://当字符的长度为100-999时，加密处理；
                single = i[0] + single + i[1] + i[2] + math_random(10, 0);
                break;
            case 4://当字符的长度为1000-9999时，加密处理；
                single = i[0] + i[1] + single + i[2] + i[3];
                break;
            default:
                single = 0;
                break;
        }
        return single;
    }

//补零函数
    function prefixInteger(num, length) {
        var zero = (Array(length).join('0') + num).slice(-length);
        return zero;
    }

//为字符串补充随机数；
    function math_random(max, min) {
        var num = parseInt(Math.random() * (max - min) + min);
        return num;
    }

//解码函数封装
    function decodePassword(str) {
        var arrstr = [], max, min, arrCharacter = [], resultValue;
        if (str === '') {
            alert("输入不能为空！");
            return;
        } else {
            //对传入的数字字符串进行遍历
            for (var i = 0; i < str.length; i++) {
                min = i * 9;
                max = i * 9 + 9;
                //每9个字符为一个数组元素
                if (max <= str.length) {
                    arrstr.push(str.substring(min, max));
                }
            }
            //console.log(JSON.stringify(arrstr));
            //对新的字符元素进行遍历；
            for (var j = 0; j < arrstr.length; j++) {
                //调用解密处理函数；
                var element = parseInt(decrypt(arrstr[j], j));
                //把unicode码转化为实际的值；
                var character = String.fromCharCode(element);
                //把实际的值放入一个数组当中；
                arrCharacter.push(character);
            }
            //把数据转化为字符串；
            resultValue = arrCharacter.join('');
            return resultValue;
        }
    }

//字符解密处理函数；
    function decrypt(value, num) {
        var strValue;
        var len = parseInt(num).toString().length;
        if (len == 4) {
            strValue = value.substr(2, 5);
        } else {
            strValue = value.substr(1, 5);
        }
        ;
        return strValue;
    }
}