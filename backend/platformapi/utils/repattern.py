#-------------------------------------------------------------------------------#
#  使用正则或算法实现敏感数据自动识别并提取， 敏感个人信息分为以下八大类：
#     特定身份（specified_identity）：身份证、军官证、护照、驾驶证、工作证、出入证、社保卡、居住证、港澳台通行证等
#     行踪轨迹（track）：基于实时地理位置形成的个人行踪和行程信息，例如实时精准定位信息、GPS车辆轨迹信息、出入境记录、住宿信息（定位到街道、小区甚至更精确位置的数据）等
#     金融账户（financial_account）：包括但不限于支付账号、银行卡磁道数据、证券账户、基金账户、保险账户、其他财富账户、公积金账户等
#     电子设备（electronic_equipment）：IMEI、IMSI、MEID、设备 MAC 地址、硬件序列号、ICCID等
#     生物识别信息（bioinformation）：个人基因、指纹、声纹、掌纹、眼纹、耳廓、虹膜、面部识别特征、步态等
#     医疗健康（healthcare）：个人因生病医治等产生的相关记录，如病症、住院志、医嘱单、生育信息、以往病史、诊治情况、家族病史、现病史、传染病史等
#     未成年人个人信息（juveniles_information）：14岁以下（含）未成年人的个人信息
#     身份鉴别信息（authentication_information）：用于验证主体是否具有访问或使用权限的信息，包括但不限于登录密码、支付密码、账户查询密码、交易密码、银行卡有效期、银行卡片验证码（CVN 和 CVN2）、口令、动态口令、口令保护答案、短信验证码、密码提示问题答案、随机令牌等
#     其他敏感个人信息（other）：年龄、种族、性取向、婚史、宗教信仰、未公开的违法犯罪记录等
#     统计信息（statistics_information）：均值、方差、标准差、最大值、最小值等
#--------------------------------------------------------------------------------#
import re




#--------------------------------------------------------------------------------#
# (一) 特定身份（specified_identity）：身份证、军官证、护照、驾驶证、工作证、出入证、社保卡、居住证、港澳台通行证等
#--------------------------------------------------------------------------------#

# (1) 身份证号: 正则表达式
# IDNumber_pattern = re.compile(r'''(
#                 [1-9]\d{5}[12]\d{3}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])\d{3}[0-9xX]
#                 )''', re.VERBOSE)

# 身份证号码格式： AABBCCYYYYMMDDXXXR
# 参考 GB/T 2260-2002、GB11643-1999
IDNumber_pattern = re.compile(r'''(
                            (1[1-5]|2[1-3]|3[1-7]|4[1-6]|5[0-4]|6[1-5]|71|8[1-2]) # 省级行政区 AA
                            (0[1-9]|[1-9][0-9]) # 市级行政区 BB
                            (0[1-9]|[1-9][0-9]) # 县级行政区 CC
                            (1[89]\d{2}|20[012]\d{1}) # 出生年份 YYYY 仅认为1800-2029年份为合法
                            (0[1-9]|1[012]) # 出生月份 MM
                            (0[1-9]|[12][0-9]|3[01]) #出生日 DD
                            \d{3}[0-9xX] #顺序码与校验码 XXXR
                )''', re.VERBOSE)

def calc_last_digit(data):
    factors = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
    digit_sum = sum(map(lambda digit,fac:eval(digit)*fac,data,factors))
    digit_map = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']

    return digit_map[digit_sum%11]

def des_IDNumber(s):
    des = lambda m: m.group()[:4]+'********'+m.group()[-4:]
    res = re.sub(IDNumber_pattern, des, s)
    return res

# (2) 护照号: 正则表达式
passport_pattern = re.compile(r'''(
                1[45][0-9]{7}|([P|p|S|s]\d{7})|([S|s|G|g]\d{8})|([Gg|Tt|Ss|Ll|Qq|Dd|Aa|Ff]\d{8})|([H|h|M|m]\d{8，10})
                )''', re.VERBOSE)
def des_passport(s):
    des = lambda m: m.group()[:2]+'*****'+m.group()[-2:]
    res = re.sub(passport_pattern, des, s)
    return res
    

# (3) 军官证号: 正则表达式
officer_pattern = re.compile(r'''(
                [\u4E00-\u9FA5](字第)([0-9a-zA-Z]{4,8})(号?)
                )''', re.VERBOSE)
def des_officer(s):
    des = lambda m: m.group()[:3]+'*****'+m.group()[-3:]
    res = re.sub(officer_pattern, des, s)
    return res

