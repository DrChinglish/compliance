from django.db import models
from django.utils import timezone
# from django.urls import reverse


from django.contrib.auth.models import AbstractUser


class UserInfo(AbstractUser):
    """
    用户信息
    """
   
    telephone = models.CharField(max_length=11, null=True, unique=True)
    create_time = models.DateTimeField(verbose_name='创建时间', auto_now_add=True)

    site = models.OneToOneField(to='Site', to_field='id', null=True, on_delete=models.CASCADE)

    def __str__(self):
        return self.username



class Site(models.Model):
    """
    后台站点表
    """
  
    title = models.CharField(verbose_name='标题', max_length=64)
    site_name = models.CharField(verbose_name='站点名称', max_length=64)
    theme = models.CharField(verbose_name='主题', max_length=32)

    def __str__(self):
        return self.title



class Category(models.Model):
    """
    分类表
    """
    CATEGORY_CHOICES = (
        ('hoax', '诈骗'),
        ('intrusion', '入侵'),
        ('network_scanning', '网络扫描'),
        ('misdirected_email', '误发邮件'),
        ('game', '游戏数据'),
        ('text', '文本数据'),
        ('speech', '语音数据'),
        ('image', '图片数据'),
    )

   
    title = models.CharField(verbose_name='分类标题',max_length=32, choices=CATEGORY_CHOICES, default='misdirected_email')
    site = models.ForeignKey(verbose_name='所属站点', to='Site', to_field='id', on_delete=models.CASCADE)

    def __str__(self):
        return self.title


class Tag(models.Model):
    """
    标签表
    """
 
    title = models.CharField(verbose_name='标签名称', max_length=32)
    site = models.ForeignKey(verbose_name='所属站点', to='Site', to_field='id', on_delete=models.CASCADE)
  
    def __str__(self):
        return self.title



class Law(models.Model):
    """
    法律表
    """
 
    law_article = models.CharField(verbose_name='所属法律', max_length=50)
    serial_number = models.CharField(verbose_name='条目', max_length=30)
    law_term = models.TextField()
    primary_classification = models.CharField(verbose_name='一级分类', max_length=50)
    secondary_classification = models.CharField(verbose_name='二级分类', max_length=50)
    third_classification = models.CharField(verbose_name='三级分类', max_length=50)
  
    def __str__(self):
        return self.law_term


class SimpleLaw(models.Model):
    """
    demo临时使用法律表（刘宁整理16条法律）
    """
 
    law_article = models.CharField(verbose_name='所属法律', max_length=50)
    serial_number = models.CharField(verbose_name='条目', max_length=30)
    law_term = models.TextField()
    primary_classification = models.CharField(verbose_name='一级分类', max_length=50)
    secondary_classification = models.CharField(verbose_name='二级分类', max_length=50)
 
    def __str__(self):
        return self.law_term


class Question(models.Model):
    """
    问卷建议表
    """

    serial_number = models.CharField(verbose_name='条目', max_length=30)
    question = models.TextField()
    suggestion = models.TextField()
    score = models.IntegerField(default=0)

    law = models.ForeignKey(verbose_name='所属法律条目', to='Law', to_field='id', on_delete=models.CASCADE)

    def __str__(self):
        return self.question



