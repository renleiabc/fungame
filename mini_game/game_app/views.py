# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect, render_to_response
from django import forms
from game_app.models import User
from django.views.decorators.csrf import csrf_exempt
from django.contrib import auth
from django.contrib.auth.decorators import login_required
from django.conf import settings


# Create your views here.

# 定义UserForm表单用于注册和登录页面，ChangeForm表单用于修改密码页面


class RegistForm(forms.Form):
    username = forms.CharField(label='用户名')
    password = forms.CharField(label='密码', widget=forms.PasswordInput())
    againpassword = forms.CharField(label='再次输入密码', widget=forms.PasswordInput())
    # last_login = forms.DateTimeField()


class LoginForm(forms.Form):
    username = forms.CharField(label='用户名')
    password = forms.CharField(label='密码', widget=forms.PasswordInput())
    # last_login = forms.DateTimeField()


class ChangeForm(forms.Form):
    username = forms.CharField(label='用户名')
    old_password = forms.CharField(label='原密码', widget=forms.PasswordInput())
    new_password = forms.CharField(label='新密码', widget=forms.PasswordInput())
    again_password = forms.CharField(label='再次输入密码', widget=forms.PasswordInput())


# 用户注册
@csrf_exempt
def regist(request):
    if request.method == 'POST':
        uf = RegistForm(request.POST)
        if uf.is_valid():
            username = uf.cleaned_data['username']
            password = uf.cleaned_data['password']
            againpassword = uf.cleaned_data['againpassword']
            # 判断用户原密码是否匹配
            user = User.objects.filter(username=username)
            if user:
                info = '1'  # 用户名已存在!
            elif password != againpassword:
                info = '2'  # 两次密码不一致!
            elif len(user) == 0:
                info = '3'  # 注册成功!
                user = User()
                user.username = username
                request.session['username'] = username
                user.password = password
                user.save()
                return redirect('/index')
        return render(request, 'regist.html', locals())
    else:
        uf = RegistForm()
    return render(request, 'regist.html', locals())


# 用户登陆
@csrf_exempt
def login(request):
    if request.method == 'POST':
        # 获取表单信息
        uf = LoginForm(request.POST)
        if uf.is_valid():
            username = uf.cleaned_data['username']
            password = uf.cleaned_data['password']
            # 判断用户密码是否匹配
            user = User.objects.filter(username=username)
            if user:
                passwd = User.objects.filter(username=username, password=password)
                if passwd:
                    info = 'ok'  # 登录成功！
                    request.session['username'] = username
                    return redirect('/index')
                else:
                    info = '4'  # 密码错误!
            elif len(user) == 0:
                info = '5'  # 用户名错误!
        return render(request, 'login.html', locals())
    else:
        uf = LoginForm()
    return render(request, 'login.html', locals())


# 修改密码
@csrf_exempt
def change(request):
    if request.method == 'POST':
        uf = ChangeForm(request.POST)
        # username = uf.cleaned_data['username']
        if uf.is_valid():
            username = uf.cleaned_data['username']
            old_password = uf.cleaned_data['old_password']
            new_password = uf.cleaned_data['new_password']
            again_password = uf.cleaned_data['again_password']
            # 判断用户原密码是否匹配
            passwd = User.objects.filter(username=username, password=old_password)
            user = User.objects.filter(username=username)
            if len(user) == 0:
                info = '5'  # 用户名错误!
            elif not passwd:
                info = '4'  # 密码错误!
            elif old_password == new_password:
                info = "6"  # 不能修改为旧密码!
            elif new_password != again_password:
                info = '2'  # 两次密码不一致!
            elif passwd:
                User.objects.filter(username=username, password=old_password).update(
                    password=new_password)  # 如果用户名、原密码匹配则更新密码
                info = '7'  # 不能修改为原来的密码!
                return redirect('/index')
        return render(request, 'change.html', locals())
    else:
        uf = ChangeForm()
    return render(request, 'change.html', locals())


# 首页
def index(request):
    if request.session.get("username", None):
        username = request.session['username']  # 获取sesion
        return render(request, "index.html", {"username": username})
    else:
        return redirect('/login')


def home(request):
    # print request.session.get("username",None)
    # 检测username是否存在，存在的话就，直接跳转至首页
    if request.session.get("username", None):
        return redirect("/index")
    else:
        # 如果不存在就跳转到登陆界面
        return redirect('/login')


