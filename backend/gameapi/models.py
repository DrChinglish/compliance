from django.db import models
from django.utils import timezone

# Create your models here.



'''任务表'''
class Project(models.Model):

    CATEGORY_CHOICES = (
        ('game','Game'),
        ('table', 'Table'),
        ('text', 'Text'),
        ('speech','Speech'),
        ('image','Image'),
    )


    title = models.CharField(max_length=300, verbose_name='项目名称')
    description = models.TextField(verbose_name='项目描述')
    upload = models.FileField(upload_to='files/project',verbose_name='上传文件')
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES, default='table',verbose_name='项目类别')
   


    def __str__(self):
        return self.title

