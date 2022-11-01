import React, { useState } from 'react'
import {ToggleButton, ToggleButtonGroup, Stack, Typography, Divider, Container, Paper, Box } from '@mui/material'
import Titles from '../../../../typography/Titles'
import Paragraphs from '../../../../typography/Paragraphs'
export default function TextFileContent(props){
    const [activeContent, setActiveContent] = useState('traditional_characters')
    let color = 'red'
    let text=[]
    //console.log(props)
    let contentList = props.file.contentlist[activeContent].fulltext
    for(let index in contentList){
      let s = contentList[index]
      switch (s.flag){
        case 2:color = 'orange';break;
        default: color = 'red'
      }
      //console.log(s)
      if(s.flag == 0){ //legal
        
        text.push(<span>{s.text}</span>)
      }else{
        text.push(<span style={{background:color, borderRadius:'3px', color:'white'}} className='highlighted'>{s.text}</span>)
      }
    }

    const handleChange = (e,value)=>{
      setActiveContent(value)
    }
    console.log(text.length)
  
    return(
      <Stack spacing={2} sx={{px:2,height:'100%',py:2}} justifyContent="spcae-between" alignItems="center">
        <Titles>{props.file.name}</Titles>
        <Divider flexItem/>
        {/* <List sx={{maxHeight:'70%',overflowY:'scroll',overflowX:'clip',maxWidth:'100%',borderRadius:'5px', border:"thin solid #a9a9a9"}}>
          <ListItem>
            <Box >
              {text}  
            </Box>
          </ListItem>
          </List> */}
        <Box sx={{maxHeight:'70%',maxWidth:'100%'}}>
          <Paper elevation={8} sx={{pl:2,py:2,maxHeight:'100%',maxWidth:'100%',overflowY:'scroll'}}>
             {text}
          </Paper>
        </Box>
        <ToggleButtonGroup exclusive value={activeContent} onChange={handleChange} aria-label="outlined primary button group">
          <ToggleButton value="traditional_characters">繁体字检测</ToggleButton>
          <ToggleButton value="senstive_characters">敏感词检测</ToggleButton>
          <ToggleButton value="english_word">英文检测</ToggleButton>
        </ToggleButtonGroup>
      </Stack>
      
    )
  }
