import { InboxOutlined } from '@ant-design/icons'
import { LoadingButton } from '@mui/lab'
import {Card, Divider, Typography, Grid, Select, CardHeader, CardContent, Stack, FormControl, InputLabel, OutlinedInput, FormHelperText, Box, Chip, MenuItem, List, Paper, ListItem, Checkbox, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import React, { Component } from 'react'
import SnackBar from '../components/elements/SnackBar'
import { LocallizationLaw } from '../utils/util'
import { FormState, SnackbarStatus } from '../Interfaces'
import { databaseScan, databaseScanAll } from '../utils/APIs'
import DoneIcon from '@mui/icons-material/Done';
import StatusContainer from '../components/elements/StatusContainer'
import Titles from '../components/typography/Titles'
import ScanResultType from '../components/elements/DatabaseScan/ScanResultType'
import ScanResultSum from '../components/elements/DatabaseScan/ScanResultSum'
import ScanResult from '../components/elements/DatabaseScan/ScanResult'
type Props = {}
const helperText={
    empty:'该项目是必填项'
}

type State = {
    forms:{
        ip:FormState,
        user:FormState,
        password:FormState,
        dbtype:FormState,
        schema:FormState,
        table:FormState
    },
    snackbarStatus:SnackbarStatus,
    errorField:{
        field:string,
        helperText:string
    },
    creating:boolean,
    success:boolean,
    connected:string,
    databases:string[],
    checked:string[],
    isResult:string,
    result:any
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
          forms:{dbtype:emptyFormState(),ip:emptyFormState(),user:emptyFormState(),password:emptyFormState(),schema:emptyFormState(),table:emptyFormState()},
          snackbarStatus:{show:false,text:'',severity:"success"},
          errorField:{
              field:'',
              helperText:''
           },//for backend verification only
           creating:false,
           success:false,
           connected:'initial',
           databases:[],
           checked:[],
           isResult:'initial',
           result:undefined
        }
    }

    handleToggle = (value: string) => () => {
        let {checked} = this.state 
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];
    
        if (currentIndex === -1) {
          newChecked.push(value);
        } else {
          newChecked.splice(currentIndex, 1);
        }
        console.log(newChecked)
        this.setState({checked:newChecked})
      };

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
    showSnackMessage = (severity, text)=>{
        let msgstate = this.state.snackbarStatus
        msgstate.show = true
        msgstate.severity = severity
        msgstate.text = text
        this.setState({snackbarStatus:msgstate})
    }

    handleSubmit = ()=>{
        let {ip,password,dbtype,table,user} = this.state.forms
        this.setState({connected:'loading'})
        databaseScan(ip.values,user.values,password.values,dbtype.values,
            (e)=>{this.showSnackMessage('error','发生了一个错误，可能是数据库用户名密码错误')},
            (res)=>{
            if(res.databases?.length>0){
                this.setState({databases:res.databases,connected:'success'})
            }
            console.log(res)
        })
    }

    render_result=()=>{
        let ret:JSX.Element[]=[]
        let res = this.state.result
        for(let db in res){
            ret.push(<ScanResult database_name={db} database_data={res[db]}/>)
        }
        return ret
    }

    handleScan = ()=>{
        let {ip,password,dbtype,table,user} = this.state.forms
        this.setState({isResult:'loading'})
        databaseScanAll(this.state.checked,ip.values,user.values,password.values,dbtype.values,
            (e)=>{
                this.showSnackMessage('error','发生了一个错误，可能是数据库用户名密码错误')
                this.setState({isResult:'error'})
            },
            (res)=>{
            if(res.data){
                this.setState({result:res.data,isResult:'success'})
            }
            console.log(res)
        })
        }
    

  render() {
    let {ip,user,password,dbtype,table}=this.state.forms
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
                            // defaultValue='127.0.0.1'                
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
                            // defaultValue='root'             
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
                    <FormControl sx={{m:1, width:'25ch'}} variant='outlined' error={dbtype.error}>
                        <InputLabel id="dbtype-select-label">数据库类型</InputLabel>
                        <Select
                            required
                            // defaultValue='mysql'
                            labelId='dbtype-select-label'
                            id='dbtype'
                            value={dbtype.values}
                            onChange={this.handleChange('dbtype')}
                            onFocus={this.handleFoucus('dbtype')}
                            onBlur={this.handleblur('dbtype')}
                            label="数据库类型"
                            >   
                                {typeItems}
                        </Select>
                        <FormHelperText>{dbtype.helperText}</FormHelperText>
                    </FormControl>
                    {/* <FormControl sx={{m:1, width:'40ch'}} variant='outlined' error={table.error}>
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
                    </FormControl> */}
                </Grid>
                
                <Stack justifyContent='center' alignItems='center'>
                    <LoadingButton startIcon={this.state.success?<DoneIcon/>:undefined} variant='contained' loading={this.state.creating} color={this.state.success?'success':'primary'}
                    onClick={this.state.success?()=>{}:this.handleSubmit}>
                        {this.state.success?"完成":"连接到数据库"}
                    </LoadingButton>
                    <Divider flexItem textAlign='left'><Typography variant='h6' fontWeight='bold'>选择数据库</Typography></Divider>
                    <Paper>
                        <StatusContainer sx={{width:'400px', height:'50vh'}} status={this.state.connected} initialText='连接到数据库以选择需要审查的内容'>
                            <Box sx={{p:2}}>
                                <Titles>请选择需要扫描的数据库</Titles>
                            </Box>
                            <Divider></Divider>
                            <List sx={{bgcolor:'background.paper',height:'calc(100% - 128px)', overflowY:'auto'}}>
                                {this.state.databases.map((value,index)=>{
                                    const labelID = `db-list-${value}`
                                    return (
                                        <ListItem
                                        key={value}
                                        disablePadding
                                    >
                                        <ListItemButton role={undefined} onClick={this.handleToggle(value)} dense>
                                        <ListItemIcon>
                                            <Checkbox
                                            edge="start"
                                            checked={this.state.checked.indexOf(value) !== -1}
                                            tabIndex={-1}
                                            disableRipple
                                            inputProps={{ 'aria-labelledby': labelID }}
                                            />
                                        </ListItemIcon>
                                        <ListItemText id={labelID} primary={`${value}`} />
                                        </ListItemButton>
                                    </ListItem>
                                    )
                                })}
                            </List>
                            <Divider/>
                            <Box sx={{height:'64px'}} display={'flex'} alignItems='center' justifyContent='center'>
                                <LoadingButton startIcon={this.state.isResult==='success'?<DoneIcon/>:undefined} 
                                variant='contained' loading={this.state.isResult==='loading'} 
                                disabled={this.state.checked.length===0}
                                color={this.state.isResult==='success'?'success':'primary'}
                                onClick={this.state.isResult==='success'?()=>{}:this.handleScan}>
                                    {this.state.success?"完成":"连接到数据库"}
                                </LoadingButton>
                            </Box>
                            
                            
                        </StatusContainer>
                    </Paper>
                    
                </Stack>
                <Divider flexItem textAlign='left'><Typography variant='h6' fontWeight='bold'>检测结果</Typography></Divider>
                <Stack justifyContent='center' alignItems='center' sx={{p:2}}>
                    <StatusContainer status={this.state.isResult} initialText='选择数据库后点击开始检测并等待结果'>
                       {this.render_result()}
                    </StatusContainer>
                </Stack>
                
            </Stack>
        </CardContent>
      </Card>
    )
  }
}

const typeItems = [
    <MenuItem value='mysql'>Mysql</MenuItem>,
    <MenuItem value='mssql'>SqlServer</MenuItem>,
]