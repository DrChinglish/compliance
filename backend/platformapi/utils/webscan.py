import requests

def get(url,params=None):
    # 下载url对应资源，可能是图片/html等
    res = requests.get(url=url,params=params)
    print(res.text,res.headers,res.cookies.items())
    res_type = get_response_type(res.headers['Content-Type'])
    file_handler={
        'image':download_image,
        'text':resolve_text,
    }
    def unknown_type(type,content=None,format=None):
        print('Unsupported Content-Type: {}'.format(type))
        return None
    handler = file_handler.get(res_type[0][0],unknown_type)
    return handler(content=res.content,format=res_type[0][1],type=res_type[0][0])

def save_as_file(content,path):
    # 将资源保存为文件
    try:
        file = open(path,'wb')
        file.write(content)
        file.close()
        return path
    except:
        print("Error while saving file \"{}\"".format(path))
        return None


def download_image(content,format,type=None):
    # 保存图片
    import uuid
    base = ""
    # base = "media/files/webscan/"
    path = "{0}{1}.{2}".format(base,uuid.uuid4(),format)
    return save_as_file(content,path)

def get_response_type(content_type:str):
    # 分析资源类型
    list = content_type.split(';')
    type = list[0]
    param = list[1:] if len(list)>1 else None
    type_list = type.split('/')
    if len(type_list) != 2:
        print("Unrecognized Content-Type: {}".format(content_type))
    # print(list,type_list)
    return (type_list,param)

def resolve_text(content,format:str,type=None):
    # 解析文本类型资源
    if format.lower() == 'html':
        return resolve_html(content)
    else :
        print("Unsupported format")
        return None

def resolve_html(content):
    # 提取html内文本信息
    from lxml import etree 
    root_elem = etree.HTML(content)
    # xpath_text = "//descendant::text()"
    # xpath_text = "(//p)//text()"
    xpath_text = "(//a | //p | //li | //span | //h1 | //h2 | //h3 | //h4 | //h5 | //h6 | //strong)//text()"
    text_list = root_elem.xpath(xpath_text)
    # print(text_list)
    import re
    patt = re.compile(r"\S+")
    # print(patt.search(" 2 "))
    filtered_list = list(filter(lambda str: patt.search(str)!=None,text_list))
    # print("\n",filtered_list,len(text_list),len(filtered_list))
    return filtered_list

get("https://www.cnblogs.com/hjxiamen/p/17231739.html")


