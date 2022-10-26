import React from 'react'
import { ListItemButton,ListItemText } from '@mui/material'
import ListItemFileIcon from './ListItemFileIcon'
export default function ListItemFile(props){
    
    return(
      <ListItemButton key={props.index} selected={props.selected===props.index} onClick={(e)=>props.onClick(e,props.index)}>
        {ListItemFileIcon(props.file.type,props.file.ext)}
        <ListItemText sx={{overflow:'hidden'}}
        primary={props.file.name}
        secondary={props.file.size}
        />
      </ListItemButton>
    )
  }
