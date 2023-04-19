import { CardContent, CardHeader, FormControl, Grid, InputLabel, MenuItem, OutlinedInput, Select, Card, Button, Divider, Stack, Typography, FormHelperText, Snackbar, Alert, Chip } from '@mui/material'
import { Box } from '@mui/system'
import {LoadingButton} from '@mui/lab'
import React, { Component } from 'react'
import withRouter from '../utils/WithRouter'
import { message, Upload} from 'antd'
import { InboxOutlined } from '@ant-design/icons';
import cookie from 'react-cookies'
import DoneIcon from '@mui/icons-material/Done';
import fetchHandle from '../utils/FetchErrorhandle' 
import urlMapping from '../urlMapping.json'
import { FileMeta, FormState, SnackbarStatus, WithRouterProps } from '../Interfaces'
import SnackBar from '../components/elements/SnackBar'
import { RcFile, UploadFile } from 'antd/lib/upload'
import { NavigateFunction, Params } from 'react-router-dom'
import { UploadListType } from 'antd/lib/upload/interface'
import { createGameProject, createPlatformProject, setCookies } from '../utils/APIs'
import { LocallizationLaw } from '../utils/util'
const {Dragger} = Upload
//import "../assets/scss/createProject.scss"

const helperText={
    empty:'该项目是必填项'
}

type Props={
    
}& WithRouterProps

function emptyFormState(array:boolean=false){
    
    return{
        error:false,
        helperText:'',
        values:array?[]:'',
        touched:false
    }
}

type State={
    forms:{
        name:FormState,
        type:FormState,
        description:FormState,
        law:FormState
    },
    snackbarStatus:SnackbarStatus,
    errorField:{
        field:string,
        helperText:string
    },
    fileList:UploadFile<any>[],
    creating:boolean,
    success:boolean
}

class CreateProject extends Component<Props, State> {
    componentDidMount=()=>{
        setCookies()
    }

    constructor(props) {
      super(props)
    
      this.state = {
        forms:{name:emptyFormState(),type:emptyFormState(),description:emptyFormState(),law:emptyFormState(true)},
        snackbarStatus:{show:false,text:'',severity:"success"},
        errorField:{
            field:'',
            helperText:''
         },//for backend verification only
         fileList:[],
         creating:false,
         success:false,
      }
    }

    isTouched = (item:string)=>{
        return this.state.forms[item].touched
    }

    isError = (item:string) => {
        return this.state.forms[item].Error
    }

    valueOf = (item:string) => {
        return this.state.forms[item].values
    }

    handleCloseSnackbar = (e,reason)=>{
        console.log(reason)
        if(reason === 'clickaway'){
            return
        }
        this.setState((state)=>{
            state.snackbarStatus.show=false
            return state
        })
    }

