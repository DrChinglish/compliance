import { createTheme, styled, useTheme } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Avatar, Divider, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography} from '@mui/material';
// icons
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import TableChartIcon from '@mui/icons-material/TableChart';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import ImageIcon from '@mui/icons-material/Image';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import urlMapping from '../../../../urlMapping.json'
import { DrawerHeader } from './DrawerHeader';
import withRouter from '../../../../utils/WithRouter';
import { ThemeProvider } from '@emotion/react';
const drawerWidth = 200;

const theme = createTheme({
  components:{
    // MuiListItemIcon:{
    //   styleOverrides:{
    //     root:{
    //       color:'#FFFFFF',
    //     }
    //   }
    // },
    MuiListItemButton:{
      styleOverrides:{
        selected:{
          backgroundColor:'#202020',
        }
      }
    }
  }
})

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});
  
const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const StyledListItemButton = styled(ListItemButton)(({theme,selected})=>({
  '&.Mui-selected':{
    backgroundColor:'rgba(25,118,210,0.9)'
  },
  '&.Mui-selected:hover':{
    backgroundColor:'rgba(25,118,210,0.5)'
  },
  ...(selected &&{
    '& .MuiListItemIcon-root':{
      color:'#FFFFFF'
    }
  })
}))


class SideDrawer extends Component {
  constructor(props){
    super(props)
    this.state={
      open:false,
      selectedIndex:1
    }
  }
  
  static getDerivedStateFromProps(prop,state){
      if(prop.open!==state.open){//get parent component's open status
        return {
          open : prop.open,
        }
      }
      return null
  }

  

  MenuItem = (item)=>{

    const {open} = this.state 
    return (
      <ThemeProvider theme={theme}>
        <StyledListItemButton
        key={item.title} disablePadding divider onClick={(e)=>{this.setState({selectedIndex:item.id}); this.props.navigate(item.link)}} selected={this.state.selectedIndex==item.id}
          sx={{
            minHeight: 48,
            justifyContent: open ? 'initial' : 'center',
            px: 2.5,
            // bgcolor:'lightgrey'
          }}
        >
          {/* maybe add a 'onclick' event handler here?*/}
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: this.state.open ? 3 : 'auto',
              justifyContent: 'center',
            }}
          >
            {item.icon}
          </ListItemIcon>
          <ListItemText primary={item.title} sx={{ opacity: open ? 1 : 0 }} primaryTypographyProps={{
                  // fontSize: 20,
                  fontWeight: 'bold',
                  letterSpacing: 0,
                }} />
        </StyledListItemButton>
      </ThemeProvider>
        
    )
  }

 

  render() {
    const {open} = this.state
    const {setOpen} = this.props 
    return (
      <Drawer variant='permanent' open={open}>
        <DrawerHeader>
          <Avatar alt='User' sx={{mr:1,height:24,width:24}}/>
          <Typography variant="body" noWrap component="div" sx={{flexGrow:1}}>
            UserName{/* place username here */}
          </Typography>
          <IconButton onClick={(e)=>setOpen(false)}>
            <ChevronLeftIcon/>
          </IconButton>
          
        </DrawerHeader>
        <Divider/>

        <List>
          {menuList.map((item,index)=>(
            this.MenuItem(item)
          ))}
         
        </List>
      </Drawer>
      
    )
  }
}
export default withRouter(SideDrawer)
SideDrawer.propTypes={
  setOpen: PropTypes.func.isRequired,// to let parent notice state change
  open: PropTypes.bool,
}

SideDrawer.defaultProps={
  open: false,
  active:0
}

//menu list 
const menuList = [
  { id:1,
    title:"表格数据",
    icon:<TableChartIcon/>,
    link: urlMapping.tablelist//for navigation...
  },
  { 
    id:2,
    title:"文本数据",
    icon:<TextFieldsIcon/>,
    link:urlMapping.textlist//for navigation...
  },
  { 
    id:3,
    title:"图像数据",
    icon:<ImageIcon/>,
    link:urlMapping.imagelist//for navigation...
  },
  {   
    id:4,
    title:"音频数据",
    icon:<RecordVoiceOverIcon/>,
    link:urlMapping.voicelist//for navigation...
  },
  { 
    id:5,
    title:"游戏合规",
    icon:<VideogameAssetIcon/>,
    link:urlMapping.gamelist//for navigation...
  },
]
