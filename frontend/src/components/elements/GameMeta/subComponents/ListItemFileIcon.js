import React from 'react'
import { ListItemIcon } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import MusicNoteOutlinedIcon from '@mui/icons-material/MusicNoteOutlined';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import {FileWordOutlined, FileTextOutlined, FileJpgOutlined, FileExcelOutlined, FileGifOutlined, FileUnknownOutlined} from '@ant-design/icons'
export default function ListItemFileIcon(type,ext){
    let icon = undefined
    switch(ext){
      case '.doc': case '.docx':icon = <ListItemIcon><FileWordOutlined style={{fontSize:'24px'}}/></ListItemIcon>;break;
      case '.txt':icon = <ListItemIcon><FileTextOutlined style={{fontSize:'24px'}}/></ListItemIcon>;break;
      case '.jpg': case '.jpeg':icon = <ListItemIcon><FileJpgOutlined style={{fontSize:'24px'}}/></ListItemIcon>;break;
      case '.xls': case '.xlsx':icon = <ListItemIcon><FileExcelOutlined style={{fontSize:'24px'}}/></ListItemIcon>;break;
      case '.gif':icon = <ListItemIcon><FileGifOutlined style={{fontSize:'24px'}}/></ListItemIcon>;break;
      default:
        switch(type){
        case 'text':icon = <ListItemIcon><DescriptionIcon/></ListItemIcon>; break;
        case 'image':icon = <ListItemIcon><ImageOutlinedIcon/></ListItemIcon>;break;
        case 'audio':icon = <ListItemIcon><MusicNoteOutlinedIcon /></ListItemIcon>;break;
        default:icon = <ListItemIcon><FileUnknownOutlined/></ListItemIcon>;
      }  
    }
    
  
    return icon
  }
