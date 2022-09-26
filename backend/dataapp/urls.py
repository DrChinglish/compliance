from django.urls import path
from . import views

app_name = 'dataapp'

urlpatterns=[
    # path('', views.index, name="index"),
    path('register/', views.register, name="register"),
    path('login/', views.login, name="login"),
    path('logout/', views.logout, name="logout"),
    path('post_list/', views.post_list, name="post_list"),
    path('text_list/', views.text_list, name="text_list"),
    # path('speech_list/', views.speech_list, name="speech_list"),
    # path('image_list/', views.image_list, name="image_list"),

    # path('text_detail/', views.text_detail, name="text_detail"),
    path('image_detail/', views.image_detail, name="image_detail"),
    path('speech_detail/', views.speech_detail, name="speech_detail"),
    path('project_configration/', views.project_configration, name="project_configration"),

    path('text_list/<slug:post>/', views.text_detail, name='text_detail'),  
    path('text_list/<slug:post>/generate_report/',views.generate_report,name='generate_report'),

    path('post_list/<int:pk>/', views.post_delete, name='post_delete'),
    path('post_list/<slug:post>/', views.post_detail, name='post_detail'),
    path('post_list/<slug:post>/handle_high_level/', views.handle_high_level, name='handle_high_level'),
    path('post_list/<slug:post>/generate_report/',views.generate_report,name='generate_report'),

    path('new_post/', views.MainView.as_view(), name="upload-view"),
    path('new_project/',views.create_project_view,name="create_new_project"),
    path('new_post/upload/', views.file_upload_view, name="upload_view"),


    path('project_delete/',views.project_delete,name='project_delete'),
    path('project_list/',views.project_list,name = "project_list"),
    path('project_info/<int:id>/',views.project_info,name = "project_info"),
    path('file_list/<int:id>/',views.file_list,name = "file_list"),
    path('text_censor/<int:fid>/',views.text_censor,name = "text_censor"),

    path('test/',views.search_keyword,name = "search_keyword")
    ]
