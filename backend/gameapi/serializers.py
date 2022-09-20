from rest_framework import serializers
# 序列化基类
# serializers.Serializers
# serializers.ModelSerializer
from .models import Project
class ProjectModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = "__all__"
        # fileds = ["id","name"]