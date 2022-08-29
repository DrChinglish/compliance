import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {Drawer, AppBar, Typography, Stack, Card, CardHeader, Button, CardContent, IconButton, Accordion, AccordionSummary, AccordionDetails, ButtonGroup, CssBaseline, Chip, ListItem} from "@mui/material"
import DataGridS from '../components/elements/DataGridS/DataGridS'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { GridActionsCellItem} from '@mui/x-data-grid'
import RadarChart from '../components/elements/ScoreRadarChart/ScoreRadarChart';
import { useParams } from 'react-router-dom';
import withRouter from '../utils/WithRouter';

// icons
import BuildIcon from '@mui/icons-material/Build';
import { CheckBox, ExpandMore, MoreVert } from '@mui/icons-material';
import ResultS from '../components/elements/ResultS/ResultS';


 class Detail extends Component {
  constructor(props){
    super(props)
    console.log(this)
  }

  render() {
    return (
      <>
        <Stack direction='row' spacing={2}>
          <CssBaseline/>
          <Stack spacing={2} sx={{width:'60%'}}>
          <Card>
              <CardHeader 
                title='项目详情'
                titleTypographyProps={{variant:'h6',fontWeight:'bold'}}
                action={
                  <IconButton>
                    <MoreVert/>
                  </IconButton>
                }
              >
              </CardHeader>
              <CardContent sx={{px:2}}>
                {/* pass actual data here */}
                <DataGridS columns={columns} rows={rows}/>

              </CardContent>
            </Card>
            
          </Stack>
          <Stack sx={{width:'40%'}} spacing={2}>

            {/* 审计结果（suggestion） */}
            <ResultS suggestions={suggestions}>

            </ResultS>

            {/* 图表区域 */}
            <Card>
              <CardHeader 
                title='合规分数'
                titleTypographyProps={{variant:'h6',fontWeight:'bold'}}
                // sx={{backgroundColor:'darkgray'}}
                action={
                  <IconButton>
                    <MoreVert/>
                  </IconButton>
                }
              >

              </CardHeader>
              <CardContent>
                {/* radar chart, can be replaced by other charts. Need to be feed with analysis score(Not yet implemented) */}
                <RadarChart/>
              </CardContent>
            </Card>
          </Stack>
        </Stack>
        
        
      </>
    )
  }
}
export default withRouter(Detail)
Detail.propTypes = {}

const suggestions=[
  {
    id:1,
    seriousness:'high',
    title:'123',
    description:'114514'
  },
  {
    id:2,
    seriousness:'medium',
    title:'123',
    description:'114514'
  },
  {
    id:3,
    seriousness:'high',
    title:'123',
    description:'114514'
  },
]
const rows=[
    {
      id:1,
      name: "张三",
      address: "114514",
      phone: "12345678901",
    },
    {
      id:2,
      name: "张三",
      address: "114514",
      phone: "12345678901",
    },
    {
      id:3,
      name: "张三",
      address: "114514",
      phone: "12345678901",
    },
    {
      id:4,
      name: "张三",
      address: "114514",
      phone: "12345678901",
    },
    {
      id:5,
      name: "张三",
      address: "114514",
      phone: "12345678901",
    },
    {
      id:6,
      name: "张三",
      address: "114514",
      phone: "12345678901",
    },
    {
      id:7,
      name: "张三",
      address: "114514",
      phone: "12345678901",
    },
    {
      id:8,
      name: "张三",
      address: "114514",
      phone: "12345678901",
    },
  ]
  const columns = [
        
    //other columns...
    {field: 'name', headerName: '姓名',flex:1,type:'string'},
    {field: 'address', headerName: '地址',flex: 1},
    {field: 'phone' ,headerName: '电话' , flex: 1, type: 'string'},
    //reserved columns...
    {field: '_operation', headerName: '操作',width: 100,type: 'actions', getActions: (params)=>[
      <Stack spacing={1} direction="row">
        <GridActionsCellItem icon={<BuildIcon/>} onClick={(e)=>{console.log(params)}} label="修复" />
        <GridActionsCellItem icon={<RemoveRedEyeIcon/>} onClick={(e)=>{console.log(params)}} label="查看详情" />
      </Stack>
    ]},
]