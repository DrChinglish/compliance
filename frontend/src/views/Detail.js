import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {Drawer, AppBar, Typography, Stack, Card, CardHeader, Button, CardContent, IconButton, Accordion, AccordionSummary, AccordionDetails, ButtonGroup, CssBaseline, Chip, ListItem} from "@mui/material"
import DataGridS from '../components/elements/DataGridS/DataGridS'
import DataGridP from '../components/elements/DataGridP/DataGridP'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { GridActionsCellItem} from '@mui/x-data-grid'
import RadarChart from '../components/elements/ScoreRadarChart/ScoreRadarChart';
import { useParams } from 'react-router-dom';
import withRouter from '../utils/WithRouter';

// icons
import BuildIcon from '@mui/icons-material/Build';
import { CheckBox, ExpandMore, MoreVert } from '@mui/icons-material';
import ResultS from '../components/elements/ResultS/ResultS';
import GameMeta from '../components/elements/GameMeta/GameMeta'


 class Detail extends Component {

  projectType(index){
    //分类项目类型（结构化数据、图片音频等）,还需要后续实现
    
    if(index==1){
      return 'S'
    }else if(index==2){
      return 'G'
    }else{
      return 'P'
    }
  }

  constructor(props){
    super(props)
    console.log(this.props.params.id)
  }

  render() {
    var content
    let defaultsx={px:2}
    switch(this.projectType(this.props.params.id)){
      case 'S': content = <DataGridS columns={columns} rows={rows}/>;break;
      case 'G': content = <GameMeta fileList={fileList}/> ;defaultsx={px:0};break;
      case 'P': content = <DataGridP columns={columnsP} rows={rows}/>;break;
      default: content = <h6> 404 </h6>
    }
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
              <CardContent sx={defaultsx}>
                {/* pass real data here */}
                
                {content}

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

const CellRenderer=(props)=>{
  const { hasFocus, value } = props;
  const buttonElement = React.useRef(null);
  const rippleRef = React.useRef(null);

  React.useLayoutEffect(() => {
    if (hasFocus) {
      const input = buttonElement.current?.querySelector('input');
      input?.focus();
    } else if (rippleRef.current) {
      // Only available in @mui/material v5.4.1 or later
      rippleRef.current.stop({});
    }
  }, [hasFocus]);
  //console.log(props)
  return(
    <Button >abc</Button>
  )
}

const fileList=[
  {name:'dialog.txt',size:'100kb',type:'text',content:`Method:

  Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10 minutes.
  
  Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over medium-high heat. Add chicken, shrimp and chorizo, and cook, stirring occasionally until lightly browned, 6 to 8 minutes. Transfer shrimp to a large plate and set aside, leaving chicken and chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes, onion, salt and pepper, and cook, stirring often until thickened and fragrant, about 10 minutes. Add saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
  
  Add rice and stir very gently to distribute. Top with artichokes and peppers, and cook without stirring, until most of the liquid is absorbed, 15 to 18 minutes. Reduce heat to medium-low, add reserved shrimp and mussels, tucking them down into the rice, and cook again without stirring, until mussels have opened and rice is just tender, 5 to 7 minutes more. (Discard any mussels that don't open.)
  
  Set aside off of the heat to let rest for 10 minutes, and then serve.`},
  {name:'b',size:'200kb',type:'text',content:`Method:

  Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10 minutes.
  
  Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over medium-high heat. Add chicken, shrimp and chorizo, and cook, stirring occasionally until lightly browned, 6 to 8 minutes. Transfer shrimp to a large plate and set aside, leaving chicken and chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes, onion, salt and pepper, and cook, stirring often until thickened and fragrant, about 10 minutes. Add saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
  
  Add rice and stir very gently to distribute. Top with artichokes and peppers, and cook without stirring, until most of the liquid is absorbed, 15 to 18 minutes. Reduce heat to medium-low, add reserved shrimp and mussels, tucking them down into the rice, and cook again without stirring, until mussels have opened and rice is just tender, 5 to 7 minutes more. (Discard any mussels that don't open.)
  
  Set aside off of the heat to let rest for 10 minutes, and then serve.`},
  {name:'c',size:'300kb',type:'text',content:`Method:

  Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10 minutes.
  
  Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over medium-high heat. Add chicken, shrimp and chorizo, and cook, stirring occasionally until lightly browned, 6 to 8 minutes. Transfer shrimp to a large plate and set aside, leaving chicken and chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes, onion, salt and pepper, and cook, stirring often until thickened and fragrant, about 10 minutes. Add saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
  
  Add rice and stir very gently to distribute. Top with artichokes and peppers, and cook without stirring, until most of the liquid is absorbed, 15 to 18 minutes. Reduce heat to medium-low, add reserved shrimp and mussels, tucking them down into the rice, and cook again without stirring, until mussels have opened and rice is just tender, 5 to 7 minutes more. (Discard any mussels that don't open.)
  
  Set aside off of the heat to let rest for 10 minutes, and then serve.`},
  {name:'d',size:'1mb',type:'text',content:`Method:

  Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10 minutes.
  
  Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over medium-high heat. Add chicken, shrimp and chorizo, and cook, stirring occasionally until lightly browned, 6 to 8 minutes. Transfer shrimp to a large plate and set aside, leaving chicken and chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes, onion, salt and pepper, and cook, stirring often until thickened and fragrant, about 10 minutes. Add saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
  
  Add rice and stir very gently to distribute. Top with artichokes and peppers, and cook without stirring, until most of the liquid is absorbed, 15 to 18 minutes. Reduce heat to medium-low, add reserved shrimp and mussels, tucking them down into the rice, and cook again without stirring, until mussels have opened and rice is just tender, 5 to 7 minutes more. (Discard any mussels that don't open.)
  
  Set aside off of the heat to let rest for 10 minutes, and then serve.`},
]

const columnsP = [
        
  //other columns...
  {field: 'name', headerName: '姓名',flex:1,type:'string'},
  {field: 'address', headerName: '地址',flex: 1},
  {field: 'phone' ,headerName: '电话' , flex: 1, type: 'string'},
  {field: 'test' ,headerName: 'test' , flex: 1, renderCell:CellRenderer,valueGetter:()=>{return 1}},
  //reserved columns...
  {field: '_operation', headerName: '操作',width: 100,type: 'actions', getActions: (params)=>[
    <Stack spacing={1} direction="row">
      <GridActionsCellItem icon={<BuildIcon/>} onClick={(e)=>{console.log(params)}} label="修复" />
      <GridActionsCellItem icon={<RemoveRedEyeIcon/>} onClick={(e)=>{console.log(params)}} label="查看详情" />
    </Stack>
  ]},
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