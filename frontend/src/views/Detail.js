import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {Drawer, AppBar} from "@mui/material"
import DataGridS from '../components/elements/DataGridS/DataGridS'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { GridActionsCellItem} from '@mui/x-data-grid'
export default class Detail extends Component {
  

  render() {
    return (
        <DataGridS columns={columns} rows={rows}/>
    )
  }
}
Detail.propTypes = {}

const rows=[
    {
      id:1,
      name: "张三",
      address: "114514",
      phone: "12345678901",
    },
    {
      id:2,
      name: "张三",
      address: "114514",
      phone: "12345678901",
    },
    {
      id:3,
      name: "张三",
      address: "114514",
      phone: "12345678901",
    },
    {
      id:4,
      name: "张三",
      address: "114514",
      phone: "12345678901",
    },
    {
      id:5,
      name: "张三",
      address: "114514",
      phone: "12345678901",
    },
  ]
  const columns = [
        
    //other columns...
    {field: 'name', headerName: '姓名',flex:1,type:'string'},
    {field: 'address', headerName: '地址',flex: 1},
    {field: 'phone' ,headerName: '电话' , flex: 1, type: 'string'},
    //reserved columns...
    {field: '_operation', headerName: '操作',width: 70,type: 'actions', getActions: (params)=>[
      <GridActionsCellItem icon={<RemoveRedEyeIcon/>} onClick={(e)=>{console.log(params)}} label="查看详情" />
    ]},
]