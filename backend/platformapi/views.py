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
from .class_method import *




class ProjectModelViewSet(ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectModelSerializer

    if not Law.objects.all():
        for i in ['personal_protection_law','network_security_law', 'data_security_law']:
            path = 'media/files/platformapi/law/{}.xlsx'.format(i)
            law = pd.read_excel(path, index_col=None, header=4)
            law.fillna(value = '', inplace=True)
            for item in law.values:
                new_law = Law(law_article= i, serial_number=item[0],law_term=item[1],
                                # primary_classification=item[3],secondary_classification=item[4],
                                # third_classification=item[5])
                                primary_classification=item[4],secondary_classification=item[5],
                                third_classification=item[6])
                new_law.save()

   

    if not Question.objects.all():
        for i in ['personal_protection_law','network_security_law', 'data_security_law']:
            # path = 'media/files/platformapi/law/{}_question.xlsx'.format(i)
            path = 'media/files/platformapi/law/{}.xlsx'.format(i)
            question = pd.read_excel(path, index_col=None, header=4)
            question.fillna(value = '', inplace=True)
            for item in question.values:
                # print(item)
                law = Law.objects.filter(law_article=i, serial_number=item[0])[0]
                # new_question = Question(serial_number=item[0],question=item[1],
                #                 suggestion=item[2],score=item[3],
                #                 law=law)
                new_question = Question(serial_number=item[0],question=item[10],
                                suggestion=item[11],score=item[12],
                                law=law)
                new_question.save()
        

    """添加一个项目"""
    def create(self, request, **kwargs):
        print(type(request.data), request.data)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        project =  Project.objects.last()
    
        for i in ['personal_protection_law','network_security_law', 'data_security_law']:
            if request.data[i] == 'true':
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
            res.append({'id':i.id, 'question':i.question.question})
       
        if request.method == "POST":
            for key, values in request.data.items():
                print(key,values)
                if values == 'true':
                    ProjectQuest.objects.filter(id=key).update(answer=True)
                
            return Response({'status':1 },status=status.HTTP_200_OK)
        
        return Response(res,status=status.HTTP_200_OK)



    '''处理项目数据'''
    @action(methods=['GET'], detail=True, url_path="results") 
    def process_data(self,request,pk,file_id):
        from .class_method import DataProcess
        project = Project.objects.get(id=pk)
        files = project.project_files.all()
        path = files[0].fileS

        # 开始处理数据
        dataprocesser = DataProcess()
        dataprocesser.init_para(path)
        dataprocesser.search_risk()
        dataprocesser.des_txts()
        dataprocesser.des_iamge()
        res = dataprocesser.sensitive_information

        # 合规建议、违规法条
        suggestion = []
        law = []
        for i in ProjectQuest.objects.filter(project=project):
            if not i.answer:
                law = Law.objects.filter(serial_number=i.question.serial_number)
                suggestion.append(i.question.suggestion)
                law.append(law.law_term)
        
        return Response({'risk_data':res, 'suggestion':suggestion,'law':law},status=status.HTTP_200_OK)



    '''上传项目文件'''
    @action(methods=['POST'], detail=True, url_path="upload") 
    def upload_new_files(self,request,pk):
        from .util import calculate_file_hash
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
        
            from .util import convert_type,generate_video_cover
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