from __future__ import unicode_literals

from django.db import models

class Chain(models.Model):
	name = models.CharField(max_length=100)
	description = models.CharField(max_length=200)
	html = models.CharField(max_length=500)
	size = models.IntegerField(default=0)

class Configuration(models.Model):
	idchain = models.OneToOneField(Chain,on_delete=models.CASCADE)
	nfsconfig = models.CharField(max_length=500)
	topology = models.CharField(max_length=50)

class Execution(models.Model):
	nfs = models.CharField(max_length=500)
	ip = models.CharField(max_length=50)
	state = models.IntegerField(default=0)
