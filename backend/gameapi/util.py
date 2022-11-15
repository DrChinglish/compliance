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
    audio = ['.mp3','.wav','.aac','.wma','m4a']
    video = ['.mp4','.m4v','.avi']

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
    # print(track_info)
    extract_attributes = ['title','performer']
    general_track = track_info['tracks'][0]
    if 'title' not in general_track.keys():
        extract_attributes[0]='file_name'
    if 'performer' not in general_track.keys():
        extract_attributes.pop()
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


def get_file_info(f):
    # print(f.file.url,f.file.path)
    # f.file.url: /media/files/game_projects/project_all%20here/20210116210455445.png
    # f.file.path: D:\GIT\compliance\backend\media\files\game_projects\project_all here\20210116210455445.png
    type = convert_type(f.file.name)
    extname = os.path.split(f.file.name)[1]
    purename = os.path.splitext(extname)[0]
    extracontent={}
    # print(type,extname)
    if type in ['video','audio']:
        from pymediainfo import MediaInfo
        from .util import filter_metainfo
        track_info = MediaInfo.parse(f.file.path).to_data()
        extracontent['info'] = filter_metainfo(track_info)
        # extracontent['tracks'] = MediaInfo.parse(f.file.path).to_data()
        if os.path.splitext(extname)[1] == '.mp3':
            from mutagen import File
            import base64
            audiofile = File(f.file.path)
            # print('path '+f.file.path+' {}'.format('exist'if os.path.exists(f.file.path)else 'non'))
            # print('audio file {0} is {1}'.format(f.file.name,'none'if audiofile==None else 'fine'))
            if audiofile.tags:
                audiodata = audiofile.tags['APIC:'].data
                b64img = base64.b64encode(audiodata)
                extracontent['coverimg'] = b64img
                # print(f.file.path+'ok')
        if type == 'video':
            basepath = os.path.dirname(f.file.url)
            coverpath = os.path.join(basepath,'videocovers','{}.jpg'.format(purename))
            # It would be something like
            # /media/files/game_projects/project_video%20test\\videocovers\\浙江大学文琴合唱团_-_浙大校歌.jpg
            # But the requests worked fine in the tests so far...
            extracontent['coverurl'] = coverpath
    return {
            'id':f.id,
            'name':extname,
            'size':convert_size(f.file.size),
            'type':type,
            'ext':os.path.splitext(f.file.name)[1],
            'url':f.file.url,
            'status':f.status,
            'content':extracontent
        }