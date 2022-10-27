import { Box, CssBaseline, Typography } from '@mui/material'
import React from 'react'
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import Titles from '../../../../../typography/Titles';
import PopoverHint from '../../../../PopoverHint';
import CheckIndicatorLayout from './CheckIndicatorLayout';
export default function CheckStatus({
    status:pass,
    ...rest
}) {
    const [anchorEl,setAnchorEl] = React.useState(null)
    const [hintText,setHinttext] = React.useState('text')
    const handlePopoverOpen =(text)=> (event) => {
        setHinttext(text)
        setAnchorEl(event.currentTarget);
      };
    
      const handlePopoverClose = () => {
        setAnchorEl(null);
      };
      let props={
        sx:{
            fontSize:'60px'
        },
       
        onMouseLeave:handlePopoverClose
    }
      const open = Boolean(anchorEl);
  return (
    <CheckIndicatorLayout label='审查结论'>
            <PopoverHint anchorEl={anchorEl} open={open}>{hintText}</PopoverHint>
            {pass===true?<DoneIcon {...props} color='success'  onMouseEnter={handlePopoverOpen('审核通过')}/>:
            (pass===undefined?<QuestionMarkIcon  {...props} color='warning' onMouseEnter={handlePopoverOpen('未知状态')}/>:
            <CloseIcon {...props} color='error' onMouseEnter={handlePopoverOpen('审核不通过')}/>)}
    </CheckIndicatorLayout>
  )
}
