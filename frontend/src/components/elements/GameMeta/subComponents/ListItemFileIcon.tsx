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
  size?:string|number,
  ext?:string,
  coverurl?:string, //image data in url
  coverimg?:string //image data in base64
  origin?:boolean
}

type ImageIconLayoutProps={
  children?:React.ReactNode
}

function ImageIconLayout(props:ImageIconLayoutProps){
  return <Box display='flex' alignItems='center' height='24px' maxWidth='32px'>
    {props.children}
    </Box>
}


export default function ListItemFileIcon(props:ListItemFileIconProps){
    let icon:undefined|React.ReactNode = undefined
    let styleprops = {
      fontSize:props.size??'24px'
    }
    if(props.coverurl){
      icon = <ImageIconLayout>
        <img src={urlmapping.host+urlmapping.apibase.other+props.coverurl}/>
        </ImageIconLayout>
    }else if(props.coverimg){
      icon = <ImageIconLayout>
      <img src={`data:image/png;base64,${props.coverimg}`}/>
      </ImageIconLayout>
    }
    else
      switch(props.ext){
        case '.doc': case '.docx':icon = <FileWordOutlined style={styleprops}/>;break;
        case '.txt':icon = <FileTextOutlined style={styleprops}/>;break;
        case '.jpg': case '.jpeg':icon = <FileJpgOutlined style={styleprops}/>;break;
        case '.xls': case '.xlsx':icon = <FileExcelOutlined style={styleprops}/>;break;
        case '.gif':icon = <FileGifOutlined style={styleprops}/>;break;
        default:
          switch(props.type){
          case 'text':icon = <DescriptionIcon sx={styleprops}/>; break;
          case 'image':icon = <ImageOutlinedIcon sx={styleprops}/>;break;
          case 'audio':icon = <MusicNoteOutlinedIcon sx={styleprops}/>;break;
          case 'video':icon = <TheatersIcon sx={styleprops}/>;break;
          default:icon = <FileUnknownOutlined  style={styleprops}/>;
        }  
      }
    
  
    return props.origin?
    <Box width='100%' height='100%' display='flex' justifyContent='center' alignItems='center'>
      {icon}
    </Box>
    :
    <ListItemIcon sx={{justifyContent:'center'}}>{icon}</ListItemIcon>
  }
