# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
import django.utils.timesince as timesince

from django.contrib.auth.models import User
from django.contrib import admin


class User(models.Model):
      username=models.CharField(verbose_name='用户名', max_length=100)
      password=models.CharField(verbose_name='密码', max_length=100)
      registTime = models.DateTimeField(max_length=250, verbose_name='加入时间', auto_now_add = True, blank=True)# auto_now_add=True第一次创建的时间
      loginTime = models.DateTimeField(max_length=250, verbose_name='最近登陆', auto_now=True,blank=True)# auto_now=True每次登录都会更新这个时间


class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'password', 'registTime', 'loginTime')


admin.site.register(User, UserAdmin)


def __unicode__(self):
    return self.username