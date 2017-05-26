from django.shortcuts import render, redirect
from .models import Chain
from django.http import HttpResponse
import json
import urllib.request

def index(request):
	data = {}
	chains = Chain.objects.all()
	if chains:
		totalchains = chains.count()
		dic = {}
		#abc = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"]
		for x in range(totalchains):
			id = chains[x].id
			name = chains[x].name
			description = chains[x].description
			content = json.loads(chains[x].html)
			size = chains[x].size

			c = {
				'id':id,
				'name':name,
				'description':description,
				'content':content,
				'size':size
			}

			key = id
			d = {key:c}
			dic.update(d)

		data = {"dic":dic, "size":len(dic)}
	else:
		data.clear()
	return render(request, 'index.html', data)

def saveChain(request):
	name = request.POST.get('name')
	description = request.POST.get('description')
	content = request.POST.get('html')
	size = request.POST.get('size')
	#print("[Controller] name: "+name)
	chain = Chain(name = name, description = description, html = content, size = size)
	chain.save()
	return HttpResponse(status=200)

def deleteChain(request):
	ids = request.POST.getlist('id')
	for i in ids:
		Chain.objects.get(id=i).delete()
	return redirect('index')

def run(request):
	ids = request.POST.getlist('chain[]')
	ip = request.POST.get('ip')
	print(ids)
	print(ip)
	def switch(i):
		return {
			'firewall':'cmd fw',
			'loadBalancer':'cmd lb',
			'router':'cmd router'
		}.get(i,i) #if i is a NF, return cmd. Else return chain's id (i).
	for i in ids:
		print(switch(i))
	return HttpResponse(status=200)

def status(request):
	ip = request.GET.get('ip','0.0.0.0')
	funcs = request.GET.get('funcs','')
	funcs = funcs.split(',')
	print(funcs)
	fs = ""
	#switchID = request.GET.get('id', '0000')
	for i in funcs:
		if fs != "":
			fs = fs + ","
		print("i: "+i)
		if i != "firewall" and i != "loadBalancer" and i != "router":
			chain = Chain.objects.get(id=i)
			objs_json = chain.html
			nfs = json.loads(objs_json)
			print("nfs: ")
			print(nfs)
			orden = [None]*chain.size
			for pos in nfs:
				print("pos: " + pos)
				nf = nfs[pos]
				print("nf: " + nf)
				orden[int(pos)] = nf
			print("orden")
			print(orden)
			for f in range(0,len(orden)):	# 0 < f < len(orden)
				if f > 0: 
					fs = fs + ","
				print("orden["+str(f)+"]: "+orden[f])
				fs = fs + orden[f]
		else:
			fs = fs + i
	print("fs:")
	print(fs)
	url = 'http://'+ip+'/launcher?f='+fs
	print(url)
	#urllib.request.urlopen(url).read()
	return render(request, 'status.html', {'ip':ip, 'funcs':fs, 'url':url})