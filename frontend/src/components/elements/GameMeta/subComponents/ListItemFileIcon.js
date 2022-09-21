import React from 'react'
import { ListItemIcon } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
export default function ListItemFileIcon(type){
    let icon
    switch(type){
      case 'text':icon = <ListItemIcon><DescriptionIcon/></ListItemIcon>; break;
      case 'image':icon = <ListItemIcon><InsertPhotoIcon/></ListItemIcon>;break;
      default:icon = <ListItemIcon><QuestionMarkIcon/></ListItemIcon>;
    }  
  
    return icon
  }