# (4) 港澳通行证号: 正则表达式
HMpass_pattern = re.compile(r'''(
                ([HMhm]){1}([0-9]{10}|[0-9]{8})
                )''', re.VERBOSE)
def des_HMpass(s):
    des = lambda m: m.group()[:4]+'*****'+m.group()[-4:]
    res = re.sub(HMpass_pattern, des, s)
    return res

# (5) 车牌号: 正则表达式
carnum_pattern = re.compile(r'''(
    ([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼]){1}([·]){0,1}([A-HJ-NP-Z]){1}([°|·]){0,1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}
    )''', re.VERBOSE)
def des_carnum(s):
    des = lambda m: m.group()[:3]+'*****'+m.group()[-3:]
    res = re.sub(carnum_pattern, des, s)
    return res

# (6) 营业执照号码: 算法
def business_check(value):
    business_pattern = re.compile(r'''(
                (?<!\d)\d{15}(?!\d)
                )''', re.VERBOSE)
    business_list = [i for i in business_pattern.findall(value)]
    result = []
    if len(business_list) != 0:
        for value_item in business_list:
            verify_code = 10
            for index in range(14):
                verify_code = (((verify_code % 11 + int(value_item[index])) % 10 or 10) * 2) % 11
            verify_code = (11 - (verify_code % 10)) % 10
            if str(verify_code) == value_item[-1]:
                result.append(value_item)
            else:
                continue
    return result

def des_business(s):
    des = lambda m: m.group()[:3]+'*****'+m.group()[-3:]
    res = s
    for i in business_check(s):
        res = re.s
        

# (6) 中文姓名: 算法
def is_all_chinese(str):
    '''
    判断字符串是否只有汉字
    '''
    pattern = re.compile('^[\u4e00-\u9fa5]+$')
    result = pattern.match(str)
    if result:
        return True
    else:
        return False

def name_lac(sentences: str):
    from LAC import LAC
    user_name_list = []
    lac = LAC(mode="lac")
    lac_result = lac.run(sentences)
    for index, lac_label in enumerate(lac_result[1]):
        if lac_label == "PER":
            if is_all_chinese(lac_result[0][index]) and len(lac_result[0][index])>1:
                user_name_list.append(lac_result[0][index])
    return user_name_list




#--------------------------------------------------------------------------------#
# (二) 行踪轨迹（track）：基于实时地理位置形成的个人行踪和行程信息，例如实时精准定位信息、GPS车辆轨迹信息、出入境记录、住宿信息（定位到街道、小区甚至更精确位置的数据）等
#--------------------------------------------------------------------------------#

# (1) 精准定位信息: 正则表达式
adress_pattern = re.compile(r'''(
                ([\u4e00-\u9fa5]{2,5}?(?:省|自治区)){0,1}
                ([\u4e00-\u9fa5]{2,5}?(?:市)){1}
                ([\u4e00-\u9fa5]{2,5}?(?:区|县|州)){1}
                ([\u4e00-\u9fa5]{2,6}?(?:村|镇|街道|路)){1}
                ([\d]{1,5}(?:号)){0,1}
                ([\u4e00-\u9fa5]{2,10}?(?:小区|社区|百货|大厦|厦|园|苑|院|大学|公寓|畔|场|村)){0,1}
                ([\u4e00-\u9fa5]{1,8}?(?:区)){0,1}
                ([\d]{1,3}(?:号楼|幢|楼)){0,1}
                ([\d]{1,3}(?:单元)){0,1}
                ([\d]{1,5}(?:室){0,1}){0,1}
                )''', re.VERBOSE)

# (2) 经纬度信息: 正则表达式
gps_pattern = re.compile(r'''(
                ([-+]?\d+(\.\d+)?),\s*([-+]?\d+(\.\d+)?)
                )''', re.VERBOSE)


#--------------------------------------------------------------------------------#
# (三) 金融账户（financial_account）：包括但不限于支付账号、银行卡磁道数据、证券账户、基金账户、保险账户、其他财富账户、公积金账户等
#--------------------------------------------------------------------------------#

# (1) 手机号: 正则表达式
phone_pattern = re.compile(r'''(
               [1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}
                )''', re.VERBOSE)
def des_phone(s):
    des = lambda m: m.group()[:3]+'*****'+m.group()[-3:]
    res = re.sub(phone_pattern, des, s)
    return res

# (2) 邮箱: 正则表达式
email_pattern = re.compile(r'''(
                [a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+ (\.[a-zA-Z]{2,4})
                )''', re.VERBOSE)
