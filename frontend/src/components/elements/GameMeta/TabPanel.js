import { Box } from '@mui/system'
import React from 'react'



export default function TabPanel(props) {
    const {children, value, index, sx, ...others} =props 
    console.log(props)
  return (
    <div
        hidden={value!==index}
        id={`game-meta-tabpanel-${index}`}
        {...others}
        style={{height:'100%'}}
        >
            {value === index &&(
                <Box sx={{width:'100%',height:'100%',...sx}}>
                    {children}
                </Box>
            )}
    </div>

  )
}
