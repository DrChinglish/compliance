from rest_framework import serializers
from .models import Project, File, KeyFrame, Tasks, User




class UserModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class FileModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = "__all__"


class ProjectTaskModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tasks
        fields = '__all__'


class KeyFrameModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = KeyFrame
        fields = "__all__"


class ProjectModelSerializer(serializers.ModelSerializer):
    project_files = FileModelSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = ["id", "title", "description", "category", "project_files", "created", "updated", "status"]