def des_email(s):
    des = lambda m: m.group().split('@')[0][:2]+'*****'+m.group().split('@')[0][-2:]+'@'+'***.'+m.group().split('@')[1].split('.')[1]
    res = re.sub(email_pattern, des, s)
    return res

# (3) 银行卡号: 算法
def bankcard_check(value):
    bankcard_pattern = re.compile(r'''(
                (?<!\d)\d{16,19}(?!\d)
                )''', re.VERBOSE)
    bankcard_list = [i for i in bankcard_pattern.findall(value)]
    result = []
    for card_num in bankcard_list:
        total = 0
        card_num_length = len(card_num)
        for item in range(1, card_num_length + 1):
            t = int(card_num[card_num_length - item])
            if item % 2 == 0:  # 偶数
                t *= 2
                total += t if t < 10 else t % 10 + t // 10
            else:  # 奇数
                total += t
        if total % 10 == 0:
            result.append(card_num)
    return result

def des_bankcard(s):
    des = lambda m: m.group()[:3]+'**********'+m.group()[-3:]
    res = s
    for i in bankcard_check(s):
        res = re.sub(i, des, s)
    return res



#--------------------------------------------------------------------------------#
# (四) 电子设备（electronic_equipment）：IMEI、IMSI、MEID、设备 MAC 地址、硬件序列号、ICCID等
#--------------------------------------------------------------------------------#

# (1) IP地址： 正则表达式
ip_pattern = re.compile(r'''(
               (?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)
                )''', re.VERBOSE)
def des_ip(s):
    des = lambda m: m.group()[:3]+'*****'+m.group()[-3:]
    res = re.sub(ip_pattern, des, s)
    return res

# (2) MAC地址: 正则表达式
mac_pattern = re.compile(r'''(
               (?:(?:(?:[a-f0-9A-F]{2}:){5})|(?:(?:[a-f0-9A-F]{2}-){5}))[a-f0-9A-F]{2}
                )''', re.VERBOSE)
def des_mac(s):
    des = lambda m: m.group()[:3]+'*****'+m.group()[-3:]
    res = re.sub(mac_pattern, des, s)
    return res   

# (3) IPv6地址: 正则表达式
ipv6_pattern = re.compile(r'''(
               \s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*
                )''', re.VERBOSE)
def des_ipv6(s):
    des = lambda m: m.group()[:3]+'*****'+m.group()[-3:]
    res = re.sub(ipv6_pattern, des, s)
    return res


#--------------------------------------------------------------------------------#
# (五) 未成年人个人信息（juveniles_information）：14岁以下（含）未成年人的个人信息
#--------------------------------------------------------------------------------#

# (1) 年龄： 正则表达式（130岁以下）结合关键字（如：年龄、age等）共同判定，然后判断是否小于14岁
age_pattern =  re.compile(r'''(
                (0?[1-9]|[1-9][0-9])$|^1[0-2][0-9]
                )''', re.VERBOSE)

agekey_pattern = re.compile(r'''(
                年龄|岁|岁数|age|dob
                )''', re.VERBOSE)
# ['年龄','岁','岁数','age','dob']


#--------------------------------------------------------------------------------#
# (六) 统计信息（statistics_information）：均值、方差、标准差、最大值、最小值等
#--------------------------------------------------------------------------------#

# (1) 统计信息：正则表达式结合关键字（如均值、方差、标准差等）共同判定
statistics_pattern =  re.compile(r'''(
                        \d+(\.\d+)?
                        )''', re.VERBOSE)

meankey_pattern = re.compile(r'''(
                均值|平均值|mean|average
                )''', re.VERBOSE)
variancekey_pattern = re.compile(r'''(
                方差|variance|var
                )''', re.VERBOSE)
stdkey_pattern = re.compile(r'''(
                标准差|standard deviation|standard_deviation|std
                )''', re.VERBOSE)
variancekey_pattern = re.compile(r'''(
                方差|variance|var
                )''', re.VERBOSE)
mediankey_pattern = re.compile(r'''(
                中位数|median|mid
                )''', re.VERBOSE)
modekey_pattern = re.compile(r'''(
                众数|mode
                )''', re.VERBOSE)


#--------------------------------------------------------------------------------#
# (七) 内部文件（restricted_document）：判定文件是否是内部，用于ocr识别中
#--------------------------------------------------------------------------------#
restdoc_pattern = re.compile(r'''(
                内部文件)''', re.VERBOSE)



