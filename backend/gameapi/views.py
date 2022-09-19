from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from .models import Project
from .serializers import ProjectModelSerializer

# Create your views here.


def gameupload(request):
    
    return render(request, 'agameupload.html')




class ProjectModelViewSet(ModelViewSet):  # 万能视图集
    queryset = Project.objects.all()
    serializer_class = ProjectModelSerializer