//分页插件
/**
 2014-08-05 ch
 **/
(function ($) {
    var ms = {
        init: function (obj, args) {
            return (function () {
                ms.fillHtml(obj, args);
                ms.bindEvent(obj, args);
            })();
        },
        //填充html
        fillHtml: function (obj, args) {
            return (function () {
                obj.empty();
                //上一页
                if (args.current > 1) {
                    obj.append('<a href="javascript:;" class="prevPage">上一页</a>');
                } else {
                    obj.remove('.prevPage');
                    obj.append('<span class="disabled">上一页</span>');
                }
                //中间页码
                if (args.current != 1 && args.current >= 4 && args.pageCount != 4) {
                    obj.append('<a href="javascript:;" class="tcdNumber">' + 1 + '</a>');
                }
                if (args.current - 2 > 2 && args.current <= args.pageCount && args.pageCount > 5) {
                    obj.append('<span>...</span>');
                }
                var start = args.current - 2, end = args.current + 2;
                if ((start > 1 && args.current < 4) || args.current == 1) {
                    end++;
                }
                if (args.current > args.pageCount - 4 && args.current >= args.pageCount) {
                    start--;
                }
                for (; start <= end; start++) {
                    if (start <= args.pageCount && start >= 1) {
                        if (start != args.current) {
                            obj.append('<a href="javascript:;" class="tcdNumber">' + start + '</a>');
                        } else {
                            obj.append('<span class="current">' + start + '</span>');
                        }
                    }
                }
                if (args.current + 2 < args.pageCount - 1 && args.current >= 1 && args.pageCount > 5) {
                    obj.append('<span>...</span>');
                }
                if (args.current != args.pageCount && args.current < args.pageCount - 2 && args.pageCount != 4) {
                    obj.append('<a href="javascript:;" class="tcdNumber">' + args.pageCount + '</a>');
                }
                //下一页
                if (args.current < args.pageCount) {
                    obj.append('<a href="javascript:;" class="nextPage">下一页</a>');
                } else {
                    obj.remove('.nextPage');
                    obj.append('<span class="disabled">下一页</span>');
                }
            })();
        },
        //绑定事件
        bindEvent: function (obj, args) {
            return (function () {
                obj.on("click", "a.tcdNumber", function () {
                    var current = parseInt($(this).text());
                    ms.fillHtml(obj, {"current": current, "pageCount": args.pageCount});
                    if (typeof(args.backFn) == "function") {
                        args.backFn(current);
                    }
                });
                //上一页
                obj.on("click", "a.prevPage", function () {
                    var current = parseInt(obj.children("span.current").text());
                    ms.fillHtml(obj, {"current": current - 1, "pageCount": args.pageCount});
                    if (typeof(args.backFn) == "function") {
                        args.backFn(current - 1);
                    }
                });
                //下一页
                obj.on("click", "a.nextPage", function () {
                    var current = parseInt(obj.children("span.current").text());
                    ms.fillHtml(obj, {"current": current + 1, "pageCount": args.pageCount});
                    if (typeof(args.backFn) == "function") {
                        args.backFn(current + 1);
                    }
                });
            })();
        }
    }
    $.fn.createPage = function (options) {
        var args = $.extend({
            pageCount: 10,
            current: 1,
            backFn: function () {
            }
        }, options);
        ms.init(this, args);
    }
})(jQuery);
//精灵图插件
;(function ($) {
    $.fn.bouncyPlugin = function (option) {
        var DHTMLSprite = function (params) {
            var width = params.width,
                height = params.height,
                imagesWidth = params.imagesWidth,
                $element = params.$drawTarget.append('<div/>').find(':last'),
                elemStyle = $element[0].style,
                mathFloor = Math.floor;
            $element.css({
                position: 'absolute',
                width: width,
                height: height,
                backgroundImage: 'url(' + params.images + ')'
            });
            var that = {
                draw: function (x, y) {//绘制整个图片的位置
                    elemStyle.left = x + 'px';
                    elemStyle.top = y + 'px';
                },
                changeImage: function (index) {//定义精灵图的位置
                    index *= width;
                    var vOffset = -mathFloor(index / imagesWidth) * height;
                    var hOffset = -index % imagesWidth;
                    elemStyle.backgroundPosition = hOffset + 'px ' + vOffset + 'px';
                },
                show: function () {//显示图片
                    elemStyle.display = 'block';
                },
                hide: function () {//隐藏图片
                    elemStyle.display = 'none';
                },
                destroy: function () {//移出图片
                    $element.remove();
                }
            };
            return that;
        };
//让图片反弹的函数
        var bouncySprite = function (params) {
            var x = params.x,
                y = params.y,
                xDir = params.xDir,
                yDir = params.yDir,
                maxX = params.maxX,
                maxY = params.maxY,
                animIndex = 0,
                that = DHTMLSprite(params);
            that.moveAndDraw = function () {
                x += xDir;
                y += yDir;
                animIndex += xDir > 0 ? 1 : -1;
                animIndex %= 5;
                animIndex += animIndex < 0 ? 5 : 0;
                if ((xDir < 0 && x < 0) || (xDir > 0 && x >= maxX)) {
                    xDir = -xDir;
                }
                if ((yDir < 0 && y < 0) || (yDir > 0 && y >= maxY)) {
                    yDir = -yDir;
                }
                that.changeImage(animIndex);
                that.draw(x, y);
            }
            return that;
        };
        var bouncyBoss = function (numBouncy, $drawTarget) {
            var bouncys = [];
            for (var i = 0; i < numBouncy; i++) {
                bouncys.push(bouncySprite({
                    images: './static/images/common/cogs.png',
                    imagesWidth: 256,
                    width: 64,
                    height: 64,
                    $drawTarget: $drawTarget,
                    x: Math.random() * ($drawTarget.width() - 64),
                    y: Math.random() * ($drawTarget.height() - 64),
                    xDir: Math.random() * 4 - 2,
                    yDir: Math.random() * 4 - 2,
                    maxX: $drawTarget.width() - 64,
                    maxY: $drawTarget.height() - 64
                }))
            }
            var moveAll = function () {
                var len = bouncys.length;
                for (var i = 0; i < len; i++) {
                    bouncys[i].moveAndDraw();
                }
                setTimeout(moveAll, 10);
            }
            moveAll();
        }
        option = $.extend({}, $.fn.bouncyPlugin.default, option);
        return this.each(function () {
            var $drawTarget = $(this);
            $drawTarget.css('background-color', option.bgColor);
            bouncyBoss(option.numBouncy, $drawTarget);
        })
    };
    $.fn.bouncyPlugin.default = {
        bgcolor: '#f00',
        numBouncy: 10
    }

})(jQuery);