#--------------------------------------------------------------------------------#
#  对于数字类型数据的二次验证，过滤在长数字字符串中匹配的情况
#--------------------------------------------------------------------------------#
def validate(value,data_type,start,end):
    risk_type_digits=[
        'phone',
        'banckcard',
        'IDNumber',
        'business',
    ]
    if data_type=='IDNumber' and calc_last_digit(value) != value[end-1].upper():
        return False
    if data_type in risk_type_digits: 
        return (start==0 or not value[start-1].isdigit()) and (end==len(value) or not value[end].isdigit())
    else:
        return True     


#--------------------------------------------------------------------------------#
#  定义风险检测模式列表以及风险类型映射字典
#--------------------------------------------------------------------------------#

# pattern_list = [adress_pattern,phone_pattern,bankcard_check,email_pattern,name_lac,age_pattern,IDNumber_pattern, 
#                 passport_pattern, officer_pattern, HMpass_pattern,carnum_pattern,business_check]

pattern_list = [adress_pattern,phone_pattern,bankcard_check,email_pattern,name_lac,IDNumber_pattern, 
                carnum_pattern,business_check,restdoc_pattern]

# pattern_name = ['adress','phone','bankcard','email','name','age','IDNumber', 'passport', 'officer', 'HMpass','carnum','business']
pattern_name = ['adress','phone','bankcard','email','name','IDNumber','carnum','business','restricted_doc']

# risk_type = {'adress':'地址', 'phone':'手机号','bankcard':'银行卡号','email':'邮箱',
#              'name':'姓名','age':'年龄','IDNumber':'身份证号','passport':'护照号',
#              'officer':'军官证号','HMpass':'港澳通行证号','carnum':'车牌号','business':'营业执照号'}

risk_type = {'adress':'地址', 'phone':'手机号','bankcard':'银行卡号','email':'邮箱',
             'name':'姓名','IDNumber':'身份证号','carnum':'车牌号','business':'营业执照号','restricted':'内部文件'}


#------------------------------------------------------------------------------------------------------------#
# 基于上面的正则和算法查找文本数据中的敏感信息 
#------------------------------------------------------------------------------------------------------------#
from .risk_level import get_risk_level
from platformapi.models import SimpleLaw
from django.db.models import Q
import pandas as pd
import numpy as np
import threading
from platformapi.utils.law import get_law_list



class SearchRiskdata:
    def __init__(self,text):
        self.text = text
        self.ret = []
        self.res = {'overview':{'high':{},'middle':{},'low':{}},'detail':{'high':{},'middle':{},'low':{}}}

    def init_para(self):
        if isinstance(self.text,dict):
            self.text = self.text
        elif isinstance(self.text,str):
            self.text = {'text':self.text}


    def matching_law(self):

        risk_pd = pd.DataFrame(self.ret,columns=['violation_content','violation_item','start','end','url','levle'])
        print('post processing')
        # 分类统计各风险项
        level_group = risk_pd.groupby('levle',as_index=False)['violation_item'].value_counts()
        for level in  self.res['overview'].keys():
            result = level_group.loc[level_group['levle'] == level, ['violation_item', 'count']]
            for i,j in zip(result['violation_item'],result['count']):
                 self.res['overview'][level][i] = j

        law_group = risk_pd.groupby('levle',as_index=False)
        for group in law_group:
            level = group[0]
            group = group[1].sort_values(by='violation_item')
            violation_item = group['violation_item'].unique()
            for item in violation_item:
                law_list = get_law_list(level)
                # law_list = [{k: v for k, v in d.items() if k not in ['id', 'primary_classification','secondary_classification']} for d in law_list]
                content_list =  np.array(group[group['violation_item']==item][['violation_content','url']]).tolist()
                # print(content_list)
                item_content = {'content_list':content_list,'law_list':law_list}
                self.res['detail'][level][item] = item_content
                
        return  self.res

    def miti_process(self):
        self.init_para()
        # 多线程处理
        threads = []
        for key,value in self.text.items():
            print(key)
            thread = threading.Thread(target=self.search_riskdata, args=(value,key))
            threads.append(thread)
            thread.start()

        # 等待所有线程结束
        for thread in threads:
            thread.join()

        return self.matching_law()


    def search_riskdata(self,value,url=None):
        print('prepare to scan------>')
        ret = []
        for patt_index,patt in enumerate(pattern_list) :
            if isinstance(patt,(re.Pattern)):
                re_result = patt.findall(value)
                #   print(re_result)
                risk_data = []
                if len(re_result) > 0:
                    if isinstance(re_result[0],tuple):
                        risk_data = [i[0] for i in re_result]
                    else:
                        risk_data = [i for i in re_result]
            else:
                risk_data = patt(value)
            for data in risk_data:
                patt_name = pattern_name[patt_index]
                all_index = [r.span() for r in re.finditer(data, value)]
                for i in all_index:
                    if validate(value,patt_name,i[0],i[1]):
                        print(f'{patt_name}------>{data}')
                        ret.append((
                                data,
                                risk_type[patt_name.split('_')[0]],
                                i[0], # start index
                                i[1], # end index
                                url,
                                get_risk_level(patt_name.split('_')[0])
                                    ))
                    

        risk_pd = pd.DataFrame(ret,columns=['violation_content','violation_item','start','end','url','levle'])
        risk_pd.sort_values(['start'],inplace=True)
        risk_pd.reset_index( drop=True,inplace=True)
        drop_index = []
        for i, _ in enumerate(ret):
            if i!=0:
                if risk_pd.loc[i][2]-risk_pd.loc[i-1][3]<0:
                    drop_index.append(i)
        risk_pd.drop(drop_index,inplace=True)
        ret = np.array(risk_pd).tolist()

        self.ret += ret
                    
    



