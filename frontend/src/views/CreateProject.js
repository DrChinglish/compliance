import { CardContent, CardHeader, FormControl, Grid, InputLabel, MenuItem, OutlinedInput, Select, Card, Button, Divider, Stack, Typography, FormHelperText, Snackbar, Alert } from '@mui/material'
import { Box } from '@mui/system'
import {LoadingButton} from '@mui/lab'
import React, { Component } from 'react'
import withRouter from '../utils/WithRouter'
import { message, Upload} from 'antd'
import { InboxOutlined } from '@ant-design/icons';
import cookie from 'react-cookies'
import SaveIcon from '@mui/icons-material/Save';
import fetchHandle from '../utils/FetchErrorhandle' 
import urlMapping from '../urlMapping.json'
const {Dragger} = Upload
//import "../assets/scss/createProject.scss"

const helperText={
    empty:'该项目是必填项'
}




class CreateProject extends Component {
    componentDidMount=()=>{
        fetch("/api/new_project",{
            method:'GET',
            mode:'cors'
        })
        .then((res)=>{
            console.log(res.json())
            if(cookie.load("csrftoken")!=undefined)
                console.log("cookie ok!")
            else
                console.log("cookie error!")
        })
    }

    constructor(props) {
      super(props)
    
      this.state = {
        snackmessage:{
            show:false,
            severity:'success',
            text:''
        },
        error:{
            name:false,
            type:false,
            description:false
        },
        helperText:{
            name:' ',
            type:' ',
            description:' '
        },
        values:{
            name:'',
            type:'',
            description:''
         },
        touched:{
            name:false,
            type:false,
            description:false
         },
        errorField:{
            field:'',
            helperText:''
         },//for backend verification only
         fileList:[],
         creating:false,
      }
    }

    handleCloseSnackbar = (e,reason)=>{
        console.log(reason)
        if(reason === 'clickaway'){
            return
        }
        this.setState((state)=>{
            let newvalue = state.snackmessage
            newvalue.show = false
            return {snackmessage:newvalue}
        })
    }

    handleSubmit =(e)=>{
        const formdata = new FormData()
        this.state.fileList.forEach((file)=>{
            formdata.append('files[]',file)
        })
        formdata.append("category",this.state.values.type)
        formdata.append("title",this.state.values.name)
        formdata.append("description",this.state.values.description)
        this.setState({creating:true})
        fetch("/api/new_project/",{
            method:'POST',
            body:formdata,
            mode:'cors',
            credentials:'include',
            headers:{
                'X-CSRFToken':cookie.load('csrftoken')
            }
        })
        .then(fetchHandle)
        .then((res)=>{
            return res.json()
        })
        .then((msg)=>{
            this.setState({creating:false})
            console.log(msg)
            if(msg.status!='1'){
                // if something went wrong:
                this.showSnackMessage('error',"表单错误："+msg.msg)
                this.setState({
                    errorField:{field:msg.field, helperText:msg.helperText}  //assumes that only mark one of them
                })
                
            }else{//ok
                this.showSnackMessage('success','创建项目成功,正在跳转至项目列表页面')
                setTimeout(()=>{
                    this.props.navigate(urlMapping.list+'/'+this.state.values.type)
                },3000)
            }
        })
        .catch(e=>{
            //console.log(e.name)
            this.showSnackMessage('error',e.name +":"+e.message)
            //console.log(msgstate)
            this.setState({creating:false})
            
        })
    }

    showSnackMessage = (severity, text)=>{
        let msgstate = this.state.snackmessage
        msgstate.show = true
        msgstate.severity = severity
        msgstate.text = text
        this.setState({snackmessage:msgstate})
    }

    uploadProps = {
        multiple: true,
        onRemove:(file)=>{
            // let fileList = this.state.fileList
            // const index = fileList.indexOf(file);
            // const newFileList = fileList.slice();
            // newFileList.splice(index, 1);
            // this.setState({fileList:newFileList})
            this.setState((state)=>{
                return {fileList:state.fileList.splice(state.fileList.indexOf(file),1)}
            })
        },
        beforeUpload:(file)=>{
            //console.log(file)
            this.setState((state)=>{
                return {fileList:[...state.fileList, file]}
            })
            return false
        },
        listType:'picture-card'

    }

    isCorrectInput=(prop)=>{
        let flag = false
        console.log("check")
        let newHelperText = this.state.helperText
        if (this.state.values[prop]?.length==0 && this.state.touched[prop]) {
            newHelperText[prop] = helperText.empty
            flag=true
        }
        if(prop==this.state.errorField.field){
            helperText[prop] = this.state.errorField.helperText
            flag=true
        }
        //console.log(prop,this.state.values[prop])
        // console.log("1",this.state.touched[prop])
        if(!flag){
            newHelperText[prop] = " "
        }
        this.setState({
            helperText:newHelperText,
            error:{...this.state.error,[prop]:flag}
        })
        return flag
    }

