from curses import curs_set
from email.mime import audio
from os import walk, path
from sqlite3 import Cursor
from zipfile import ZipFile
import os
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from .models import Project, File, KeyFrame, GameAdvice
from .serializers import ProjectModelSerializer, FileModelSerializer, GameAdviceModelSerializer, KeyFrameModelSerializer
from rest_framework.decorators import action
from .class_method import *







class GameAdviceModelSerializer(ModelViewSet):
    queryset = GameAdvice.objects.all()
    serializer_class = GameAdviceModelSerializer






class FileModelViewSet(ModelViewSet):
    queryset = File.objects.all()
    serializer_class = FileModelSerializer



    """上传文件"""
    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        print(request._request.FILES.getlist('file'))

        # 如果上传的是zip压缩包，则解压到当前目录
        instance = File.objects.last()
        file = instance.file
        if path.splitext(str(file))[1] == '.zip':
            unzipfile = unzip_file(ZipFile(file))
            unzippath = 'media/files/game_projects/project_{}'.format( instance.project.title)
            with unzipfile as zfp:
                zfp.extractall(unzippath)  # 解压到指定目录

        return Response(serializer.data, status=status.HTTP_201_CREATED)





class ProjectModelViewSet(ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectModelSerializer



    """添加一个项目"""
    def create(self, request):
        print(type(request.data), request.data)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)



    """获取一个项目"""
    def retrieve(self, request, pk):
        instance = self.get_object()
        serializer = self.get_serializer(instance=instance)

        instance = Project.objects.get(id=pk)
        path = 'media/files/game_projects/project_{}'.format(instance.title)
        res = {}
        img_data_file = get_file(path,'image')
        doc_data_file = get_file(path, 'doc')
        audio_data_file = get_file(path, 'audio')
        vedio_data_file = get_file(path, 'vedio')
        res['file_num'] = len(img_data_file)+len(doc_data_file)+len(audio_data_file)+len(vedio_data_file)
        res['img_num'] = len(img_data_file)
        res['doc_num'] = len(doc_data_file)
        res['audio_num'] = len(audio_data_file)
        res['vedio_num'] = len(vedio_data_file)
        res['img_data_file'] = img_data_file
        res['doc_data_file'] = doc_data_file
        res['audio_data_file'] = audio_data_file
        res['vedio_data_file'] = vedio_data_file
        serializer.data['res'] = res
        res.update(serializer.data)

        return Response(res, status=status.HTTP_201_CREATED)



    """删除一个项目"""
    def destroy(self, request, pk):

        # 删除该项目所有文件
        import shutil
        instance = Project.objects.get(id=pk)
        path = 'media/files/game_projects/project_{}'.format(instance.title)
        if os.path.exists(path):
            shutil.rmtree(path)

       # 删除项目
        self.get_object().delete()
        return Response({'mes': '删除成功'}, status=status.HTTP_204_NO_CONTENT)



    '''获取项目所有图片文件'''
    @action(methods=["get"], detail=True, url_path="images")
    def get_img_files(self, request, pk):
        from .util import convert_type
        instance = Project.objects.get(id=pk)
        serializer = ProjectModelSerializer(instance=instance)
        instance_file = serializer.data['project_files']

        image_file = [{'id': file['id'], 'file':os.path.basename(file['file']), 'project':file['project']}
                                  for file in instance_file if convert_type(os.path.basename(file['file'])) == 'image']


        if len(image_file) == 0:
            return Response({'res': "项目没有图片文件"}, status=status.HTTP_204_NO_CONTENT)

        return Response(data=image_file, status=status.HTTP_204_NO_CONTENT)

    '''获取项目游戏建议图片文件'''
    @action(methods=["get"], detail=True, url_path="advice_images")
    def get_advice_img_files(self, request, pk):
        from .util import convert_type
        instance = Project.objects.get(id=pk)
        serializer = ProjectModelSerializer(instance=instance)
        instance_advice_file = serializer.data['advice_files']



        advice_image = [{'id': file['id'], 'file':os.path.basename(file['file']), 'project':file['project']}
                                  for file in instance_advice_file if convert_type(os.path.basename(file['file'])) == 'image']

        if len(advice_image) == 0:
            return Response({'res': "项目没有图片文件"}, status=status.HTTP_204_NO_CONTENT)

        return Response(data=advice_image, status=status.HTTP_204_NO_CONTENT)



    '''获取项目所有文本文件'''
    @action(methods=["get"], detail=True, url_path="texts")
    def get_text_files(self, request, pk):
        from .util import convert_type
        instance = Project.objects.get(id=pk)
        serializer = ProjectModelSerializer(instance=instance)
        instance_file = serializer.data['project_files']
        text_file = [{'id': file['id'], 'file':os.path.basename(file['file']), 'project':file['project']}
                                  for file in instance_file if convert_type(os.path.basename(file['file'])) == 'text']

        if len(text_file) == 0:
            return Response({'res': "项目没有文本文件"}, status=status.HTTP_204_NO_CONTENT)

        return Response(data=text_file, status=status.HTTP_204_NO_CONTENT)



    '''获取项目所有音频文件'''
    @action(methods=["get"], detail=True, url_path="audios")
    def get_audio_files(self, request, pk):
        from .util import convert_type
        instance = Project.objects.get(id=pk)
        serializer = ProjectModelSerializer(instance=instance)
        instance_file = serializer.data['project_files']
        audio_file = [{'id': file['id'], 'file':os.path.basename(file['file']), 'project':file['project']}
                                  for file in instance_file if convert_type(os.path.basename(file['file'])) == 'audio']

        if len(audio_file) == 0:
            return Response({'res': "项目没有音频文件"}, status=status.HTTP_204_NO_CONTENT)

        return Response(data=audio_file, status=status.HTTP_204_NO_CONTENT)


    '''获取项目所有视频文件'''
    @action(methods=["get"], detail=True, url_path="vedios")
    def get_vedio_files(self, request, pk):
        from .util import convert_type
        instance = Project.objects.get(id=pk)
        serializer = ProjectModelSerializer(instance=instance)
        instance_file = serializer.data['project_files']
        video_file = [{'id': file['id'], 'file':os.path.basename(file['file']), 'project':file['project']}
                                  for file in instance_file if convert_type(os.path.basename(file['file'])) == 'video']

        if len(video_file) == 0:
            return Response({'res': "项目没有视频文件"}, status=status.HTTP_204_NO_CONTENT)

        return Response(data=video_file, status=status.HTTP_204_NO_CONTENT)



    '''获取一张图片'''
    # @action(methods=["get"], detail=True, url_path="process_img")
    def get_one_img(self, request, pk, file_id):
        from PIL import Image
        instance = Project.objects.get(id=pk)

        file = File.objects.filter(id=file_id)[0]
        path = file.file

        image = Image.open(path).convert('RGB')
        context = img_base64(image)

        return Response({'image': context}, status=status.HTTP_204_NO_CONTENT)

    '''获取一张游戏建议图片'''
    # @action(methods=["get"], detail=True, url_path="process_img")
    def get_one_advice_img(self, request, pk, file_id):
        from PIL import Image
        instance = Project.objects.get(id=pk)

        file = GameAdvice.objects.filter(id=file_id)[0]
        path = file.file

        image = Image.open(path).convert('RGB')
        context = img_base64(image)

        return Response({'image': context}, status=status.HTTP_204_NO_CONTENT)




    '''获取一个文档'''
    # @action(methods=["get"], detail=True, url_path="process_img")
    def get_one_doc(self, request, pk, file_id):
        import docx
        instance = Project.objects.get(id=pk)
        file = File.objects.get(id=file_id)
        path = file.file
        content_str = ''
        file = docx.Document(path)
        for para in file.paragraphs:
            content_str += str(para.text)

        return Response({'text': content_str}, status=status.HTTP_204_NO_CONTENT)


    '''获取一个音频'''
    # @action(methods=["get"], detail=True, url_path="process_audio")
    def get_one_audio(self, request, pk, file_id):
        instance = Project.objects.get(id=pk)
        audiofile = File.objects.get(id=file_id)
        file_path = audiofile.file
        
        return Response({'audio': str(file_path)}, status=status.HTTP_204_NO_CONTENT)


    '''获取一个视频'''
    # @action(methods=["get"], detail=True, url_path="process_audio")
    def get_one_vedio(self, request, pk, file_id):
        instance = Project.objects.get(id=pk)
        vediofile = File.objects.get(id=file_id)
        file_path = vediofile.file
        KeyFrame.objects.all().delete()
        
        return Response({'vedio': str(file_path)}, status=status.HTTP_204_NO_CONTENT)




    '''处理一张图片'''
    # @action(methods=["get"], detail=True, url_path="process_img")
    def process_img(self, request, pk, file_id):

        instance = Project.objects.get(id=pk)
        file = File.objects.get(id=file_id)
        path = file.file

        # # 开始处理图片
        imgfilter = ImageProcess()
        imgfilter.init_para(path)
        imgfilter.process_traditional_characters()
        imgfilter.process_sensitive_word()
        imgfilter.process_english_word()
        imgfilter.process_skull()
        # imgfilter.get_img_base64()
        res = imgfilter.process_result

        return Response(data=res, status=status.HTTP_204_NO_CONTENT)



    '''处理一张图片(健康游戏忠告)'''
    # @action(methods=["get"], detail=True, url_path="game_advice")
    def game_advice(self, request, pk, file_id):

        instance = Project.objects.get(id=pk)
        file = GameAdvice.objects.get(id=file_id)
        path = file.file

        # # 开始处理图片
        imgfilter = ImageProcess()
        imgfilter.init_para(path)
        is_game_advice = imgfilter.game_advice()
        if is_game_advice==True:
            return Response(data='图片含有游戏健康忠告内容', status=status.HTTP_204_NO_CONTENT)
        if is_game_advice==False:
            return Response(data='图片不含有游戏健康忠告内容', status=status.HTTP_204_NO_CONTENT)

        




    '''处理一个文档'''
    # @action(methods=["get"], detail=True, url_path="process_doc")
    def process_doc(self, request, pk, file_id):

        instance = Project.objects.get(id=pk)
        file = File.objects.get(id=file_id)
        path = file.file

        # # 开始处理
        docfilter = DocProcess()
        docfilter.init_para(path)
        docfilter.process_traditional_characters()
        docfilter.process_sensitive_word()
        docfilter.process_english_word()

        res = docfilter.process_result

        return Response(data=res, status=status.HTTP_204_NO_CONTENT)


    '''处理一个音频'''
    # @action(methods=["get"], detail=True, url_path="process_audio")
    def process_audio(self, request, pk, file_id):

        instance = Project.objects.get(id=pk)
        file = File.objects.get(id=file_id)
        path = './media/' + str(file.file)

        speechfilter = SpeechProcess()
        speechfilter.init_para(path)
        speechfilter.process_sensitive_word()
        speechfilter.process_english_word()

        res = speechfilter.process_result
  
        return Response(data=res, status=status.HTTP_204_NO_CONTENT)


    '''处理一个视频'''
    # @action(methods=["get"], detail=True, url_path="process_audio")
    def key_frames(self, request, pk, file_id):
        instance = Project.objects.get(id=pk)
        file = File.objects.get(id=file_id)
        print(f'这里是文件id{file.id}')
        path = './media/' + str(file.file)
        #开始抽取关键帧
        vediofilter = VedioProcess()
        vediofilter.extract_frame(path)

        key_frame = dict(zip(vediofilter.frame_time, vediofilter.frame_path))
        #保存关键帧到数据库
        for key,value in key_frame.items():
            new_keyframe = KeyFrame.objects.create()
            new_keyframe.file = file
            new_keyframe.path = value
            new_keyframe.time = key
            new_keyframe.save()

        all_key = KeyFrame.objects.filter(file=file.id)
        res = [{'id': file.id, 'description': '此关键帧可能含有血液','time':file.time , 'file':file.path, } for file in all_key ]

        return Response(data=res, status=status.HTTP_204_NO_CONTENT)





    '''链接数据库并获取数据'''
    @action(methods=["post"], detail=False, url_path="conndb")
    def conndb(self, request):
        import pandas as pd
        form_data=request.data
        # request._request.session['user'] = form_data['user']
        # request._request.session['pwd'] = form_data['pwd']
        # request._request.session['dbname'] = form_data['dbname']
        # request._request.session['tablename'] = form_data['tablename']
 
        dbcursor = DBConnection(user=form_data['user'],pwd=form_data['pwd'],dbname=form_data['dbname'],tablename=form_data['tablename'])
        dbcursor.conn()
        data = dbcursor.get_data()
        formheader = dbcursor.formheader
        df = pd.DataFrame(data[1000:1500],columns=formheader)
      
        print(df.values)

        res = {'table':[],'suggestion':[]}

        for row in df.values:
            row_dic={}
            for i,j in enumerate(row):
                row_dic[formheader[i]]=j
            res['table'].append(row_dic)


        nametemplate = "在{0}行的{1}列中发现敏感姓名信息。"
        addresstemplate = "在{0}行的{1}列中发现敏感地址信息。"
        phonetemplate = "在{0}行的{1}列中发现敏感电话号码信息。"
        agetemplate = "在{0}行的{1}列中发现敏感年龄信息。"
        suggcount=0



        if 'name' in formheader:
            col=formheader.index('name')
            for i,item in enumerate(df.values[:,col]) :
                if not item.count('*'):
                    sug={
                        'id':suggcount+1,
                        'rowid':i,
                        'column':'name',
                        'seriousness':'high',
                        'title':'发现敏感姓名数据',
                        'description':nametemplate.format(i,'name'),
                    }
                    suggcount+=1
                    res['suggestion'].append(sug)


        if 'address' in formheader:
            col=formheader.index('address')
            for i,item in enumerate(df.values[:,col]) :
                if not item.count('*'):
                    sug={
                        'id':suggcount+1,
                        'rowid':i,
                        'column':'address',

                        'seriousness':'medium',
                        'title':'发现敏感地址数据',
                        'description':addresstemplate.format(i,'address'),
                    }
                    suggcount+=1
                    res['suggestion'].append(sug)


        if 'phone_number' in formheader:
            col=formheader.index('phone_number')
            for i,item in enumerate(df.values[:,col]) :
                if not item.count('*'):
                    sug={
                        'id':suggcount+1,
                        'rowid':i,
                        'column':'phone_number',

                        'seriousness':'high',
                        'title':'发现敏感电话号码数据',
                        'description':phonetemplate.format(i,'phone_number'),
                    }
                    suggcount+=1
                    res['suggestion'].append(sug)


        if 'age' in formheader:
            col=formheader.index('age')
            for i,item in enumerate(df.values[:,col]) :
                if  item != 'nan':
                    sug={
                        'id':suggcount+1,
                        'rowid':i,
                        'column':'age',
                        'seriousness':'low',
                        'title':'发现敏感年龄数据',
                        'description':agetemplate.format(i,'age'),
                    }
                    suggcount+=1
                    res['suggestion'].append(sug)
               
        return Response( data={'data':res},status=status.HTTP_201_CREATED)
    