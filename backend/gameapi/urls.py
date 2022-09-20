
from rest_framework.routers import DefaultRouter,SimpleRouter
from django.urls import path
from . import views

urlpatterns = [
    path('gameupload/', views.gameupload, name='gameupload'),
]


router = DefaultRouter()
# 注册视图(访问前缀，视图集类，调用别名)
router.register("projects", views.ProjectModelViewSet, "projects")
# 把路由对象生成的视图集路由列表合并追加路由列表中
# print(router.urls)
urlpatterns += router.urls