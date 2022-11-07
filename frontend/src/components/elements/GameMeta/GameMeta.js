import { Box, Tab, Tabs, Stack, IconButton } from '@mui/material'
import React, { Component } from 'react'
import DataGridS from '../DataGridS/DataGridS';
import GameFileList from './GameFileList';
import GameInfo from './GameInfo';
import TabPanel from './TabPanel';
import BuildIcon from '@mui/icons-material/Build';
import RefreshIcon from '@mui/icons-material/Refresh';
import urlmapping from "../../../urlMapping.json"
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import {GridActionsCellItem} from '@mui/x-data-grid'
import LoadingProgress from './subComponents/LoadingProgress';
import ProjectCheckList from './ProjectCheckList';
import fetchHandle from '../../../utils/FetchErrorhandle'
import ErrorHint from '../ErrorHint';
function a11yProps(index) {
    return {
      id: `game-meta-tab-${index}`,
      'aria-controls': `game-meta-tabpanel-${index}`,
    };
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
export default class GameMeta extends Component {
    constructor(props){
        
        //console.log(props)
        super(props)
        
        //console.log(fileList)
        this.state={
            value:0, //currently selected tab index
            tableLoading:false,
            loaderror:false,
            rows:[],
            errmsg:'未知错误',
            fileList:{
                text:[],
                image:[],
                audio:[],
                video:[],
                other:[]
            }
        }
    }

    getFileCount=()=>{
        let counts={
            total:0,
            image:0,
            text:0,
            audio:0,
            video:0,
            other:0
        }
        //console.log(this)
        Object.entries(this.state.fileList).forEach((value)=>{
            counts[value[0]]+=value[1].length
            counts.total+=value[1].length
        })
        return counts
    }

    

    static getDerivedStateFromProps(props,state){
        let fileList={
            text:[],
            image:[],
            audio:[],
            video:[],
            other:[]
        }
        //console.log(props.fileList)
        for(let file of props.fileList){
            let target 
            switch(file.type){
                case 'text': target = fileList.text;break;
                case 'image':target = fileList.image;break;
                case 'audio':target = fileList.audio;break;
                case 'video':target = fileList.video;break;
                default : target = fileList.other;break;
            }
            target.push(file)
        }
        //console.log(fileList)
        return {fileList:fileList}
    }

    loadDBScan=()=>{
        this.setState({
            tableLoading:true,
            loaderror:false
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
        })
        .then(fetchHandle)
        .then((res)=>{
            //console.log(res)
            return res.json()
        })
        .then((res)=>{
            //console.log(res)
            this.setState({
                rows:res.data.table,
                tableLoading:false
            })
            this.props.setSuggestions(res.data.suggestion,'databasescan')
        })
        .catch((reason)=>{
            this.setState({
                loaderror:true,
                errmsg:`发生了一个错误：${reason.name} ${reason.message}`
            })
            console.log(reason.message)
        })
    }

    handleChange=(dbindex)=>(e,value)=>{
        this.props.setSuggestions([],'null')
        if(value === dbindex){
            this.loadDBScan()
        }
        
        this.setState({
            value: value
        })
    }
    
  render() {
    //console.log(this.state.fileList)
    // Define the panels here
    
    let panels=[
        {
            label:'审核概览',
            variant:'summary',
            content:<ProjectCheckList info={{fileCount:this.getFileCount()}}/>,
        },
        {
            label:'游戏信息',
            variant:'game',
            content:<GameInfo info={{...this.props.info,['filecount']:this.getFileCount()}}/>,
        },
        {
            label:'文本合规',
            variant:'text',
            content:<GameFileList setSuggestions={this.props.setSuggestions} pid={this.props.info.id} 
            fileList={this.state.fileList.text} variant='text'/>,
        },
        {
            label:'图片合规',
            variant:'image',
            content:<GameFileList setSuggestions={this.props.setSuggestions} pid={this.props.info.id} 
            fileList={this.state.fileList.image} variant='image'/>,
        },
        {
            label:'数据库检测',
            variant:'dbscan',
            content:this.state.loaderror?<ErrorHint text={this.state.errmsg} 
            extra={<IconButton onClick={()=>{this.loadDBScan()}}><RefreshIcon/></IconButton>}/>:(this.state.tableLoading?
                <LoadingProgress/>:<DataGridS columns={columns} sx={{pb:5}} rows={this.state.rows}/>),
        },
        {
            label:'音频检测',
            variant:'audio',
            content:<GameFileList setSuggestions={this.props.setSuggestions} pid={this.props.info.id} 
            fileList={this.state.fileList.audio} variant='audio'/>,
        },
        {
            label:'视频检测',
            variant:'video',
            content:<GameFileList setSuggestions={this.props.setSuggestions} pid={this.props.info.id} 
            fileList={this.state.fileList.video} variant='video'/>,
        },
    ]

    let dbindex = panels.findIndex((value)=>{return value.label==='数据库检测'})
    let {value} = this.state
    return (
        <Box sx={{height:'75vh',width:'55vw'}}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={this.handleChange(dbindex)} 
                aria-label="basic tabs example">
                    {panels.map((panel,index)=>(
                        <Tab label={panel.label} {...a11yProps(index)}/>
                    ))}
                </Tabs>
            </Box>
            {
                panels.map((panel,index)=>(
                    <TabPanel value={value} index={index}>
                        {panel.content}
                    </TabPanel>
                ))
            }
        </Box>
    )
  }
}