//代码整理：懒人之家 www.lanrenzhijia.com
/*回到顶部*/
$(function () {
    var win = "";
    $(window).scroll(function () {
        win = $(this).scrollTop();
        var height = $(this).height();
        if (win > height) {
            $(".back-top").css({
                display: 'block'
            })
        } else {
            $(".back-top").css({
                display: 'none'
            })
        }
    })
    /*var timer = null;
    $(".back-top").on('click', function () {
        cancelAnimationFrame(timer);
        timer = requestAnimationFrame(function fn() {
            var oTop = $(window).scrollTop();
            if (oTop > 0) {
                scrollTo(0, oTop - 50);
                timer = requestAnimationFrame(fn);
            } else {
                cancelAnimationFrame(timer);
            }
        });
    })*/
    //回到顶部
    $(".back-top").on('click', function () {
        $("html,body").animate({
            scrollTop: 0
        }, 2000)
    });

    $(".row-box img").on('mouseover', function () {
        $(this).stop().animate({
            width: "210px",
            height: "170px"
        }, 500);
    })
    $(".row-box img").on('mouseout', function () {
        $(this).stop().animate({
            width: "180px",
            height: "140px"
        }, 500);
    })
})
/*旋转插件*/
/*
 * JQuery CSS Rotate property using CSS3 Transformations
 * Copyright (c) 2011 Jakub Jankiewicz  <http://jcubic.pl>
 * licensed under the LGPL Version 3 license.
 * http://www.gnu.org/licenses/lgpl.html
 */
// VERSION: 2.3 LAST UPDATE: 11.07.2013
/*
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 *
 * Made by Wilq32, wilq32@gmail.com, Wroclaw, Poland, 01.2009
 * Website: http://code.google.com/p/jqueryrotate/
 */

