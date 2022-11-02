import { Card, CardContent, CardHeader, Stack, Box, Button, Chip, Snackbar, Alert } from '@mui/material'
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
import SyncIcon from '@mui/icons-material/Sync';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import PendingIcon from '@mui/icons-material/Pending';
import QuestionMarkOutlinedIcon from '@mui/icons-material/QuestionMarkOutlined';
async function retrieveProjectList(type){
  let formData = new FormData()
  let plist = rows
  let status = false
  formData.append('category',type)
  let url = type === 'game' ? urlmapping.apibase.game+ urlmapping.apis.project_list_game:urlmapping.apibase.other+urlmapping.apis.project_list
  let method = type === 'game' ? 'GET':'DELETE'
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

//渲染项目状态单元格
const RenderStatus = (props)=>{
  let color
  let label
  let icon
  switch (props.value){
    case 'open': color = 'info';label = "Open";icon = <SyncIcon/>; break;
    case 'closed': color = 'success';label = 'Closed';icon = <CheckIcon/>;break;
    case 'aborted': color = 'error';label = 'Aborted';icon = <CloseIcon/>;break;
    case 'pending': color = 'primary';label = 'Pending';icon = <PendingIcon/>;break;
    default :color = 'warning';label = 'Unknown';icon = <QuestionMarkOutlinedIcon/>;
  }
  return (
    <Chip size='small' icon={icon} label={label} color={color}/>
  )
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
        snackmessage:{
          show:false,
          severity:'success',
          text:''
        },
        type:props.params.type
      }
    }

  handleCloseSnackbar = (e,reason)=>{
    if(reason === 'clickaway'){
        return
    }
    this.setState((state)=>{
        let newvalue = state.snackmessage
        newvalue.show = false
        return {snackmessage:newvalue}
      })
  }

  showSnackMessage = (severity, text)=>{
      let msgstate = this.state.snackmessage
      msgstate.show = true
      msgstate.severity = severity
      msgstate.text = text
      this.setState({snackmessage:msgstate})
  }
  handleClickDelete=(e,param)=>{
    // console.log(this.props.params.type === 'game')
    let url
    if(this.props.params.type === 'game'){
      url = urlmapping.apibase.game+urlmapping.apis.delete_project+param.id.toString()+'/'
    }
    else{
      url = urlmapping.apibase.other+urlmapping.apis.delete_project+param.id.toString()+'/'
    }
    fetch(url,{
      method:'DELETE',
      mode:'cors',
      headers:{
        'X-CSRFToken':cookie.load('csrftoken')
      }
  })
  .then((res)=>{
      return res.json()
  })
  .then((res)=>{
    console.log(param,this.state.rows)
    let index = this.state.rows.findIndex((value)=>{return value.id === param.id})
    console.log(index)
    if(index>=0){
      this.showSnackMessage('success','删除成功')
    this.setState((state)=>{
      let newrows = state.rows.slice()
      newrows.splice(index,1)
      return {rows:newrows}
    })
    }
    else{
      this.showSnackMessage('error','删除失败')
    }
  })
  
  }
  columns = [
    {field: 'id', headerName: '#',flex:1,type:'string'},
    {field: 'title', headerName: '项目名称',flex:6,type:'string'},
    {field: 'created', headerName: '创建日期',flex: 3,type:'dateTime',valueGetter: ({ value }) => value && new Date(value),},
    {field: 'updated' ,headerName: '修改日期' , flex: 3, type: 'dateTime',valueGetter: ({ value }) => value && new Date(value),},
    {field: 'status', headerName: '项目状态',flex:3,renderCell: RenderStatus },
    {field: '_operation', headerName: '操作',width: 100,type: 'actions', getActions: (params)=>[
      <Stack spacing={1} direction="row">
        <GridActionsCellItem icon={<DeleteIcon color='error'/>} onClick={(e)=>{this.handleClickDelete(e,params)}} label="删除" />
        <GridActionsCellItem icon={<RemoveRedEyeIcon/>} onClick={(e)=>{console.log(params);this.props.navigate(`/detail/${params.id}`)}} label="查看详情" />
      </Stack>
    ]},
]
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
                  <Button variant='contained' startIcon={<AddIcon/>}  onClick=
                  {(e)=>{this.props.navigate(urlmapping.newproject)}}>创建新项目</Button>
              </Stack>
            }
        />
        <CardContent>
            <Box sx={{height:'100vh'}}>
                <Snackbar onClose={this.handleCloseSnackbar} anchorOrigin={{vertical:'top',horizontal:'center'}}
                 open={this.state.snackmessage.show} autoHideDuration={3000}>
                    <Alert onClose={this.handleCloseSnackbar} severity={this.state.snackmessage.severity} 
                    sx={{width:'50ch'}}>
                        {this.state.snackmessage.text}
                    </Alert>
                </Snackbar>
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