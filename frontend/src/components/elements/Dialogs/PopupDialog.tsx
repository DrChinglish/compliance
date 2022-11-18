import React, { MouseEventHandler } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material'
import type { DialogProps } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
interface DialogAction{
  label:string,action:()=>void
}

type Props = {
    children?:React.ReactNode,
    open:boolean,
    title?:React.ReactNode,
    onClose?:(event: object, reason: string)=>void,
    actions?:React.ReactNode,
    maxWidth?:DialogProps['maxWidth']
}

export default function PopupDialog(props: Props) {
  let actions = Array.isArray(props.actions)?props.actions:(props.actions?[props.actions]:undefined)
  
  return (
    <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth={props.maxWidth} >
      <DialogTitle>
        {props.title}
        {props.onClose?(
        <IconButton
          aria-label="close"
          onClick={props.onClose as MouseEventHandler}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        ):null}
      </DialogTitle>
      <DialogContent >
        {props.children}
      </DialogContent>
      {actions&&
      <DialogActions>
        {actions}
      </DialogActions>
      }
      
    </Dialog>
  )
}