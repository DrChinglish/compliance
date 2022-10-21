import React from 'react'
import { Empty } from 'antd'
import { Typography } from '@mui/material'
export default function EmptyHint(props) {
  return (
    <div style={{height:'100%',width:'100%',display:'flex',alignItems:"center",justifyContent:'center'}}>
      <Empty
        description={
          <Typography component='div' color="#a9a9a9" align='center' lineHeight='100%'>{props.text}</Typography>
        }
      />
        
    </div>
  )
}
