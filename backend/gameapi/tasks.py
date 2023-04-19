from celery import shared_task,group
from gameapi.models import KeyFrame, File
from .class_method import *
import threading,queue

@shared_task(name='gameapi.process_frame')
def process_frame(frame_id):
    frame = KeyFrame.objects.get(id=frame_id)
    frame.status = 'processing'
    frame.save()
    frame_path = frame.path
    #  开始处理关键帧
    imgfilter = ImageProcess()
    imgfilter.init_para(frame_path)
    imgfilter.process_blood(frame_path)
    res = imgfilter.process_result
    frame.status = 'done'
    frame.result = res
    frame.save()
    res['frame_id'] = frame_id
    return res

@shared_task
def extract_keyframe(video_id):
    video = File.objects.get(id=video_id)
    path = './media/' + str(video.file)
    #清除原来的关键帧
    video.video_keyframes.all().delete()
    #开始抽取关键帧
    vediofilter = VideoProcess()
    vediofilter.extract_frame(path)
    key_frame = zip(vediofilter.frame,vediofilter.frame_time, vediofilter.frame_path)
    #保存关键帧到数据库
    for i,j,k in key_frame:
        new_keyframe = KeyFrame.objects.create()
        new_keyframe.file = video
        new_keyframe.path = k
        new_keyframe.time = j
        new_keyframe.frame = i
        new_keyframe.save()
    video.status = 'ready'
    video.save()



@shared_task
def process_audio(audio_id):
    audio = File.objects.get(id=audio_id)
    audio.status = 'processing'
    audio.save()
    path = './media/' + str(audio.file)
    print('processing...')
    speechfilter = SpeechProcess()
    speechfilter.init_para(path,local=False)
    speechfilter.process_sensitive_word()
    speechfilter.process_english_word()
    res = speechfilter.process_result 
    audio.result = res
    audio.status = 'done'
    audio.save()
    print('done')
    return res

@shared_task
def process_video(video_id):
    video = File.objects.get(id=video_id)
    video.status = 'processing'
    video.save()
    extract_keyframe(video_id)
    video_task = group(process_frame.s(frame.id) for frame in video.video_keyframes.all())()
    video.status = 'processing'
    video.save()
    res = video_task.get()
    if video_task.successful():
        video.status = 'done'
        video.result = res
        video.save()
    else:
        video.status = 'error'
        video.save()
    return res




