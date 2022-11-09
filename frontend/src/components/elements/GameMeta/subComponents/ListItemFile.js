import React from 'react'
import { ListItem, ListItemButton,ListItemText } from '@mui/material'
import ListItemFileIcon from './ListItemFileIcon'
export default function ListItemFile(props){
    return(
      <ListItem key={props.index} secondaryAction={props.secondaryAction} sx={{pr:1}}>
        <ListItemButton selected={props.selected===props.index} sx={{p:0}}
      onClick={(e)=>props.onClick(e,props.index)}>
          <ListItemFileIcon type={props.file.type} ext={props.file.ext} coverurl={props.thumbnailUrl??undefined} 
          coverimg={props.file.content.coverimg}/>
          <ListItemText sx={{overflow:'clip'}}
          primary={props.file.name}
          secondary={props.file.size}
          />
        </ListItemButton>
      </ListItem>
      
    )
  }
