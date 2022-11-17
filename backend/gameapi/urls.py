from rest_framework.routers import DefaultRouter,SimpleRouter
from django.urls import path,re_path
from django.views.static import serve
from django.conf import settings
from django.urls import path
from . import views

urlpatterns = [
    path("projects/<int:pk>/images/<int:file_id>/", views.ProjectModelViewSet.as_view({"get":"get_one_img"})),
    path("projects/<int:pk>/advice_images/<int:file_id>/", views.ProjectModelViewSet.as_view({"get":"get_one_advice_img"})),
    path("projects/<int:pk>/texts/<int:file_id>/", views.ProjectModelViewSet.as_view({"get":"get_one_doc"})),
    path("projects/<int:pk>/audios/<int:file_id>/", views.ProjectModelViewSet.as_view({"get":"get_one_audio"})),
    path("projects/<int:pk>/videos/<int:file_id>/", views.ProjectModelViewSet.as_view({"get":"get_one_video"})),
    path("projects/<int:pk>/videos/<int:file_id>/key_frames/<int:frame_id>", views.ProjectModelViewSet.as_view({"get":"get_one_frame"})),
    path("projects/<int:pk>/images/<int:file_id>/result", views.ProjectModelViewSet.as_view({"get":"process_img"})),
    path("projects/<int:pk>/advice_images/<int:file_id>/result", views.ProjectModelViewSet.as_view({"get":"game_advice"})),
    path("projects/<int:pk>/texts/<int:file_id>/result", views.ProjectModelViewSet.as_view({"get":"process_doc"})),
    path("projects/<int:pk>/audios/<int:file_id>/result", views.ProjectModelViewSet.as_view({"get": "process_audio"})),
    path("projects/<int:pk>/videos/<int:file_id>/key_frames", views.ProjectModelViewSet.as_view({"get": "key_frames"})),
    path("projects/<int:pk>/videos/<int:file_id>/key_frames/<int:frame_id>/result", views.ProjectModelViewSet.as_view({"get": "process_frame"})),
    re_path("media/(?P<path>.*)$", serve, {"document_root": settings.MEDIA_ROOT}),

]


router = DefaultRouter()
router.register("projects", views.ProjectModelViewSet, "projects")
router.register("files", views.FileModelViewSet, "files")
router.register("advices", views.GameAdviceModelSerializer, "advices")
urlpatterns += router.urls