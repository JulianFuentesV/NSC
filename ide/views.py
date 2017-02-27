from django.shortcuts import render

def index(request):
    return render(request, 'index.html', {})

def status(request):
	return render(request, 'status.html', {})