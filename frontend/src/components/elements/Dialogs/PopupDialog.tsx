import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'

interface DialogAction{
  label:string,action:()=>void
}

type Props = {
    children?:React.ReactNode,
    open:boolean,
    title?:React.ReactNode,
    onClose?:(event: object, reason: string)=>void,
    actions?:React.ReactNode
}

export default function PopupDialog(props: Props) {
  let actions = Array.isArray(props.actions)?props.actions:(props.actions?[props.actions]:undefined)
  
  return (
    <Dialog open={props.open} onClose={props.onClose} fullWidth>
      <DialogTitle>
        {props.title}
      </DialogTitle>
      <DialogContent>
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