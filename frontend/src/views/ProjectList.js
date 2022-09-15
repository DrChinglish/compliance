import { Card, CardContent, CardHeader, Stack, Box, Button } from '@mui/material'
import TablePaginationActions from '@mui/material/TablePagination/TablePaginationActions'
import React, { Component } from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import withRouter from '../utils/WithRouter'
import AddIcon from '@mui/icons-material/Add';
import { DataGrid, zhCN, GridActionsCellItem } from '@mui/x-data-grid';
import urlmapping from '../urlMapping.json'
import DataGridPagination from '../components/elements/DataGridPartial/DataGridPagination';
import { DataGridToolbar } from '../components/elements/DataGridPartial/DataGridToolbar';
function retrieveProjectList(type){

    //TODO: to be implemented
    return rows
}


 class ProjectList extends Component {
    constructor(props) {
      super(props)

      this.state = {
         rows:retrieveProjectList(this.props.params.type)
      }
    }
  render() {
    const {params} = this.props
    let listTypeText
    switch(params.type){
        case 'table':listTypeText = '结构化数据合规';break;
        case 'game':listTypeText = '游戏合规';break;
        case 'voice':listTypeText = '音频合规';break;
        case 'image':listTypeText = '图片合规';break;
        case 'text':listTypeText = '文本合规';break;
        default:listTypeText = '其他'
    }
    return (
      <Card sx={{maxWidth:'75vw',mx:'auto'}}>
        <CardHeader
            title={'项目列表-'+listTypeText}
            titleTypographyProps={{variant:'h6',fontWeight:'bold'}}
            action={
              <Stack direction='row' spacing={2} sx={{pr:5,pt:2}}>
                  <Button variant='contained' startIcon={<AddIcon/>}  onClick={(e)=>{this.props.navigate(urlmapping.newproject)}}>创建新项目</Button>
              </Stack>
            }
        />
        <CardContent>
            <Box sx={{height:'100vh'}}>
                <DataGrid columns={this.columns} rows={this.state.rows}
                localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
                components={{
                Toolbar: DataGridToolbar ,
                Pagination: DataGridPagination
                }} 
                componentsProps={{
                    toolbar:{noTitle:true}
                }}
                />
            </Box>
            
        </CardContent>
      </Card>
    )
  }
  columns = [
        
    {field: 'id', headerName: '#',flex:1,type:'string'},
    {field: 'name', headerName: '项目名称',flex:6,type:'string'},
    {field: 'date_created', headerName: '创建日期',flex: 3,type:'date'},
    {field: 'date_modified' ,headerName: '修改日期' , flex: 3, type: 'date'},
    {field: 'status', headerName: '项目状态',flex:3},
    {field: '_operation', headerName: '操作',width: 100,type: 'actions', getActions: (params)=>[
      <Stack spacing={1} direction="row">
        <GridActionsCellItem icon={<DeleteIcon color='error'/>} onClick={(e)=>{console.log(params)}} label="删除" />
        <GridActionsCellItem icon={<RemoveRedEyeIcon/>} onClick={(e)=>{this.props.navigate('/detail/2')}} label="查看详情" />
      </Stack>
    ]},
]

}

export default withRouter(ProjectList)



const rows = [
{
    id:'1',
    name:'project A',
    date_created:'2022-09-03',
    date_modified:'2022-09-03',
    status:'open'
},
{
    id:'2',
    name:'project B',
    date_created:'2022-09-03',
    date_modified:'2022-09-03',
    status:'finished'
},
{
    id:'3',
    name:'project C',
    date_created:'2022-09-03',
    date_modified:'2022-09-03',
    status:'canceled'
},
]