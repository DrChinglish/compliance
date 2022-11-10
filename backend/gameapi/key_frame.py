import enum
from pathlib import Path
import cv2
import operator # 内置操作符函数接口（后面排序用到）
import numpy as np
import matplotlib.pyplot as plt
import os
import pdb
from scipy.signal import argrelextrema # 极值点


def smooth(x, window_len=13, window='hanning'):
    """使用具有所需大小的窗口使数据平滑。
    
    This method is based on the convolution of a scaled window with the signal.
    The signal is prepared by introducing reflected copies of the signal 
    (with the window size) in both ends so that transient parts are minimized
    in the begining and end part of the output signal.
    该方法是基于一个标度窗口与信号的卷积。
    通过在两端引入信号的反射副本(具有窗口大小)来准备信号，
    使得在输出信号的开始和结束部分中将瞬态部分最小化。
    input:
        x: the input signal输入信号 
        window_len: the dimension of the smoothing window平滑窗口的尺寸
        window: the type of window from 'flat', 'hanning', 'hamming', 'bartlett', 'blackman'
            flat window will produce a moving average smoothing.
            平坦的窗口将产生移动平均平滑
    output:
        the smoothed signal平滑信号
        
    example:
    import numpy as np    
    t = np.linspace(-2,2,0.1)
    x = np.sin(t)+np.random.randn(len(t))*0.1
    y = smooth(x)
    
    see also: 
    
    numpy.hanning, numpy.hamming, numpy.bartlett, numpy.blackman, numpy.convolve
    scipy.signal.lfilter
 
    TODO: 如果使用数组而不是字符串，则window参数可能是窗口本身   
    """
    # print(len(x), window_len)
    # if x.ndim != 1:
    #     raise ValueError, "smooth only accepts 1 dimension arrays."
    #提高ValueError，“平滑仅接受一维数组。”
    # if x.size < window_len:
    #     raise ValueError, "Input vector needs to be bigger than window size."
    #提高ValueError，“输入向量必须大于窗口大小。”
    # if window_len < 3:
    #     return x
    #
    # if not window in ['flat', 'hanning', 'hamming', 'bartlett', 'blackman']:
    #     raise ValueError, "Window is on of 'flat', 'hanning', 'hamming', 'bartlett', 'blackman'"
 
    s = np.r_[2 * x[0] - x[window_len:1:-1],
              x, 2 * x[-1] - x[-1:-window_len:-1]]
    #print(len(s))
 
    if window == 'flat':  # moving average平移
        w = np.ones(window_len, 'd')
    else:
        w = getattr(np, window)(window_len)
    y = np.convolve(w / w.sum(), s, mode='same')
    return y[window_len - 1:-window_len + 1]


class Frame:
    """class to hold information about each frame 用于保存有关每个帧的信息"""
    def __init__(self, id, hours=-1, minutes=-1, seconds=-1, milliseconds=-1, frame_path=None, diff=None):
        self.id = id
        self.frame_path=frame_path
        self.diff = diff
        self.hour=hours
        self.minute=minutes
        self.second=seconds
        self.millisecond=milliseconds
 
    def __lt__(self, other):
        if self.id == other.id:
            return self.id < other.id
        return self.id < other.id
 
    def __gt__(self, other):
        return other.__lt__(self)
 
    def __eq__(self, other):
        return self.id == other.id and self.id == other.id
 
    def __ne__(self, other):
        return not self.__eq__(other)

 
def rel_change(a, b):
    x = (b - a) / max(a, b)
    return x