// Easy Responsive Tabs Plugin
// Author: Samson.Onna <Email : samson3d@gmail.com>

;(function ($) {
    $.fn.extend({
        easyResponsiveTabs: function (options) {
            //Set the default values, use comma to separate the settings, example:
            var defaults = {
                type: 'default', //default, vertical, accordion;
                width: 'auto',
                fit: true
            }
            //Variables
            var options = $.extend(defaults, options);
            var opt = options, jtype = opt.type, jfit = opt.fit, jwidth = opt.width, vtabs = 'vertical',
                accord = 'accordion';

            //Main function
            this.each(function () {
                var $respTabs = $(this);
                $respTabs.find('ul.resp-tabs-list li').addClass('resp-tab-item');
                $respTabs.css({
                    'display': 'block',
                    'width': jwidth
                });

                $respTabs.find('.resp-tabs-container > div').addClass('resp-tab-content');
                jtab_options();

                //Properties Function
                function jtab_options() {
                    if (jtype == vtabs) {
                        $respTabs.addClass('resp-vtabs');
                    }
                    if (jfit == true) {
                        $respTabs.css({width: '100%', margin: '0px'});
                    }
                    if (jtype == accord) {
                        $respTabs.addClass('resp-easy-accordion');
                        $respTabs.find('.resp-tabs-list').css('display', 'none');
                    }
                }

                //Assigning the h2 markup
                var $tabItemh2;
                $respTabs.find('.resp-tab-content').before("<h2 class='resp-accordion' role='tab'><span class='resp-arrow'></span></h2>");

                var itemCount = 0;
                $respTabs.find('.resp-accordion').each(function () {
                    $tabItemh2 = $(this);
                    var innertext = $respTabs.find('.resp-tab-item:eq(' + itemCount + ')').text();
                    $respTabs.find('.resp-accordion:eq(' + itemCount + ')').append(innertext);
                    $tabItemh2.attr('aria-controls', 'tab_item-' + (itemCount));
                    itemCount++;
                });

                //Assigning the 'aria-controls' to Tab items
                var count = 0,
                    $tabContent;
                $respTabs.find('.resp-tab-item').each(function () {
                    $tabItem = $(this);
                    $tabItem.attr('aria-controls', 'tab_item-' + (count));
                    $tabItem.attr('role', 'tab');

                    //First active tab
                    $respTabs.find('.resp-tab-item').first().addClass('resp-tab-active');
                    $respTabs.find('.resp-accordion').first().addClass('resp-tab-active');
                    $respTabs.find('.resp-tab-content').first().addClass('resp-tab-content-active').attr('style', 'display:block');

                    //Assigning the 'aria-labelledby' attr to tab-content
                    var tabcount = 0;
                    $respTabs.find('.resp-tab-content').each(function () {
                        $tabContent = $(this);
                        $tabContent.attr('aria-labelledby', 'tab_item-' + (tabcount));
                        tabcount++;
                    });
                    count++;
                });

                //Tab Click action function
                $respTabs.find("[role=tab]").each(function () {
                    var $currentTab = $(this);
                    $currentTab.click(function () {

                        var $tabAria = $currentTab.attr('aria-controls');

                        if ($currentTab.hasClass('resp-accordion') && $currentTab.hasClass('resp-tab-active')) {
                            $respTabs.find('.resp-tab-content-active').slideUp('', function () {
                                $(this).addClass('resp-accordion-closed');
                            });
                            $currentTab.removeClass('resp-tab-active');
                            return false;
                        }
                        if (!$currentTab.hasClass('resp-tab-active') && $currentTab.hasClass('resp-accordion')) {
                            $respTabs.find('.resp-tab-active').removeClass('resp-tab-active');
                            $respTabs.find('.resp-tab-content-active').slideUp().removeClass('resp-tab-content-active resp-accordion-closed');
                            $respTabs.find("[aria-controls=" + $tabAria + "]").addClass('resp-tab-active');

                            $respTabs.find('.resp-tab-content[aria-labelledby = ' + $tabAria + ']').slideDown().addClass('resp-tab-content-active');
                        } else {
                            $respTabs.find('.resp-tab-active').removeClass('resp-tab-active');
                            $respTabs.find('.resp-tab-content-active').removeAttr('style').removeClass('resp-tab-content-active').removeClass('resp-accordion-closed');
                            $respTabs.find("[aria-controls=" + $tabAria + "]").addClass('resp-tab-active');
                            $respTabs.find('.resp-tab-content[aria-labelledby = ' + $tabAria + ']').addClass('resp-tab-content-active').attr('style', 'display:block');
                        }
                    });
                    //Window resize function
                    $(window).resize(function () {
                        $respTabs.find('.resp-accordion-closed').removeAttr('style');
                    });
                });
            });
        }
    });
})(jQuery);

