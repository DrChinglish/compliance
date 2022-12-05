from .util import re_pattern
from PIL import Image
import numpy as np


# 1.图片处理
class ImageProcess(object):
    def __init__(self):
        self.txts = []  # 图片中文字
        self.boxes = []  # 图片中文字对应框四点坐标
        self.image = None
        self.level = []  # 风险数据位置设置为风险颜色RGB,其他位置为None,形如[None,None,None,(255,193,7),None,(236, 58, 58),None,None,None,None]
        self.risk_word = {}  # 风险数据文本
        self.bounds_list = []  # 将boxes转化成两个顶点决定的框
        self.risk = {'high_risk': (236, 58, 58), 'middle_risk': (255, 193, 7), 'low_risk': (147, 186, 84)}
        self.img_array = None
        self.is_high_risk_handled = False
        self.is_middle_risk_handled = False
        self.is_low_risk_handled = False

    def init_para(self, path):
        from paddleocr import PaddleOCR
        from PIL import Image
        import numpy as np
        self.image = Image.open(path).convert('RGB')
        # 调整图片为统一大小，保持比例不变
        base_width = 3360
        w_percent = base_width / float(self.image.size[0])
        h_size = int(float(self.image.size[1]) * float(w_percent))
        self.image = self.image.resize((base_width, h_size), Image.ANTIALIAS)
        # 调用模型处理图片
        ocr = PaddleOCR(use_angle_cls=True, det=True, lang="ch")
        result = ocr.ocr(np.array(self.image), cls=True)

        self.boxes = [line[0] for line in result]
        self.txts = [line[1][0] for line in result]
        self.level = [None] * len(self.txts)
        self.img_array = np.array(self.image).astype(int)

        box_array = np.array(self.boxes)
        box_array = box_array[:, ::2, :]
        for i in box_array:
            self.bounds_list.append(list(i.flatten()))

    # 识别图片上的姓名
    def identify_name(self):
        from LAC import LAC
        lac = LAC(mode="lac")
        for index, string_item in enumerate(self.txts):
            _result = lac.run(string_item)
            for _index, _label in enumerate(_result[1]):
                if _label == "PER":
                    self.level[index] = (236, 58, 58)

    # 识别其他风险数据: 邮箱、地址、手机、地址
    def identify_other(self):
        regex_list = [re_pattern('phone'), re_pattern('idnumber'), re_pattern('email'), re_pattern('adress')]
        for index, string_item in enumerate(self.txts):
            for regex_item in regex_list:
                if len(regex_item.findall(string_item)):
                    if regex_item == re_pattern('phone') or regex_item == re_pattern('idnumber'):
                        self.level[index] = (236, 58, 58)  # 高风险
                    elif regex_item == re_pattern('email') or regex_item == re_pattern('adress'):
                        self.level[index] = (255, 193, 7)  # 中风险
                    else:
                        self.level[index] = (147, 186, 84)  # 低风险

    # 将识别到的风险数据，标记不同颜色的框
    def find_risk_data(self):

        for i, bounds in enumerate(self.bounds_list):
            if self.level[i] != None:
                clip = self.image.crop(bounds)
                old_size = clip.size
                new_size = [i + 20 for i in old_size]
                new_clip = Image.new("RGB", new_size, color=self.level[i])
                new_clip.paste(clip, (int((new_size[0] - old_size[0]) / 2), int((new_size[1] - old_size[1]) / 2)))

                diff_list = [-10, -10, 10, 10]
                new_bounds = [int(bounds[i] + diff_list[i]) for i in range(len(bounds))]
                self.image.paste(new_clip, new_bounds)
        self.img_array = np.array(self.image).astype(int)

    # 处理风险数据，并将风险数据框打码，接受一个参数，'high_risk' 'middle_risk' 'low_risk'其中一个，表示处理那个风险等级的数据
    def process_risk_data(self, risk):
        quantity_of_high_level = [i for i in self.level if i == self.risk[risk]]
        if quantity_of_high_level != 0:
            pixel = 25
            for index, i in enumerate(self.boxes):
                if self.level[index] == self.risk[risk]:
                    for x in range(int(i[0][1]), int(i[2][1]) - 20, pixel):
                        for y in range(int(i[0][0]), int(i[2][0]) - 20, pixel):
                            self.img_array[x:x + pixel, y:y + pixel] = self.img_array[x +
                                                                                      (pixel // 2)][y + (pixel // 2)]
            self.image = Image.fromarray(self.img_array.astype("uint8"))


# 2.文本处理

# 3.语音处理
# 处理语音数据
class SpeechProcess(object):
    def __init__(self):
        self.txts = ""  # 语音转化的文字
        self.speech = None
        self.process_result = {}  #
        self.keyword_time = {}  # 敏感词所时间

    def init_para(self, path):
        from paddlespeech.cli.asr.infer import ASRExecutor
        from paddlespeech.cli.text.infer import TextExecutor

        asr = ASRExecutor()
        self.re_sample(path)
        result = asr(audio_file=path)

        text_punc = TextExecutor()
        result = text_punc(text=result)
        self.txts = result

    # 将音频的采样率改成16000,方便模型调用
    def re_sample(self, path):
        import librosa
        import soundfile as sf
        import numpy as np
        src_sig, sr = sf.read(path)  # path是要 输入的wav 返回 src_sig:音频数据  sr:原采样频率
        src_sig = src_sig.T
        dst_sig = librosa.resample(np.asarray(src_sig), sr, 16_000)  # resample 入参三个 音频数据 原采样频率 和目标采样频率
        dst_sig = dst_sig.T
        sf.write(path, dst_sig, 16_000)  # 写出数据  参数三个 ：  目标地址  更改后的音频数据  目标采样数据


# 4.将图片转化成base64
def convert_to_base64(image):
    import io
    import base64
    # if not isinstance(image, Image):
    #     image = Image.open(image).convert('RGB')
    im_io = io.BytesIO()
    image.save(im_io, 'png', quality=70)
    im_io.seek(0)
    im_io_png = base64.b64encode(im_io.getvalue())
    context = im_io_png.decode('UTF-8')
    return context


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
