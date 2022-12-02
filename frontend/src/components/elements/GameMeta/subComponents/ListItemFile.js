import React from 'react'
import { ListItem, ListItemButton,ListItemText } from '@mui/material'
import ListItemFileIcon from './ListItemFileIcon'
import FileStatusIcon from './FileStatusIcon'
export default function ListItemFile(props){
    let secondary =
    <React.Fragment>
      {props.file.size+' '}
      <FileStatusIcon status={props.file.status}/>
    </React.Fragment>
    return(
      <ListItem key={props.index} secondaryAction={props.secondaryAction} sx={{pr:1}}>
        <ListItemButton selected={props.selected===props.index} key={props.file.id} sx={{p:0} }
      onClick={(e)=>props.onClick(e,props.index)}>
          <ListItemFileIcon type={props.file.type} ext={props.file.ext} coverurl={props.thumbnailUrl??undefined} 
          coverimg={props.file.content.coverimg}/>
          <ListItemText sx={{overflow:'clip'}}
          primary={props.file.name}
          secondary={secondary}
          />
        </ListItemButton>
      </ListItem>
      
    )
  }
