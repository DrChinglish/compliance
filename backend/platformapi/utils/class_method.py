from .util import *
from .repattern import *
import numpy as np
from pathlib import Path
from PIL import Image
from paddleocr import PaddleOCR


# 数据处理
class DataProcess(object):
    def __init__(self):
        self.txts = []  # 文本内容
        self.string = ''
        self.boxes = [] # 图片中文字边框
        self.file_type = None
        self.image = None
        self.speech = None
        self.sensitive_information = {'specified_identity':{'passport':[],'IDNumber':[],'officer':[],'HM_pass':[],'carnum':[]},
                                      'bioinformation':{'face':[],'fingerprint':[],'iris':[],'Eye_pattern':[]},
                                      'financial_account':{'debit':[],'fund_account':[],'Alipay_account':[]},
                                      'healthcare':{'birth_information':[],'hospital_records':[]},
                                      'track':{'Latitude_longitude':[],'position':[]},
                                      'juveniles_information':{'juveniles':[]},
                                      'authentication_information':{'password':[],'auth_code':[]},
                                      'other':{'sex':[],'nation':[]},
                                     } 
       
    def init_para(self, path):
        file_path = Path(path)
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
