from dataclasses import field
from email.policy import default
from rest_framework import serializers
# 序列化基类

from .models import Project, File, KeyFrame, GameAdvice,Tasks


class FileModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = "__all__"


class GameAdviceModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameAdvice
        fields = "__all__"


class KeyFrameModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = KeyFrame
        fields = "__all__"
     

class ProjectTaskModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tasks
        fields = '__all__'


class ProjectModelSerializer(serializers.ModelSerializer):
    project_files = FileModelSerializer(many=True, read_only=True)  
    advice_files = FileModelSerializer(many=True, read_only=True) 
    class Meta:
        model = Project
        # fields = "__all__"
        fields = ["id", "title", "description", "category", "project_files", "advice_files","created","updated","status"]

