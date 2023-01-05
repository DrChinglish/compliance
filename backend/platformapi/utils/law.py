#-------------------------------------------------------------------------------#
#  平台目前支持的法律：
#     个人信息保护法（personal_protection_law）
#     网络安全法（network_security_law）
#     数据安全法（data_security_law）
#-------------------------------------------------------------------------------#
from platformapi.models import Law, Question
import pandas as pd
import numpy as np


law_list = [
            'personal_protection_law',
            'network_security_law',
            'data_security_law'
]

# 将法条保存到数据库
def save_law_to_database():
    if not Law.objects.all():
            for i in law_list:
                path = 'media/files/platformapi/law/{}.xlsx'.format(i)
                law = pd.read_excel(path, index_col=None, header=0)
                law.fillna(value = '', inplace=True)
                for item in law.values:
                    new_law = Law(law_article= i, serial_number=item[0],law_term=item[1],
                                    primary_classification=item[3],secondary_classification=item[4],
                                    third_classification=item[5])
                    new_law.save()

# 将问卷保存到数据库
def save_question_to_database():
    if not Question.objects.all():
        for i in law_list:
            path = 'media/files/platformapi/law/{}_question.xlsx'.format(i)
            question = pd.read_excel(path, index_col=None, header=0)
            question.fillna(value = '', inplace=True)
            for item in question.values:
                law = Law.objects.filter(law_article=i, serial_number=item[0])[0]
                new_question = Question(serial_number=item[0],question=item[1],
                                suggestion=item[2],score=item[3],
                                law=law)
                new_question.save()