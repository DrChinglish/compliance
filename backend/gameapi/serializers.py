from dataclasses import field
from email.policy import default
from rest_framework import serializers
# 序列化基类

from .models import Project, File


class FileModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = "__all__"
        # field = ["id","file"]


class ProjectModelSerializer(serializers.ModelSerializer):
    project_files = FileModelSerializer(many=True, read_only=True)   
    class Meta:
        model = Project
        # fields = "__all__"
        fields = ["id", "title", "description", "category", "project_files","created","updated","status"]

