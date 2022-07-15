import React, { Component } from 'react'
import  PropTypes  from 'prop-types' 
import { AppBar, Box, CssBaseline, IconButton, Toolbar, Typography } from '@mui/material'
import {Menu} from '@mui/icons-material'
import Footer from '../components/layout/Footer'

export default class LayoutDetail extends Component {
  render() {
    return (
      <Box sx={{display:'flex'}}>
        <CssBaseline/>
        {/* Header start */}
        <AppBar position='fixed' sx={{zIndex: (theme)=> theme.zIndex.drawer + 1}}>
            <Toolbar>
                <IconButton size='large' edge='start' color='inherit' aria-label='menu' sx={{mr:2}}>
                    <Menu/>
                </IconButton>
                <Typography variant="h6" noWrap component="div">
                    项目列表
                </Typography>
            </Toolbar>

        </AppBar>
        <Toolbar/>
        {/* Header end */}

        {/* Body */}
        <main className="site-content">
            {this.props.children}
        </main>
        {/* Body end */}

        {/* Footer */}
        <Footer/>
        {/* Footer end */}
      </Box>
    )
  }
}

LayoutDetail.propTypes={
    chilidren: PropTypes.any
}