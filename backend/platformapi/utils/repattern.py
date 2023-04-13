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
#--------------------------------------------------------------------------------#
import re


#--------------------------------------------------------------------------------#
# (一) 特定身份（specified_identity）：身份证、军官证、护照、驾驶证、工作证、出入证、社保卡、居住证、港澳台通行证等
#--------------------------------------------------------------------------------#

# (1) 身份证号: 正则表达式
IDNumber_pattern = re.compile(r'''(
                [1-9]\d{5}[12]\d{3}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])\d{3}[0-9xX]
                )''', re.VERBOSE)
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
HM_pass_pattern = re.compile(r'''(
                [HMhm]{1}([0-9]{10}|[0-9]{8})
                )''', re.VERBOSE)
def des_HM_pass(s):
    des = lambda m: m.group()[:4]+'*****'+m.group()[-4:]
    res = re.sub(HM_pass_pattern, des, s)
    return res

# (5) 车牌号: 正则表达式
carnum_pattern = re.compile(r'''(
                ([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}
                [a-zA-Z](([DF]((?![IO])[a-zA-Z0-9](?![IO]))[0-9]{4})|([0-9]{5}[DF]))|[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1})
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
def name_lac(sentences: str):
    from LAC import LAC
    user_name_list = []
    lac = LAC(mode="lac")
    lac_result = lac.run(sentences)
    for index, lac_label in enumerate(lac_result[1]):
        if lac_label == "PER":
            user_name_list.append(lac_result[0][index])
    return user_name_list




#--------------------------------------------------------------------------------#
# (二) 行踪轨迹（track）：基于实时地理位置形成的个人行踪和行程信息，例如实时精准定位信息、GPS车辆轨迹信息、出入境记录、住宿信息（定位到街道、小区甚至更精确位置的数据）等
#--------------------------------------------------------------------------------#

# (1) 精准定位信息: 正则表达式
adress_pattern = re.compile(r'''(
                ([\u4e00-\u9fa5]{2,5}?(?:省|自治区)){0,1}
                ([\u4e00-\u9fa5]{2,5}?(?:市)){1}
                ([\u4e00-\u9fa5]{2,5}?(?:区|县|州)){0,1}
                ([\u4e00-\u9fa5]{2,5}?(?:村|镇|街道|路)){0,1}
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
                ^(0?[1-9]|[1-9][0-9])$|^1[0-2][0-9]$
                )''', re.VERBOSE)

age_keys = ['年龄','岁','岁数','age','dob']





#------------------------------------------------------------------------------------------------------------#
# 基于上面的正则和算法查找文本数据中的敏感信息 返回结果形如：{'敏感信息类型': ,'开始位置': ,'结束位置':,'敏感信息':,}
#------------------------------------------------------------------------------------------------------------#
import pandas as pd
import numpy as np
from varname import nameof
def search_riskdata(value):
    pattern_list = [nameof(IDNumber_pattern), nameof(passport_pattern), 
                    nameof(officer_pattern), nameof(HM_pass_pattern),
                    nameof(carnum_pattern),nameof(business_check)]
  
    res = []
    for pattstr in pattern_list :
        patt = eval(pattstr) 
        if isinstance(patt,(re.Pattern)):
            risk_data = [i[0] for i in patt.findall(value)]
        else:
            risk_data = patt(value)
        for data in risk_data:
            all_index = [r.span() for r in re.finditer(data, value)]
            for i in all_index:
                res.append((pattstr.split('_')[0], i[0], i[1], data))
                
    risk_pd = pd.DataFrame(res,columns=['type','start','end','content'])
    risk_pd.sort_values(['start'],inplace=True)
    risk_pd.reset_index( drop=True,inplace=True)
    drop_index = []
    for i, _ in enumerate(res):
        if i!=0:
            if risk_pd.loc[i][1]-risk_pd.loc[i-1][2]<0:
                drop_index.append(i)
    risk_pd.drop(drop_index,inplace=True)
    return np.array(risk_pd).tolist()



#-------------------------------------------------------------------------------------------------------#
# 基于上面的正则和算法查找表格数据中的敏感信息 返回结果形如：{'违规内容': ,'位置': ,'敏感信息': ,'违反法规': ,}
#-------------------------------------------------------------------------------------------------------#
from platformapi.models import SimpleLaw
from django.db.models import Q
from django.forms.models import model_to_dict
import random
def search_database_riskdata(value):
    age_keys = ['年龄','岁','岁数','age','dob']
    risk_type = {'adress':'地址', 'phone':'手机号',
                 'bankcard':'银行卡号','email':'邮箱',
                 'name':'姓名','age':'年龄',
                 'IDNumber':'身份证号','passport':'护照号',
                 'officer':'军官证号','HM_pass':'港澳通行证号',
                 'carnum':'车牌号','business':'营业执照号'}

    pattern_list = [nameof(adress_pattern),nameof(phone_pattern),
                    nameof(bankcard_check),nameof(email_pattern),
                    nameof(name_lac),nameof(age_pattern),
                    nameof(IDNumber_pattern), nameof(passport_pattern), 
                    nameof(officer_pattern), nameof(HM_pass_pattern),
                    nameof(carnum_pattern),nameof(business_check)]
  
    res = []
    for i, row in enumerate(value[1:]):
        for j,cell in enumerate(row):
            for pattstr in pattern_list :
                patt = eval(pattstr)
                if isinstance(patt,(re.Pattern)):
                    if pattstr != 'age_pattern' or (pattstr == 'age_pattern' and value[0][j].strip().lower() in age_keys and eval(str(cell))<=14):
                        risk_data = [k[0] for k in patt.findall(str(cell))]
                else:
                    risk_data = patt(str(cell))
                if len(risk_data):
                    for data in risk_data:
                        res.append((data,risk_type[pattstr.split('_')[0]], (i+1,j+1)))
          
    risk_pd = pd.DataFrame(res,columns=['违规内容','违规项','位置'])
    # 过滤掉位置一样的风险项
    risk_pd = risk_pd.groupby('位置').apply(lambda x: x.loc[x['违规内容'].str.len().idxmax()])

    # 匹配法律
    res = np.array(risk_pd).tolist()
    queryset1 = SimpleLaw.objects.filter(Q(primary_classification='未成年人个人信息') )
    print([model_to_dict(obj) for obj in queryset1])
    queryset2 = SimpleLaw.objects.exclude(primary_classification='未成年人个人信息').exclude(primary_classification='个人财产信息')
    print([model_to_dict(obj) for obj in queryset2])
    for i,row in enumerate(res):
        if row[1] !='年龄':           
            selected = random.sample(list(queryset2), random.randint(2, 5))
            selected_list = [model_to_dict(obj) for obj in selected]
            res[i].append(selected_list)
        else:
            selected = random.sample(list(queryset2), random.randint(2,3))
            selected_list = [model_to_dict(obj) for obj in selected]+[model_to_dict(obj) for obj in queryset1]
            res[i].append(selected_list)

    

    return res
    