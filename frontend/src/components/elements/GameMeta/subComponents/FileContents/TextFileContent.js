import React, { useEffect, useState } from 'react'
import {ToggleButton, ToggleButtonGroup, Stack, Typography, Divider, Container, Paper, Box } from '@mui/material'
import Titles from '../../../../typography/Titles'
import Paragraphs from '../../../../typography/Paragraphs'
import FileContentLayout from './FileContentLayout'
import HightlightedText from '../../../../typography/HightlightedText'
export default function TextFileContent(props){
    const [activeContent, setActiveContent] = useState('traditional_characters')
    const [textList,setTextList] = useState({'traditional_characters':[],'senstive_characters':[],'english_word':[]})
    useEffect(()=>{
      let contentList = props.file.contentlist
      setTextList({
        'traditional_characters':contentList['traditional_characters'].fulltext,
        'senstive_characters':contentList['senstive_characters'].fulltext,
        'english_word':contentList['english_word'].fulltext
      })
    },[props.file])

    const handleChange = (e,value)=>{
      // console.log(value)
      if(value) setActiveContent(value)
    }

    return(
      <FileContentLayout title={props.file.name}>
        {/* <List sx={{maxHeight:'70%',overflowY:'scroll',overflowX:'clip',maxWidth:'100%',borderRadius:'5px', border:"thin solid #a9a9a9"}}>
          <ListItem>
            <Box >
              {text}  
            </Box>
          </ListItem>
          </List> */}
        <Box sx={{maxHeight:'70%',maxWidth:'100%'}}>
          <Paper elevation={8} sx={{p:2,maxHeight:'100%',maxWidth:'100%',overflowY:'auto'}}>
             <HightlightedText textlist={textList[activeContent]}/>
          </Paper>
        </Box>
        <ToggleButtonGroup exclusive value={activeContent} onChange={handleChange} aria-label="outlined primary button group">
          <ToggleButton value="traditional_characters">繁体字检测</ToggleButton>
          <ToggleButton value="senstive_characters">敏感词检测</ToggleButton>
          <ToggleButton value="english_word">英文检测</ToggleButton>
        </ToggleButtonGroup>
      </FileContentLayout>
    )
  }
