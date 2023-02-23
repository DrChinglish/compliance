import { Alert } from '@mui/material'
import React from 'react'

type Props = {
    variant:'info'|'error',
    label:string
}

export default function CheckListResultSuggestion({variant,label}: Props) {
  return (
    <Alert severity={variant}>{label}</Alert>
  )
}