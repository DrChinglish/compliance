#-------------------------------------------------------------------------------#
#  根据信通院的标准敏感信息的等级分为以下三大类：
#     高风险（high_risk）：含有未经技术处理的直接标识符，该类数据能够直接关联到唯一自然人，如未经处理的身份证号、护照号、手机号等
#     中风险（middle_risk）：不含直接标识符，但含有准标识符的数据，该类数据不再直接关联到唯一自然人，但在外界的帮助下可以间接关联到自然人，如未经处理的住址、ip地址、年龄等
#     低风险（low_risk）：含有经技术处理的直接标识符数据，但识别概率较低的数据，如身份证号、护照号、手机号中较多位标为*。此外统计信息也是属于低风险，如平均值、方差等
#--------------------------------------------------------------------------------#

high_risk = ['IDNumber','passport','officer','HM_pass','carnum','name','phone','bankcard','restricted']
middle_risk = ['adress','ip','mac','ipv6','age','email']
low_risk =['average','variance','median','mode','std','maxvalue','minvalue','business']

def get_risk_level(value):
    risk_level = 'high'
    if value in high_risk:
        risk_level = 'high'
        return risk_level
    elif value in middle_risk:
        risk_level = 'middle'
        return risk_level
    elif value in low_risk:
        risk_level = 'low'
        return risk_level
    else:
        raise ValueError('Unknown riskdata type: ' + value)