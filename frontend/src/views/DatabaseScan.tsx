import { InboxOutlined } from '@ant-design/icons'
import { LoadingButton } from '@mui/lab'
import {Card, Divider, Typography, Grid, Select, CardHeader, CardContent, Stack, FormControl, InputLabel, OutlinedInput, FormHelperText, Box, Chip } from '@mui/material'
import React, { Component } from 'react'
import SnackBar from '../components/elements/SnackBar'
import { LocallizationLaw } from '../utils/util'
import { FormState, SnackbarStatus } from '../Interfaces'
import { databaseScan } from '../utils/APIs'
import DoneIcon from '@mui/icons-material/Done';
type Props = {}
const helperText={
    empty:'该项目是必填项'
}

type State = {
    forms:{
        ip:FormState,
        user:FormState,
        password:FormState,
        schema:FormState,
        table:FormState
    },
    snackbarStatus:SnackbarStatus,
    errorField:{
        field:string,
        helperText:string
    },
    creating:boolean,
    success:boolean
}

function emptyFormState(array:boolean=false){
    
    return{
        error:false,
        helperText:'',
        values:array?[]:'',
        touched:false
    }
}

export default class DatabaseScan extends Component<Props, State> {
    constructor(props) {
        super(props)
      
        this.state = {
          forms:{ip:emptyFormState(),user:emptyFormState(),password:emptyFormState(),schema:emptyFormState(),table:emptyFormState()},
          snackbarStatus:{show:false,text:'',severity:"success"},
          errorField:{
              field:'',
              helperText:''
           },//for backend verification only
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

    handleSubmit = ()=>{
        let {ip,password,schema,table,user} = this.state.forms
        databaseScan(ip.values,user.values,password.values,schema.values,table.values,()=>{},(res)=>{
            console.log(res)
        })
    }

  render() {
    let {ip,user,password,schema,table}=this.state.forms
    return (
        <Card sx={{maxWidth:'75vw',mx:'auto'}}>
        <CardHeader
            title='数据库敏感信息扫描'
            titleTypographyProps={{variant:'h5',fontWeight:'bold'}}
        />
        <CardContent>
            <SnackBar status={this.state.snackbarStatus}/>
            <Stack sx={{minHeight:'75vh', display:'flex',flexWrap:'wrap',overflow:'auto'}} spacing={2}>
                <Divider flexItem textAlign='left'><Typography variant='h6' fontWeight='bold'>连接信息</Typography></Divider>
                <Grid container>
                    <FormControl sx={{m:1, width:'40ch'}} variant='outlined' error={ip.error}>
                        <InputLabel htmlFor='db-address'>数据库地址</InputLabel>
                        <OutlinedInput
                            required                  
                            id='db-address'
                            value={ip.values}
                            onChange={this.handleChange('ip')}
                            onFocus={this.handleFoucus('ip')}
                            onBlur={this.handleblur('ip')}
                            label="数据库地址"
                            />
                            <FormHelperText>{ip.helperText}</FormHelperText>
                    </FormControl>
                    <FormControl sx={{m:1, width:'40ch'}} variant='outlined' error={user.error}>
                        <InputLabel htmlFor='db-user'>用户名</InputLabel>
                        <OutlinedInput
                            required                  
                            id='db-user'
                            value={user.values}
                            onChange={this.handleChange('user')}
                            onFocus={this.handleFoucus('user')}
                            onBlur={this.handleblur('user')}
                            label="用户名"
                            />
                            <FormHelperText>{user.helperText}</FormHelperText>
                    </FormControl>
                    <FormControl sx={{m:1, width:'40ch'}} variant='outlined' error={password.error}>
                        <InputLabel htmlFor='db-password'>密码</InputLabel>
                        <OutlinedInput
                            type='password'
                            required                  
                            id='db-password'
                            value={password.values}
                            onChange={this.handleChange('password')}
                            onFocus={this.handleFoucus('password')}
                            onBlur={this.handleblur('password')}
                            label="数据库连接密码"
                            />
                            <FormHelperText>{password.helperText}</FormHelperText>
                    </FormControl>
                    <FormControl sx={{m:1, width:'40ch'}} variant='outlined' error={schema.error}>
                        <InputLabel htmlFor='db-schema'>数据库名称</InputLabel>
                        <OutlinedInput
                            required                  
                            id='db-schema'
                            value={schema.values}
                            onChange={this.handleChange('schema')}
                            onFocus={this.handleFoucus('schema')}
                            onBlur={this.handleblur('schema')}
                            label="数据库名称"
                            />
                            <FormHelperText>{schema.helperText}</FormHelperText>
                    </FormControl>
                    <FormControl sx={{m:1, width:'40ch'}} variant='outlined' error={table.error}>
                        <InputLabel htmlFor='db-table'>数据表名称</InputLabel>
                        <OutlinedInput
                            required                  
                            id='db-table'
                            value={table.values}
                            onChange={this.handleChange('table')}
                            onFocus={this.handleFoucus('table')}
                            onBlur={this.handleblur('table')}
                            label="项目名称"
                            />
                            <FormHelperText>{table.helperText}</FormHelperText>
                    </FormControl>
                </Grid>
                
                <Stack justifyContent='center' alignItems='center'>
                    <LoadingButton startIcon={this.state.success?<DoneIcon/>:undefined} variant='contained' loading={this.state.creating} color={this.state.success?'success':'primary'}
                    onClick={this.state.success?()=>{}:this.handleSubmit}>
                        {this.state.success?"完成":"开始扫描"}
                    </LoadingButton>
                </Stack>
                
            </Stack>
        </CardContent>
      </Card>
    )
  }
}