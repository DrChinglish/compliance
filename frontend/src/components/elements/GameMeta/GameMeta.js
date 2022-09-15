import { Box, Card, Tab, Tabs } from '@mui/material'
import React, { Component } from 'react'
import GameTextList from './GameTextList';
import TabPanel from './TabPanel';

function a11yProps(index) {
    return {
      id: `game-meta-tab-${index}`,
      'aria-controls': `game-meta-tabpanel-${index}`,
    };
  }

export default class GameMeta extends Component {

    constructor(props){
        super(props)
        this.state={
            value:0 //currently selected tab index
        }
    }

    handleChange=(e,value)=>{
        this.setState({
            value: value
        })
    }

  render() {
    let {value} = this.state
    return (
        <Box sx={{height:'75vh',width:'55vw'}}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={this.handleChange} aria-label="basic tabs example">
                    <Tab label="游戏信息" {...a11yProps(0)} />
                    <Tab label="文本合规" {...a11yProps(1)} />
                    <Tab label="图片合规" {...a11yProps(2)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                Item 2
            </TabPanel>
            <TabPanel value={value} index={1}>
                <GameTextList fileList={this.props.fileList}/>
            </TabPanel>
            <TabPanel value={value} index={2}>
                Item 3
            </TabPanel>
        </Box>
    )
  }
}
