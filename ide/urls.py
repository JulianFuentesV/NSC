from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^status/$', views.status, name='status'),
    url(r'^chain/save/$', views.saveChain, name='saveChain'),
    url(r'^chain/delete/$', views.deleteChain, name='deleteChain'),
    url(r'^run/$', views.run, name='run'),
    url(r'^offExec/$', views.setExecutionStateOff, name="offExec"),
]