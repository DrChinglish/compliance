import React, { useEffect, useState } from 'react'
import { SnackbarStatus } from '../../Interfaces'
import { Snackbar, Alert, AlertColor } from '@mui/material'
type Props = {
    status:SnackbarStatus
}

export default function SnackBar(props: Props) {

  const [open,setOpen] = useState(props.status.show)

  useEffect(()=>{
    setOpen(props.status.show)
  },[props.status.show])

  const handleClose=(event: React.SyntheticEvent | Event, reason?: string) => {
    console.log(reason)
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <Snackbar anchorOrigin={{vertical:'top',horizontal:'center'}}
        open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert severity={props.status.severity as AlertColor} 
        sx={{width:'50ch'}}>
            {props.status.text instanceof Error?`${props.status.text.name}:${props.status.text.message}`
            :props.status.text}
        </Alert>
    </Snackbar>
  )
}