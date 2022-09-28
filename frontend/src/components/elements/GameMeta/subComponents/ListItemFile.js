import React from 'react'
import { ListItemButton,ListItemText } from '@mui/material'
import ListItemFileIcon from './ListItemFileIcon'
export default function ListItemFile(props){

    return(
      <ListItemButton selected={props.selected===props.index} onClick={(e)=>props.onClick(e,props.index)}>
        {ListItemFileIcon(props.file.type)}
        <ListItemText sx={{overflow:'hidden'}}
        primary={props.file.name}
        secondary={props.file.size}
        />
      </ListItemButton>
    )
  }