    handleSubmit =(e)=>{ 
        this.setState({creating:true})
        let {type,description,law,name}=this.state.forms
        if(type.values === 'other'){
            createPlatformProject(name.values,description.values,law.values,this.state.fileList,
                (e)=>{
                    this.showSnackMessage('error',e)
                    this.setState({creating:false})
                },
                (res)=>{
                    console.log(res)
                    this.showSnackMessage('success','创建项目成功，正在进入下一个步骤')
                    this.setState({creating:false})
                }
            )
            return
        }

        createGameProject(name.values,description.values,this.state.fileList,type.values,
            e=>{
            //console.log(e.name)
            this.showSnackMessage('error',e.name +":"+e.message)
            //console.log(msgstate)
            this.setState({creating:false})    
        }
        ,(msg)=>{
            this.setState({creating:false,success:msg.status===1})
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
                    this.props.navigate(urlMapping.list+'/'+this.state.forms.type.values)
                },3000)
            }
        }
        )
    }

    showSnackMessage = (severity, text)=>{
        let msgstate = this.state.snackbarStatus
        msgstate.show = true
        msgstate.severity = severity
        msgstate.text = text
        this.setState({snackbarStatus:msgstate})
    }

    uploadProps = {
        multiple: true,
        onRemove:(file)=>{
            // let fileList = this.state.fileList
            // const index = fileList.indexOf(file);
            // const newFileList = fileList.slice();
            // newFileList.splice(index, 1);
            // this.setState({fileList:newFileList})
            console.log(this.state.fileList)
            this.setState((state)=>{
                let newFileList = state.fileList.slice()
                newFileList.splice(state.fileList.indexOf(file),1)
                console.log(newFileList)
                return {fileList:newFileList}
            })
        },
        beforeUpload:(file)=>{
            console.log(this.state.fileList)
            this.setState((state)=>{
                return {fileList:[...state.fileList, file]}
            })
            return false
        },
        listType:'picture-card' as UploadListType

    }

    isCorrectInput=(prop)=>{
        let flag = false
        console.log("check")
        let newHelperText: string 
        if (this.valueOf(prop)?.length==0 && this.isTouched(prop)) {
            newHelperText = helperText.empty
            flag=true
        }
        if(prop==this.state.errorField.field){
            helperText[prop] = this.state.errorField.helperText
            flag=true
        }
        //console.log(prop,this.state.values[prop])
        // console.log("1",this.state.touched[prop])
        if(!flag){
            newHelperText = " "
        }
        this.setState((state)=>{
            state.forms[prop].helperText = newHelperText
            return state
        })
        return flag
    }

    handleblur =(prop)=>(e)=>{
        this.isCorrectInput(prop)
    }    

    handleFoucus=(prop)=>(e)=>{
        this.setState((state)=>{
            state.forms[prop].touched = true
        })
    }
    handleChange=(prop)=>(e)=>{
        this.setState((state)=>{
            state.forms[prop].values = e.target.value
        }
        ,()=>{this.isCorrectInput(prop)})
    }
  render() {
    let {name,description,type,law}=this.state.forms
    return (
      <Card sx={{maxWidth:'75vw',mx:'auto'}}>
        <CardHeader
            title='创建新项目'
            titleTypographyProps={{variant:'h5',fontWeight:'bold'}}
        />
        <CardContent>
            <SnackBar status={this.state.snackbarStatus}/>
            <Stack sx={{minHeight:'75vh', display:'flex',flexWrap:'wrap',overflow:'auto'}} spacing={2}>
                <Divider flexItem textAlign='left'><Typography variant='h6' fontWeight='bold'>项目属性</Typography></Divider>
                <Grid container>
                    <FormControl sx={{m:1, width:'40ch'}} variant='outlined' error={name.error}>
                        <InputLabel htmlFor='project-name'>项目名称</InputLabel>
                        <OutlinedInput
                            required                  
                            id='project-name'
                            value={name.values}
                            onChange={this.handleChange('name')}
                            onFocus={this.handleFoucus('name')}
                            onBlur={this.handleblur('name')}
                            label="项目名称"
                            />
                            <FormHelperText>{name.helperText}</FormHelperText>
                    </FormControl>
                    <FormControl sx={{m:1, width:'25ch'}} variant='outlined' error={type.error}>
                        <InputLabel id="type-select-label">项目类型</InputLabel>
                        <Select
                            required
                            labelId='type-select-label'
                            id='project-type'
                            value={type.values}
                            onChange={this.handleChange('type')}
                            onFocus={this.handleFoucus('type')}
                            onBlur={this.handleblur('type')}
                            label="项目类型"
                            >   
                                {typeItems}
                        </Select>
                        <FormHelperText>{type.helperText}</FormHelperText>
                    </FormControl>
                    
                </Grid>
                <Grid container>
                    <FormControl sx={{m:1, width:'67ch'}} variant='outlined' error={law.error}>
                        <InputLabel id="type-select-label-law">选择法律</InputLabel>
                        <Select
                            multiple
                            required
                            labelId='type-select-label-law'
                            id='project-law'
                            value={law.values}
                            onChange={this.handleChange('law')}
                            onFocus={this.handleFoucus('law')}
                            onBlur={this.handleblur('law')}
                            label="选择法律"
                            renderValue={(selected)=> (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                  {selected.map((value) => (
                                    <Chip key={value} label={LocallizationLaw[value]} />
                                  ))}
                                </Box>
                                  )}
                            >   
                                {typeItemslaw}
                        </Select>
                        <FormHelperText>{law.helperText}</FormHelperText>
                    </FormControl>
                </Grid>
                <Grid container sx={{mt:0}}>
                    <FormControl sx={{m:1}} fullWidth variant='outlined' error={description.error}>
                        <InputLabel htmlFor='description'>项目描述</InputLabel>
                        <OutlinedInput
                        multiline
                        rows={5}
                        fullWidth
                        required
                        id="description"
                        value={description.values}
                        onChange={this.handleChange('description')}
                        onFocus={this.handleFoucus('description')}
                        onBlur={this.handleblur('description')}
                        label="项目描述"
                        />
                        <FormHelperText>{description.helperText}</FormHelperText>
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
                    <LoadingButton startIcon={this.state.success?<DoneIcon/>:undefined} variant='contained' loading={this.state.creating} color={this.state.success?'success':'primary'}
                    onClick={this.state.success?()=>{}:this.handleSubmit}>
                        {this.state.success?"完成":"创建项目"}
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
const typeItemslaw = [
    <MenuItem value='personal'>个人信息保护法</MenuItem>,
    <MenuItem value='network'>网络安全法</MenuItem>,
    <MenuItem value='data'>数据安全法</MenuItem>
]


export default withRouter(CreateProject)