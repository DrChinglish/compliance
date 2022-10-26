import React from 'react'
import { PropTypes } from 'prop-types'
import { CircularProgress, Box, Typography } from '@mui/material'
import Paragraphs from '../../../typography/Paragraphs'
import Titles from '../../../typography/Titles'
export default function LabelCircularProgress({
    title:title,
    ...rest
}) {
  return (
    <Box>
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant="determinate" {...rest} size={60} />
            <Box
                sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                }}
            >
                <Typography variant="caption" component="div" color="text.secondary">
                {`${Math.round(rest.value)}%`}
                </Typography>
            </Box>
        </Box>
        <Titles variant='iconlabel'>{title}</Titles>
    </Box>
    
  )
}
