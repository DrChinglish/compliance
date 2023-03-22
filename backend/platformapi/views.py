from os import walk, path
from zipfile import ZipFile
import os
import pandas as pd
import numpy as np
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from .models import Project, File, UserInfo, Category, Law, Question, ProjectQuest
from .serializers import ProjectModelSerializer, FileModelSerializer, UserModelSerializer, CategoryModelSerializer,ProjectQuestModelSerializer
from rest_framework.decorators import action
# from .class_method import *
from platformapi.utils.class_method import *
from platformapi.utils.law import *
from platformapi.utils.score import *




class ProjectModelViewSet(ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectModelSerializer

    '''项目启动时执行一次，将平台目前支持的法律保存到数据库'''
    save_law_to_database()
    save_question_to_database()
        

    '''添加一个项目'''
    def create(self, request, **kwargs):
        print(type(request.data), request.data)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        project =  Project.objects.last()


        for i in law_list:
            if request.data[i] == 'true':
                print(type(request.data[i]),request.data[i])
                for instence in Law.objects.filter(law_article=i):
                    for ques in Question.objects.filter(law=instence):
                        ProjectQuest(project=project, question=ques).save()
            
        return Response({'status': 1}, status=status.HTTP_201_CREATED)



    '''填写项目问卷'''
    @action(methods=['POST','GET'], detail=True, url_path="questions") 
    def do_survey(self,request,pk):
        project = Project.objects.get(id=pk)
        res = []
        for i in ProjectQuest.objects.filter(project=project):
            res.append({'id':i.id, 'law_article':i.question.law.law_article, 'question':i.question.question})
       
        if request.method == "POST":
            for key, values in request.data.items():
                print(key,values)
                if values == 'true':
                    ProjectQuest.objects.filter(id=key).update(answer=True)
                
            return Response({'status':1 },status=status.HTTP_200_OK)
        
        return Response(res,status=status.HTTP_200_OK)



    '''处理项目数据'''
    @action(methods=['GET'], detail=True, url_path="results") 
    def process_data(self,request,pk):
        project = Project.objects.get(id=pk)
        files = project.project_files.all()
        path = 'media/' + str(files.last().file)

        # 开始处理数据
        dataprocesser = DataProcess()
        dataprocesser.init_para(path)
        dataprocesser.search_risk()
        dataprocesser.face_detect()
        dataprocesser.fingerprint_detect() 
        dataprocesser.bioinfo_detect()
        dataprocesser.des_txts()
        dataprocesser.des_iamge()
        res = dataprocesser.sensitive_information

        # 合规得分
        scores = get_scores(project)

        # 合规建议、违规法条
        suggestion_list = []
        law_list = []
        for i in ProjectQuest.objects.filter(project=project):
            if not i.answer:
                law = Law.objects.filter(serial_number=i.question.serial_number)[0]
                if i.question.suggestion:
                    suggestion_list.append(i.question.suggestion)
                law_list.append(law.law_term)


        
        return Response({'risk_data':res, 'scores':scores, 'suggestion':suggestion_list,'law':law_list},status=status.HTTP_200_OK)



    '''上传项目文件'''
    @action(methods=['POST'], detail=True, url_path="upload") 
    def upload_new_files(self,request,pk):
        from utils.util import calculate_file_hash
        uploaded = 0
        filecount = len(request.FILES.getlist('files[]'))
        project = Project.objects.get(id=pk)
        current_files_md5=project.project_files.all().values_list('md5',flat=True)
    
        file_rejected=[]
        for f in request.FILES.getlist('files[]'):
            hashcode = calculate_file_hash(f)
            if hashcode in current_files_md5:
                print('found')
                file_rejected.append(f.name)
                continue
            instance = File(file=f ,project=project,md5=hashcode)
            instance.save()
        
            from utils.util import convert_type,generate_video_cover
            if convert_type(instance.file.path) == 'video':
                generate_video_cover(instance)
            uploaded+=1
        return Response({'status':1 if uploaded>0 else 0,'file_rejected':file_rejected,
        'fileuploaded':uploaded,'text':'共上传了{0}个文件中的{1}个'.format(filecount,uploaded)}
        ,status=status.HTTP_200_OK)



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



class CategoryModelViewSet(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategoryModelSerializer