#------------------------------------------------------------------------------------------------------#
#  平台合规得分计算，目前基于自己设计的规则计算合规得分（行业有成熟的技术标准可以参考并加以修改），主要分为四个得分：
#     隐私保护性(privacy_protection)：数据采集、数据委托处理、特殊个人信息的处理、各方主体的权利义务、数据体量、个人敏感数据体量
#     数据安全性(data_security)：制度保障、组织建设、技术能力、数据体量
#     流程规范性(process_specification)：数据采集、数据传输、数据存储、数据销毁、数据使用、数据披露、数据体量
#     数据保密性(data_privacy)：数据存储、数据使用、有关加密存储与安全措施的问题、数据体量
#------------------------------------------------------------------------------------------------------#
from platformapi.models import Project, File, UserInfo, Category, Law, Question, ProjectQuest


def get_scores(project):
    privacy_protection = {'数据采集':0,'数据委托处理':0,'特殊个人信息的处理':0,'各方主体的权利义务':0,'数据体量':0,'个人敏感数据体量':0}
    data_security = {'制度保障':0,'组织建设':0,'技术能力':0,'数据体量':0}
    process_specification = {'数据采集':0,'数据传输':0,'数据存储':0,'数据销毁':0,'数据使用':0,'数据披露':0,'数据体量':0}
    data_privacy = {'数据存储':0,'数据使用':0,'有关加密存储与安全措施的问题':0,'数据体量':0}
    total_score = 0
    score_list = [privacy_protection,data_security,process_specification,data_privacy]

    for i in ProjectQuest.objects.filter(project=project):
        total_score += i.question.score
        if i.answer:
            for score_item in score_list:
                for key,value in score_item.items():
                    if key in i.question.law.primary_classification or key in i.question.law.secondary_classification or key in i.question.law.third_classification:
                        score_item[key] += i.question.score

    for score_item in score_list:
        for key,value in score_item.items():
            if key!='数据体量' and key!='个人敏感数据体量':
                score_item[key] += round(100*score_item[key]/total_score)

    return { 'privacy_protection_score': sum(privacy_protection.values())/len(privacy_protection.values()),
             'data_security_score': sum(data_security.values())/len(data_security.values()),
             'process_specification_score': sum(process_specification.values())/len(process_specification.values()),
             'data_privacy_score': sum(data_privacy.values())/len(data_privacy.values()),
            }