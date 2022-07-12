# Generated by Django 4.0.4 on 2022-06-07 00:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dataapp', '0003_post_author'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='slug',
            field=models.SlugField(default='', max_length=300, unique_for_date='publish'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='post',
            name='title',
            field=models.CharField(max_length=300),
        ),
    ]
