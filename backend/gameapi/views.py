# from curses import curs_set
from os import walk, path
from sqlite3 import Cursor
from zipfile import ZipFile
import os
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from .models import Project, File
from .serializers import ProjectModelSerializer, FileModelSerializer
from rest_framework.decorators import action




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
        if path.splitext(str(file))[1] =='.zip':
            unzipfile = unzip_file(ZipFile(file))
            unzippath = 'media/files/game_projects/project_{}'.format(instance.project.title)
            with unzipfile as zfp:
                zfp.extractall(unzippath) #解压到指定目录

        return Response(serializer.data, status=status.HTTP_201_CREATED)





class ProjectModelViewSet(ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectModelSerializer



    """添加一个项目"""
    def create(self, request):
        print(request.FILES.getlist('files[]'))
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        for f in request.FILES.getlist('files[]'):  
                # This looks not so right, could have cause some undesire behaviors....  
                instance = File(file=f ,project=Project.objects.last())
                instance.save()
        return Response({'status':1}, status=status.HTTP_201_CREATED)



    """获取一个项目"""
    def retrieve(self, request, pk):
        instance = self.get_object()
        serializer = self.get_serializer(instance=instance)

        instance = Project.objects.get(id=pk)
        path = 'media/files/game_projects/project_{}'.format(instance.title)
        res={}
        files = instance.project_files.all()
        filelist = []
        print(files)
        from .util import convert_size, convert_type
        for f in files:
            file_info={'id':f.id,
            'name':os.path.split(f.file.name)[1],
            'size':convert_size(f.file.size),
            'type':convert_type(f.file.name),
            'content':''}
            filelist.append(file_info)
        res['fileList'] = filelist
        img_data_file = get_img(path)
        doc_data_file = get_doc(path)
        res['file_num'] = len(img_data_file)+len(doc_data_file)
        res['img_num'] = len(img_data_file)
        res['doc_num'] = len(doc_data_file)
        res['img_data_file'] = img_data_file
        res['doc_data_file'] = doc_data_file
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
    def get_img_files(self,request,pk):
        from .util import convert_type
        instance = Project.objects.get(id=pk)
        serializer = ProjectModelSerializer(instance=instance)
        instance_file = serializer.data['project_files']
        image_file = [{'id':file['id'],'file':os.path.basename(file['file']),'project':file['project']} 
                                  for file in instance_file if convert_type(os.path.basename(file['file']))=='image']

        if len(image_file)==0:
            return Response({'res': "项目没有图片文件"}, status=status.HTTP_204_NO_CONTENT)

        return Response(data=image_file, status=status.HTTP_204_NO_CONTENT)


    '''获取项目所有文本文件'''
    @action(methods=["get"], detail=True, url_path="texts")
    def get_text_files(self,request,pk):
        from .util import convert_type
        instance = Project.objects.get(id=pk)
        serializer = ProjectModelSerializer(instance=instance)
        instance_file = serializer.data['project_files']
        text_file = [{'id':file['id'],'file':os.path.basename(file['file']),'project':file['project']} 
                                  for file in instance_file if convert_type(os.path.basename(file['file']))=='text']

        if len(text_file)==0:
            return Response({'res': "项目没有文本文件"}, status=status.HTTP_204_NO_CONTENT)

        return Response(data=text_file, status=status.HTTP_204_NO_CONTENT)




    '''获取一张图片'''
    # @action(methods=["get"], detail=True, url_path="process_img")
    def get_one_img(self, request, pk, file_id):
        from PIL import Image
        instance = Project.objects.get(id=pk)
        file = File.objects.get(id=file_id)
        path = file.file 
        image = Image.open(path).convert('RGB')
        context = img_base64(image)

        return Response({'image':context}, status=status.HTTP_204_NO_CONTENT)
    

    '''获取一个文档'''
    # @action(methods=["get"], detail=True, url_path="process_img")
    def get_one_doc(self, request, pk, file_id):
        import re
        import docx
        instance = Project.objects.get(id=pk)
        file = File.objects.get(id=file_id)
        path = file.file 
        content_str =''
        file = docx.Document(path)
        for para in file.paragraphs:
            content_str+=str(para.text)

        return Response({'text':content_str}, status=status.HTTP_204_NO_CONTENT)


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

        return Response(data=res, status=status.HTTP_200_OK)

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
        
        return Response(data=res, status=status.HTTP_200_OK)
    
    '''链接数据库并获取数据'''
    @action(methods=["post"], detail=False, url_path="conndb")
    def conndb(self, request):
        import pandas as pd
        form_data=request.data
        request._request.session['user'] = form_data['user']
        request._request.session['pwd'] = form_data['pwd']
        request._request.session['dbname'] = form_data['dbname']
        request._request.session['tablename'] = form_data['tablename']
 
        dbcursor = DBConnection(user=form_data['user'],pwd=form_data['pwd'],dbname=form_data['dbname'],tablename=form_data['tablename'])
        dbcursor.conn()
        data = dbcursor.get_data()
        formheader = dbcursor.formheader
        df = pd.DataFrame(data[1000:1500],columns=formheader)
      
        print(df.values)

        res = {'table':[],'suggestion':[]  }
        for row in df.values:
            row_dic={}
            for i,j in enumerate(row):
                row_dic[formheader[i]]=j
            res['table'].append(row_dic)
               
        return Response( data={'data':res},status=status.HTTP_201_CREATED)


    '''处理数据库数据'''
    @action(methods=["get"], detail=False, url_path="conndb/process_db")
    def process_db(self, request):
        import pandas as pd
        user = request.session.get('user')
        pwd = request.session.get('pwd')
        dbname = request.session.get('dbname')
        tablename = request.session.get('tablename')

        if not user:
            return Response({'mes': '请先链接数据库'}, status=status.HTTP_204_NO_CONTENT)


        dbcursor = DBConnection(user=user,pwd=pwd,dbname=dbname,tablename=tablename)
        dbcursor.conn()
        data = dbcursor.get_data()
        formheader = dbcursor.formheader
        df = pd.DataFrame(data[1000:1500],columns=formheader)
        header=dbcursor.formheader

        res = {'table':[],
       'suggestion':[]  
       }

        for row in df.values:
            row_dic={}
            for i,j in enumerate(row):
                row_dic[header[i]]=j
            res['table'].append(row_dic)
            
            
        if 'name' in header:
            col=header.index('name')
            for i,item in enumerate(df.values[:,col]) :
                if not item.count('*'):
                    sug={
                        'rowid':i,
                        'column':'name',
                        'severity':'high',
                    }
                    res['suggestion'].append(sug)
                    

        
        if 'phone_number' in header:
            col=header.index('phone_number')
            for i,item in enumerate(df.values[:,col]) :
                if not item.count('*'):
                    sug={
                        'rowid':i,
                        'column':'phone_number',
                        'severity':'high',
                    }
                    res['suggestion'].append(sug)
        
        
        if 'address' in header:
            col=header.index('address')
            for i,item in enumerate(df.values[:,col]) :
                if not item.count('*'):
                    sug={
                        'rowid':i,
                        'column':'address',
                        'severity':'medium',
                    }
                    res['suggestion'].append(sug)


        if 'age' in header:
            col=header.index('age')
            for i,item in enumerate(df.values[:,col]) :
                if  item != 'nan':
                    sug={
                        'rowid':i,
                        'column':'age',
                        'severity':'low',
                    }
                    res['suggestion'].append(sug)
        

        return Response( data={'data': res},status=status.HTTP_201_CREATED)







'''-------------------------------自定义的视图函数中调用的方法或类-----------------------------------'''

# 1.获取文件夹下的所有图片,列表形式返回
def get_img(rootdir):
    img_data = []
    prefix = []
    for root, dirs, files in walk(rootdir, topdown=True):
        for name in files:
            pre, ending = path.splitext(name)
            if ending != ".jpg" and ending != ".jepg" and ending != ".png":
                continue
            else:  
                print(name)          
                img_data.append(name)
                # prefix.append(pre)

    return img_data


# 2.获取文件夹下的所有文档
def get_doc(rootdir):
    doc_data = []
    prefix = []
    for root, dirs, files in walk(rootdir, topdown=True):
        for name in files:
            pre, ending = path.splitext(name)
            if ending != ".docx" and ending != ".txt" and ending != ".doc":
                continue
            else:
                print(name)
                doc_data.append(name)
                # doc_data.append(root+'/' + name)
                # prefix.append(pre)

    return doc_data


# 3.解压用户上传的zip文件包
def unzip_file(zip_file: ZipFile):
    name_to_info = zip_file.NameToInfo
    for name, info in name_to_info.copy().items():
        real_name = name.encode('cp437').decode('gbk')  # 解决中文乱码问题
        if real_name != name:
            info.filename = real_name
            del name_to_info[name]
            name_to_info[real_name] = info
    return zip_file


# 4.PIL映像从 Django REST 框架后端获取到前端
def img_base64(image):
    import io
    import base64
    im_io = io.BytesIO()
    image.save(im_io, 'png', quality=70)
    im_io.seek(0)
    im_io_png = base64.b64encode(im_io.getvalue())
    context = im_io_png.decode('UTF-8')
    return context



        


# 5.处理图片数据
class ImageProcess(object): 
    def __init__(self):
        self.txts = []  # 图片中文字
        self.boxes = []  # 图片中文字对应坐标
        self.image = None
        self.process_result = {}  # 敏感词
        self.keyword_box = {}  # 敏感词所在坐标
        

    def init_para(self, path):
        from paddleocr import PaddleOCR
        from PIL import Image
        import numpy as np
        self.image = Image.open(path).convert('RGB')
        # 调整图片为统一大小，保持比例不变
        # base_width = 3360
        # w_percent = base_width / float(self.image.size[0])
        # h_size = int(float(self.image.size[1]) * float(w_percent))
        # self.image = self.image.resize((base_width, h_size), Image.ANTIALIAS)
        #调用模型处理图片
        ocr = PaddleOCR(use_angle_cls=True,det=True, lang="ch")  
        result = ocr.ocr(np.array(self.image), cls=True) 
        self.boxes = [line[0] for line in result ]
        self.txts = [line[1][0] for line in result ]
        

    #处理图片上的繁体字
    def process_traditional_characters(self):
        from paddleocr import draw_ocr
        from PIL import Image
        import numpy as np
        count = 0    #繁体字数量
        traditional_item = []   #繁体字
        traditional_characters = [line for line in self.txts if len(self.recongnize_traditional(line))]
        traditional_characters_box = [box for box,line in zip(self.boxes,self.txts) if len(self.recongnize_traditional(line))]
        img_ocr = draw_ocr(self.image, traditional_characters_box, font_path='./fonts/simfang.ttf')
      
        img = np.asarray(img_ocr)
        image_traditional = Image.fromarray(np.uint8(img))
        for character in traditional_characters:
            for item in character:
                if len(self.recongnize_traditional(item)):
                    traditional_item.append(item)
                    count += 1
                else:
                    pass
        
        self.process_result['traditional_characters'] = {'count':count,'traditional_item':traditional_item,'image':self.get_img_base64(image_traditional)}

        

    #处理图片上的敏感词
    def process_sensitive_word(self):
        from paddleocr import draw_ocr
        from PIL import Image
        import numpy as np
        
        count = 0    #敏感词数量
        senstive_item = []   #敏感词
        senstive_characters = [line for line in self.txts if len(self.recongnize_sensitive(line))]
        senstive_characters_box = [box for box,line in zip(self.boxes,self.txts) if len(self.recongnize_sensitive(line))]
        img_ocr = draw_ocr(self.image, senstive_characters_box, font_path='./fonts/simfang.ttf')

        img = np.asarray(img_ocr)
        image_sensitive = Image.fromarray(np.uint8(img))
      
        for line in senstive_characters:
            
            if len(self.recongnize_sensitive(line)):
                senstive_item += self.recongnize_sensitive(line)
                count += 1
                
        self.process_result['senstive_characters'] = {'count':count,'senstive_item':senstive_item,'image':self.get_img_base64(image_sensitive)}
        


    #处理图片上的英文
    def process_english_word(self):
        from paddleocr import draw_ocr
        from PIL import Image
        import numpy as np
        count = 0    #敏感词数量
        english_item = []   #敏感词
        senstive_characters = [line for line in self.txts if len(self.recongnize_english(line))]
        senstive_characters_box = [box for box,line in zip(self.boxes,self.txts) if len(self.recongnize_english(line))]
        img_ocr = draw_ocr(self.image, senstive_characters_box, font_path='./fonts/simfang.ttf')

        img = np.asarray(img_ocr)
        image_english = Image.fromarray(np.uint8(img))
      
        for line in senstive_characters:
            
            if len(self.recongnize_english(line)):
                english_item += self.recongnize_english(line)
                count += 1

        self.process_result['english_word'] = {'count':count,'english_item':english_item,'image':self.get_img_base64(image_english)}


    #处理图片上的骷髅
    def process_skull(self):
        import sys
        sys.path.append("yolo")
        sys.path.append("yolo/model_data")
        
        from yolo.yolo import YOLO
        yolo = YOLO()     
        r_image = yolo.detect_image(self.image, crop = False, count=False)

        self.process_result['skull'] = self.get_img_base64(r_image)
        


    # PIL映像从 Django REST 框架后端获取到前端
    def get_img_base64(self,image):
        context = img_base64(image)
        # self.process_result['image'] = context
        return context


    #判断是否有繁体字
    def recongnize_traditional(self,text):
        filter = TrantitionalCharacterFilter()
        filter.filter(text)
        res = filter.trantitional_list()
        return res    

    #判断是否有敏感词
    def recongnize_sensitive(self,text): 
        keywords_path = 'media/filter/keywords.docx'
        filter = DFAFilter()
        filter.init_chains(keywords_path)
        filter.filter(text)
        res = filter.sensitive_list()
        return res

    #判断是否有英文
    def recongnize_english(self,text): 
        res,_ = english(text)
        return res





# 6.处理文档数据
class DocProcess(object): 
    def __init__(self):
        self.txts = []  # 文档文字，按段落成list
        self.string = '' 
        self.process_result = {}  # 敏感词
 
    def init_para(self, path):    
        import docx
        file = docx.Document(path)
        for para in file.paragraphs:
            self.txts.append(str(para.text))
            self.string += str(para.text)
        
    #处理文档的繁体字
    def process_traditional_characters(self):      
        count = 0    #繁体字数量
        traditional_item = []   #繁体字       
        for item in self.string:
            if len(self.recongnize_traditional(item)[0]):
                traditional_item.append(item)
                count += 1
        ret = self.recongnize_traditional(self.string)[1]
        self.process_result['traditional_characters'] = {'count':count,'traditional_item':traditional_item,'fulltext':ret}
     

    #处理文档的敏感词
    def process_sensitive_word(self):    
        count = 0    #敏感词数量
        senstive_item = []   #敏感词             
        if len(self.recongnize_sensitive(self.string)[0]):
            senstive_item += self.recongnize_sensitive(self.string)[0]
            count = len(senstive_item)
        ret =   self.recongnize_sensitive(self.string)[1]
        self.process_result['senstive_characters'] = {'count':count,'senstive_item':senstive_item, 'fulltext':ret}
        

    #处理文档的英文
    def process_english_word(self):
        count = 0    #敏感词数量
        english_item = []   #敏感词  
        if len(self.recongnize_english(self.string)[0]):
            english_item += self.recongnize_english(self.string)[0]
            count = len(english_item)
        ret = self.recongnize_english(self.string)[1]
        self.process_result['english_word'] = {'count':count,'english_item':english_item, 'fulltext':ret}


    #判断是否有繁体字
    def recongnize_traditional(self,text):
        filter = TrantitionalCharacterFilter()
        filter.filter(text)
        res = filter.trantitional_list()
        res = list(set(res))
        return res,filter.ret

    #判断是否有敏感词
    def recongnize_sensitive(self,text): 
        keywords_path = 'media/filter/keywords.docx'
        filter = DFAFilter()
        filter.init_chains(keywords_path)
        filter.filter(text)
        res = filter.sensitive_list()
        res = list(set(res))
        return res,filter.ret

    #判断是否有英文
    def recongnize_english(self,text): 
        res,ret= english(text)
        res = list(set(res))
        return res, ret



# 7.敏感词处理
class DFAFilter(object):
    def __init__(self):
        self.keyword_chains = {}  # 敏感词链表
        self.delimit = '\x00'  # 敏感词词尾标识
        self.whitelist=['的'] # 白名单
        self.ret = []  # 返回字符串列表，为了便于前端显示，采取形如[{'flag':0, 'text':"abc"}, {'flag':1 ,'text':"sb"}]的形式返回
    def add(self, keyword):
        keyword = keyword.lower()  # 关键词英文变为小写
        chars = keyword.strip()  # 关键字去除首尾空格和换行
        if not chars:  # 如果关键词为空直接返回
            return
        level = self.keyword_chains
        # 遍历关键字的每个字
        for i in range(len(chars)):
            # 如果这个字已经存在字符链的key中就进入其子字典
            if chars[i] in level:
                level = level[chars[i]]
            else:
                if not isinstance(level, dict):
                    break
                for j in range(i, len(chars)):
                    level[chars[j]] = {}
                    last_level, last_char = level, chars[j]
                    level = level[chars[j]]
                last_level[last_char] = {self.delimit: 0}
                break
        if i == len(chars) - 1:
            level[self.delimit] = 0
        
    def init_chains(self, path):
        import docx
        import re
        keyword_file = docx.Document(path)
        keywords = []
        for para in keyword_file.paragraphs:
            keywords.extend(re.split("[；|;]",str(para.text)))
        # print(keywords)
        for keyword in keywords:
            self.add(str(keyword).strip())

    def filter(self, message):
        message = message.lower()
        # ret = []  
        start = 0
        while start < len(message):
            level = self.keyword_chains
            step_ins = 0
            for char in message[start:]:
                if char in level:
                    step_ins += 1
                    if self.delimit not in level[char] or message[start:start+step_ins] in self.whitelist: # current serial is legal
                        level = level[char]
                    else:
                        self.ret.append({'flag':1,'text':message[start:start+step_ins]})
                        start += step_ins - 1
                        break
                else:
                    self.ret.append({'flag':0,'text':message[start]})
                    break
            else:
                self.ret.append({'flag':0,'text':message[start]})
            start += 1
        return self.ret

    def sensitive_list(self):
        sensitive=[]
        for word in self.ret:  
            if word['flag']==1:
                sensitive.append(word['text'])
        return sensitive



# 8.繁体字词处理
class TrantitionalCharacterFilter(object):
    def __init__(self):
        self.ret = []  # 返回字符串列表，为了便于前端显示，采取形如[{'flag':0, 'text':"简体字"}, {'flag': 2 ,'text':"繁体字"}]的形式返回


    def filter(self,text):
        for i in text:
            if self.recongnize_traditional(i):
                self.ret.append({'flag':2 ,'text':i})
            else:
                self.ret.append({'flag':0 ,'text':i})


    def trantitional_list(self):
        trantitional=[]
        for word in self.ret:  
            if word['flag']==2:
                trantitional.append(word['text'])
        return trantitional
        

    #判断是否有繁体字
    def recongnize_traditional(self,text):
        from zhconv import convert
        try:
            text.encode('big5hkscs')
            if convert(text, 'zh-hans')!=text:
                return True
            else:
                return False
        except:
            if convert(text, 'zh-hans')!=text:
                return True
            else:
                return False
      

# 9.英文处理
def english(string):
    import re
    adressRegex = re.compile(r'''(
                [a-zA-Z]+
                    )''', re.VERBOSE)
    res = adressRegex.findall(string) 
    for i in ['PC','3D','2D','H5','VR','AR','HD','Q','K']:
            if i in res:
                res.pop(res.index(i))

    ret = []# 返回字符串列表，为了便于前端显示，采取形如[{'flag':0, 'text':"非英文"}, {'flag':3 ,'text':"english"}]的形式返回
    for idenx,item in enumerate(re.split("[ ,.，。]",string)):
        if item in res:
            ret.append({'flag':3 ,'text':item})
        else:
            ret.append({'flag':0 ,'text':item})

    
    return res, ret




# 10.链接数据库
class DBConnection(object):
    
    def __init__(self,user,pwd,dbname,tablename):
        self.user = user
        self.pwd = pwd
        self.dbname = dbname
        self.tablename = tablename
        self.formheader=[]
        
    def conn(self):
        import pymysql
        database = pymysql.connect(host='localhost',
                       port=3306,
                       user=self.user,
                       passwd=self.pwd,                     
                       db=self.dbname,
                       charset = 'utf8')

        cursor = database.cursor()
        return cursor

    def get_data(self):
        sql = "select * from {}".format(self.tablename)
        cursor = self.conn()
        cursor.execute(sql)
        self.formheader=[]
        desc = cursor.description
        for field in desc:
            self.formheader.append(field[0])
        # print(self.formheader)
        ret = cursor.fetchall()
        return ret
