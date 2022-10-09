import React, { useState } from 'react'
import {ToggleButton, ToggleButtonGroup, Stack, Typography, Divider, List, ListItem, Box } from '@mui/material'
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
      <Stack spacing={2} sx={{px:2,height:'100%',py:2}} justifyContent="center" alignItems="center">
        <Typography align='center' variant='h5' fontWeight='bold'>{props.file.name}</Typography>
        <Divider/>
        <List sx={{maxHeight:'70%',overflowY:'scroll',overflowX:'clip',maxWidth:'100%',borderRadius:'5px', border:"thin solid #a9a9a9"}}>
          <ListItem>
            <Box >
              {text}  
            </Box>
            
          </ListItem>
          {/* <ListItem>
            {props.file.content}
          </ListItem> */}
        </List>
        <ToggleButtonGroup exclusive value={activeContent} onChange={handleChange} aria-label="outlined primary button group">
          <ToggleButton value="traditional_characters">繁体字检测</ToggleButton>
          <ToggleButton value="senstive_characters">敏感词检测</ToggleButton>
          <ToggleButton value="english_word">英文检测</ToggleButton>
        </ToggleButtonGroup>
      </Stack>
      
    )
  }
