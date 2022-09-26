import React from 'react'
import { Stack, Typography, Divider, List, ListItem, Box } from '@mui/material'
export default function TextFileContent(props){
    let color = 'red'
    let text=[]
    for(let index in props.file.contentlist){
      let s = props.file.contentlist[index]
      switch (s.flag){
        case 2:color = 'orange';break;
        default: color = 'red'
      }
      console.log(s)
      if(s.flag == 0){ //legal
        
        text.push(<span>{s.text}</span>)
      }else{
        text.push(<span style={{background:color, borderRadius:'3px', color:'white'}} className='highlighted'>{s.text}</span>)
      }
    }
  
    console.log(text.length)
  
    return(
      <Stack spacing={2} sx={{px:2,height:'100%',py:2}}>
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
      </Stack>
      
    )
  }
