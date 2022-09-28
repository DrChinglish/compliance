import React, { Component } from 'react'
import {Descriptions} from 'antd'
export default class GameInfo extends Component {
  render() {
    console.log(this.props.info)
    return (
        <div style={{width:'100%',padding:'24px'}}>
            <Descriptions bordered title='基本信息' column={2}>
            <Descriptions.Item label='标题'>{ this.props.info.title}</Descriptions.Item>
            <Descriptions.Item label='创建时间'>{Date(this.props.info.created)}</Descriptions.Item>
            <Descriptions.Item label='最后修改'>{Date(this.props.info.updated)}</Descriptions.Item>
            <Descriptions.Item label='文件数量'>{this.props.info.filecount}</Descriptions.Item>
            <Descriptions.Item label='描述' span={2}>{this.props.info.description}</Descriptions.Item>
            </Descriptions>
        </div>
      
    )
  }
}
