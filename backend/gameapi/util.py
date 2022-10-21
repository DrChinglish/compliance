import os


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

    ext = os.path.splitext(name)[1]
    print(ext)
    if ext in text:
        return 'text'
    if ext in image:
        return 'image'
    if ext in table:
        return 'table'
    if ext in audio:
        return 'audio'
    return 'other'