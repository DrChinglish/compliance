import React from 'react'
import { CircularProgress, Stack, Typography } from '@mui/material'
import Paragraphs from '../../../../../typography/Paragraphs'
import CheckIndicatorLayout from './CheckIndicatorLayout'

export default function LoadingProgress({
  label:label
}) {
  return (
    <CheckIndicatorLayout label={label}><CircularProgress/></CheckIndicatorLayout>
  )
}
