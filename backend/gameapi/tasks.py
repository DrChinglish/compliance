from celery import shared_task
from gameapi.models import KeyFrame
from .class_method import *

@shared_task(name='gameapi.process_frame')
def process_frame(frame_id):
    frame = KeyFrame.objects.get(id=frame_id)
    frame_path = frame.path
    #  开始处理关键帧
    imgfilter = ImageProcess()
    imgfilter.init_para(frame_path)
    imgfilter.process_blood(frame_path)
    res = imgfilter.process_result
    return res