class Extractor:
    def __init__(self, video_path, output_dir=None):
        # video_name = video_path.stem, video_path.suffix, video_root = video_path.parent
        # file_path, file_name = os.path.split(video_path) #分离路径和文件名
        # file_name, suffix = os.path.splitext(file_name)  #区分文件的名字和后缀
        video_path = Path(video_path)
        if output_dir is None:
            output_dir = video_path.parent / 'extract_frames' / video_path.stem
        else:
            output_dir = Path(output_dir)
        output_dir.mkdir(parents=True, exist_ok=True)
        self.output_dir=output_dir
        self.video_path=video_path
        self.USE_THRESH = False # 设置固定阈值标准
        self.THRESH = 0.6       # 固定阈值
        self.USE_TOP_ORDER = False   # 设置固定阈值标准
        self.USE_LOCAL_MAXIMA = True # 设置局部最大值标准
        self.NUM_TOP_FRAMES = 50     # 排名最高的帧数
        self.len_window = int(50)    # 平滑窗口大小
        self.frames=[]
        print("target video: ",  video_path)
        print("frame save directory: ", output_dir)
        self._get_keyframe()
    
    def _get_frames(self):
        cap = cv2.VideoCapture(str(self.video_path)) 
        frames = []
        success, curr_frame = cap.read()
        prev_frame=cv2.cvtColor(curr_frame, cv2.COLOR_BGR2LUV)
        idx = 0 
        while(success):
            success, curr_frame = cap.read()
            if curr_frame is None:
                break
            curr_frame = cv2.cvtColor(curr_frame, cv2.COLOR_BGR2LUV)
            diff = cv2.absdiff(curr_frame, prev_frame)  # 获取差分图
            diff_sum = np.sum(diff)
            diff_sum_mean = diff_sum / diff.size        #平均帧
            # frame_diffs.append(diff_sum_mean)
            frame = Frame(idx, diff=diff_sum_mean)
            frames.append(frame)
            prev_frame = curr_frame
            idx = idx + 1
        cap.release()
        return frames

    def _get_keyframe(self):
        frames = self._get_frames()
        keyframe_id_set = set()
        if self.USE_TOP_ORDER:
            # sort the list in descending order以降序对列表进行排序
            frames.sort(key=operator.attrgetter("diff"), reverse=True)# 排序operator.attrgetter
            for keyframe in frames[: self.NUM_TOP_FRAMES]:
                keyframe_id_set.add(keyframe.id) 
        if self.USE_THRESH:
            print("Using Threshold")    # 使用阈值
            pre_frame = frames[0]
            for _, cur_frame in enumerate(frames[1:]):
                if rel_change(pre_frame.diff, cur_frame.diff) >= self.THRESH:
                    keyframe_id_set.add(cur_frame.id)
        if self.USE_LOCAL_MAXIMA:
            print("Using Local Maxima") # 使用局部极大值
            frame_diffs=[frame.diff for frame in frames]
            diff_array = np.asarray(frame_diffs, dtype=np.float32)
            sm_diff_array = smooth(diff_array, self.len_window) #平滑
            frame_indexes = argrelextrema(sm_diff_array, np.greater)[0] # 找极值
            keyframe_id_set=set(frame_indexes)
            for _, idx in enumerate(frame_indexes):
                assert idx==frames[idx].id # 记录极值帧数
            # plt.figure(figsize=(40, 20))
            # plt.locator_params("x", nbins = 100)
            # stem 绘制离散函数，polt是连续函数
            # plt.stem(sm_diff_array,linefmt='-',markerfmt='o',basefmt='--',label='sm_diff_array')
            # plt.savefig(self.output_dir / '{}_plot.png'.format(self.video_path.stem))

        # save all keyframes as image将所有关键帧另存为图像
        cap = cv2.VideoCapture(str(self.video_path))
        success, _ = cap.read()
        idx = 0
        while(success):
            success, frame = cap.read()
            if frame is None:
                break
            if idx in keyframe_id_set:
                frame_path=str(self.output_dir / '{}_keyframe_{}.jpg'.format(self.video_path.stem, idx))
                # cv2.imwrite(frame_path, frame)
                cv2.imencode('.jpg', frame)[1].tofile(frame_path)
                keyframe_id_set.remove(idx)
                print('saving: {}'.format(frame_path))
                milliseconds = cap.get(cv2.CAP_PROP_POS_MSEC)
                seconds = milliseconds//1000
                milliseconds = milliseconds%1000
                minutes = seconds//60
                seconds = seconds % 60
                hours = minutes//60
                minutes = minutes % 60
                self.frames.append(Frame(idx, int(hours), int(minutes), int(seconds), milliseconds, frame_path))
            idx = idx + 1
        cap.release()


# if __name__ == "__main__":

#     video_path= '../v7.mp4'
#     extractor=Extractor(video_path)
#     print(
#         'path: ', [frame.frame_path for frame in extractor.frames], '\n'
#         'hour: ', [frame.hour for frame in extractor.frames], '\n',
#         'millisecond: ', [frame.millisecond for frame in extractor.frames])