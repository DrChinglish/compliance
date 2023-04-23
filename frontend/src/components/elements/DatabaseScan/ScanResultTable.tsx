import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material'
import React from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ScanResultSum from './ScanResultSum';
import ScanResultType from './ScanResultType';
type Props = {
    table_name:string,
    table_data:any
}

export default function ScanResultTable({table_data,table_name}: Props) {
  return (
    <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`${table_name}-content`}
          id={`${table_name}-head`}
        >
          <Typography variant='h6'>{`表 ${table_name}中的检测结果`}</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <ScanResultSum data={table_data['overview']}></ScanResultSum>
            <ScanResultType severity='high' data={table_data['detail']['high']}/>
            <ScanResultType severity='middle' data={table_data['detail']['middle']}/>
            <ScanResultType severity='low' data={table_data['detail']['low']}/>
        </AccordionDetails>
      </Accordion>
  )
}