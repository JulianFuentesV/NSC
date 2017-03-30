from __future__ import unicode_literals

from django.db import models

class Chain(models.Model):
	name = models.CharField(max_length=100)
	description = models.CharField(max_length=200)
	html = models.CharField(max_length=500)
	size = models.IntegerField(default=0)
