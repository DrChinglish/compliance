import React from 'react'
import { Typography } from '@mui/material'
import { Empty } from 'antd'
type Props = {
  extra?:React.ReactNode,
  text:string
}

export default function ActionHint(props: Props) {
  return (
    <div style={{height:'100%',width:'fill-available',display:'flex',alignItems:"center",justifyContent:'center'}}>
      <Empty
        description={
          <React.Fragment>
            <Typography component='div' color="#a9a9a9" align='center' lineHeight='100%'>{props.text}</Typography>
            {props.extra}
          </React.Fragment>
        }
      />
    </div>
  )
}