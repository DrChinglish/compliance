import React, { Component } from 'react'
import  PropTypes  from 'prop-types' 
import { Box, CssBaseline, Drawer, IconButton, Toolbar, Typography } from '@mui/material'
import {Menu} from '@mui/icons-material'
import Footer from '../components/layout/Footer'
import { Container } from '@mui/system'
import AppBar from '../components/layout/partials/AppBar'
import SideDrawer from '../components/layout/partials/SideDrawer/SideDrawer'
import { DrawerHeader } from '../components/layout/partials/SideDrawer/DrawerHeader'
import { Outlet } from 'react-router-dom'



export default class LayoutDetail extends Component {
    constructor(props){
        super(props)
        this.state={
            open:false
        }
    }

    setOpen = (state) => {
        if(state!=undefined){
        this.setState({
            open:state
        })
        }
    }

    render() {
        const {open}=this.state

    

    return (
    <Box sx={{display:'flex',maxWidth:'100vw'}}>
        <CssBaseline/>
        {/* Header start */}
        <AppBar position='fixed' open={open}>
            <Toolbar>
                <IconButton size='large' edge='start' color='inherit' aria-label='menu' sx={{mr:2,...(open && {display:'none'})}} onClick={e=>this.setOpen(true)}>
                    <Menu/>
                </IconButton>
                <Typography variant="h6" noWrap component="div" >
                    数据合规审计
                </Typography>
            </Toolbar>
        </AppBar>
        
        {/* Header end */}
        {/* Drawer */}
        <SideDrawer open={open} setOpen={this.setOpen}/>
        <Box sx={{flexDirection:'row',flexGrow:1,p:0}}>
             {/* Body */}
            <Box component='main' sx={{flexGrow:1,p:4,maxWidth:'100%'}}>
                
                <DrawerHeader/>
                {/* {this.props.children} */}
                <Outlet/>
                
            </Box>
            
            {/* Body end */}

            {/* Footer */}
            <Box        component='footer' sx={{flexGrow:1}} >  
                <Footer/>
            </Box>
            
            {/* Footer end */}
        </Box>
       
    </Box>
    )
  }
}


