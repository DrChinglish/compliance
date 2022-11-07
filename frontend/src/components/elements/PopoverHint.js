import React from 'react'
import { Popover, Typography, Popper, Fade, Paper } from '@mui/material'
export default function PopoverHint({
    open:open,
    anchorEl:anchorEl,
    children:children,
    timeout:timeout,
    ...rest
}) {
  return (
    // <Popover
    //     id="mouse-over-popover"
    //     sx={{
    //       pointerEvents: 'none',
    //       ...sx
    //     }}
    //     open={open}
    //     anchorEl={anchorEl}
    //     anchorOrigin={{
    //       vertical: 'top',
    //       horizontal: 'right',
    //     }}
    //     transformOrigin={{
    //       vertical: 'bottom',
    //       horizontal: 'left',
    //     }}
    //     {...rest}
    //     // onClose={handlePopoverClose}
    //     disableRestoreFocus
    //   >
    //     <Typography sx={{ p: 1 }}>{children}</Typography>
    //   </Popover>
    <Popper placement='right' anchorEl={anchorEl} open={open} transition {...rest}>
        {({TransitionProps}) => (
            <Fade {...TransitionProps} timeout={timeout??350}>
                <Paper>
                    <Typography sx={{ p: 2 }}>{children}</Typography>
                </Paper>
            </Fade>
        )}
    </Popper>
  )
}
