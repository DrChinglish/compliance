from .util import *
from .repattern import *
import numpy as np
from pathlib import Path
from PIL import Image, ImageDraw
from paddleocr import PaddleOCR
from mediapipe.python.solutions.face_detection import FaceDetection
from mediapipe.python.solutions.drawing_utils import _normalized_to_pixel_coordinates
from mediapipe.python.solutions.hands import Hands
import cv2


# 数据处理
class DataProcess(object):
    def __init__(self):
        self.path = ''
        self.txts = []  # 文本内容
        self.string = ''
        self.boxes = [] # 图片中文字边框
        self.file_type = None
        self.image = None
        self.speech = None
        self.sensitive_information = {'specified_identity':{'passport':[],'IDNumber':[],'officer':[],'HM_pass':[],'carnum':[]},
                                      'bioinformation':{'face':[],'fingerprint':[],'iris':[],'Eye_pattern':[],'auricle':[]},
                                      'financial_account':{'debit':[],'fund_account':[],'Alipay_account':[]},
                                      'healthcare':{'birth_information':[],'hospital_records':[]},
                                      'track':{'Latitude_longitude':[],'position':[]},
                                      'juveniles_information':{'juveniles':[]},
                                      'authentication_information':{'password':[],'auth_code':[]},
                                      'other':{'sex':[],'nation':[]},
                                     } 
       
    def init_para(self, path):
        file_path = Path(path)
        self.path = file_path
        if convert_type(file_path) == 'text':
            self.file_type = 'text'
            import docx
            file = docx.Document(file_path)          
            for para in file.paragraphs:
                self.txts.append([str(para.text),0])
                self.string = self.string+str(para.text)
        elif convert_type(file_path) == 'audio':
            self.file_type = 'audio'
            from paddlespeech.cli.asr.infer import ASRExecutor
            from paddlespeech.cli.text.infer import TextExecutor
            asr = ASRExecutor()
            self.re_sample(path)
            result = asr(audio_file=path)

            text_punc = TextExecutor()
            result = text_punc(text=result)
            self.txts = [result, 0]
            self.string = ''.join((str(x[0]) for x in self.txts))
        elif convert_type(file_path) == 'image':
            self.file_type = 'image'
            self.image = Image.open(path).convert('RGB')
            ocr = PaddleOCR(use_angle_cls=True,det=True, lang="ch")
            result = ocr.ocr(np.array(self.image), cls=True)
            result = result[0]  
            self.boxes = [line[0] for line in result ]
            self.txts = [[line[1][0], 0] for line in result ]
            self.string = ''.join((str(x[0]) for x in self.txts))
        else:
            pass
        
    # 将音频的采样率改成16000,方便模型调用
    def re_sample(self, path):
        import librosa
        import soundfile as sf
        import numpy as np
        src_sig,sr = sf.read(path)                                
        src_sig =src_sig.T
        dst_sig = librosa.resample(np.asarray(src_sig),sr,16_000) 
        dst_sig = dst_sig.T
        sf.write(path,dst_sig,16_000)   

    # 查找用户上传数据中的敏感信息
    def search_risk(self): 
        if self.file_type in ['text', 'audio', 'image']:
            for item in search_riskdata(self.string):
                for type in self.sensitive_information.keys():
                    if item[0] in self.sensitive_information[type].keys():
                        self.sensitive_information[type][item[0]].append(item[3])
                for i,txt in enumerate(self.txts):
                    if item[3] in txt[0]:
                        self.txts[i][1] = 1
    # 图片中人脸检测
    def face_detect(self):
        if self.file_type =='image':
            path = str(Path(self.path))
            face_det = FaceDet(min_detection_confidence=0.5, model_selection=0)
            bboxes, _=face_det.detect_all_faces(image=cv2.cvtColor(cv2.imread(path), cv2.COLOR_RGB2BGR))
            if len(bboxes)>0:
                self.sensitive_information['bioinformation']['face'].append(path)
        return
    
    # 图片手指纹检测
    def fingerprint_detect(self):
        if self.file_type =='image':
            path = str(Path(self.path))
            hand_det = HandDet()
            keys=hand_det.detect_all_hands(image=cv2.cvtColor(cv2.imread(path), cv2.COLOR_RGB2BGR))
            if len(keys)>0:
                self.sensitive_information['bioinformation']['fingerprint'].append(path)
        return
    
    # 图片中的其他生物信息
    def bioinfo_detect(self):
        if self.file_type == 'image':
            bioinfo_det = BioinfoDet() 
            path = str(Path(self.path))
            ret = bioinfo_det.bio_detect(onnx_path="media/files/platformapi/onnx_server/best.onnx",imgpath=path,show=True)
            if len(ret)>0:
                for item in ret:
                    if item["classes"] == 'iris':
                        self.sensitive_information['bioinformation']['iris'].append(path)
                    if item["classes"] == 'auricle':
                        self.sensitive_information['bioinformation']['auricle'].append(path)
                    return
            


    # 文本数据脱敏
    def des_txts(self):
        if self.file_type in ['text', 'audio', 'image']:
            for item in search_riskdata(self.string):
                for i,para in enumerate(self.txts):
                    if item[3] in para[0]:
                        self.txts[i][0] = self.txts[i][0].replace(item[3], eval(f'des_{item[0]}')(item[3]))


    # 图片数据脱敏，将敏感数据部分打马赛克             
    def des_iamge(self):
        if self.file_type == 'image':
            img_array = np.array(self.image).astype(int) 
            pixel = 40
            for i, item in enumerate(self.boxes):
                if self.txts[i][1] == 1:
                    for x in range(int(item[0][1]), int(item[2][1])-20, pixel):
                        for y in range(int(item[0][0]), int(item[2][0])-20, pixel):
                            img_array[x:x + pixel, y:y + pixel] = img_array[x +(pixel // 2)][y + (pixel // 2)]
            self.image = Image.fromarray(img_array.astype("uint8"))
        else:
            return

    # 保存处理后的数据到指定的路径
    def save_des_data(self, save_path):
        import docx
        if self.file_type == 'text':
            doc = docx.Document()
            for para in self.txts:
                par = doc.add_paragraph('')
                run_ = par.add_run(para[0])
            doc.save(save_path)
        elif self.file_type == 'image':
            img_array = np.array(self.image).astype(int)
            image = Image.fromarray(img_array.astype("uint8"))
            image.save(save_path)
        else:
            return        



# 人脸检测模型
class FaceDet(FaceDetection):

    def detect_all_faces(self, image):
        image_cols, image_rows, _=image.shape
        results=self.process(image=image)

        bboxes=[]
        keypoints=[]
        if not results.detections:
            return bboxes, keypoints
        for detection in results.detections:
            location = detection.location_data
            if not location.HasField('relative_bounding_box'):
                continue
            relative_bounding_box = location.relative_bounding_box

            x_min, y_min = _normalized_to_pixel_coordinates(
                relative_bounding_box.xmin, 
                relative_bounding_box.ymin, image_cols, image_rows)

            x_max, y_max = _normalized_to_pixel_coordinates(
                relative_bounding_box.xmin + relative_bounding_box.width,
                relative_bounding_box.ymin + relative_bounding_box.height, image_cols, image_rows)
            bboxes.append((x_min, y_min, x_max, y_max))
            
            keypoints.append([_normalized_to_pixel_coordinates(
                        keypoint.x, keypoint.y, image_cols, image_rows
                        ) for keypoint in location.relative_keypoints])
        
        return bboxes, keypoints


# 手指检测模型
class HandDet(Hands):

    def detect_all_hands(self, image):
        
        image_cols, image_rows, _=image.shape
        results=self.process(image=image)
        
        keypoints=[]
        if not results.multi_hand_landmarks:
            return keypoints

        for landmark_list in results.multi_hand_landmarks:
            if not landmark_list:
                continue
            hand_landmarks = landmark_list.landmark
            keypoints.append([(i, round(landmark.x * image_rows), round(landmark.y * image_cols))
                                for i, landmark in enumerate(hand_landmarks)])

        return keypoints 
    


# 生物信息检测模型(onnx)
from .detect_onnx_server.operation import YOLO
class BioinfoDet():

    def bio_detect(self,onnx_path,imgpath='',show=True):
        '''
        检测目标，返回目标所在坐标如：
        {'crop': [57, 390, 207, 882], 'classes': 'person'},...]
        :param onnx_path:onnx模型路径
        :param img:检测用的图片
        :param show:是否展示
        :return:
        '''
        yolo = YOLO(onnx_path=onnx_path)
        # 结果
        det_obj = yolo.decect(imgpath)

        # 画框框
        if show:
            img = Image.open(imgpath)
            draw = ImageDraw.Draw(img)

            for i in range(len(det_obj)):
                draw.rectangle(det_obj[i]['crop'],width=3)
            # img.show()  # 展示
        return det_obj



# 解压用户上传的zip文件包
from zipfile import ZipFile
def unzip_file(zip_file: ZipFile):
    name_to_info = zip_file.NameToInfo
    for name, info in name_to_info.copy().items():
        real_name = name.encode('cp437').decode('gbk')  # 解决中文乱码问题
        if real_name != name:
            info.filename = real_name
            del name_to_info[name]
            name_to_info[real_name] = info
    return zip_file                


# 链接数据库
class DBConnection(object):
    
    def __init__(self,user,pwd,dbname,tablename,dbtype='mysql',host='localhost'):
        self.host = host
        self.user = user
        self.pwd = pwd
        self.dbname = dbname
        self.tablename = tablename
        self.formheader=[]
        self.dbtype = dbtype
    
    def db_list(self):
        import pymysql
        import pymssql
        sql_my = "show databases;"
        sql_ms = "select name from sysdatabases;"
        sql = sql_my if self.dbtype=='mysql' else sql_ms
        cursor = self.conn()
        cursor.execute(sql)
        res = cursor.fetchall()
        rl = [r[0] for r in res]
        return rl


    def conn(self):
        import pymysql,pymssql
        if self.dbtype == 'mssql': # Sql Server
            port = self.port
            if not self.port:
                port = 1433
            database = pymssql.connect(host=self.host,
                                       port=port,
                                       user=self.user,
                                       password=self.pwd,
                                       charset = 'utf-8',
                                       )
        else: #Mysql 
            database = pymysql.connect(host=self.host,
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