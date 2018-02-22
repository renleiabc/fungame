# -*- coding: utf-8 -*-
"""zqxt_auth URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from game_app import views as game_app_views

urlpatterns = [
    url(r'^login$', game_app_views.login, name='login'),
    url(r'^regist$', game_app_views.regist, name='regist'),
    url(r'^change$', game_app_views.change, name='change'),
    url(r'^logout$', game_app_views.logout, name='logout'),
    url(r'^index$', game_app_views.index, name="index"),
    url(r'^gameworld$', game_app_views.gameworld, name="gameworld"),
    url(r'^worksample$', game_app_views.worksample, name="worksample"),
    url(r'^lifedynamics$', game_app_views.lifedynamics, name="lifedynamics"),
    url(r'^contactme$', game_app_views.contactme, name="contactme"),
    url(r'^encryption$', game_app_views.encryption, name="encryption"),  # 数字加密
    url(r'^lantern$', game_app_views.lantern, name="lantern"),  # 走马灯
    url(r'^weather$', game_app_views.weather, name="weather"),  # 天气预报
    url(r'^magnifer$', game_app_views.magnifer, name="magnifer"),  # 放大镜效果
    url(r'^columnar$', game_app_views.columnar, name="columnar"),  # 柱形图
    url(r'^candle$', game_app_views.war, name="war"),  # 生日蛋糕
    url(r'^luck$', game_app_views.luck, name="luck"),  # 幸运抽奖 intruder
    url(r'^curtain$', game_app_views.curtain, name="curtain"),  # 柱形图
    url(r'^intruder$', game_app_views.intruder, name="intruder"),  # 太空入侵者
    url(r'^tetris$', game_app_views.tetris, name="tetris"),  # 俄罗斯方块
    url(r'^sin$', game_app_views.sin, name="sin"),  # 正弦曲线
    url(r'^spirit$', game_app_views.spirit, name="spirit"),  # 精灵图
    url(r'^snake$', game_app_views.snake, name="snake"),  # 贪吃蛇
    url(r'^mousemove$', game_app_views.mousemove, name="mousemove"),  # 鼠标移动
    url(r'^puzzle$', game_app_views.puzzle, name="puzzle"),  # 拼图
    url(r'^aircraft$', game_app_views.aircraft, name="aircraft"),
    url(r'^$', game_app_views.home, name="home"),
    url(r'^admin/', admin.site.urls),
]
