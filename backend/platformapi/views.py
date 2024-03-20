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
    law_list = [
            'personal_protection_law',
            'network_security_law',
            'data_security_law'
    ]
    '''项目启动时执行一次，将平台目前支持的法律保存到数据库'''
    save_law_to_database()
    save_question_to_database()
    save_simplelaw_to_database()
        

    '''添加一个项目'''
    def create(self, request, **kwargs):
        print(type(request.data), request.data)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        print(request.FILES)
        project =  Project.objects.last()
        for f in request.FILES.getlist('files[]'):
            from .utils.util import calculate_file_hash
            # This looks not so right, could have cause some undesire behaviors....
            hashcode = calculate_file_hash(f)  
            instance = File(file=f ,project=project,md5=hashcode)
            instance.save()
            print(f,'111',instance,'111',instance.file.path)
        for i in law_list:
            if request.data[i] == 'true':
                print(type(request.data[i]),request.data[i])
                for instence in Law.objects.filter(law_article=i):
                    for ques in Question.objects.filter(law=instence):
                        ProjectQuest(project=project, question=ques).save()
            
        return Response({'status': 1,'id':project.id}, status=status.HTTP_201_CREATED)


    '''快速检测'''
    @action(methods=['POST'],detail=False,url_path='scan')
    def image_scan(self,request): 
        from django.core.files.uploadedfile import UploadedFile
        import os
        save_dir = "media/ocr_test/"
        if not os.path.exists(save_dir):
            os.makedirs(save_dir)
        file_list:list[UploadedFile] = request.FILES.getlist('files[]') 
        for f in file_list:
            with open(f"{save_dir}{f.name}",'wb') as wf:
                wf.write(f.read())
        file_map = {f"{save_dir}{f.name}":f"Image:{f.name}" for f in file_list}
        res = process_img({},file_map,modules=['文本类型敏感信息检测'])
        return Response(data=res,status=status.HTTP_200_OK)
    
    '''快速检测-无去水印功能'''
    @action(methods=['POST'],detail=False,url_path='scan_2')
    def image_scan_2(self,request): 
        from django.core.files.uploadedfile import UploadedFile
        import os
        save_dir = "media/ocr_test/"
        if not os.path.exists(save_dir):
            os.makedirs(save_dir)
        file_list:list[UploadedFile] = request.FILES.getlist('files[]') 
        for f in file_list:
            with open(f"{save_dir}{f.name}",'wb') as wf:
                wf.write(f.read())
        file_map = {f"{save_dir}{f.name}":f"Image:{f.name}" for f in file_list}
        res = process_img({},file_map,modules=['文本类型敏感信息检测'],options=[])
        return Response(data=res,status=status.HTTP_200_OK)

    '''填写项目问卷'''
    @action(methods=['POST','GET'], detail=True, url_path="questions") 
    def do_survey(self,request,pk):
        project = Project.objects.get(id=pk)
        res = []
        for i in ProjectQuest.objects.filter(project=project):
            res.append({'id':i.id, 'law_article':i.question.law.law_article, 'question':i.question.question})
       
        if request.method == "POST":
            if project.status != 'open':
                return Response({'status':-1,'msg':'您已经填写过问卷，请勿重复提交'},status=status.HTTP_200_OK)
            else:
                
                for key, values in request.data.items():
                    print(key,values)
                    if values == 'true':
                        ProjectQuest.objects.filter(id=key).update(answer=True)
                project.status = 'pending'
                project.save()
                return Response({'status':1 },status=status.HTTP_200_OK)
        
        project.status = 'open'
        project.save()
        return Response(res,status=status.HTTP_200_OK)



    '''处理项目图片数据'''
    @action(methods=['GET'], detail=True, url_path="results") 
    def process_data(self,request,pk):
        project = Project.objects.get(id=pk)
        files = project.project_files.all()
        file_list = {"media/"+str(file.file):f'{convert_type(str(file.file))} ' for file in project.project_files.all()}
        res = process_img({}, file_list)

        return Response(data=res,status=status.HTTP_200_OK)
    



    '''上传项目文件'''
    @action(methods=['POST'], detail=True, url_path="upload") 
    def upload_new_files(self,request,pk):
        from .utils.util import calculate_file_hash
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
            uploaded+=1
        
            from .utils.util import convert_type,generate_video_cover
            if convert_type(instance.file.path) == 'video':
                generate_video_cover(instance)
            
        return Response({'status':1 if uploaded>0 else 0,'file_rejected':file_rejected,
        'fileuploaded':uploaded,'text':'共上传了{0}个文件中的{1}个'.format(filecount,uploaded)}
        ,status=status.HTTP_200_OK)
    

    '''扫描数据库信息'''
    @action(methods=["POST"], detail=False, url_path="get_databases")
    def get_databases(self, request):
        form_data=request.data
      
        print(form_data['ip'])
        db = DBConnection(host=form_data['ip'],dbtype=form_data['dbtype'],user=form_data['user'],pwd=form_data['pwd'])
        res = db.db_list()
               
        return Response(data={'databases':res},status=status.HTTP_200_OK)

    '''扫描数据库数据'''
    @action(methods=["POST"], detail=False, url_path="conndb")
    def conndb(self, request):
        import pandas as pd
        form_data=request.data
      
 
        db = DBConnection(host=form_data['ip'],dbtype=form_data['dbtype'],user=form_data['user'],pwd=form_data['pwd'],dbname=form_data['dbname'],tablename=form_data['tablename'])
        data = list(db.get_data())
        formheader = db.formheader
    
      
        data.insert(0,formheader)  
        res = search_database_riskdata(data)
               
        return Response( data={'data':res},status=status.HTTP_201_CREATED)
    
    '''扫描所有选择的数据库'''
    @action(methods=["POST"], detail=False, url_path="scandb")
    def scandb(self, request):
        import json
        form_data=dict(eval(request.body))
        print(form_data)
        db_list = form_data['databases']
        print(db_list)
        ret = {}
        
        for db in db_list:
            print(db)
            conn = DBConnection(host=form_data['ip'], dbtype=form_data['dbtype'],user=form_data['user'],pwd=form_data['pwd'],dbname=db)
            table_list = conn.table_list()
            ret[db] = {}
            print('Tables in database \'{0}\': {1}'.format(db,table_list))
            for table in table_list:
                print(table)
                db_cursor = DBConnection(host=form_data['ip'],dbtype=form_data['dbtype'],user=form_data['user'],pwd=form_data['pwd'],dbname=db,tablename=table)
                print('getting data')
                data = list(db_cursor.get_data())
                formheader = db_cursor.formheader
                data.insert(0,formheader)  
                print('scanning')
                res = search_database_riskdata(data)
                ret[db][table] = res
        print('saving result')
        save_file = open("media/result/result_file.json",'w',encoding='utf-8')
        json.dump(ret,save_file,ensure_ascii=False)
        save_file.close()
        return Response( data={'data':ret},status=status.HTTP_200_OK)
    
    '''用于DEBUG的API'''
    @action(methods=['POST'],detail=False, url_path='testscan')
    def scanweb(self,request):
        text = request.data['text']
        risk_data = SearchRiskdata({'test':text})
        res = risk_data.miti_process()
        return Response(data=res,status=status.HTTP_201_CREATED)

    '''扫描网站信息'''
    from asgiref.sync import async_to_sync
    @async_to_sync  
    @action(methods=["POST"], detail=False, url_path="scanweb")
    async def sacnweb(self, request):
        from django.conf import settings
        form_data=request.data

        print(form_data['selected']) # '文本类型敏感信息检测,人脸信息检测,暴露信息检测'
        keys:str = form_data['selected']
        keylist = keys.split(',')
        if keylist.__len__() == 0:
            return Response(data={'status':0,'msg':'无效的处理模块'},status=status.HTTP_200_OK)
        try:
            url = form_data['url']
            print(url)
            scraper = WebScraper(url)
        except:
            # 使用日志文件导入所有网页链接的情况
            import hashlib
            import os
            file = request.FILES.get('file')
            file_data = file.file.read()

            m = hashlib.md5()   #创建md5对象
            m.update(file_data)  #更新md5对象
            file_hash = m.hexdigest() #哈希值
            # 上传日志文件

            filename = "{0}/logfile_{1}{2}".format(settings.WEBSCAN_SPIDER_RES_DIR,file_hash,os.path.splitext(file.name)[1]) 
            os.makedirs(os.path.dirname(filename), exist_ok=True)
            with open(filename, 'wb') as f:
                f.write(file_data)
                f.close()

            from .utils.webscan import get_urllist_from_log 
            scraper = WebScraper(logfile=filename,logparser=get_urllist_from_log)

        scraper.miti_process()
        web_text = scraper.filtered_text
        web_img = scraper.img
     

        # img = {}
        # img_scrapy = ImgScraper(web_text, img)
        # await img_scrapy.run()
        # from .utils.util import merge_dict
        # print(img)
        # web_img = merge_dict(web_img, img)
       
        #开始处理文本数据
        riskdata = SearchRiskdata(web_text)
        res = riskdata.miti_process()


        # 开始处理非文本数据
        res=process_img(res, web_img, modules=keylist)

        # 保存结果
        try:
            resfilename = "media/files/webscan/results/result_{0}".format(file.name)
            os.makedirs(os.path.dirname(resfilename), exist_ok=True)
            with open(resfilename,'w',encoding='utf-8') as rf:
                import json
                json.dump(res,rf,ensure_ascii=False)
                
                rf.close()
        except Exception as e:
            print(e)
        return Response(data={'result':res,'status':0},status=status.HTTP_200_OK)


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