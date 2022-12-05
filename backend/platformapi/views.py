from os import walk, path
from sqlite3 import Cursor
from zipfile import ZipFile
import os
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from .models import Project, File, KeyFrame, User
from .serializers import ProjectModelSerializer, FileModelSerializer, UserModelSerializer, KeyFrameModelSerializer
from rest_framework.decorators import action
from .class_method import *



# Create your views here.
class FileModelViewSet(ModelViewSet):
    queryset = File.objects.all()
    serializer_class = FileModelSerializer

    """上传文件"""
    def create(self, request, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        print(request.FILES.getlist('file'))

        # 如果上传的是zip压缩包，则解压到当前目录
        instance = File.objects.last()
        file = instance.file
        if path.splitext(str(file))[1] == '.zip':
            unzipfile = unzip_file(ZipFile(file))
            unzippath = 'media/files/game_projects/project_{}'.format(instance.project.title)
            with unzipfile as zfp:
                zfp.extractall(unzippath)  # 解压到指定目录

        return Response(serializer.data, status=status.HTTP_201_CREATED)





class ProjectModelViewSet(ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectModelSerializer

    """添加一个项目"""

    def create(self, request, **kwargs):
        print(type(request.data), request.data)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        for f in request.FILES.getlist('files[]'):
            # This looks not so right, could have cause some undesire behaviors....
            instance = File(file=f, project=Project.objects.last())
            instance.save()
            print(f, '111', instance, '111', instance.file.path)
            from .util import convert_type, generate_video_cover
            if convert_type(instance.file.path) == 'video':
                # Generate a video cover
                generate_video_cover(instance)
        return Response({'status': 1}, status=status.HTTP_201_CREATED)
