#Dockerfile
FROM python:3.8
ENV PYTHONUNBUFFERED 1
RUN mkdir /dist
WORKDIR /dist
COPY requirements.txt /dist/
RUN python -m pip install --upgrade pip -i https://pypi.tuna.tsinghua.edu.cn/simple
RUN pip config set global.index-url https://mirrors.aliyun.com/pypi/simple
RUN pip config set install.trusted-host mirrors.aliyun.com
RUN pip install setuptools-scm -i https://pypi.tuna.tsinghua.edu.cn/simple
RUN pip install pytest-runner -i https://pypi.tuna.tsinghua.edu.cn/simple
RUN pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
#RUN apt-get update && apt-get install -y opencv-python-headless
RUN apt-get update && apt-get install libgl1 -y
RUN pip install opencv-python-headless -i https://pypi.tuna.tsinghua.edu.cn/simple
RUN python3 -m pip install paddlepaddle==2.4.2 -i https://pypi.tuna.tsinghua.edu.cn/simple
RUN pip install torch==1.12.1 torchvision==0.13.1 torchaudio==0.12.1 -i https://pypi.tuna.tsinghua.edu.cn/simple
COPY . /dist/
EXPOSE 8000
CMD python manage.py runserver 0.0.0.0:8000