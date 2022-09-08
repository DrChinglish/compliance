import React from 'react'
import {
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridToolbarFilterButton,
    GridToolbarExport,
    GridToolbarDensitySelector,
    
  } from '@mui/x-data-grid';
import { Stack, Typography } from '@mui/material';

export const DataGridToolbar = (props) => {
  return (
    <GridToolbarContainer sx={{
        p:1
      }}>
        <Stack>
            {!props?.noTitle && (<Typography variant='h6'> Title</Typography>)}
            <Stack direction='row'>
                
                <GridToolbarColumnsButton />
                {/* <GridToolbarColumnsButton name='121' > 114</GridToolbarColumnsButton> */}
                <GridToolbarFilterButton />
                <GridToolbarDensitySelector />
                <GridToolbarExport />
            </Stack>  
        </Stack>
            
    </GridToolbarContainer>
  )
}