# 退出
def logout(request):
    del request.session['username']  # 删除session
    auth.logout(request)
    return redirect("/login")


# 游戏世界
def gameworld(request):
    if request.session.get("username", None):
        username = request.session['username']  # 获取sesion
        return render(request, "subpage/gameworld.html", {"username": username})
    else:
        return redirect('/login')


# 作品小样
def worksample(request):
    if request.session.get("username", None):
        username = request.session['username']  # 获取sesion
        return render(request, "subpage/worksample.html", {"username": username})
    else:
        return redirect('/login')


# 学习天地
def lifedynamics(request):
    if request.session.get("username", None):
        username = request.session['username']  # 获取sesion
        return render(request, "subpage/lifedynamics.html", {"username": username})
    else:
        return redirect('/login')


# 联系方式
def contactme(request):
    if request.session.get("username", None):
        username = request.session['username']  # 获取sesion
        return render(request, "subpage/contactme.html", {"username": username})
    else:
        return redirect('/login')


# 3D走马灯效果
def aircraft(request):
    if request.session.get("username", None):
        username = request.session['username']  # 获取sesion
        return render(request, "gameworks/aircraft.html", {"username": username})
    else:
        return redirect('/login')


# 数字加密
def encryption(request):
    if request.session.get("username", None):
        username = request.session['username']  # 获取sesion
        return render(request, "worksample/encryption.html", {"username": username})
    else:
        return redirect('/login')


# 3D走马灯效果
def lantern(request):
    if request.session.get("username", None):
        username = request.session['username']  # 获取sesion
        return render(request, "worksample/lantern.html", {"username": username})
    else:
        return redirect('/login')


# 天气预报
def weather(request):
    if request.session.get("username", None):
        username = request.session['username']  # 获取sesion
        return render(request, "worksample/weather.html", {"username": username})
    else:
        return redirect('/login')


# 放大镜效果
def magnifer(request):
    if request.session.get("username", None):
        username = request.session['username']  # 获取sesion
        return render(request, "worksample/magnifier.html", {"username": username})
    else:
        return redirect('/login')


# 柱形图
def columnar(request):
    if request.session.get("username", None):
        username = request.session['username']  # 获取sesion
        return render(request, "worksample/columnar.html", {"username": username})
    else:
        return redirect('/login')


# 战争视频
def war(request):
    if request.session.get("username", None):
        username = request.session['username']  # 获取sesion
        return render(request, "worksample/war.html", {"username": username})
    else:
        return redirect('/login')


# 战争视频
def luck(request):
    if request.session.get("username", None):
        username = request.session['username']  # 获取sesion
        return render(request, "worksample/luck.html", {"username": username})
    else:
        return redirect('/login')


# 战争视频
def curtain(request):
    if request.session.get("username", None):
        username = request.session['username']  # 获取sesion
        return render(request, "worksample/curtain.html", {"username": username})
    else:
        return redirect('/login')


# 太空入侵者
def intruder(request):
    if request.session.get("username", None):
        username = request.session['username']  # 获取sesion
        return render(request, "gameworks/intruder.html", {"username": username})
    else:
        return redirect('/login')


# 俄罗斯方块
def tetris(request):
    if request.session.get("username", None):
        username = request.session['username']  # 获取sesion
        return render(request, "gameworks/tetris.html", {"username": username})
    else:
        return redirect('/login')


# 贪吃蛇
def snake(request):
    if request.session.get("username", None):
        username = request.session['username']  # 获取sesion
        return render(request, "gameworks/snake.html", {"username": username})
    else:
        return redirect('/login')


# 正弦曲线
def sin(request):
    if request.session.get("username", None):
        username = request.session['username']  # 获取sesion
        return render(request, "gameworks/sin.html", {"username": username})
    else:
        return redirect('/login')


# 精灵图
def spirit(request):
    if request.session.get("username", None):
        username = request.session['username']  # 获取sesion
        return render(request, "gameworks/spirit.html", {"username": username})
    else:
        return redirect('/login')


# 拼图
def puzzle(request):
    if request.session.get("username", None):
        username = request.session['username']  # 获取sesionpuzzle
        return render(request, "gameworks/puzzle.html", {"username": username})
    else:
        return redirect('/login')


# 拼图
def mousemove(request):
    if request.session.get("username", None):
        username = request.session['username']  # 获取sesionpuzzle
        return render(request, "gameworks/mousemove.html", {"username": username})
    else:
        return redirect('/login')