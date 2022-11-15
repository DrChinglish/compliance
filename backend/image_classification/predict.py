import torch
import torch.nn.functional as F
import pdb
import numpy as np
import matplotlib.pyplot as plt
from pytorch_image_classification import (
    get_default_config,
    create_model,
)
import pandas as pd
from pytorch_image_classification.transforms import create_imagenet_transform
from PIL import Image


class Predictor:
    def __init__(self, ):
        config = get_default_config()
        config.merge_from_file('image_classification/configs/resnet34.yaml')

        config.device=config.device if torch.cuda.is_available() else 'cpu'
        model = create_model(config)
        model.load_state_dict(torch.load('image_classification/weights/checkpoint_00120.pth', map_location='cpu')['model'],strict=False)
        model.to(config.device)
        self.net = model.eval()
        self.config = config
        self.transform = create_imagenet_transform(config=config, is_train=False)
        self.idx2class_names={0: '_blood_None', 1:'blood',}

    def blood_predict(self, image_dir):#blood_predict
        image = Image.open(image_dir) # image = cv2.imread(image_dir)[..., (2, 1, 0)]
        assert image is not None, 'image reading error!'
        image = np.array(self.resize_image(image=image), dtype=np.float32)
        # image=cv2.resize(image, dsize=(self.config.dataset.image_size, self.config.dataset.image_size), interpolation=cv2.INTER_LINEAR)
        image, _, _=self.transform(image)
        with torch.no_grad():
            pred = self.net(image.unsqueeze(0).to(self.config.device))
        prob = F.softmax(pred, dim=1).cpu()
        scores, indices = prob.topk(k=2)
        scores = scores.numpy().ravel()
        indices = indices.numpy().ravel()
        names = [self.idx2class_names[index] for index in indices]
        print(pd.DataFrame({'label': names, 'score': scores}))
        return scores[0]
        
    def resize_image(self, image, letterbox_image=True):
      
        iw, ih  = image.size
        size    = self.config.dataset.image_size, self.config.dataset.image_size
        w, h    = size
        if letterbox_image:
            scale   = min(w/iw, h/ih)
            nw      = int(iw*scale)
            nh      = int(ih*scale)

            image   = image.resize((nw,nh), Image.BICUBIC)
            new_image = Image.new('RGB', size, (128,128,128))
            new_image.paste(image, ((w-nw)//2, (h-nh)//2))
        else:
            new_image = image.resize((w, h), Image.BICUBIC)
        return new_image


# if __name__=='__main__':
#     predictor =Predictor()
#     predictor('./datasets/bloody/val/blood/keyframe_9664.jpg')