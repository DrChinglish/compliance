from rest_framework import serializers
from .models import Project, File, Tasks, UserInfo, Category, ProjectQuest,Question




class UserModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInfo
        fields = "__all__"


class QuestionModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = "__all__"


class ProjectQuestModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectQuest
        fields = "__all__"

class CategoryModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"

class FileModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = "__all__"


class ProjectTaskModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tasks
        fields = '__all__'



class ProjectModelSerializer(serializers.ModelSerializer):
    project_files = FileModelSerializer(many=True, read_only=True)

    class Meta:
        model = Project           
        fields = ["id", "title", "description", "category", "personal_protection_law",  "network_security_law", "data_security_law",
                  "tags", "project_files", "created", "updated", "status"]
