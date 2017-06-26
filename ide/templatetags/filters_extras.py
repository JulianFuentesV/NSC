from django import template

register = template.Library()

@register.filter()
def to_int(value):
    return int(value)

@register.filter()
def findDict(dict, key):
    return dict[key]