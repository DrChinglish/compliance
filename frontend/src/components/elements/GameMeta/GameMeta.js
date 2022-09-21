import { Box, Card, Tab, Tabs } from '@mui/material'
import React, { Component } from 'react'
import GameFileList from './GameFileList';
import TabPanel from './TabPanel';

function a11yProps(index) {
    return {
      id: `game-meta-tab-${index}`,
      'aria-controls': `game-meta-tabpanel-${index}`,
    };
  }

export default class GameMeta extends Component {

    static getDerivedStateFromProps(props,state){
        let fileList={
            text:[],
            image:[],
            other:[]
        }
        for(let index in props.fileList){
            let file = props.fileList[index]
            let target 
            switch(file.type){
                case 'text': target = fileList.text;break;
                case 'image':target = fileList.image;break;
                default : target = fileList.other;break;
            }
            target.push(file)
        }
        console.log(fileList)
        return {fileList:fileList}
    }

    constructor(props){
        
        //console.log(props)
        super(props)
        
        //console.log(fileList)
        this.state={
            value:0, //currently selected tab index
        }
    }

    handleChange=(e,value)=>{
        this.setState({
            value: value
        })
    }

  render() {
    console.log(this.state.fileList)
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
                <GameFileList fileList={this.state.fileList.text} variant='text'/>
            </TabPanel>
            <TabPanel value={value} index={2}>
                <GameFileList fileList={this.state.fileList.image} variant='image'/>
            </TabPanel>
        </Box>
    )
  }
}
