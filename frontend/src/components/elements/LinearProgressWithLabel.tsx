import * as React from 'react';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
    const [value,setValue] = React.useState(0)
    React.useEffect(()=>{
        //console.log(props.value)
        setValue(props.value)
    },[props.value])
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress variant="determinate" {...props}  color={props.value===100?'success':'primary'}/>
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(
            value,
          )}%`}</Typography>
        </Box>
      </Box>
    );
  }