    handleblur =(prop)=>(e)=>{
        this.isCorrectInput(prop)
    }    

    handleFoucus=(prop)=>(e)=>{
        this.setState({
            touched:{...this.state.touched,[prop]:true}
        })
    }
    handleChange=(prop)=>(e)=>{
        
        this.setState({
            values:{...this.state.values,[prop]:e.target.value},
        },()=>{this.isCorrectInput(prop)})
    }
  render() {
    let {values}=this.state
    return (
      <Card sx={{maxWidth:'75vw',mx:'auto'}}>
        <CardHeader
            title='创建新项目'
            titleTypographyProps={{variant:'h5',fontWeight:'bold'}}
        />
        <CardContent>
            <Snackbar onClose={this.handleCloseSnackbar} anchorOrigin={{vertical:'top',horizontal:'center'}} open={this.state.snackmessage.show} autoHideDuration={3000}>
                <Alert onClose={this.handleCloseSnackbar} severity={this.state.snackmessage.severity} sx={{width:'50ch'}}>
                    {this.state.snackmessage.text}
                </Alert>
            </Snackbar>
            <Stack sx={{minHeight:'75vh', display:'flex',flexWrap:'wrap',overflow:'auto'}} spacing={2}>
                <Divider flexItem textAlign='left'><Typography variant='h6' fontWeight='bold'>项目属性</Typography></Divider>
                <Grid container>
                    <FormControl sx={{m:1, width:'40ch'}} variant='outlined' error={this.state.error.name}>
                        <InputLabel htmlFor='project-name'>项目名称</InputLabel>
                        <OutlinedInput
                            required                  
                            id='project-name'
                            value={values.name}
                            onChange={this.handleChange('name')}
                            onFocus={this.handleFoucus('name')}
                            onBlur={this.handleblur('name')}
                            label="项目名称"
                            />
                            <FormHelperText>{this.state.helperText.name}</FormHelperText>
                    </FormControl>
                    <FormControl sx={{m:1, width:'25ch'}} variant='outlined' error={this.state.error.type}>
                        <InputLabel id="type-select-label">项目类型</InputLabel>
                        <Select
                            required
                            labelId='type-select-label'
                            id='project-type'
                            value={values.type}
                            onChange={this.handleChange('type')}
                            onFocus={this.handleFoucus('type')}
                            onBlur={this.handleblur('type')}
                            label="项目类型"
                            >   
                                {typeItems}
                        </Select>
                        <FormHelperText>{this.state.helperText.type}</FormHelperText>
                    </FormControl>
                </Grid>
                <Grid container sx={{mt:0}}>
                    <FormControl sx={{m:1}} fullWidth variant='outlined' error={this.state.error.description}>
                        <InputLabel htmlFor='description'>项目描述</InputLabel>
                        <OutlinedInput
                        multiline
                        rows={5}
                        fullWidth
                        required
                        id="description"
                        value={values.description}
                        onChange={this.handleChange('description')}
                        onFocus={this.handleFoucus('description')}
                        onBlur={this.handleblur('description')}
                        label="项目描述"
                        />
                        <FormHelperText>{this.state.helperText.description}</FormHelperText>
                    </FormControl>
                </Grid>
                <Divider flexItem textAlign='left'><Typography variant='h6' fontWeight='bold'>项目文件</Typography></Divider>
                <Stack sx={{height:'auto'}}>
                    <Dragger {...this.uploadProps} fileList={this.state.fileList} style={{marginBottom:'24px',maxHeight:'200px'}}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">点击或拖拽上传文件</p>
                        <p className="ant-upload-hint">
                        支持批量上传
                        </p>
                    </Dragger>
                    
                </Stack>
                <Stack justifyContent='center' alignItems='center'>
                    <Button variant='contained' onClick={this.testDBConnection}>
                        测试数据库连接
                    </Button>
                    <LoadingButton variant='contained' loading={this.state.creating} onClick={this.handleSubmit}>
                        创建项目
                    </LoadingButton>
                </Stack>
                
            </Stack>
        </CardContent>
      </Card>
    )
  }
}

const typeItems = [
    <MenuItem value='table'>表格数据合规</MenuItem>,
    <MenuItem value='game'>游戏合规</MenuItem>,
    <MenuItem value='image'>图片合规</MenuItem>,
    <MenuItem value='text'>文本合规</MenuItem>,
    <MenuItem value='speech'>音频合规</MenuItem>,
    <MenuItem value='other'>其他</MenuItem>,
]

export default withRouter(CreateProject)