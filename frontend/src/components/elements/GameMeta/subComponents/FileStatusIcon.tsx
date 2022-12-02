import React from 'react'
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    QuestionCircleOutlined,
    ExclamationCircleOutlined,
    MinusCircleOutlined,
    SyncOutlined,
} from '@ant-design/icons';
import { FileProcessStatus, VideoFileStatus } from '../../../../Interfaces';
import { Tag } from 'antd';



type Props = {
    status: FileProcessStatus|VideoFileStatus
}

export default function FileStatusIcon({status}: Props) {
    let tag: JSX.Element
    switch (status) {
        case 'done':tag =
            <Tag icon={<CheckCircleOutlined />} color="success">
                处理完成
            </Tag>
            break;
        case 'processing':tag =
            <Tag icon={<SyncOutlined spin />} color="processing">
                处理中
            </Tag>
            break;
        case 'error':tag =
            <Tag icon={<CloseCircleOutlined />} color="error">
                处理错误
            </Tag>
            break;
        case 'uploaded':tag =
            <Tag icon={<ClockCircleOutlined />} color="default">
                等待处理
            </Tag>
        break;
        case 'ready':tag =
            <Tag icon={<CheckCircleOutlined />} color="default">
                准备就绪
            </Tag>
        break;
        default:tag =
            <Tag icon={<QuestionCircleOutlined />} color="warning">
                未知状态
            </Tag>
            break;
    }
  return (
    tag
  )
}