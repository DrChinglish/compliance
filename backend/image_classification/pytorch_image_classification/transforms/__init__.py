from typing import Callable, Tuple
import albumentations as A
import numpy as np
import torchvision
import yacs.config
import pdb
from .transforms import (
    CenterCrop,
    Normalize,
    RandomCrop,
    RandomHorizontalFlip,
    RandomResizeCrop,
    Resize,
    ToNumpy,
    ToTensor,
)

from .cutout import Cutout, DualCutout
from .random_erasing import RandomErasing


class AlbuCompose(A.Compose):
    def __init__(self, *args, **kwargs):
        super(AlbuCompose, self).__init__(*args, **kwargs)

    def __call__(self, image, bboxes=None, labels=None):
        sample = super(AlbuCompose, self).__call__(image=image, bboxes=bboxes, labels=labels)
        image, bboxes, labels= sample['image'], sample['bboxes'], sample['labels']
        return image, bboxes, labels


class Compose:
    def __init__(self, transforms):
        self.transforms = transforms

    def __call__(self, image, bboxes=None, labels=None):
        for t in self.transforms:
            image, bboxes, labels=t(image=image, bboxes=bboxes, labels=labels)
        return image, bboxes, labels


def _get_dataset_stats(
        config: yacs.config.CfgNode) -> Tuple[np.ndarray, np.ndarray]:
    name = config.dataset.name
    if name == 'CIFAR10':
        # RGB
        mean = np.array([0.4914, 0.4822, 0.4465])
        std = np.array([0.2470, 0.2435, 0.2616])
    elif name == 'CIFAR100':
        # RGB
        mean = np.array([0.5071, 0.4865, 0.4409])
        std = np.array([0.2673, 0.2564, 0.2762])
    elif name == 'MNIST':
        mean = np.array([0.1307])
        std = np.array([0.3081])
    elif name == 'FashionMNIST':
        mean = np.array([0.2860])
        std = np.array([0.3530])
    elif name == 'KMNIST':
        mean = np.array([0.1904])
        std = np.array([0.3475])
    elif name in ('Bloody', 'ImageNet'):
        # RGB
        mean = [0.485, 0.456, 0.406]
        std = [0.229, 0.224, 0.225]
    else:
        raise ValueError()
    return mean, std


def create_transform(config: yacs.config.CfgNode, is_train: bool) -> Callable:
    if config.model.type == 'cifar':
        return create_cifar_transform(config, is_train)
    elif config.model.type == 'imagenet':
        return create_imagenet_transform(config, is_train)
    else:
        raise ValueError


def create_cifar_transform(config: yacs.config.CfgNode,
                           is_train: bool) -> Callable:
    mean, std = _get_dataset_stats(config)
    if is_train:
        transforms = []
        if config.augmentation.use_random_crop:
            transforms.append(RandomCrop(config))
        if config.augmentation.use_random_horizontal_flip:
            transforms.append(RandomHorizontalFlip(config))

        transforms.append(Normalize(mean, std))

        if config.augmentation.use_cutout:
            transforms.append(Cutout(config))
        if config.augmentation.use_random_erasing:
            transforms.append(RandomErasing(config))
        if config.augmentation.use_dual_cutout:
            transforms.append(DualCutout(config))

        transforms.append(ToTensor())
    else:
        transforms = [
            Normalize(mean, std),
            ToTensor(),
        ]

    return torchvision.transforms.Compose(transforms)


def create_imagenet_transform(config: yacs.config.CfgNode,
                              is_train: bool) -> Callable:
    mean, std = _get_dataset_stats(config)
    transforms=[]
    if is_train:
        albu_transforms = [# A.BBoxSafeRandomCrop()
            A.RandomSizedBBoxSafeCrop(
                height=config.albu.RandomSizedBBoxSafeCrop.height,
                width=config.albu.RandomSizedBBoxSafeCrop.width,
                p=config.albu.RandomSizedBBoxSafeCrop.p,
            ),
            A.Resize(height=config.dataset.image_size, width=config.dataset.image_size),
            A.HorizontalFlip(p=0.5),
        ]

        transforms += [
            # ToNumpy,
            AlbuCompose(albu_transforms, bbox_params=A.BboxParams(format='pascal_voc',
                                                                # min_area=6400, min_visibility=0.1,
                                                                label_fields=['labels']))
        ]

    
        if config.augmentation.use_cutout:
            transforms.append(Cutout(config))
        if config.augmentation.use_random_erasing:
            transforms.append(RandomErasing(config))
        if config.augmentation.use_dual_cutout:
            transforms.append(DualCutout(config))

    transforms += [
        Normalize(mean, std),
        ToTensor(),
    ]

    return Compose(transforms)


def _create_imagenet_transform(config: yacs.config.CfgNode,
                              is_train: bool) -> Callable:
    mean, std = _get_dataset_stats(config)
    if is_train:
        transforms = []
        if config.augmentation.use_random_crop:
            transforms.append(RandomResizeCrop(config))
        else:
            transforms.append(CenterCrop(config))
        if config.augmentation.use_random_horizontal_flip:
            transforms.append(RandomHorizontalFlip(config))

        transforms.append(Normalize(mean, std))

        if config.augmentation.use_cutout:
            transforms.append(Cutout(config))
        if config.augmentation.use_random_erasing:
            transforms.append(RandomErasing(config))
        if config.augmentation.use_dual_cutout:
            transforms.append(DualCutout(config))

        transforms.append(ToTensor())
    else:
        transforms = []
        if config.tta.use_resize:
            transforms.append(Resize(config))
        if config.tta.use_center_crop:
            transforms.append(CenterCrop(config))
        transforms += [
            Normalize(mean, std),
            ToTensor(),
        ]

    return torchvision.transforms.Compose(transforms)
