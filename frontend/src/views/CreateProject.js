import { CardContent, CardHeader, FormControl, Grid, InputLabel, MenuItem, OutlinedInput, Select, Card, Button, Divider, Stack, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { Component } from 'react'
import withRouter from '../utils/WithRouter'
import { Upload} from 'antd'
import { InboxOutlined } from '@ant-design/icons';
const {Dragger} = Upload
//import "../assets/scss/createProject.scss"

class CreateProject extends Component {

    constructor(props) {
      super(props)
    
      this.state = {
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
         fileList:[],
         creating:false,
      }
    }

    handleSubmit =(e)=>{
        const formdata = new FormData()
        this.state.fileList.forEach((file)=>{
            formdata.append('files[]',file)
        })
        this.setState({creating:true})
        fetch("http://localhost:8000/new_project",{
            method:'POST',
            body:formdata,
        })
        .then((res)=>{
            return res.json()
        })
        .then((msg)=>{
            console.log(msg)
        })
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
        
        console.log(prop,this.state.values[prop])
        console.log("1",this.state.touched[prop])
        return this.state.values[prop]?.length==0 && this.state.touched[prop]
    }
    handleFoucus=(prop)=>(e)=>{
        this.setState({
            touched:{...this.state.touched,[prop]:true}
        })
    }
    handleChange=(prop)=>(e)=>{
        this.setState({
            values:{...this.state.values,[prop]:e.target.value},
        })
    }
  render() {
    let {values}=this.state
    return (
      <Card>
        <CardHeader
            title='创建新项目'
            titleTypographyProps={{variant:'h5',fontWeight:'bold'}}
        />
        <CardContent>
            <Stack sx={{minHeight:'75vh', display:'flex',flexWrap:'wrap',overflow:'auto'}} spacing={4}>
                <Divider flexItem textAlign='left'><Typography variant='h6' fontWeight='bold'>项目属性</Typography></Divider>
                <Grid container>
                    <FormControl sx={{m:1, width:'40ch'}} variant='outlined' error={this.isCorrectInput('name')}  >
                        <InputLabel htmlFor='project-name'>项目名称</InputLabel>
                        <OutlinedInput
                            required                  
                            id='project-name'
                            value={values.name}
                            onChange={this.handleChange('name')}
                            onFocus={this.handleFoucus('name')}
                            label="项目名称"
                            />
                    </FormControl>
                    <FormControl sx={{m:1, width:'25ch'}} variant='outlined' error={this.isCorrectInput('type')}>
                        <InputLabel id="type-select-label">项目类型</InputLabel>
                        <Select
                            required
                            labelId='type-select-label'
                            id='project-type'
                            value={values.type}
                            onChange={this.handleChange('type')}
                            onFocus={this.handleFoucus('type')}
                            label="项目类型"
                            >   
                                {typeItems}
                        </Select>
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
                    <Button variant='contained'>
                        创建项目
                    </Button>
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
    <MenuItem value='picture'>图片合规</MenuItem>,
    <MenuItem value='text'>文本合规</MenuItem>,
    <MenuItem value='voice'>音频合规</MenuItem>,
    <MenuItem value='other'>其他</MenuItem>,
]

export default withRouter(CreateProject)