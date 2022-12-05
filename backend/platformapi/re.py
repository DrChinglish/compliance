#-------------------------------------------------------------------------------#
#  敏感数据自动识别并提取， 敏感个人信息分为以下八大类：
#     特定身份（specified_identity）：身份证、军官证、护照、驾驶证、工作证、出入证、社保卡、居住证、港澳台通行证等
#     生物识别信息（bioinformation）：个人基因、指纹、声纹、掌纹、眼纹、耳廓、虹膜、面部识别特征、步态等
#     金融账户（financial_account）：包括但不限于支付账号、银行卡磁道数据、证券账户、基金账户、保险账户、其他财富账户、公积金账户等
#     医疗健康（healthcare）：个人因生病医治等产生的相关记录，如病症、住院志、医嘱单、生育信息、以往病史、诊治情况、家族病史、现病史、传染病史等
#     行踪轨迹（track）：基于实时地理位置形成的个人行踪和行程信息，例如实时精准定位信息、GPS车辆轨迹信息、出入境记录、住宿信息（定位到街道、小区甚至更精确位置的数据）等
#     未成年人个人信息（juveniles_information）：14岁以下（含）未成年人的个人信息
#     身份鉴别信息（authentication_information）：用于验证主体是否具有访问或使用权限的信息，包括但不限于登录密码、支付密码、账户查询密码、交易密码、银行卡有效期、银行卡片验证码（CVN 和 CVN2）、口令、动态口令、口令保护答案、短信验证码、密码提示问题答案、随机令牌等
#     其他敏感个人信息（other）：种族、性取向、婚史、宗教信仰、未公开的违法犯罪记录等
#--------------------------------------------------------------------------------#
import re




# 手机号： 正则表达式
phone_pattern = re.compile(r'''(
               [1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}
                )''', re.VERBOSE)
def check_phone(value):
    return [i[0] for i in phone_pattern.findall(value)]

def phone_des():
    pass



# 邮箱: 正则表达式
email_pattern = re.compile(r'''(
                [a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+ (\.[a-zA-Z]{2,4})
                )''', re.VERBOSE)
def check_email(value):
    return [i[0] for i in email_pattern .findall(value)]



# 身份证号: 正则表达式
phone_pattern = re.compile(r'''(
                [1-9]\d{5}[12]\d{3}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])\d{3}[0-9xX]
                )''', re.VERBOSE)
def check_IDNumber(value):
    return [i[0] for i in phone_pattern.findall(value)]


# 军官证号: 正则表达式
officer_pattern = re.compile(r'''(
                [\u4E00-\u9FA5](字第)([0-9a-zA-Z]{4,8})(号?)
                )''', re.VERBOSE)
def check_officer(value):

    return [i[0] for i in officer_pattern.findall(value)]


# 港澳通行证号: 正则表达式
HM_pass_pattern = re.compile(r'''(
                [HMhm]{1}([0-9]{10}|[0-9]{8})
                )''', re.VERBOSE)
def check_HM_pass(value):
    return [i[0] for i in HM_pass_pattern .findall(value)]



# IP地址： 正则表达式
ip_pattern = re.compile(r'''(
               (?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)
                )''', re.VERBOSE)
def check_ip(value):
    return [i[0] for i in ip_pattern.findall(value)]



# MAC地址: 正则表达式
mac_pattern = re.compile(r'''(
               (?:(?:(?:[a-f0-9A-F]{2}:){5})|(?:(?:[a-f0-9A-F]{2}-){5}))[a-f0-9A-F]{2}
                )''', re.VERBOSE)
def check_mac(value):
    return [i[0] for i in mac_pattern.findall(value)]   



# IPv6地址: 正则表达式
ipv6_pattern = re.compile(r'''(
               \s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*
                )''', re.VERBOSE)
def check_ipv6(value):
    return [i[0] for i in ipv6_pattern.findall(value)] 




# 车牌号: 正则表达式
carnum_pattern = re.compile(r'''(
                ([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}
                [a-zA-Z](([DF]((?![IO])[a-zA-Z0-9](?![IO]))[0-9]{4})|([0-9]{5}[DF]))|[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1})
                )''', re.VERBOSE)
def check_carnum(value):
    return [i[0] for i in carnum_pattern.findall(value)]



# 护照号: 正则表达式
passport_pattern = re.compile(r'''(
                ([a-zA-z]|[0-9]){5,17}
                )''', re.VERBOSE)
def check_passport(value):
    return [i[0] for i in passport_pattern .findall(value)] 



# 营业执照号码: 算法
def check_business(value):
    business_pattern = re.compile(r'((?<!\d)\d{15}(?!\d))', re.VERBOSE)
    business_list = business_pattern.findall(value)
    result = []
    # if re.search(business_pattern, value, re.S):
    for value_item in business_list:
        verify_code = 10
        for index in range(14):
            verify_code = (((verify_code % 11 + int(value_item[index])) % 10 or 10) * 2) % 11
        verify_code = (11 - (verify_code % 10)) % 10
        if str(verify_code) == value_item[-1]:
            result.append(value_item)
        else:
            continue
    