#-------------------------------------------------------------------------------------------------------#
# 基于上面的正则和算法查找表格数据中的敏感信息 
#-------------------------------------------------------------------------------------------------------#

def search_database_riskdata(value):
    # 定义结果字典
    res = {'overview':{'high':{},'middle':{},'low':{}},
           'detail':{'high':{},'middle':{},'low':{}}}
    
    # 发现风险项
    print('prepare to scan')
    ret = []
    for i, row in enumerate(value[1:]):
        print('row {0} of {1}'.format(i,len(value)-1))
        for j,cell in enumerate(row):
            for patt_index,patt in enumerate(pattern_list) :
                if isinstance(patt,(re.Pattern)):
                    if pattern_name[patt_index] != 'age_pattern' or (pattern_name[patt_index] == 'age_pattern' and bool(re.search(agekey_pattern, value[0][j].strip().lower()))):
                        risk_data = [k[0] for k in patt.findall(str(cell))]
                else:
                    risk_data = patt(str(cell))
                if len(risk_data):
                    for data in risk_data:
                        if len(data)==len(cell):
                            ret.append((data,
                                    risk_type[pattern_name[patt_index].split('_')[0]], 
                                    (i+1,j+1),
                                    get_risk_level(pattern_name[patt_index].split('_')[0])
                                    ))
                       

    print('post processing')
    # 过滤掉位置一样的风险项  
    risk_pd = pd.DataFrame(ret,columns=['violation_content','violation_item','position','levle'])
    risk_pd = risk_pd.groupby('position').apply(lambda x: x.loc[x['violation_content'].str.len().idxmax()])
    
    # 分类统计各风险项
    level_group = risk_pd.groupby('levle',as_index=False)['violation_item'].value_counts()
    for level in res['overview'].keys():
        result = level_group.loc[level_group['levle'] == level, ['violation_item', 'count']]
        for i,j in zip(result['violation_item'],result['count']):
            res['overview'][level][i] = j


    law_group = risk_pd.groupby('levle',as_index=False)
    for group in law_group:
        level = group[0]
        group = group[1].sort_values(by='violation_item')
        violation_item = group['violation_item'].unique()
        for item in violation_item:
            law_list = get_law_list(level)
            # law_list = [{k: v for k, v in d.items() if k not in ['id', 'primary_classification','secondary_classification']} for d in law_list]
            content_list =  np.array(group[group['violation_item']==item][['violation_content','position']]).tolist()
            print(content_list)
            item_content = {'content_list':content_list,'law_list':law_list}
            res['detail'][level][item] = item_content
            

    return res
    




# def search_riskdata(value):
  
#     res = []
#     # for pattstr in pattern_list :
#     for patt_index,patt in enumerate(pattern_list) :
#         if isinstance(patt,(re.Pattern)):
#             risk_data = [i[0] for i in patt.findall(value)]
#         else:
#             risk_data = patt(value)
#         for data in risk_data:
#             all_index = [r.span() for r in re.finditer(data, value)]
#             for i in all_index:
#                 res.append((pattern_name[patt_index].split('_')[0], i[0], i[1], data))
                
#     risk_pd = pd.DataFrame(res,columns=['type','start','end','content'])
#     risk_pd.sort_values(['start'],inplace=True)
#     risk_pd.reset_index( drop=True,inplace=True)
#     drop_index = []
#     for i, _ in enumerate(res):
#         if i!=0:
#             if risk_pd.loc[i][1]-risk_pd.loc[i-1][2]<0:
#                 drop_index.append(i)
#     risk_pd.drop(drop_index,inplace=True)
#     return np.array(risk_pd).tolist()