class Project(models.Model):
    '''
    项目表
    '''
    STATUS_CHOICES = (
        ('open', 'Open'),
        ('closed', 'Closed'),
        ('new', 'New'),
        ('complete', 'Complete'),
        ('aborted', 'Aborted'),
        ('pending', 'Pending'),
        ('other', "Other")
    )
    CATEGORY_CHOICES = (
        ('hoax', '诈骗'),
        ('intrusion', '入侵'),
        ('network_scanning', '网络扫描'),
        ('misdirected_email', '误发邮件'),
        ('game', '游戏数据'),
        ('text', '文本数据'),
        ('speech', '语音数据'),
        ('image', '图片数据'),
    )

  
    title = models.CharField(max_length=300)
    description = models.TextField()
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='new')
    personal_protection_law = models.BooleanField(default=True)
    network_security_law = models.BooleanField(default=False)
    data_security_law = models.BooleanField(default=False)
   
    # user = models.ForeignKey(verbose_name='创建者', to='UserInfo', to_field='id', on_delete=models.CASCADE)
    # category = models.ForeignKey(to='Category', to_field='id', null=True, on_delete=models.CASCADE)
    category = models.CharField(max_length=64, choices=CATEGORY_CHOICES, default='misdirected_email')
    tags = models.ManyToManyField(
        to="Tag",
        through='Project2Tag',
        through_fields=('project', 'tag'),
    )


    def __str__(self):
        return self.title


class Project2Tag(models.Model):
   
    project = models.ForeignKey(verbose_name='项目', to="Project", to_field='id', on_delete=models.CASCADE)
    tag = models.ForeignKey(verbose_name='标签', to="Tag", to_field='id', on_delete=models.CASCADE)

    class Meta:
        unique_together = [
            ('project', 'tag'),
        ]

    def __str__(self):
        v = self.article.title + "---" + self.tag.title
        return v



'''文件表'''
def get_file_dir(instance, filename):

    return 'files/platformapi/project_files/project_{0}/{1}'.format(instance.project.title, filename)

class File(models.Model):
    STATUS_CHOICES_FILE = (
        ('uploaded', 'Uploaded'),
        ('processing', 'Processing'),
        ('error', 'Error'),
        ('done', 'Done')
    )
  
    file = models.FileField(upload_to=get_file_dir, verbose_name='上传文件')
    md5 = models.CharField(max_length=30, default='')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES_FILE, default='uploaded')

    project = models.ForeignKey(verbose_name='所属项目', to='Project', to_field='id', related_name='project_files',on_delete=models.CASCADE)



class ProjectQuest(models.Model):
    '''
    项目问卷
    '''
    answer = models.BooleanField(default=False)
  
    project = models.ForeignKey(verbose_name='所属项目', to='Project', to_field='id', on_delete=models.CASCADE)
    question = models.ForeignKey(verbose_name='问题', to='Question', to_field='id', on_delete=models.CASCADE)

    


'''任务表'''
class Tasks(models.Model):
    STATUS_CHOICES_TASK = (
        ('created', 'Created'),
        ('running', 'Running'),
        ('success', 'Success'),
        ('failed', 'Failed')
    )
   
    files = models.JSONField(default=dict)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES_TASK, default='created')

    project = models.ForeignKey(verbose_name='所属项目', to='Project', to_field='id', on_delete=models.CASCADE)






'''敏感数据表'''
class RiskData(models.Model):
    TYPE_CHOICES = (
        ('specified_identity', '特定身份'),
        ('bioinformation', '生物识别信息'),
        ('financial_account', '金融账户;'),
        ('healthcare', '医疗健康'),
        ('track ', '行踪轨迹 '),
        ('authentication_information', '身份鉴别信息'),
        ('juveniles_information', '未成年人个人信息'),
        ('other', '其他敏感信息'),
    )
 
    content = models.CharField(max_length=400)
    type = models.CharField(max_length=100, choices=TYPE_CHOICES, default='specified_identity')

    project = models.ForeignKey(verbose_name='所属项目', to='Project', to_field='id', on_delete=models.CASCADE)
    file = models.ForeignKey(verbose_name='所属项目', to='File', to_field='id', on_delete=models.CASCADE)




'''视频关键帧表'''
class KeyFrame(models.Model):
  
    path = models.CharField(max_length=40)
    time = models.CharField(max_length=20, default='')
    frame = models.IntegerField(null=True)

    file = models.ForeignKey(verbose_name='所属项目', to='File', to_field='id', on_delete=models.CASCADE)

