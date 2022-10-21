from rest_framework.routers import DefaultRouter,SimpleRouter
from django.urls import path,re_path
from django.views.static import serve
from django.conf import settings
from . import views

urlpatterns = [
    path("projects/<int:pk>/images/<int:file_id>/", views.ProjectModelViewSet.as_view({"get":"get_one_img"})),
    path("projects/<int:pk>/texts/<int:file_id>/", views.ProjectModelViewSet.as_view({"get":"get_one_doc"})),
    path("projects/<int:pk>/images/<int:file_id>/process_img", views.ProjectModelViewSet.as_view({"get":"process_img"})),
    path("projects/<int:pk>/texts/<int:file_id>/process_doc", views.ProjectModelViewSet.as_view({"get":"process_doc"})),
    re_path("media/(?P<path>.*)$", serve, {"document_root": settings.MEDIA_ROOT}),

]


router = DefaultRouter()
router.register("projects", views.ProjectModelViewSet, "projects")
router.register("files", views.FileModelViewSet, "files")
urlpatterns += router.urls