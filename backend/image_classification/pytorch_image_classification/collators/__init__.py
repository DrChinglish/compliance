from typing import Callable

import torch
import yacs.config

from .cutmix import CutMixCollator
from .mixup import MixupCollator
from .ricap import RICAPCollator


def create_collator(config: yacs.config.CfgNode) -> Callable:
    if config.augmentation.use_mixup:
        return MixupCollator(config)
    elif config.augmentation.use_ricap:
        return RICAPCollator(config)
    elif config.augmentation.use_cutmix:
        return CutMixCollator(config)
    else:
        # def collate_fn(batch):
        #     # batch_imgs, batch_boxes, batch_classes, batch_hms, infos = zip(*batch)
        #     batch_imgs, batch_boxes, labels = zip(*batch)

        #     pad_imgs = []
        #     pad_hms = []
        #     for _, (img, hm) in enumerate(zip(batch_imgs, batch_hms)):

        #         _, h, w = img.shape
        #         pad_imgs.append(torch.nn.functional.pad(img, (0, max_w - w, 0, max_h - h), value=0.))

        #         _, h, w = hm.shape
        #         pad_hms.append(torch.nn.functional.pad(hm, (0, max_w // 4 - w, 0, max_h // 4 - h), value=0.))
            
        #     batch_imgs = torch.stack(pad_imgs)
        #     batch_hms = torch.stack(pad_hms)

        #     return batch_imgs, batch_hms
        return torch.utils.data.dataloader.default_collate
