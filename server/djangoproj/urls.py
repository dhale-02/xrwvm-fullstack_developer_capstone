from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('djangoapp/', include('djangoapp.urls', namespace='djangoapp')),
    # React frontend routes
    path('dealers', TemplateView.as_view(template_name='frontend/index.html')),
    re_path(r'^dealer/.*$', TemplateView.as_view(template_name='frontend/index.html')),
    re_path(r'^postreview/.*$', TemplateView.as_view(template_name='frontend/index.html')),
    path('login', TemplateView.as_view(template_name='frontend/index.html')),
    path('register', TemplateView.as_view(template_name='frontend/index.html')),
    path('', TemplateView.as_view(template_name='index.html')),
]
