import { Box, Card, Tab, Tabs, Stack } from '@mui/material'
import React, { Component } from 'react'
import DataGridS from '../DataGridS/DataGridS';
import GameFileList from './GameFileList';
import GameInfo from './GameInfo';
import TabPanel from './TabPanel';
import BuildIcon from '@mui/icons-material/Build';
import urlmapping from "../../../urlMapping.json"
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { GridActionsCellItem} from '@mui/x-data-grid'
import LoadingProgress from './subComponents/LoadingProgress';
function a11yProps(index) {
    return {
      id: `game-meta-tab-${index}`,
      'aria-controls': `game-meta-tabpanel-${index}`,
    };
  }

export default class GameMeta extends Component {

    getFileCount=()=>{
        let count = 0
        count += this.state.fileList.text.length
        count += this.state.fileList.image.length
        count += this.state.fileList.other.length
        return count
    }

    static getDerivedStateFromProps(props,state){
        let fileList={
            text:[],
            image:[],
            other:[]
        }
        for(let index in props.fileList){
            let file = props.fileList[index]
            let target 
            switch(file.type){
                case 'text': target = fileList.text;break;
                case 'image':target = fileList.image;break;
                default : target = fileList.other;break;
            }
            target.push(file)
        }
        //console.log(fileList)
        return {fileList:fileList}
    }

    constructor(props){
        
        //console.log(props)
        super(props)
        
        //console.log(fileList)
        this.state={
            value:0, //currently selected tab index
            tableLoading:false,
            rows:[]
        }
    }

    handleChange=(e,value)=>{
        this.props.setSuggestions([],'null')
        if(value === 3){
            this.setState({
                tableLoading:true
            })
            let fetchurl = urlmapping.apibase.game + urlmapping.apis.dbscan
            const formdata = new FormData()
            formdata.append('user','root')
            formdata.append('pwd',123456)
            formdata.append('dbname','testdb')
            formdata.append('tablename','data')
            fetch(fetchurl,{
                mode:'cors',
                method:'POST',
                body:formdata
            }).then((res)=>{
                return res.json()
            })
            .then((res)=>{
                this.setState({
                    rows:res.data.table,
                    tableLoading:false
                })
                this.props.setSuggestions(res.data.suggestion,'databasescan')
            })
        }
        
        this.setState({
            value: value
        })
    }

  render() {
    console.log(this.state.fileList)
    let {value} = this.state
    return (
        <Box sx={{height:'75vh',width:'55vw'}}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={this.handleChange} 
                aria-label="basic tabs example">
                    <Tab label="游戏信息" {...a11yProps(0)} />
                    <Tab label="文本合规" {...a11yProps(1)} />
                    <Tab label="图片合规" {...a11yProps(2)} />
                    <Tab label="数据库检测" {...a11yProps(3)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <GameInfo info={{...this.props.info,['filecount']:this.getFileCount()}}/>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <GameFileList setSuggestions={this.props.setSuggestions} pid={this.props.info.id} fileList={this.state.fileList.text} 
                variant='text'/>
            </TabPanel>
            <TabPanel value={value} index={2}>
                <GameFileList setSuggestions={this.props.setSuggestions} pid={this.props.info.id} fileList={this.state.fileList.image} 
                variant='image'/>
            </TabPanel>
            <TabPanel value={value} index={3} >
                {this.state.tableLoading?
                <LoadingProgress/>:<DataGridS columns={columns} sx={{pb:5}} rows={this.state.rows}/>}
            </TabPanel>
        </Box>
    )
  }
}
const columns = [
        
    //other columns...
    {field: 'id', headerName: 'ID',flex:1,type:'string'},
    {field: 'name', headerName: '姓名',flex:1,type:'string'},
    {field: 'address', headerName: '地址',flex: 2},
    {field: 'date_account_created', headerName: '账号创建日期',flex:1,type:'dateTime'},
    {field: 'gender', headerName: '性别',flex:1,type:'string'},
    {field: 'age', headerName: '年龄',flex:1,type:'number'},
    {field: 'phone_number' ,headerName: '电话' , flex: 2, type: 'string'},
    {field: 'language' ,headerName: '语言' , flex: 2, type: 'string'},
    {field: 'signup_app' ,headerName: '注册方式' , flex: 1, type: 'string'},
    {field: 'first_device_type' ,headerName: '设备类型' , flex: 1, type: 'string'},
    {field: 'order_amount' ,headerName: '订单数量' , flex: 1, type: 'number'},
    //reserved columns...
    {field: '_operation', headerName: '操作',width: 100,type: 'actions', getActions: (params)=>[
      <Stack spacing={1} direction="row">
        <GridActionsCellItem icon={<BuildIcon/>} onClick={(e)=>{console.log(params)}} label="修复" />
        <GridActionsCellItem icon={<RemoveRedEyeIcon/>} onClick={(e)=>{console.log(params)}} label="查看详情" />
      </Stack>
    ]},
]