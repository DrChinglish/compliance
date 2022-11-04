import os
from django.core.files.uploadedfile import UploadedFile

def convert_size(text):
    units = ["B", "KB", "MB", "GB", "TB", "PB"]
    size = 1024
    for i in range(len(units)):
        if (text/ size) < 1:
            return "%.2f%s" % (text, units[i])  # 返回值保留小数点后两位
        text = text/ size


def convert_type(name):
    text = ['.txt','.docx','.doc']
    image = ['.jpg','.jpeg','.gif','.png','.svg','.psd','.pcd','.raw','.bmp','.tif']
    table = ['.csv','.xls','.xlsx']
    audio = ['.mp3','.wav','.aac','.wma']
    video = ['.mp4']
    ext = os.path.splitext(name)[1]
    # print(ext)
    if ext in text:
        return 'text'
    if ext in image:
        return 'image'
    if ext in table:
        return 'table'
    if ext in audio:
        return 'audio'
    if ext in video:
        return 'video'
    return 'other'

def filter_metainfo(track_info):
    # 提取需要的信息
    extract_attributes = ['title','performer']
    general_track = track_info['tracks'][0]
    # print(general_track)
    for track in track_info['tracks']:
        if track['track_type'] == 'General':
            general_track = track
    return dict([(key,general_track[key]) for key in extract_attributes])

def generate_video_cover(instance):
    # Generate a video cover
    import subprocess
    videoname = os.path.splitext(instance.file.name)[0]
    coverdir =  os.path.join(os.path.dirname(instance.file.path),'videocovers')
    if not os.path.exists(coverdir):
        os.makedirs(coverdir)
    coverpath = os.path.join (coverdir,'{}.jpg'.format(os.path.splitext(os.path.basename(videoname))[0]))
    
    print(coverpath)
    ffmpeg_cmd = 'ffmpeg -i \"{}\" -ss 1 -f image2 -frames:v 1 \"{}\"'.format(instance.file.path,coverpath)
    print(ffmpeg_cmd)
    ffmpeg_pipe = subprocess.Popen(ffmpeg_cmd,shell=True)
    ffmpeg_pipe.wait()

def calculate_file_hash(file:UploadedFile):
    import hashlib
    md5obj = hashlib.md5()
    for chunk in file.chunks():
        md5obj.update(chunk)
    hash = md5obj.hexdigest()
    return hash
