from typing import Tuple, Union
import xml.etree.ElementTree as ET
import pathlib
import cv2
import os
import pdb
import numpy as np
import torch
import torchvision
import yacs.config
from pathlib import Path
from torch.utils.data import Dataset
from pytorch_image_classification import create_transform


def default_loader(path):
    image = cv2.imread(path)[..., (2, 1, 0)]
    return image


class SubsetDataset(Dataset):
    def __init__(self, subset_dataset, transform=None):
        self.subset_dataset = subset_dataset
        self.transform = transform

    def __getitem__(self, index):
        x, y = self.subset_dataset[index]
        if self.transform:
            x = self.transform(x)
        return x, y

    def __len__(self):
        return len(self.subset_dataset)


class ImageFolder(torchvision.datasets.DatasetFolder):
    def __init__(
        self,
        root: str,
        transform = None,
        target_transform = None,
        loader = default_loader,
        is_valid_file = None,
    ):
        super().__init__(
            root,
            loader,
            (".jpg", ".jpeg", ".png", ".ppm", ".bmp", ".pgm", ".tif", ".tiff", ".webp") if is_valid_file is None else None,
            transform=transform,
            target_transform=target_transform,
            is_valid_file=is_valid_file,
        )

    def __getitem__(self, index):
        path, class_labels = self.samples[index]
        image = self.loader(path)
        path_ann = path[:-3] + 'xml'
        path = Path(path)
        if os.path.exists(path_ann):
            bboxes, labels=self._get_annotation(path_ann)
        elif path.stem.endswith('blood'):
            _, bboxes_string, _=path.stem.split('$')
            bboxes=np.asarray([[int(coord) for coord in coord_string.split('_')]
                for coord_string in bboxes_string.split('&')], dtype=np.float32)
            labels = np.ones(len(bboxes))
        else:
            h, w, _=image.shape
            bboxes=np.array([[int(w*0.15),int(h*0.15),int(w*0.85), int(h*0.85) ]], dtype='float32')
            labels=np.array([1], dtype='float32')
        if self.transform is not None:
            image, bboxes, labels = self.transform(image, bboxes, labels)
        if self.target_transform is not None:
            labels = self.target_transform(labels)
        return image, torch.as_tensor(class_labels, dtype=torch.int64)

    def _get_annotation(self, anno_dir):

        objects = ET.parse(anno_dir).findall('object')

        boxes = []
        labels = []
        for obj in objects:
            name = obj.find('name').text.lower().strip()
            label = self.className_to_idx.get(name, None)
            if label is None:
                continue
            labels.append(label)

            bndbox = obj.find('bndbox')
            xmin = int(bndbox.find('xmin').text) - 1
            ymin = int(bndbox.find('ymin').text) - 1
            xmax = int(bndbox.find('xmax').text) - 1
            ymax = int(bndbox.find('ymax').text) - 1
            boxes.append([xmin, ymin, xmax, ymax])

        return np.asarray(boxes, dtype='float32'), np.asarray(labels, dtype='float32')


def create_dataset(config: yacs.config.CfgNode,
                   is_train: bool) -> Union[Tuple[Dataset, Dataset], Dataset]:
    if config.dataset.name in ['CIFAR10', 'CIFAR100', 'MNIST', 'FashionMNIST', 'KMNIST',]:
        module = getattr(torchvision.datasets, config.dataset.name)
        if is_train:
            if config.train.use_test_as_val:
                train_transform = create_transform(config, is_train=True)
                val_transform = create_transform(config, is_train=False)
                train_dataset = module(config.dataset.dataset_dir,
                                       train=is_train,
                                       transform=train_transform,
                                       download=True)
                test_dataset = module(config.dataset.dataset_dir,
                                      train=False,
                                      transform=val_transform,
                                      download=True)
                return train_dataset, test_dataset
            else:
                dataset = module(config.dataset.dataset_dir,
                                 train=is_train,
                                 transform=None,
                                 download=True)
                val_ratio = config.train.val_ratio
                assert val_ratio < 1
                val_num = int(len(dataset) * val_ratio)
                train_num = len(dataset) - val_num
                lengths = [train_num, val_num]
                train_subset, val_subset = torch.utils.data.dataset.random_split(
                    dataset, lengths)

                train_transform = create_transform(config, is_train=True)
                val_transform = create_transform(config, is_train=False)
                train_dataset = SubsetDataset(train_subset, train_transform)
                val_dataset = SubsetDataset(val_subset, val_transform)
                return train_dataset, val_dataset
        else:
            transform = create_transform(config, is_train=False)
            dataset = module(config.dataset.dataset_dir,
                             train=is_train,
                             transform=transform,
                             download=True)
            return dataset
    elif config.dataset.name in ('Bloody', 'ImageNet'):
        dataset_dir = pathlib.Path(config.dataset.dataset_dir).expanduser()
        train_transform = create_transform(config, is_train=True)
        val_transform = create_transform(config, is_train=False)
        train_dataset = ImageFolder(dataset_dir / 'train', transform=train_transform)
        val_dataset = ImageFolder(dataset_dir / 'val', transform=val_transform)
        return train_dataset, val_dataset
    else:
        raise ValueError()