import { styled, useTheme } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Divider, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import InboxIcon from '@mui/icons-material/Inbox';
import { DrawerHeader } from './DrawerHeader';
const drawerWidth = 240;

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



export default class SideDrawer extends Component {
  constructor(props){
    super(props)
    this.state={
      open:false
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
      <ListItem key={item.title} disablePadding sx={{ display: 'block' }}>
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent: open ? 'initial' : 'center',
            px: 2.5,
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
          <ListItemText primary={item.title} sx={{ opacity: open ? 1 : 0 }} />
        </ListItemButton>
      </ListItem>
    )
  }

 

  render() {
    const {open} = this.state
    const {setOpen} = this.props 
    return (
      <Drawer variant='permanent' open={open}>
        <DrawerHeader>
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

SideDrawer.propTypes={
  setOpen: PropTypes.func.isRequired,// to let parent notice state change
  open: PropTypes.bool
}

SideDrawer.defaultProps={
  open: false
}

//menu list 
const menuList = [
  {
    title:"Menu Item",
    icon:<InboxIcon/>,
    link:""//for navigation...
  }
]
