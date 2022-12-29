from rest_framework.routers import DefaultRouter,SimpleRouter
from django.urls import path,re_path
from django.views.static import serve
from django.conf import settings
from django.urls import path
from . import views

urlpatterns = [
    # path("projects/<int:pk>/images/<int:file_id>/", views.ProjectModelViewSet.as_view({"get":"get_one_img"})),
    # path("projects/<int:pk>/images/<int:file_id>/", views.ProjectModelViewSet.as_view({"get":"get_one_img"})),
    re_path("media/(?P<path>.*)$", serve, {"document_root": settings.MEDIA_ROOT}),
]


router = DefaultRouter()
router.register("projects", views.ProjectModelViewSet, "projects")
router.register("files", views.FileModelViewSet, "files")
router.register("categorys", views.CategoryModelViewSet, "categorys")
urlpatterns += router.urls