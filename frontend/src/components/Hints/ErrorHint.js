import React from 'react'
import { Empty } from 'antd'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Button, Typography } from '@mui/material';
export default function ErrorHint({
    text:text,
    extra:extras
}) {
  return (
    <div style={{height:'100%',width:'100%',display:'flex',alignItems:"center",justifyContent:'center'}}>
      <Empty
      image={<ErrorOutlineIcon sx={{fontSize:'80px'}} color='disabled' />}
        description={
            <React.Fragment>
                <Typography gutterBottom component='div' color="#a9a9a9" align='center' lineHeight='100%'>{text}</Typography>
                {extras}
            </React.Fragment>
        }
      />
        
    </div>
  )
}
