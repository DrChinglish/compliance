# Generated by Django 4.0.4 on 2022-06-17 17:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dataapp', '0005_operation'),
    ]

    operations = [
        migrations.AlterField(
            model_name='operation',
            name='quantity',
            field=models.IntegerField(null=True),
        ),
    ]