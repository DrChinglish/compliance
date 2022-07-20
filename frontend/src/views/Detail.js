import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {Drawer, AppBar, Typography, Stack, Card, CardHeader, Button, CardContent, IconButton, Accordion, AccordionSummary, AccordionDetails} from "@mui/material"
import DataGridS from '../components/elements/DataGridS/DataGridS'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { GridActionsCellItem} from '@mui/x-data-grid'



// icons
import BuildIcon from '@mui/icons-material/Build';
import { ExpandMore, MoreVert } from '@mui/icons-material';
import RadarChart from '../components/elements/ScoreRadarChart/ScoreRadarChart';
export default class Detail extends Component {
  

  render() {
    return (
      <>
        <Stack direction='row' spacing={2}>
          <Stack spacing={2} sx={{flexGrow:6}}>
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
          <Stack sx={{flexGrow:4}} spacing={2}>

            {/* 审计结果（suggestion） */}
            <Card>
              <CardHeader 
                title='审计结果'
                titleTypographyProps={{variant:'h6',fontWeight:'bold'}}
                action={
                  <Button variant='contained' startIcon={<BuildIcon/>}>FIX ALL</Button>
                }
              >

              </CardHeader>
              <CardContent>
                <Accordion disableGutters>
                  <AccordionSummary sx={{backgroundColor:'red'}} expandIcon={<ExpandMore color='inherit'/>}>
                    <Typography color='white' fontWeight='bold'>
                      高风险
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    Detail
                  </AccordionDetails>
                </Accordion>
                <Accordion disableGutters>
                  <AccordionSummary sx={{backgroundColor:'Orange'}} expandIcon={<ExpandMore color='inherit'/>}>
                    <Typography color='white' fontWeight='bold'>
                      中风险
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    Detail
                  </AccordionDetails>
                </Accordion>
                <Accordion disableGutters>
                  <AccordionSummary sx={{backgroundColor:'lightblue'}} expandIcon={<ExpandMore color='inherit'/>}>
                    <Typography color='white' fontWeight='bold'>
                      低风险
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    Detail
                  </AccordionDetails>
                </Accordion>
              </CardContent>
            </Card>

            {/* 图表区域 */}
            <Card>
              <CardHeader 
                title='合规分数'
                titleTypographyProps={{variant:'h6',fontWeight:'bold'}}
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
Detail.propTypes = {}

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
  ]
  const columns = [
        
    //other columns...
    {field: 'name', headerName: '姓名',flex:1,type:'string'},
    {field: 'address', headerName: '地址',flex: 1},
    {field: 'phone' ,headerName: '电话' , flex: 1, type: 'string'},
    //reserved columns...
    {field: '_operation', headerName: '操作',width: 70,type: 'actions', getActions: (params)=>[
      <GridActionsCellItem icon={<RemoveRedEyeIcon/>} onClick={(e)=>{console.log(params)}} label="查看详情" />
    ]},
]