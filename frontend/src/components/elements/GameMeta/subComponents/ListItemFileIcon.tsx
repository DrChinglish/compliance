import React from 'react'
import PropTypes from 'prop-types'
import { ListItemIcon } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import MusicNoteOutlinedIcon from '@mui/icons-material/MusicNoteOutlined';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import TheatersIcon from '@mui/icons-material/Theaters';
import {FileWordOutlined, FileTextOutlined, FileJpgOutlined, FileExcelOutlined, FileGifOutlined, FileUnknownOutlined} from '@ant-design/icons'
import urlmapping from '../../../../urlMapping.json'
import { Box } from '@mui/system';
interface ListItemFileIconProps{
  type : 'text'|'image'|'audio'|'video'|'other'| undefined,
  ext:string,
  coverurl?:string
}

export default function ListItemFileIcon(props:ListItemFileIconProps){
    let icon:undefined|React.ReactNode = undefined
    if(props.coverurl){
      icon = <Box display='flex' alignItems='center' height='24px' maxWidth='32px'><img src={urlmapping.host+urlmapping.apibase.other+props.coverurl}/></Box>
    }
    else
      switch(props.ext){
        case '.doc': case '.docx':icon = <FileWordOutlined style={{fontSize:'24px'}}/>;break;
        case '.txt':icon = <FileTextOutlined style={{fontSize:'24px'}}/>;break;
        case '.jpg': case '.jpeg':icon = <FileJpgOutlined style={{fontSize:'24px'}}/>;break;
        case '.xls': case '.xlsx':icon = <FileExcelOutlined style={{fontSize:'24px'}}/>;break;
        case '.gif':icon = <FileGifOutlined style={{fontSize:'24px'}}/>;break;
        default:
          switch(props.type){
          case 'text':icon = <DescriptionIcon/>; break;
          case 'image':icon = <ImageOutlinedIcon/>;break;
          case 'audio':icon = <MusicNoteOutlinedIcon />;break;
          case 'video':icon = <TheatersIcon/>;break;
          default:icon = <FileUnknownOutlined  style={{fontSize:'24px'}}/>;
        }  
      }
    
  
    return <ListItemIcon sx={{justifyContent:'center'}}>{icon}</ListItemIcon>
  }
