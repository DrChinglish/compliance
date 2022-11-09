import React from 'react'
import { SnackbarStatus } from '../../Interfaces'
import { Snackbar, Alert, AlertColor } from '@mui/material'
type Props = {
    status:SnackbarStatus
}

export default function SnackBar(props: Props) {
  return (
    <Snackbar anchorOrigin={{vertical:'top',horizontal:'center'}}
        open={props.status.show} autoHideDuration={3000}>
        <Alert severity={props.status.severity as AlertColor} 
        sx={{width:'50ch'}}>
            {props.status.text}
        </Alert>
    </Snackbar>
  )
}