from django.urls import path
from . import views

urlpatterns = [
    path('clear', views.clear),
    path('init', views.init)
]
