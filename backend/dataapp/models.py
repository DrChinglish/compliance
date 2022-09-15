from django.db import models
from django.utils import timezone
from django.urls import reverse

# Create your models here.

'''用户表'''


class User(models.Model):
    gender = (
        ('male', '男'),
        ('female', '女'),
    )

    username = models.CharField(max_length=128, unique=True)
    password = models.CharField(max_length=256)
    email = models.EmailField(unique=True)
    sex = models.CharField(max_length=32, choices=gender, default='男')
    c_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username

    class Meta:
        ordering = ['c_time']



'''任务表（新）'''


class Project(models.Model):
    CATEGORY_CHOICES=(
        ('table','Table'),
        ('text','Text'),
        ('image','Image'),
        ('speech','Speech'),
        ('game','Game'),
    )

    title = models.CharField(max_length=50)
    #author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_posts') # not yet supported
    description = models.TextField()
    #upload = models.FileField(upload_to=get_file_dir)
    #upload = models.FileField(upload_to='files/')
    # For multiple file uploads
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES, default='table')

    #publish = models.DateTimeField(default=timezone.now)
    #created = models.DateTimeField(auto_now_add=True)
    #updated = models.DateTimeField(auto_now=True)

    

    #status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')

'''文件'''
def get_file_dir(instance, filename):
    print(instance)
    return 'project_{0}/{1}'.format(instance.project.title,filename)

class FileUploaded(models.Model):
    project = models.ForeignKey(Project,on_delete=models.CASCADE,related_name='project_files')
    file = models.FileField(upload_to=get_file_dir)

'''任务表'''


class Post(models.Model):
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('published', 'Published'),
    )
    CATEGORY_CHOICES = (
        ('table', 'Table'),
        ('text', 'Text'),
        ('speech','Speech'),
        ('image','Image'),
    )

    title = models.CharField(max_length=300)
    slug = models.SlugField(max_length=300, unique_for_date='publish')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_posts')
    body = models.TextField()
    upload = models.FileField(upload_to='files/')
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES, default='table')

    publish = models.DateTimeField(default=timezone.now)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')

    class Meta:
        ordering = ('-publish',)

    def __str__(self):
        return self.title

    objects = models.Manager()  # The default manager.

    # published = PublishedManager()  # Our custom manager.

    def get_absolute_url(self):
        if self.category=='table':
            return reverse('dataapp:post_detail', args=[self.slug])
        elif self.category=='text':
            return reverse('dataapp:text_detail',args=[self.slug])
        elif self.category=='speech':
            return reverse('dataapp:speech_detail',args=[self.slug])
        else:
            return reverse('dataapp:image_detail',args=[self.slug])
    



'''操作表'''


class Operation(models.Model):
    content = models.CharField(max_length=500)
    task = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='post_operation', null=True)
    quantity = models.IntegerField(null=True)
    created = models.DateTimeField(default=timezone.now)
    high_proportion = models.DecimalField(null=True, max_digits=3, decimal_places=2)
    middle_proportion = models.DecimalField(null=True, max_digits=3, decimal_places=2)
    low_proportion = models.DecimalField(null=True, max_digits=3, decimal_places=2)


    class Meta:
        ordering = ('-created',)

    def __str__(self):
        return self.content
