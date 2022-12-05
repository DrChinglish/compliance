from django.db import models
from django.utils import timezone
# from django.urls import reverse


'''用户表'''
class User(models.Model):
    username = models.CharField(max_length=128, unique=True)
    password = models.CharField(max_length=256)
    email = models.EmailField(unique=True)
    c_time = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['c_time']

    def __str__(self):
        return self.username


'''项目表'''
class Project(models.Model):
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
        ('hoax', 'Hoax'),
        ('intrusion', 'intrusion'),
        ('network_scanning', 'Network_scanning'),
        ('misdirected_email', 'misdirected_email'),
        ('game', 'Game'),
        ('table', 'Table'),
        ('text', 'Text'),
        ('speech', 'Speech'),
        ('image', 'Image'),
    )

    title = models.CharField(max_length=300)
    # author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_posts')
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_projects')
    discription = models.TextField()
    # upload = models.FileField(upload_to='files/')
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES, default='misdirected_email')
    publish = models.DateTimeField(default=timezone.now)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='new')

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

    class Meta:
        ordering = ('-publish',)

    def __str__(self):
        return self.title




'''文件表'''
def get_file_dir(instance, filename):

    return 'files/game_projects/project_{0}/{1}'.format(instance.project.title, filename)

class File(models.Model):
    STATUS_CHOICES_FILE = (
        ('uploaded', 'Uploaded'),
        ('processing', 'Processing'),
        ('error', 'Error'),
        ('done', 'Done')
    )
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='project_files', verbose_name='所属项目')
    file = models.FileField(upload_to=get_file_dir, verbose_name='上传文件')
    md5 = models.CharField(max_length=30, default='')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES_FILE, default='uploaded')


'''任务表'''
class Tasks(models.Model):
    STATUS_CHOICES_TASK = (
        ('created', 'Created'),
        ('running', 'Running'),
        ('success', 'Success'),
        ('failed', 'Failed')
    )
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='project_tasks', verbose_name='处理任务')
    files = models.JSONField(default=dict)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES_TASK, default='created')


'''敏感数据表'''
class RiskData(models.Model):
    TYPE_CHOICES = (
        ('specified_identity', 'Specified_identity'),
        ('bioinformation', 'Bioinformation'),
        ('financial_account', 'Financial_account;'),
        ('healthcare', 'Healthcare'),
        ('track ', 'Track '),
        ('authentication_information', 'Authentication_information'),
        ('juveniles_information', 'Juveniles_information'),
        ('other', 'Other'),
    )


    content = models.CharField(max_length=40)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='specified_identity')
    project = models.FileField(Project, on_delete=models.CASCADE, related_name='project_risks', verbose_name='所属项目')
    file = models.FileField(File, on_delete=models.CASCADE,  related_name='file_risks',verbose_name='所属文件')



'''视频关键帧表'''
class KeyFrame(models.Model):
    file = models.ForeignKey(File, on_delete=models.CASCADE, related_name='video_keyframes', verbose_name='所属文件')
    path = models.CharField(max_length=40)
    time = models.CharField(max_length=20, default='')
    frame = models.IntegerField(null=True)


'''操作表'''
class Operation(models.Model):
    content = models.CharField(max_length=500)
    task = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='post_operation')
    quantity = models.IntegerField(null=True)
    created = models.DateTimeField(default=timezone.now)
    high_proportion = models.DecimalField(null=True, max_digits=3, decimal_places=2)
    middle_proportion = models.DecimalField(null=True, max_digits=3, decimal_places=2)
    low_proportion = models.DecimalField(null=True, max_digits=3, decimal_places=2)

    class Meta:
        ordering = ('-created',)

    def __str__(self):
        return self.content