/* UItoTop jQuery Plugin 1.2 | Matt Varone | http://www.mattvarone.com/web-design/uitotop-jquery-plugin */
;(function ($) {
    $.fn.UItoTop = function (options) {
        var defaults = {
                text: 'To Top',
                min: 200,
                inDelay: 600,
                outDelay: 400,
                containerID: 'toTop',
                containerHoverID: 'toTopHover',
                scrollSpeed: 1000,
                easingType: 'linear'
            }, settings = $.extend(defaults, options), containerIDhash = '#' + settings.containerID,
            containerHoverIDHash = '#' + settings.containerHoverID;
        $('body').append('<a href="#" id="' + settings.containerID + '">' + settings.text + '</a>');
        $(containerIDhash).hide().on('click.UItoTop', function () {
            $('html, body').animate({scrollTop: 0}, settings.scrollSpeed, settings.easingType);
            $('#' + settings.containerHoverID, this).stop().animate({'opacity': 0}, settings.inDelay, settings.easingType);
            return false;
        }).prepend('<span id="' + settings.containerHoverID + '"></span>').hover(function () {
            $(containerHoverIDHash, this).stop().animate({'opacity': 1}, 600, 'linear');
        }, function () {
            $(containerHoverIDHash, this).stop().animate({'opacity': 0}, 700, 'linear');
        });
        $(window).scroll(function () {
            var sd = $(window).scrollTop();
            if (typeof document.body.style.maxHeight === "undefined") {
                $(containerIDhash).css({'position': 'absolute', 'top': sd + $(window).height() - 50});
            }
            if (sd > settings.min)
                $(containerIDhash).fadeIn(settings.inDelay); else
                $(containerIDhash).fadeOut(settings.Outdelay);
        });
    };
})(jQuery);


/* UItoTop jQuery Plugin 1.2 | Matt Varone | http://www.mattvarone.com/web-design/uitotop-jquery-plugin */
(function ($) {
    $.fn.UItoTop = function (options) {
        var defaults = {
                text: 'To Top',
                min: 200,
                inDelay: 600,
                outDelay: 400,
                containerID: 'toTop',
                containerHoverID: 'toTopHover',
                scrollSpeed: 1000,
                easingType: 'linear'
            }, settings = $.extend(defaults, options), containerIDhash = '#' + settings.containerID,
            containerHoverIDHash = '#' + settings.containerHoverID;
        $('body').append('<a href="#" id="' + settings.containerID + '">' + settings.text + '</a>');
        $(containerIDhash).hide().on('click.UItoTop', function () {
            $('html, body').animate({scrollTop: 0}, settings.scrollSpeed, settings.easingType);
            $('#' + settings.containerHoverID, this).stop().animate({'opacity': 0}, settings.inDelay, settings.easingType);
            return false;
        }).prepend('<span id="' + settings.containerHoverID + '"></span>').hover(function () {
            $(containerHoverIDHash, this).stop().animate({'opacity': 1}, 600, 'linear');
        }, function () {
            $(containerHoverIDHash, this).stop().animate({'opacity': 0}, 700, 'linear');
        });
        $(window).scroll(function () {
            var sd = $(window).scrollTop();
            if (typeof document.body.style.maxHeight === "undefined") {
                $(containerIDhash).css({'position': 'absolute', 'top': sd + $(window).height() - 50});
            }
            if (sd > settings.min)
                $(containerIDhash).fadeIn(settings.inDelay); else
                $(containerIDhash).fadeOut(settings.Outdelay);
        });
    };
})(jQuery);