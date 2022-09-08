import { CardContent, CardHeader, FormControl, Grid, InputLabel, MenuItem, OutlinedInput, Select, Card } from '@mui/material'
import { Box } from '@mui/system'
import React, { Component } from 'react'
import withRouter from '../utils/WithRouter'

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
         }
      }
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
            titleTypographyProps={{variant:'h6',fontWeight:'bold'}}
        />
        <CardContent>
            <Box sx={{height:'75vh', display:'flex',flexWrap:'wrap'}}>
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
                            <MenuItem value='table'>表格数据合规</MenuItem>
                            <MenuItem value='game'>游戏合规</MenuItem>
                            <MenuItem value='picture'>图片合规</MenuItem>
                            <MenuItem value='text'>文本合规</MenuItem>
                            <MenuItem value='voice'>音频合规</MenuItem>
                            <MenuItem value='other'>其他</MenuItem>
                    </Select>
                </FormControl>
            </Box>
        </CardContent>
      </Card>
    )
  }
}
export default withRouter(CreateProject)