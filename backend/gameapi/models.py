from email.policy import default
from django.db import models
from django.utils import timezone

# Create your models here.



'''项目表'''
class Project(models.Model):

    CATEGORY_CHOICES = (
        ('game','Game'),
        ('table', 'Table'),
        ('text', 'Text'),
        ('speech','Speech'),
        ('image','Image'),
    )
    STATUS_CHOICES=(
        ('open','Open'),
        ('closed','Closed'),
        ('aborted','Aborted'),
        ('pending','Pending'),
        ('other',"Other")
    )
    title = models.CharField(max_length=300, verbose_name='项目名称')
    description = models.TextField(verbose_name='项目描述')
    # upload = models.FileField(upload_to='files/game_projects',verbose_name='上传文件')
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES, default='table',verbose_name='项目类别')
    publish = models.DateTimeField(default=timezone.now)
    created = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10,choices=STATUS_CHOICES,default='open')
    updated = models.DateTimeField(auto_now=True)
    # DBaddress = models.TextField(null=True,blank=True)
    # DBuser = models.TextField(null=True,blank=True)
    # DBpassword = models.TextField(null=True,blank=True)
    # DBtable = models.TextField(null=True,blank=True)

    def to_dict(self):
        """重写model_to_dict()方法转字典"""
        from datetime import datetime

        opts = self._meta
        data = {}
        for f in opts.concrete_fields:
            value = f.value_from_object(self)
            if isinstance(value, datetime):
                value = value.strftime('%Y-%m-%d %H:%M:%S')
            elif isinstance(f, models.FileField):
                value = value.url if value else None
            data[f.name] = value
        return data

    def __str__(self):
        return self.title



'''文件表'''
def get_file_dir(instance, filename):
    print(instance)
    return 'files/game_projects/project_{0}/{1}'.format(instance.project.title,filename)

class File(models.Model):
    STATUS_CHOICES_FILE=(
        ('uploaded','Uploaded'),
        ('processing','Processing'),
        ('error','Error'),
        ('done','Done')
    )
    project = models.ForeignKey(Project,on_delete=models.CASCADE, related_name='project_files' , verbose_name='所属项目')
    file = models.FileField(upload_to=get_file_dir, verbose_name='上传文件')
    md5 = models.CharField(max_length=30,default='')
    status = models.CharField(max_length=20,choices=STATUS_CHOICES_FILE,default='uploaded')

'''任务表'''
class Tasks(models.Model):
    STATUS_CHOICES_TASK=(
        ('created','Created'),
        ('running','Running'),
        ('success','Success'),
        ('failed','Failed')
    )
    project = models.ForeignKey(Project,on_delete=models.CASCADE,related_name='project_tasks', verbose_name='处理任务')
    files = models.CharField(max_length=1024,default='')
    status = models.CharField(max_length=20,choices=STATUS_CHOICES_TASK,default='created')
