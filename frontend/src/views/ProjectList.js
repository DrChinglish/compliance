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
import cookie from 'react-cookies'
import { DataGridToolbar } from '../components/elements/DataGridPartial/DataGridToolbar';
async function retrieveProjectList(type){
  let formData = new FormData()
  let plist = rows
  let status = false
  formData.append('category',type)
  let url = type === 'game' ? urlmapping.apibase.game+ urlmapping.apis.project_list_game:urlmapping.apibase.other+urlmapping.apis.project_list
  let method = type === 'game' ? 'GET':'POST'
  let body = type === 'game' ? null:formData
  await fetch(url,{
    method:method,
    mode:'cors',
    body:body,
    headers:{
      'X-CSRFToken':cookie.load('csrftoken')
    }
  })
  .then((res)=>{
    return res.json()
  })
  .then((res)=>{
    plist = type === 'game'? res: res.data
    status = true
  })
  .catch((e)=>{
    console.log("Failed to fetch!")
    //handle something else
  })
    console.log(status,plist)
    return {data:plist,status:status}
}


 class ProjectList extends Component {
  static getDerivedStateFromProps(props,state){
    if(props.params.type!=state.type){
      return{reset:true,type:props.params.type}
    }
    return null
  }

  async componentDidMount(){
    await fetch(urlmapping.apibase.game+urlmapping.apis.project_list_game,{
      method:'GET',
      mode:'cors'
    })
    .then((res)=>{
      if(cookie.load("csrftoken")!=undefined)
          console.log("cookie ok!")
      else
          console.log("cookie error!")
    })
    let res = await retrieveProjectList(this.props.params.type)
    // console.log(res)
    if(res.status){
      this.setState({
        rows:res.data,
        loading:false
      })
    }
  }

  async resetList(){
    let res = await retrieveProjectList(this.props.params.type)
    // console.log(res)
    this.setState({
      rows:res.data,
      reset:false
    })
  }

  constructor(props) {
      super(props)
      this.state = {
        rows:[],
        loading:true,
        reset:false,
        type:props.params.type
      }
    }

  handleClickDelete=(e)=>{
    let formData = new FormData()
    formData.append('id')
    fetch("/api/delete_project/",{
      method:'POST',
      mode:'cors',
      headers:{
        'X-CSRFToken':cookie.load('csrftoken')
      }
  })
  .then((res)=>{
      return res.json()
  })
  }
  
  render() {
    if(this.state.reset){
      this.resetList()
    }
    // console.log(this.state.rows)
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
                loading={this.state.loading}
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
    {field: 'title', headerName: '项目名称',flex:6,type:'string'},
    {field: 'created', headerName: '创建日期',flex: 3,type:'dateTime',valueGetter: ({ value }) => value && new Date(value),},
    {field: 'updated' ,headerName: '修改日期' , flex: 3, type: 'dateTime',valueGetter: ({ value }) => value && new Date(value),},
    {field: 'status', headerName: '项目状态',flex:3},
    {field: '_operation', headerName: '操作',width: 100,type: 'actions', getActions: (params)=>[
      <Stack spacing={1} direction="row">
        <GridActionsCellItem icon={<DeleteIcon color='error'/>} onClick={(e)=>{console.log(params)}} label="删除" />
        <GridActionsCellItem icon={<RemoveRedEyeIcon/>} onClick={(e)=>{console.log(params);this.props.navigate(`/detail/${params.id}`)}} label="查看详情" />
      </Stack>
    ]},
]

}

export default withRouter(ProjectList)



const rows = [
{
    id:'1',
    title:'project A',
    created:'2022-09-03',
    updated:'2022-09-03',
    status:'open'
},
{
    id:'2',
    title:'project B',
    created:'2022-09-03',
    updated:'2022-09-03',
    status:'finished'
},
{
    id:'3',
    title:'project C',
    created:'2022-09-03',
    updated:'2022-09-03',
    status:'canceled'
},
]