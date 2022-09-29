import React, { useState } from 'react'
import {ToggleButton, ToggleButtonGroup, Stack, Typography, Divider, Box, Backdrop, List, ListItem } from '@mui/material'
export default function ImageFileContent(props) {
    const [activeContent, setActiveContent] = useState('traditional_characters')
    const [open, setOpen] = useState(false)
    const handleChange=(e,value)=>{
        setActiveContent(value)
    }
    const handleClose = (e)=>{
        setOpen(false)
    }
    const handleClick = (e)=>{
        setOpen(true)
    }

    console.log(props)
    let res = props.image.contentlist
    let image
    let imageSrc
    if(activeContent === 'skull'){
        imageSrc = "data:image/png;base64,"+res[activeContent]
       
    }else{
        imageSrc = "data:image/png;base64,"+res[activeContent].image
    }
    image = <img alt='preview' src={imageSrc} onClick={handleClick}></img>
    let imageBig = <img alt='large' style={{maxWidth:'100vw',maxHeight:'100vh'}} src={imageSrc}></img>
  return (
    <Stack spacing={2} sx={{px:2,height:'100%',py:2}} justifyContent="spcae-between" alignItems="center">
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleClose}>
            {imageBig}
        </Backdrop>
        <Typography align='center' variant='h5' fontWeight='bold'>{props.image.name}</Typography>
        <Divider/>
        <List sx={{maxHeight:'70%',overflowY:'scroll',maxWidth:'100%'}}>
            <ListItem>
                <Box>
                    {image}  
                </Box>
            </ListItem>
        </List>
        <ToggleButtonGroup exclusive value={activeContent} onChange={handleChange} aria-label="outlined primary button group">
          <ToggleButton value="traditional_characters">繁体字检测</ToggleButton>
          <ToggleButton value="senstive_characters">敏感词检测</ToggleButton>
          <ToggleButton value="english_word">英文检测</ToggleButton>
          <ToggleButton value="skull">骷髅头检测</ToggleButton>
        </ToggleButtonGroup>
      </Stack>
  )
}