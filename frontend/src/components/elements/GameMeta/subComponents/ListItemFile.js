import React from 'react'
import { ListItemButton,ListItemText } from '@mui/material'
import ListItemFileIcon from './ListItemFileIcon'
export default function ListItemFile(props){
    return(
      <ListItemButton key={props.index} selected={props.selected===props.index} sx={{px:1}}
      onClick={(e)=>props.onClick(e,props.index)}>
        <ListItemFileIcon type={props.file.type} ext={props.file.ext} coverurl={props.thumbnailUrl??undefined} 
        coverimg={props.file.content.coverimg}/>
        <ListItemText sx={{overflow:'hidden'}}
        primary={props.file.name}
        secondary={props.file.size}
        />
      </ListItemButton>
    )
  }
